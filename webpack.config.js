// webpack.config.js
const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  if (process.env.NODE_ENV === "production") {
    console.log(
      process.env.NODE_ENV,
      "<<<<<<<<<<<<<<<<<webpack production!!!>>>>>>>>>>>>>>>"
    );
  } else {
    console.log(process.env.NODE_ENV, "<<<<<<<webpack dev?>>>>>>>>>");
  }

  return {
    mode: isProduction ? "production" : "development",
    context: __dirname,
    entry: "./frontend/recipe_thyme.jsx",
    output: {
      path: path.resolve(__dirname, "public", "assets"),
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
    devtool: isProduction ? "source-map" : "eval-source-map",
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
};

// webpack.config.js
// const path = require("path");

// module.exports = {
//   mode: "development",
//   context: __dirname,
//   entry: "./frontend/recipe_thyme.jsx",
//   output: {
//     path: path.resolve(__dirname, "app", "javascript"),
//     filename: "bundle.js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: ["@babel/preset-env", "@babel/preset-react"],
//           },
//         },
//       },

//       {
//         test: /\.module\.css$/, // Targets only CSS files ending with .module.css
//         use: [
//           "style-loader",
//           {
//             loader: "css-loader",
//             options: {
//               modules: {
//                 mode: "local",
//                 localIdentName: "[name]__[local]___[hash:base64:5]", // Configures the generated class names
//               },
//             },
//           },
//         ],
//       },
//     ],
//   },
// devtool: "eval-source-map",
// resolve: {
//   extensions: [".js", ".jsx"],
// },
// };
