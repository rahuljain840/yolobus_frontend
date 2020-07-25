const fs = require('fs');
const _merge = require('lodash/merge');
const configFilePath = 'config/index.js';
const defaultConfig = require('./config/default.js');
const prodEnv = process.env.RAILS_ENV;
const stagEnv = process.env.SITE_URL;

let variantName = '';
let currentEnv = '';

if (prodEnv && prodEnv === 'production') {
  variantName = 'default';
  currentEnv = 'production';
} else if (stagEnv) {
  variantName = stagEnv.split('.')[0];
  currentEnv = 'staging';
} else {
  currentEnv = 'local';
}

const getConfigFile = () => {
  switch (currentEnv) {
    case 'staging':
      return require('./config/dev.config');
    case 'production':
      return require('./config/prod.config');
    default:
      return require('./config/default.js');
  }
};

const writeFile = async (data) => {
  let finalConfig = { ...defaultConfig };
  const server = {
    'server': {
      'host': 'localhost',
      'port': 4000,
      'public': {
        'host': variantName === 'default' ? 'yolobus.com': `localhost`
      }
    }
  };

  if (currentEnv !== 'local') {
    finalConfig = _merge(defaultConfig, getConfigFile(), data, server);
  }
  fs.writeFileSync(`./${configFilePath}`, `module.exports = ${JSON.stringify(finalConfig, null, 2)};\n`, 'utf-8');
};

const createConfigFile = async () => {
  const config = '';
  await writeFile(config);
};

createConfigFile();
