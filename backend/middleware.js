// middleware.js

export function checkApiKey(req, res, next) {
  const provided = req.header("x-api-key");
  const expected = "1f82a9f4a9d84b8db2d4f6c0e2c5a7b1"; // same as editor.html

  if (!provided) {
    return res.status(401).json({ error: "Unauthorized: Missing API key" });
  }

  if (provided !== expected) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }

  next();
}
