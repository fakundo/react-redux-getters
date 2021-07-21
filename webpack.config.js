const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const host = 'localhost'
const port = 3000

module.exports = {
  entry: [
    `webpack-dev-server/client?http://${host}:${port}`,
    path.resolve(__dirname, 'examples/index'),
  ],
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      'react-redux-getters': path.resolve(__dirname),
    },
  },
  devServer: {
    host,
    port,
    stats: 'minimal',
  },
}
