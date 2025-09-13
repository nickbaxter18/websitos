const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { execSync, spawn } = require("child_process");
require("dotenv").config();

function createApp() {
  const app = express();
  const PORT = process.env.PORT || 4000;
  const ROOT_DIR = process.cwd();
  const API_KEY = process.env.EDITOR_API_KEY || "changeme";

  // === Security Middleware ===
  function checkApiKey(req, res, next) {
    if (req.headers.referer && req.headers.referer.includes("/editor")) return next();
    if (process.env.NODE_ENV !== "production") return next();
    const key = req.headers["x-api-key"];
    if (!key || key !== API_KEY) return res.status(403).json({ error: "Forbidden: invalid API key" });
    next();
  }

  // === Middleware ===
  app.use(cors());
  app.use(bodyParser.json({ limit: "10mb" }));

  // === Health Check ===
  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
  });

  // === Editor Route ===
  app.get("/editor", (req, res) => {
    res.sendFile(path.join(__dirname, "editor.html"));
  });

  // === Serve Frontend Build (CRA or Vite) ===
  let frontendBuildPath = path.join(__dirname, "frontend", "build"); // CRA default
  if (!fs.existsSync(frontendBuildPath)) {
    frontendBuildPath = path.join(__dirname, "frontend", "dist"); // fallback for Vite
  }
  if (fs.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
  }

  // === File APIs ===
  app.get("/file", checkApiKey, (req, res) => {
    const filePath = path.join(ROOT_DIR, req.query.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    res.json({ path: req.query.path, content: fs.readFileSync(filePath, "utf8") });
  });

  app.post("/file", checkApiKey, (req, res) => {
    const { path: relPath, content } = req.body;
    if (!relPath) return res.status(400).json({ error: "Missing path" });
    fs.writeFileSync(path.join(ROOT_DIR, relPath), content || "", "utf8");
    res.json({ message: "File updated successfully", path: relPath });
  });

  app.get("/list", checkApiKey, (req, res) => {
    const dir = req.query.dir || ".";
    const absDir = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(absDir)) return res.status(404).json({ error: "Directory not found" });
    const files = fs.readdirSync(absDir, { withFileTypes: true });
    res.json({
      dir,
      files: files.map((f) => ({ name: f.name, type: f.isDirectory() ? "dir" : "file" })),
    });
  });

  // === Create ===
  app.post("/create/file", checkApiKey, (req, res) => {
    const { path: relPath, force } = req.body;
    const absPath = path.join(ROOT_DIR, relPath);
    if (fs.existsSync(absPath) && !force)
      return res.status(400).json({ error: "File already exists" });
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, "", "utf8");
    res.json({ message: "File created", path: relPath });
  });

  app.post("/create/folder", checkApiKey, (req, res) => {
    const { path: relPath } = req.body;
    const absPath = path.join(ROOT_DIR, relPath);
    fs.mkdirSync(absPath, { recursive: true });
    res.json({ message: "Folder created", path: relPath });
  });

  // === Move / Delete ===
  app.post("/move", checkApiKey, (req, res) => {
    const { src, dest } = req.body;
    fs.renameSync(path.join(ROOT_DIR, src), path.join(ROOT_DIR, dest));
    res.json({ message: "Path moved", src, dest });
  });

  app.post("/delete", checkApiKey, (req, res) => {
    const { path: relPath, recursive } = req.body;
    const absPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(absPath)) return res.status(404).json({ error: "Not found" });
    recursive ? fs.rmSync(absPath, { recursive: true, force: true }) : fs.unlinkSync(absPath);
    res.json({ message: "Deleted", path: relPath });
  });

  // === Search & Replace ===
  app.get("/search", checkApiKey, (req, res) => {
    const { query, dir = "." } = req.query;
    const absDir = path.join(ROOT_DIR, dir);
    let matches = [];

    function searchDir(d) {
      fs.readdirSync(d, { withFileTypes: true }).forEach((f) => {
        const p = path.join(d, f.name);
        if (f.isDirectory()) return searchDir(p);
        const lines = fs.readFileSync(p, "utf8").split("\n");
        lines.forEach((line, idx) => {
          if (line.includes(query))
            matches.push({ path: path.relative(ROOT_DIR, p), line: idx + 1, text: line });
        });
      });
    }

    searchDir(absDir);
    res.json({ matches });
  });

  app.post("/replace", checkApiKey, (req, res) => {
    const { query, replace, dir = "." } = req.body;
    const absDir = path.join(ROOT_DIR, dir);

    function replaceDir(d) {
      fs.readdirSync(d, { withFileTypes: true }).forEach((f) => {
        const p = path.join(d, f.name);
        if (f.isDirectory()) return replaceDir(p);
        let content = fs.readFileSync(p, "utf8");
        if (content.includes(query)) {
          fs.writeFileSync(p, content.replaceAll(query, replace), "utf8");
        }
      });
    }

    replaceDir(absDir);
    res.json({ message: "Replacement complete" });
  });

  // === Git APIs ===
  function runGit(cmd) {
    try {
      const safeEnv = { ...process.env };
      delete safeEnv.GIT_EDITOR;
      return {
        stdout: execSync(`git ${cmd}`, {
          encoding: "utf8",
          env: safeEnv
        }),
        stderr: "",
        exitCode: 0
      };
    } catch (err) {
      return { stdout: "", stderr: err.message, exitCode: 1 };
    }
  }

  app.get("/git/status", checkApiKey, (req, res) => res.json(runGit("status")));
  app.get("/git/diff", checkApiKey, (req, res) => {
    const path = req.query.path || "";
    res.json(runGit(`diff ${path}`));
  });
  app.get("/git/log", checkApiKey, (req, res) => {
    const limit = req.query.limit || 10;
    res.json(runGit(`log -n ${limit} --oneline`));
  });
  app.post("/git/reset", checkApiKey, (req, res) => res.json(runGit("reset --hard")));

  // === Logs Tail ===
  app.get("/logs/tail", checkApiKey, (req, res) => {
    const { path: relPath, lines = 100 } = req.query;
    const absPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(absPath)) return res.status(404).json({ error: "Log not found" });
    const content = fs.readFileSync(absPath, "utf8").split("\n").slice(-lines).join("\n");
    res.json({ content });
  });

  // === Exec + Whitelist ===
  const WHITELIST = ["build", "test", "lint"];
  app.get("/exec/whitelist", (req, res) => res.json({ scripts: WHITELIST }));
  app.post("/exec", checkApiKey, (req, res) => {
    const { script, args = [] } = req.body;
    if (!WHITELIST.includes(script)) return res.status(400).json({ error: "Not allowed" });
    try {
      const result = runGit(`${script} ${args.join(" ")}`);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // === Async Tasks ===
  let tasks = {};
  app.post("/task/start", checkApiKey, (req, res) => {
    const { command } = req.body;
    const id = Date.now().toString();
    const safeEnv = { ...process.env };
    delete safeEnv.GIT_EDITOR;
    const child = spawn(command, [], {
      shell: true,
      env: safeEnv
    });
    tasks[id] = { status: "running", stdout: "", stderr: "" };
    child.stdout.on("data", (d) => (tasks[id].stdout += d.toString()));
    child.stderr.on("data", (d) => (tasks[id].stderr += d.toString()));
    child.on("close", () => (tasks[id].status = "finished"));
    res.json({ taskId: id });
  });

  app.get("/task/status", checkApiKey, (req, res) => {
    const { taskId } = req.query;
    if (!tasks[taskId]) return res.status(404).json({ error: "Task not found" });
    res.json(tasks[taskId]);
  });

  return app;
}

module.exports = { createApp };
