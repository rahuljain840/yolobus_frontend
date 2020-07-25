#!/usr/bin/env node
const path = require('path');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__ROOT_DIRECTORY__ = path.resolve(__dirname);

process.traceWarnings = true;
process.on('unhandledRejection', r => console.log(r));

const waitForFile = async filePath => {
  return new Promise(resolve => {
    const tickInterval = 500;
    const message = {
      timer: 0,
      interval: 3000
    };
    tick(
      async () => await readFile(filePath),
      500,
      resolve,
      () => {
        message.timer += tickInterval;
        if (message.timer >= message.interval) {
          message.timer = 0;
          // console.log(`${filePath} not found`);
          // console.log('##### Waiting for the build file to be generated #####');
        }
      }
    );
  });
};

const tick = (condition, interval, resolve, reject) => {
  condition().then(
    chunks => resolve(chunks)
  ).catch(
    err => {
      setTimeout(() => tick(condition, interval, resolve, reject), interval);
      reject();
    }
  );
};

waitForFile(path.resolve(__dirname, 'assets/build/webpack-assets.json'))
  .then(chunks => require('./assets/build/server/server')(JSON.parse(chunks)));
