// webpack.config.js
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const environment = argv.mode === "production" ? "production" : "development";
  const isProduction = environment === "production";

  return {
    mode: environment,
    context: __dirname,
    entry: "./frontend/recipe_thyme.jsx",
    output: {
      path: path.resolve(__dirname, "public", "packs"),
      filename: "[name]-[contenthash].js",
      publicPath: "/packs/",
    },
    plugins: [
      new CleanWebpackPlugin(),
      new WebpackManifestPlugin({
        fileName: "manifest.json",
        publicPath: "/packs/",
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(environment),
      }),
    ],
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
    devtool: isProduction ? "source-map" : "eval-source-map",
    resolve: {
      extensions: [".js", ".jsx"],
      // modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },
  };
};
