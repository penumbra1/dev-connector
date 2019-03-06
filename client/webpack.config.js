const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Dev connector",
      meta: [
        {
          name: "description",
          content: "A social network for developers."
        }
      ],
      mobile: true,
      lang: "en-US",
      appMountId: "app"
    }),
    new CleanWebpackPlugin(["dist/*"])
  ]
};
