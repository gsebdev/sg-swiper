const path = require('path');

module.exports = {
  entry: {
    demo: './index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  }
};