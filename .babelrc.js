module.exports = function (api) {
  const isTest = api.env('test');
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: isTest ? [] : ["istanbul"]
  };
};