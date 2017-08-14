const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  context: __dirname,
  entry: {
    javascript: "./app/index.jsx"
  },

  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias : {
    'react' : path.resolve(path.join(__dirname, 'node_modules', 'react'))
}
  },


  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      },
      {
	test: /\.css$/,
	use: ['style-loader','css-loader']
      }
    ],
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'})
  ]
}
