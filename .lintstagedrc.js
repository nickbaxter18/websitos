module.exports = {
  // Lint + format source code
  "src/**/*.{ts,tsx,js,jsx}": ["eslint --fix --max-warnings=0", "prettier --write"],

  // Format styles and HTML
  "src/**/*.{css,scss,html}": ["prettier --write"],

  // Format structured data
  "src/**/*.{json,md,yml,yaml}": ["prettier --write"],

  // Root-level JSON (configs, package.json, etc.)
  "*.json": ["prettier --parser json --write"],

  // Root-level Markdown & YAML
  "*.{md,yml,yaml}": ["prettier --write"],
};
