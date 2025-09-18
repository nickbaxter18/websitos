module.exports = function () {
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [] // ✅ no Istanbul here, instrumentation handled by vite-plugin-istanbul
  };
};