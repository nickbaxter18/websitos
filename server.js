// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;
const ROOT_DIR = process.cwd(); // Root of project

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Serve editor UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "editor.html")); // keep UI separate
});

// === File API ===

// Read file
app.get("/file", (req, res) => {
  const filePath = path.join(ROOT_DIR, req.query.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }
  const content = fs.readFileSync(filePath, "utf8");
  res.json({ path: req.query.path, content });
});

// Save file
app.post("/file", (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath || content === undefined) {
    return res.status(400).json({ error: "Missing path or content" });
  }
  const absPath = path.join(ROOT_DIR, filePath);
  fs.writeFileSync(absPath, content, "utf8");
  res.json({ message: "File updated successfully", path: filePath });
});

// List files
app.get("/list", (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`✅ File editor with tabs running at http://localhost:${PORT}`);
});
