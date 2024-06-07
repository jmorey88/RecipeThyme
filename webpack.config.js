// webpack.config.js
const webpack = require("webpack");
const path = require("path");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const isProduction = mode === "production";

  // new variable mode =  argv.mode never undefined pass to line 30

  if (mode === "production") {
    console.log(mode, "<<<<<<<<<<<<<<<<<webpack production!!!>>>>>>>>>>>>>>>");
  } else {
    console.log(mode, "<<<<<<<webpack dev?>>>>>>>>>");
  }

  return {
    mode: isProduction ? "production" : "development",
    context: __dirname,
    entry: "./frontend/recipe_thyme.jsx",
    output: {
      path: isProduction
        ? path.resolve(__dirname, "public", "assets")
        : path.resolve(__dirname, "app", "javascript"),
      filename: "bundle.js",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(mode),
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
    },
  };
};
