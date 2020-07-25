const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: path.resolve(__dirname, 'src/bundle.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'trips3m-packages-fe.js',
    publicPath: 'dist/',
    library: 'Trips3mPackagesFE',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),

  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/env',
                {
                  targets: { browsers: ['last 2 versions', 'safari >= 7'] },
                  modules: false,
                  loose: false
                }
              ],
              '@babel/react'
            ],
            plugins: [
              '@babel/proposal-object-rest-spread',
              'transform-class-properties',
            ]
          }
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ],
  },
};
