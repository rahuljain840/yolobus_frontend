const winston = require('winston');
require('winston-daily-rotate-file');

const productionOptions = {
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'error-file',
      filename: '/var/log/fe/ms/trips3m_web-error.log',
      level: 'error',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      json: false,
      timestamp: () => Date(),
      formatter: options =>
        `${winston.config.colorize(options.level, options.level.toUpperCase())} [${options.timestamp()}] :: ${options.message ? options.message : ''}${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
    }),
    new winston.transports.DailyRotateFile({
      name: 'info-file',
      filename: '/var/log/fe/ms/trips3m_web-access.log',
      level: 'info',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      json: false,
      timestamp: () => Date(),
      formatter: options =>
        `${winston.config.colorize(options.level, options.level.toUpperCase())} [${options.timestamp()}] :: ${options.message ? options.message : ''}${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: '/var/log/fe/ms/trips3m_web-error.log'
    })
  ],
  exitOnError: false
};

const developmentOptions = {
  transports: [
    new winston.transports.Console({
      level: 'debug',
      colorize: true,
      prettyPrint: true,
      timestamp: () => Date(),
      formatter: options =>
        `${winston.config.colorize(options.level, options.level.toUpperCase())} [${options.timestamp()}] :: ${options.message ? options.message : ''}${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      timestamp: () => Date.now(),
      formatter: options =>
        `${options.timestamp()} ${options.message ? options.message : ''}${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
    })
  ],
  exitOnError: false
};

const logConfiguration = __DEVELOPMENT__ ||
  process.env.NODE_ENV !== 'production'
  ? developmentOptions
  : productionOptions;

const logger = new winston.Logger(logConfiguration);

export default {
  error: logger.error,
  warn: logger.warn,
  info: logger.info,
  debug: logger.debug
};
