const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const googleapi = require('./src/googleapi');

var extractCSS = new ExtractTextPlugin('style-bundle.css');

let cfg = {
  entry: {
    index: ['./src/app.jsx']
  },

  output: {
    path: path.resolve(__dirname, 'www'),
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
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {limit: 2000}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Web2',
      template: 'src/index-template.html',
      googlePlaceApiKey: googleapi.googlePlaceApiKey
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    extractCSS,
    new ManifestPlugin({
      fileName: 'manifest.json',
    })
  ],
};

if (process.env.NODE_ENV === 'production') {
  cfg = merge(cfg, {
    plugins: [
      new CleanWebpackPlugin(
        ['www']
      ),
      new UglifyJSPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  });
} else {
  cfg = merge(cfg, {
    devtool: 'source-map',
    devServer: {
      contentBase: cfg.output.path,
      watchContentBase: true,
      host: '0.0.0.0',
      port: 8090,
      hot: true
      // https: true
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

module.exports = cfg;
