const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    javascript: "./app/index.jsx"
  },

  output: {
    publicPath: "/",
    filename: "doecode/app.js",
    path: __dirname + "/dist"
  },

  resolve: {
    extensions: [
      '.js', '.jsx', '.json'
    ],
    alias: {
      'react': path.resolve(path.join(__dirname, 'node_modules', 'react'))
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|jpg)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
    new HtmlWebpackPlugin({template: 'dist/index.html', inject: 'body'})
  ]
}
