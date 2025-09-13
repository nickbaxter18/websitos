const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { checkApiKey } = require("./middleware");

const upload = multer({ dest: "uploads/" });

const app = express();
const ROOT_DIR = process.cwd();

// Existing routes...

// Ingest file route (for Sync workflow)
app.post("/ingest_file", checkApiKey, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Move uploaded zip file to a permanent location (or process it)
  const tempPath = req.file.path;
  const targetPath = path.join(ROOT_DIR, "uploads", req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error("❌ Failed to move uploaded file:", err);
      return res.status(500).json({ error: "Failed to store file" });
    }

    console.log(`✅ File uploaded and stored at ${targetPath}`);
    res.json({ message: "File uploaded successfully", path: targetPath });
  });
});

module.exports = { app };