const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { exec } = require("child_process");
const { checkApiKey } = require("./middleware");

function createApp() {
  const app = express();
  const ROOT_DIR = process.cwd();
  const upload = multer({ dest: "uploads/" });
  let tasks = {};

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // === Health check ===
  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
  });

  // === Serve Editor UI ===
  app.get("/editor", (req, res) => {
    res.sendFile(path.join(ROOT_DIR, "editor.html"));
  });

  // === Ingest file ===
  app.post("/ingest_file", checkApiKey, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const targetPath = path.join(ROOT_DIR, "uploads", req.file.originalname);
    fs.rename(req.file.path, targetPath, (err) => {
      if (err) return res.status(500).json({ error: "Failed to store file" });
      res.json({ message: "File uploaded successfully", path: targetPath });
    });
  });

  // === File system helpers ===
  function safePath(p) {
    return path.normalize(path.join(ROOT_DIR, p));
  }

  // === List directory ===
  app.get("/list", checkApiKey, (req, res) => {
    const dir = safePath(req.query.dir || ".");
    if (!fs.existsSync(dir)) return res.status(404).json({ error: "Not found" });

    const files = fs.readdirSync(dir).map((f) => {
      const stat = fs.statSync(path.join(dir, f));
      return { name: f, type: stat.isDirectory() ? "dir" : "file" };
    });
    res.json({ dir, files });
  });

  // === Read file ===
  app.get("/file", checkApiKey, (req, res) => {
    if (!req.query.path) return res.status(400).json({ error: "Missing path" });
    const filePath = safePath(req.query.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
    res.json({ path: req.query.path, content: fs.readFileSync(filePath, "utf8") });
  });

  // === Write file ===
  app.post("/file", checkApiKey, (req, res) => {
    const { path: filePath, content } = req.body;
    if (!filePath) return res.status(400).json({ error: "Missing path" });
    fs.writeFileSync(safePath(filePath), content, "utf8");
    res.json({ message: "File saved", path: filePath });
  });

  // === Create file ===
  app.post("/create/file", checkApiKey, (req, res) => {
    if (!req.body.path) return res.status(400).json({ error: "Missing path" });
    fs.writeFileSync(safePath(req.body.path), "");
    res.json({ message: "File created", path: req.body.path });
  });

  // === Create folder ===
  app.post("/create/folder", checkApiKey, (req, res) => {
    if (!req.body.path) return res.status(400).json({ error: "Missing path" });
    fs.mkdirSync(safePath(req.body.path), { recursive: true });
    res.json({ message: "Folder created", path: req.body.path });
  });

  // === Delete ===
  app.post("/delete", checkApiKey, (req, res) => {
    if (!req.body.path) return res.status(400).json({ error: "Missing path" });
    const p = safePath(req.body.path);
    if (!fs.existsSync(p)) return res.status(404).json({ error: "Not found" });

    if (req.body.recursive) fs.rmSync(p, { recursive: true, force: true });
    else fs.unlinkSync(p);

    res.json({ message: "Deleted", path: req.body.path });
  });

  // === Move ===
  app.post("/move", checkApiKey, (req, res) => {
    const { src, dest } = req.body;
    if (!src || !dest) return res.status(400).json({ error: "Missing src/dest" });
    fs.renameSync(safePath(src), safePath(dest));
    res.json({ message: "Moved", src, dest });
  });

  // === Search ===
  app.get("/search", checkApiKey, (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Missing query" });

    let matches = [];
    function searchDir(dir) {
      fs.readdirSync(dir).forEach((file) => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) return searchDir(p);
        const lines = fs.readFileSync(p, "utf8").split("\n");
        lines.forEach((line, i) => {
          if (line.includes(query)) {
            matches.push({ path: p, line: i + 1, text: line });
          }
        });
      });
    }
    searchDir(ROOT_DIR);
    res.json({ matches });
  });

  // === Replace ===
  app.post("/replace", checkApiKey, (req, res) => {
    const { query, replace } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    let count = 0;
    function replaceDir(dir) {
      fs.readdirSync(dir).forEach((file) => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) return replaceDir(p);
        let content = fs.readFileSync(p, "utf8");
        if (content.includes(query)) {
          content = content.split(query).join(replace);
          fs.writeFileSync(p, content, "utf8");
          count++;
        }
      });
    }
    replaceDir(ROOT_DIR);
    res.json({ message: `Replaced in ${count} files` });
  });

  // === Tail logs ===
  app.get("/logs/tail", checkApiKey, (req, res) => {
    const { path: logPath, lines = 50 } = req.query;
    if (!logPath) return res.status(400).json({ error: "Missing log path" });

    const fullPath = safePath(logPath);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: "Not found" });

    const content = fs.readFileSync(fullPath, "utf8").split("\n").slice(-lines).join("\n");
    res.json({ content });
  });

  // === Start task ===
  app.post("/task/start", checkApiKey, (req, res) => {
    if (!req.body.command) return res.status(400).json({ error: "Missing command" });
    const id = Date.now().toString();
    const child = exec(req.body.command, { cwd: ROOT_DIR });
    tasks[id] = { status: "running", stdout: "", stderr: "" };

    child.stdout.on("data", (d) => (tasks[id].stdout += d));
    child.stderr.on("data", (d) => (tasks[id].stderr += d));
    child.on("close", () => (tasks[id].status = "done"));

    res.json({ message: "Task started", taskId: id });
  });

  // === Task status ===
  app.get("/task/status", checkApiKey, (req, res) => {
    if (!req.query.taskId) return res.status(400).json({ error: "Missing taskId" });
    const task = tasks[req.query.taskId];
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  });

  // === Git status ===
  app.get("/git/status", checkApiKey, (req, res) => {
    exec("git status", { cwd: ROOT_DIR }, (err, stdout, stderr) => {
      res.json({ stdout, stderr, error: err?.message });
    });
  });

  return app;
}

module.exports = { createApp };
