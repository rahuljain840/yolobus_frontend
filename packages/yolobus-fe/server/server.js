import  './tracer'; // must come before importing any instrumented module.

import Express from 'express';
import fs from 'fs';
import React from 'react';
import ReactDOM from 'react-dom/server';
import path from 'path';
import cookiesMiddleware from 'universal-cookie-express';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import { createMemoryHistory } from 'history';
import { StaticRouter } from 'react-router-dom';

export const history = createMemoryHistory();

import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import createStore from '../app/store';
import routes from '../app/routes';
import { ApiClient } from 'app/helpers/ApiClient';
import Html from 'app/helpers/Html';
import appConfig from '../config';
import logger from 'app/utils/logger';
import url from 'url';
import { redirectionEnabled } from 'app/helpers/urlHelpers';
import Loadable from 'react-loadable';
import { TEMPORARY_REDIRECT } from 'app/constants/httpStatusCodes';

const winston = require('winston');
const expressWinston = require('express-winston');

const renderToString = (component) => {
  const renderedComponent = {};
  try {
    renderedComponent.html = ReactDOM.renderToString(component);
    return renderedComponent;
  } catch (err) {
    console.log(`SSR error: ${err} \n stack trace is ${err.stack}`);
    if (err.message === '404') {
      renderedComponent.statusCode = 404;
    }
    return renderedComponent;
  }
};

const renderToStaticMarkup = (component) => {
  const renderedComponent = {};
  try {
    renderedComponent.html = ReactDOM.renderToStaticMarkup(component);
    return renderedComponent;
  } catch (err) {
    logger.error(`SSR error: ${err} \n stack trace is ${err.stack}`);
    if (err.message === '404') {
      renderedComponent.statusCode = 404;
    }
    return renderedComponent;
  }
};

module.exports = async (chunks) => {
  const app = new Express();

  app.use(cookieParser());
  // support parsing of application/json type post data
  app.use(bodyParser.json());
  app.use(cookiesMiddleware());

  app.get('/sw.js', (req, res) => {
    if (__DEVELOPMENT__) {
      http.get('http://localhost:4001/static/build/sw.js', (r) => {
        res.set({
          'Content-Type': 'text/javascript',
          'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
        });
        r.setEncoding('utf8');
        r.pipe(res);
      }).on('error', (e) => {
        console.error(`Error in sending sw.js in dev mode : ${e.message}`);
      });
    } else {
      res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
      res.sendFile('sw.js', { root: path.join(__ROOT_DIRECTORY__, 'assets', 'build') }); // eslint-disable-line no-undef
    }
  });

  app.get('/systems/uptime/browsing/fe-ms', (req, res) => {
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=0, no-cache'
    });
    res.send({ machine: `ms-${process.env.HOSTNAME || 'browsingfe'}`});
  });

  app.use('/mobile_assets',
    Express.static(path.join(__ROOT_DIRECTORY__, 'assets'), { maxage: '1y' }), (req, res, next) => { // eslint-disable-line no-undef
      fs.exists(req.baseUrl + req.url, (exists) => {
        if (!exists) {
          res.setHeader('Cache-Control', 'no-cache');
          res.status(404).send(`Asset not found! ${req.baseUrl + req.url}`);
        } else {
          next();
        }
      });
    }); // eslint-disable-line no-undef

  app.use((req, res, next) => {
    if (redirectionEnabled(req.path)) {
      const parsedUrl = url.parse(req.originalUrl);
      parsedUrl.pathname = parsedUrl.pathname.toLowerCase();
      res.redirect(301, url.format(parsedUrl));
    } else {
      next();
    }
  });

  const server = new http.Server(app);

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.File({
        filename: 'access.log'
      })
    ],
    meta: true,
    msg: '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
    expressFormat: true,
    colorize: false,
  }));

  app.use((req, res) => {
    const pprodCookie = req.cookies.pp;
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(req.originalUrl === '/ww.js.map') {
      return res.status(200);
    } else if(req.originalUrl === '/favicon.ico') {
      return res.status(200);
    }
    else {
      const pprodCookie = req.cookies.pp;
      if (pprodCookie === undefined || pprodCookie !== 'v') {
        res.cookie('pp', 'v');
      }
      const hydrateOnClient = () => {
        console.log(`${remoteAddress} :: Rendering server :: Hydrating on client`);
        res.send(
          `<!doctype html>\n${renderToString(<Html assets={chunks} />)}`
        );
      };

      if (__DISABLE_SSR__) {
        logger.warn(`${remoteAddress} :: Rendering server :: DisabledSSR :: Server Side Rendering disabled`);
        hydrateOnClient();
        return;
      }

      if (req.path.match('(tour|honeymoon|family)-packages/sikkim-gangtok-darjeeling') || req.path.match('(tour|honeymoon|family)-packages/sikkim%20-%20gangtok%20-%20darjeeling')) {
        res.redirect(301, req.originalUrl.replace('sikkim-gangtok-darjeeling', 'sikkim'));
      }

      if (req.path.match('hotel/.*/select-room') || req.path.match('hotel/.*/review-booking') || req.path.match('hotel/.*/guest-details')) {
        res.redirect(301, req.query.return_url);
      }

      const client = new ApiClient(req, res);
      const store = createStore(history, client);
      const reqUrl = req.originalUrl || req.url;
      const location = url.parse(reqUrl);
      const context = {};
      loadOnServer({ store, location , routes, helpers: { client } }).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <StaticRouter context={context} location={location} history={history}>
              <CookiesProvider cookies={req.universalCookies}>
                <ReduxAsyncConnect routes={routes} />
              </CookiesProvider>
            </StaticRouter>
          </Provider>
        );

        const html = <Html
          query={req.query}
          assets={chunks}
          component={component}
          store={store}
          assetPath={path.join(__ROOT_DIRECTORY__, 'assets', 'build')}
          url={req.url}
        />;

        const renderedComponent = renderToString(
          html
        );

        if (renderedComponent.statusCode === 404) {
          res.redirect(TEMPORARY_REDIRECT, appConfig.errorPage);
          return;
        } else if (!renderedComponent.html) {
          res.status(500).send('Server error occured please refresh the page');
          return;
        }

        if (context.url) {
          // Somewhere a `<Redirect>` was rendered
          res.redirect(302, context.url);
          return;
        }

        if (req.url.includes(appConfig.errorPage)) {
          res.status(404);
        } else {
          res.status(200);
        }

        // Fetch cookies recieved during the server API requests
        // and pass it to the client
        // eslint-disable-next-line
        for (const cookie of client.cookies) {
          res.set('Set-Cookie', cookie);
        }
        res.send(`<!doctype html>\n${renderedComponent.html}`);
      });

    }
  });
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.File({
        filename: 'error.log'
      })
    ]
  }));

  Loadable.preloadAll().then(() => {
    server.listen(appConfig.server.port, (error) => {
      if (error) {
        console.log(`Failed to start rendering server :: ${error}`);
        throw error;
      }

      console.log(`Rendering server listening on http://${appConfig.server.host}:${appConfig.server.port}`);
    });
  });
};
