const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
      // Minify doesn't work?
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      // No CSS modules for dependencies (to avoid breaking Semantic UI)
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "../node_modules"),
        use: ["css-loader"]
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
