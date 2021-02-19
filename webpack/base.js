const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    path: path.resolve(process.cwd(), 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        type: "asset/source"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(mp3|wav|mp4)$/i,
        type: "asset/resource",
      },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new CopyPlugin({
      patterns: [
        "public",
      ],
    }),
  ]
};
