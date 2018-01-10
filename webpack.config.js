const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractCSS = new ExtractTextPlugin('style-bundle.css');
module.exports = {
  entry: {
    app: ['./src/app.js'],
    demo: ['./src/demo/index.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name]-bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets:['env'],
              plugins: ['transform-react-jsx']
            }
          }
          // {loader: 'eslint-loader'}
        ]
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {sourceMap: true}
          }
        })
      },
      {
        test: /\.less$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'less-loader',
              options: {sourceMap: true}
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {limit: 8000}
          }
        ]
      }
    ]
  },
  plugins: [extractCSS]
};