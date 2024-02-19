// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  context: __dirname,
  entry: "./frontend/recipe_thyme.jsx",
  output: {
    path: path.resolve(__dirname, "app", "javascript"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  // devtool: "eval-source-map",
  // resolve: {
  //   extensions: [".js", ".jsx"],
  // },
};
