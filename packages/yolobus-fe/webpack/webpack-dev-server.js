const Express = require('express');
const webpack = require('webpack');
const config = require('./webpack.client.dev');

const appConfig = require('../config');


const compiler = webpack(config());

const serverOptions = {
  contentBase: 'http://' + appConfig.webpackHMR.host + ':' + appConfig.webpackHMR.port,
  hot: true,
  lazy: false,
  publicPath: config().output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    children: false
  }
};

const app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(appConfig.webpackHMR.port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> Webpack development server listening on port %s', appConfig.webpackHMR.port);
  }
});
