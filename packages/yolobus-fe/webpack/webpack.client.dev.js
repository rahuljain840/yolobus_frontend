const appConfig = require('../config');

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const glob = require('glob');
// const PurgecssPlugin = require('purgecss-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AssetsPlugin = require('assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { appPaths } = require('./webpack.config');

const ROOT_PATH = path.resolve(__dirname);

const config = (env, argv) => (
  {
    context: appPaths.root,

    entry: {
      main: [
        'webpack-hot-middleware/client?path=http://localhost:4001/__webpack_hmr&reload=true',
        './app/client.js'
      ]
    },
    output: {
      path: appPaths.assets,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: 'http://localhost:4001/static/build/',
      crossOriginLoading: 'anonymous'
    },
    cache: true,

    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname),
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            configFile: path.resolve(__dirname, '../.eslintrc'),
            quiet: true,
            emitError: true,
            emitWarning: true,
            failOnError: true,
          }
        },
        {
          test: /\.js$/,
          exclude: {
            test: /node_modules/,
            exclude: /node_modules\/(camelcase-keys|quick-lru|map-obj|camelcase)/
          },
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  '@babel/env',
                  {
                    targets: { browsers: ['last 2 versions', 'safari >= 7'] },
                    loose: false
                  }
                ],
                '@babel/react'
              ],
              plugins: [
                '@babel/proposal-object-rest-spread',
                '@babel/plugin-transform-async-to-generator',
                '@babel/plugin-transform-runtime',
                'transform-decorators-legacy',
                'transform-class-properties',
                'syntax-dynamic-import',
                'react-loadable/babel'
              ]
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /\.cm.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]'
              }
            },
            'sass-loader',
          ],
        },
        {
          test: /\.cm.scss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[path][name]__[local]--[hash:base64:5]'
                }
              }
            },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /\.(jpg|png)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
              }
            }
          ]
        },
        {
          test: /\.woff2?$/,
          use: [
            {
              loader: 'file-loader',
            }
          ]
        },
        {
          test: /\.(ttf|eot)?$/,
          use: [
            {
              loader: 'file-loader',
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
                plugins: [{ removeStyleElement: true }],
                floatPrecision: 2
              }
            }
          ]
        },
      ]
    },

    resolve: {
      modules: ['node_modules'],
      unsafeCache: true,
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
        constants: appPaths.constants,
        app: appPaths.app,
        screens: appPaths.screens,
        modules: appPaths.modules,
        'dtrace-provider': path.resolve(ROOT_PATH, 'empty_shim.js'),
        'fs': path.resolve(ROOT_PATH, 'empty_shim.js'),
        'safe-json-stringify': path.resolve(ROOT_PATH, 'empty_shim.js'),
        'mv': path.resolve(ROOT_PATH, 'empty_shim.js'),
        'source-map-support': path.resolve(ROOT_PATH, 'empty_shim.js'),
        'net': path.resolve(ROOT_PATH, 'empty_shim.js'),
        'dns': path.resolve(ROOT_PATH, 'empty_shim.js'),
      }
    },

    optimization: {
      splitChunks: {
        maxAsyncRequests: 6,
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/](react|react-cookie|react-dom|react-helmet|react-redux|react-router|redux|redux-connect|redux-thunk)/,
            reuseExistingChunk: true,
            name: "vendor-react",
            chunks: "initial",
          },
          vendorAll: {
            test: /[\\/]node_modules[\\/](?!(react|react-cookie|react-dom|react-helmet|react-redux|react-router|redux|redux-connect|redux-thunk))/,
            reuseExistingChunk: true,
            name: 'vendor-all',
            chunks: "initial",
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      },
      runtimeChunk: 'single'
    },

    mode: 'development',

    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.BABEL_ENV': JSON.stringify('development'),

        __CLIENT__: true,
        __SERVER__: false,
        __PRODUCTION__: false,
        __DEVELOPMENT__: true,
        __DEVTOOLS__: true
      }),
      new AssetsPlugin({ path: appPaths.assets }),
      new ReactLoadablePlugin({ filename: appPaths.assets + '/react-loadable.json' }),
      new webpack.NamedModulesPlugin(),
      // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
      new webpack.HotModuleReplacementPlugin({
        multiStep: true,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new WorkboxPlugin.InjectManifest({
        swSrc: path.join(__dirname, 'sw.js'),
        swDest: 'sw.js',
      }),
      new CopyWebpackPlugin(
        [{ from: 'webpack/manifest.json' }], {
          copyUnmodified: true
        }
      )
      // new PurgecssPlugin({
      //   paths: glob.sync(`${appPaths.app}/**/*`,  { nodir: true }),
      // })
    ],
    devtool: 'inline-cheap-module-source-map',
    profile: true
  }
);

module.exports = config;
