const path = require('path');
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
    extensions: ['.js', '.jsx', '.json']
  },

  devServer: {
    proxy: {
      '/doecode/api/*': {
        target: 'http://lxappdev2:8080/doecodeapi/services',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/doecode/api': ''
        }
      }
    }

  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["react-hot-loader", "babel-loader"]
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|jpg)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({template: 'dist/index.html', inject: 'body'})]
}
