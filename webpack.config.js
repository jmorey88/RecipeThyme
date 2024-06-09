// webpack.config.js
const webpack = require("webpack");
const path = require("path");

module.exports = (env, argv) => {
  console.log("argv.mode", argv.mode);
  console.log("argv.mode type", typeof argv.mode);
  const environment = argv.mode === "production" ? "production" : "development";
  const isProduction = environment === "production";

  console.log("isProduction webpack", isProduction);
  console.log("process.env.NODE_ENV webpack", process.env.NODE_ENV);
  // console.log("NODE_ENV webpack", NODE_ENV);
  console.log("environment webpack", environment);

  if (isProduction) {
    console.log(
      environment,
      "<<<<<<<<<<<<<<<<<webpack production!!!>>>>>>>>>>>>>>>"
    );
  } else {
    console.log(environment, "<<<<<<<webpack dev?>>>>>>>>>");
  }

  return {
    mode: environment,
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
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      console.log(
        "process.env.NODE_ENV webpack in plugin:",
        process.env.NODE_ENV
      ),
      console.log("json stringify environment", JSON.stringify(environment)),
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
