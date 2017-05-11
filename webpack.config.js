const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: './client/src/index.js',
  output: {
    path: path.resolve(__dirname, 'client/build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html'
    })
  ]
}

module.exports = config
