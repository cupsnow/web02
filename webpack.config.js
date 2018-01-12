const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

var extractCSS = new ExtractTextPlugin('style-bundle.css');

module.exports = {
  entry: {
    app: ['./src/app_entrance.js'],
    index: ['./src/index.js']
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
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
              presets:['env', 'stage-1'],
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
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Web2'
    }),
    extractCSS,
    new ManifestPlugin()
  ]
};
