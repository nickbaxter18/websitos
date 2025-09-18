module.exports = function (api) {
  api.cache(true); // ✅ enable caching for Jest/Babel

  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [] // instrumentation handled by vite-plugin-istanbul
  };
};