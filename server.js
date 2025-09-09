const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // ✅ load .env if present

const app = express();
const PORT = process.env.PORT || 4000;
const ROOT_DIR = process.cwd();

// === API Key Security (disabled for local/editor use) ===
const API_KEY = process.env.EDITOR_API_KEY || "changeme"; // set real key in .env
function checkApiKey(req, res, next) {
  // ✅ Bypass API key check for local/editor use
  if (req.headers.referer && req.headers.referer.includes("/editor")) {
    return next();
  }
  // ✅ Also bypass entirely if running locally
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(403).json({ error: "Forbidden: invalid API key" });
  }
  next();
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// === Paths ===
const distPath = path.join(__dirname, "dist");
const editorPath = path.join(__dirname, "editor.html");

// === Health Check ===
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

// === Editor Route ===
app.get("/editor", (req, res) => {
  res.sendFile(editorPath);
});

// === File API (for editor) ===
app.get("/file", checkApiKey, (req, res) => {
  const filePath = path.join(ROOT_DIR, req.query.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }
  const content = fs.readFileSync(filePath, "utf8");
  res.json({ path: req.query.path, content });
});

app.post("/file", checkApiKey, (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath || content === undefined) {
    return res.status(400).json({ error: "Missing path or content" });
  }
  const absPath = path.join(ROOT_DIR, filePath);
  fs.writeFileSync(absPath, content, "utf8");
  res.json({ message: "File updated successfully", path: filePath });
});

app.get("/list", checkApiKey, (req, res) => {
  const dir = req.query.dir || ".";
  const absDir = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(absDir)) {
    return res.status(404).json({ error: "Directory not found" });
  }
  const files = fs.readdirSync(absDir, { withFileTypes: true });
  res.json({
    dir,
    files: files.map((f) => ({
      name: f.name,
      type: f.isDirectory() ? "dir" : "file",
    })),
  });
});

// === React App Route (only if built) ===
if (fs.existsSync(distPath)) {
  app.use("/app", express.static(distPath));
  app.get("/app", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// === Catch-all fallback ===
app.use((req, res) => {
  res.status(404).send("Not found");
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Editor available at http://localhost:${PORT}/editor`);
  if (fs.existsSync(distPath)) {
    console.log(`✅ React app available at http://localhost:${PORT}/app`);
  } else {
    console.log("⚠️ React app not built, /app will return 404");
  }
});
