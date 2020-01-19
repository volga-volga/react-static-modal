const PATHS = require("./paths");
const postcssNormalize = require("postcss-normalize");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const entry = {
  Modal: PATHS.source + "/Modal.jsx"
  // StaticModal: PATHS.source + "/StaticModal.jsx",
};

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    // isEnvDevelopment && require.resolve("style-loader"),
    {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          }),
          postcssNormalize()
        ]
      }
    }
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {}
    });
  }
  return loaders;
};

module.exports = function(env, options) {
  return {
    entry,
    output: {
      path: PATHS.dist,
      filename: `[name].js`,
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.(scss)$/,
          exclude: /node_modules/,
          sideEffects: true,
          loader: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: false
            },
            "sass-loader"
          )
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css"
      })
    ]
  };
};
