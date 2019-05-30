const env = process.env.NODE_ENV;

if (env === "commonjs" || env === "es") {
  module.exports = {
    presets: [["@babel/preset-env", { modules: false }]],
    plugins: [
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-syntax-dynamic-import"
    ]
  };

  if (env === "commonjs") {
    module.exports.plugins.push("@babel/plugin-transform-modules-commonjs");
  }
}
