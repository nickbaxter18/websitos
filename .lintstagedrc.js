module.exports = {
  "src/**/*.{ts,tsx,js,jsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write"
  ],
  "src/**/*.{json,md,yml,yaml}": [
    "prettier --write"
  ],
  "*.{json}": [
    "prettier --parser json --write"
  ],
  "*.{md,yml,yaml}": [
    "prettier --write"
  ]
};
