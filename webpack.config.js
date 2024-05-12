const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlinePlugin = require('html-webpack-inline-plugin');

module.exports = {
  entry: './pizda/with.js',
  output: {
    filename: 'ebundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new HtmlWebpackInlinePlugin(),
  ],
};
