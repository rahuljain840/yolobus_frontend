import superagent from 'superagent';
import config from 'appConfig';
import { formatURL } from '../utils/parsers';
import camelCaseKeys from 'camelcase-keys';
import { TEMPORARY_REDIRECT, isApiError } from '../constants/httpStatusCodes';
import { redirectToErrorPage } from '../helpers/utils';

// todo : try not to use this library on client side as it will increase bundle size
const superagentLogger = require('app/helpers/superAgentLogger.js');

const methods = ['get', 'post', 'put', 'patch', 'del'];
const headerForBackend = ['x-amzn-trace-id', 'x-device', ];

export class ApiClient {
  constructor(req, res) {
    this.cookies = [];
    this.config = config;
    this.res = res;
    this.req = req;
    methods.forEach((method) => {
      this[method] = (path, { params, data, headers, hostType } = {}) => new Promise(
        (resolve, reject) => {
          const env = __SERVER__ ? 'SSR' : 'CSR';
          const request = superagent[method](formatURL({
            path,
            hostType
          }));
          // Setting the api secret key
          request.set('X-CLIENT-API-TOKEN', config.api.key);
          // request.set('TT-Mobile', config.api.ttMobileKey);

          // append user_id in query
          let modifiedParams;
          if (!params) {
            modifiedParams = {
              ...params,
            };
          }

          if (modifiedParams) {
            request.query(modifiedParams);
          }

          if (__SERVER__ && req.get('cookie')) {
            request.set('cookie', req.get('cookie'));
          }
          if (__SERVER__) {
            headerForBackend.forEach(header => {
              req.header(header) && request.set(header, req.header(header));
              // request.set('user-agent', `MS ${env} ${req.header('user-agent')}`);
            });
          }
          if (headers) {
            request.set(headers);
          }
          request.set('Accept', 'application/json').use(superagentLogger({
            outgoing: true
          }));
          if (data) {
            request.send(data);
          }
          const subContext = {
            errorPage: this.config.errorPage,
            cookies: this.cookies,
            response: this.res,
            isMainApi: params ? params.main_api : false,
            redirectUrl: params ? params.redirectUrl : '',
            api_protocol: this.config.api_protocol,
            host: this.config.server.public.host
          };
          const onSuccess = function (context, result) {
            const { body, xhr, header } = result;
            if (header && header['set-cookie']) {
              context.cookies.push(header['set-cookie']);
            }
            if (body && isApiError(body.code) && context.isMainApi) {
              if (__SERVER__ && context.response) {
                return context.response.redirect(TEMPORARY_REDIRECT, context.redirectUrl || context.errorPage);
              } else if (typeof window === 'object') {
                return redirectToErrorPage();
              }
            }
            return resolve(body || (xhr && xhr.response));
          }.bind(null, subContext);

          const errorHandler = function (context, err) {
            if (err && isApiError(err.status) && context.isMainApi) {
              if (__SERVER__ && context.response) {
                return context.response.redirect(TEMPORARY_REDIRECT, context.redirectUrl || context.errorPage);
              } else if (typeof window === 'object') {
                return redirectToErrorPage();
              }
            }
            const error = err.response && err.response.body ? err.response.body : err;
            reject(error);
          }.bind(null, subContext);

          let returnRequest;

          if (config.withCredentials) {
            returnRequest = request.withCredentials().then(onSuccess).catch(errorHandler);
          } else {
            returnRequest = request.then(onSuccess).catch(errorHandler);
          }

          return returnRequest;
        }
      );
    });
  }
}

export const clientMiddleware = client => ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const { promise, types, withoutCamelCasing = true, ...rest } = action;

  if (!promise) {
    return next(action);
  }

  const [REQUEST, SUCCESS, FAILURE] = types;

  next({ ...rest, type: REQUEST });

  const actionPromise = promise(client);

  actionPromise
    .then(
      result => {
        if (withoutCamelCasing) {
          next({ ...rest, result, type: SUCCESS });
          return;
        }
        const camelCasedResult = Array.isArray(result)
          ? result
          : camelCaseKeys(result, { deep: true });
        next({ ...rest, result: camelCasedResult, type: SUCCESS });
      },
      error => {
        console.log('withoutCamelCasing', error);

        if (withoutCamelCasing) {
          next({ ...rest, error, type: FAILURE });
          return;
        }
        const camelCasedErrors = Array.isArray(error)
          ? error
          : camelCaseKeys(error, { deep: true });

        console.log('error...', camelCasedErrors);
        next({ ...rest, error: camelCasedErrors, type: FAILURE });
      }
    )
    .catch(error => {
      console.error('MIDDLEWARE ERROR:', error);
      next({ ...rest, error, type: FAILURE });
    });

  return actionPromise;
};

const debugRequest = (req, request, body) => {
  console.log('\n******* API CLIENT DEBUG REQUEST *******');
  console.log(`request.url ${request.url}`);
  console.log(`body ${body}`);
  console.log(`request.query().qs ${request.query().qs}`);
  console.log('******* API CLIENT DEBUG REQUEST END *******\n');
};
