const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const appConfig = require('../config');

const {appPaths} = require('./webpack.config');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin', 'glamor', 'glamorous'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const config = (env, argv) => (
  {
    context: appPaths.root,

    entry: {
      server: [
        './server/server.js'
      ]
    },
    output: {
      path: path.resolve(__dirname, '../assets/build/server/'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: 'http://localhost:4001/static/build/',
      libraryTarget: 'commonjs2',
      pathinfo: true
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: {
            test: /node_modules/,
            exclude: /node_modules\/(camelcase-keys|quick-lru|map-obj|camelcase)/
          },
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    targets: {node: '8.9.2'},
                  }
                ],
                '@babel/react'
              ],
              plugins: [
                '@babel/proposal-object-rest-spread',
                'transform-decorators-legacy',
                'transform-class-properties',
                'syntax-dynamic-import',
                'react-loadable/babel'
              ]
            }
          }
        },
        {
          test: /\.css/,
          use: [
            {
              loader: 'css-loader/locals',
              options: {
                modules: false,
                importLoaders: 1
              }
            }
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.cm.scss$/,
          use: [
            {
              loader: 'css-loader/locals',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '_[hash:base64:5]'
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                preferPathResolver: 'webpack',
                outputStyle: 'expanded'
              }

            }
          ],
        },
        {
          test: /\.cm.scss$/,
          use: [
            {
              loader: 'css-loader/locals',
              options: {
                modules: false,
                importLoaders: 2
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                preferPathResolver: 'webpack',
                outputStyle: 'expanded'
              }
            }
          ],
        },
        {
          test: /\.(jpg|png)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                emitFile: false
              }
            }
          ]
        },
        {
          test: /\.woff2?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: false
              }
            }
          ]
        },
        {
          test: /\.(ttf|eot)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: false
              }
            }
          ]
        },
        {
          test: /\.svg?$/,
          use: [
            {
              loader: 'svg-sprite-loader',
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [{removeStyleElement: true}],
                floatPrecision: 2
              }
            }
          ]
        },
      ]
    },

    resolve: {
      modules: [
        'app',
        'node_modules'
      ],
      alias: {
        actionConstants: appPaths.actionConstants,
        components: appPaths.components,
        containers: appPaths.containers,
        reducers: appPaths.reducers,
        actions: appPaths.actions,
        theme: appPaths.theme,
        helpers: appPaths.helpers,
        utils: appPaths.utils,
        appConfig: appPaths.appConfig,
        assets: appPaths.assets,
        constants: appPaths.constants,
        app: appPaths.app,
        screens: appPaths.screens,
        modules: appPaths.modules
      }
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.BABEL_ENV': JSON.stringify('development'),

        __CLIENT__: false,
        __SERVER__: true,
        __PRODUCTION__: false,
        __DEVELOPMENT__: true,
        __DEVTOOLS__: false
      }),
      new webpack.BannerPlugin({banner: 'require("source-map-support").install();', raw: true, entryOnly: false})
    ],

    target: 'node',

    node: {
      __filename: false,
      __dirname: false,
    },

    devtool: 'inline-source-map',

    externals: nodeModules,
  }
);

module.exports = config;
