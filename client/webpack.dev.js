const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge.smartStrategy({ "module.rules": "prepend" })(common, {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: ["style-loader"]
      }
    ]
  }
});
