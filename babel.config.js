export default {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic", // ✅ no need to import React in tests or components
      },
    ],
    "@babel/preset-env",
    "@babel/preset-typescript",
  ],
  env: {
    test: {
      plugins: ["istanbul"],
    },
  },
};
