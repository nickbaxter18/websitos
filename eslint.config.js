import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      ".github/scripts/aggregator.js",
      ".github/workflows/*.yml",
      ".github/workflows/*.yaml",
    ],
  },
];
