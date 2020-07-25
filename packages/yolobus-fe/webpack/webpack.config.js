const path = require('path');
const fs = require('fs');

const appPaths = {
  root: path.resolve(__dirname, '../'),
  app: path.resolve(__dirname, '../app'),
  actionConstants: path.resolve(__dirname, '../app/actionConstants'),
  assets: path.resolve(__dirname, '../assets/build/'),
  theme: path.resolve(__dirname, '../app/theme'),
  containers: path.resolve(__dirname, '../app/containers'),
  components: path.resolve(__dirname, '../app/components'),
  reducers: path.resolve(__dirname, '../app/reducers'),
  actions: path.resolve(__dirname, '../app/actions'),
  helpers: path.resolve(__dirname, '../app/helpers'),
  utils: path.resolve(__dirname, '../app/utils'),
  constants: path.resolve(__dirname, '../app/constants'),
  appConfig: path.resolve(__dirname, '../config'),
  screens: path.resolve(__dirname, '../app/screens'),
  modules: path.resolve(__dirname, '../app/modules'),
  server: path.resolve(__dirname, '../server'),
};

const commonConfig = (env = {}, args = {}) => ({
  context: appPaths.root
});

module.exports = {
  appPaths,
  commonConfig
};
