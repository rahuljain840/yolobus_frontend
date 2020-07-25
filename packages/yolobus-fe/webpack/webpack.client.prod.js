const path = require('path');
const webpack = require('webpack');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const appConfig = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { appPaths } = require('./webpack.config');

const ROOT_PATH = path.resolve(__dirname);

const plugins = [
  new SpriteLoaderPlugin(),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.BABEL_ENV': JSON.stringify('production'),

    __CLIENT__: true,
    __SERVER__: false,
    __PRODUCTION__: true,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false
  }),
  new AssetsPlugin({ path: appPaths.assets }),
  new ReactLoadablePlugin({ filename: appPaths.assets + '/react-loadable.json' }),
  new MiniCssExtractPlugin({
    filename: "[name]-[hash].css",
    chunkFilename: "[name]-[hash].css"
  }),
  new WorkboxPlugin.InjectManifest({
    swSrc: path.join(__dirname, 'sw.js'),
    swDest: 'sw.js',
  }),
  new CopyWebpackPlugin(
    [{ from: 'webpack/manifest.json' }], {
      copyUnmodified: true
    }
  ),
  //new BundleAnalyzerPlugin({ analyzerMode: 'static' })
  // new PurgecssPlugin({
  //   paths: glob.sync(`${appPaths.app}/**/*`,  { nodir: true }),
  //   whitelistPatterns: [/.*swiper-\w*/]
  // })
];

const config = (env = {}, argv = {}) => (
  {
    context: appPaths.root,

    entry: {
      main: ['./app/client.js']
    },
    output: {
      path: appPaths.assets,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: env['disable-cdn'] ? '/mobile_assets/build/' : appConfig.assets.cdn + '/mobile_assets/build/'
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
              babelrc: false,
              presets: [
                [
                  '@babel/env',
                  {
                    targets: { browsers: ['last 2 versions', 'safari >= 7'] },
                    loose: false
                  },
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
                  localIdentName: '[hash:base64:7]'
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
              options: {
                extract: true,
                spriteFilename: `${appConfig.assets.svgPrefix}[hash].svg`
              }
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
      alias: {
        'lodash-es': 'lodash',
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
      usedExports: true,
      splitChunks: {
        maxAsyncRequests: 15,
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/](react|react-cookie|react-dom|react-helmet|react-redux|react-router|react-router-dom|react-router-config|redux|redux-connect|redux-thunk)/,
            reuseExistingChunk: true,
            name: "vendor-react",
            chunks: "initial",
          },
          vendorAll: {
            test: /[\\/]node_modules[\\/](?!(react|react-cookie|react-dom|react-helmet|react-redux|react-router|react-router-dom|react-router-config|redux|redux-connect|redux-thunk))/,
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
      runtimeChunk: 'single',
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },

    mode: 'production',

    plugins,

    devtool: 'nosources-source-map',
    performance: {
      //TODO: Brij Increasing to 382KB due to QDP web view. Need to reduce size.
      maxAssetSize: 532968, // Limiting to 375 KB as Vendor-all file takes 375 KB size.
      maxEntrypointSize: 1572864,// Limiting to 1.5 MB as it combined all entrypoint size which is currently 1.03 KB
      hints: 'error',
      assetFilter: (filename) => {
        return filename.endsWith('.js');
      }
    },
  }
);

module.exports = config;
