const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/icons.js")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new CleanWebpackPlugin(),
    !process.env.IS_NOW &&
      new BundleAnalyzerPlugin({
        openAnalyzer: false
      })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader"
            // options: {
            //   modules: true
            // }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          "css-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(ts|js)x?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|svg|eot|ttf|woff|woff2)$/,
        loader: "file-loader",
        options: {
          outputPath: "assets"
        }
      }
    ]
  }
};
