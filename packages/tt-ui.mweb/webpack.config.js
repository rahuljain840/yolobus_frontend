const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/main.jsx'),
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    host: 'localhost',
    port: 9000,
    disableHostCheck: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [],
  devtool: 'source-map',
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
        test: /\.js?$/,
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
        test: /\.scss?$/,
        exclude: /(node_modules|bower_components)/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ],
  },
};
