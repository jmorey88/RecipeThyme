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

      {
        test: /\.module\.css$/, // Targets only CSS files ending with .module.css
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]___[hash:base64:5]", // Configures the generated class names
              },
            },
          },
        ],
      },
    ],
  },
  // devtool: "eval-source-map",
  // resolve: {
  //   extensions: [".js", ".jsx"],
  // },
};
