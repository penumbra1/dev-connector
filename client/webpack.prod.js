const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge.smartStrategy({ "module.rules": "prepend" })(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCSSAssetsPlugin(),
    new CompressionPlugin({
      cache: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              filename: "[name].css",
              chunkFilename: "[id].css"
            }
          }
        ]
      }
    ]
  }
});
