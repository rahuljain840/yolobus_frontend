/* eslint-disable */
import React from 'react';
import PropTypes  from 'prop-types';
import ReactDOM from 'react-dom/server';
import { renderStaticOptimized } from 'glamor/server';
import serialize from 'serialize-javascript';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import moduleStats from '../../assets/build/react-loadable.json';
import syncRequest from 'sync-request';
const fs = require('fs');

const generateInlineStyle = (asyncBundles, assetPath) => {
  if (__PRODUCTION__) {
    return asyncBundles
        .filter(bundle => bundle.file.endsWith('.css'))
        .map(bundle => {
              let cssFileContent = fs.readFileSync(`${assetPath}/${bundle.file}`, 'utf8');
              return <style data-name={bundle.file} dangerouslySetInnerHTML={{ __html: cssFileContent }}
                            key={bundle.file} data-href={`${__webpack_public_path__}${bundle.file}`} />
            }
        )
  }
  return asyncBundles
      .filter(bundle => bundle.file.endsWith('.css'))
      .map(bundle => {
            let path = `${__webpack_public_path__}${bundle.file}`;
            const res = syncRequest('GET', path);
            return <style data-name={bundle.file} dangerouslySetInnerHTML={{ __html: res.getBody('utf8') }}
                          key={bundle.file} data-href={`${__webpack_public_path__}${bundle.file}`} />
          }
      );
};

const Html = ({ assets, component, store, assetPath }) => {
  // If we get this query param from any webview then disable the inclusion of anyof the
  // mentioned scripts in the query param *disable_external_scripts* value
  // disable_external_scripts=vwo,segment,newrelic,sentry,gtm,semlead

  const disableExternalScripts = {};

  let content;
  let injectCss;
  let injectIds;
  let head;
  const asyncModules = [];

  if (component) {
    const { html, css, ids } = renderStaticOptimized(
        () => ReactDOM.renderToString(
            <Loadable.Capture report={moduleName => {moduleName && asyncModules.push(moduleName)}}>
              {component}
            </Loadable.Capture>
        )
    );
    head = Helmet.renderStatic();
    content = html;
    injectCss = css;
    injectIds = ids;
  } else {
    content = '';
  }
  const asyncBundles = getBundles(moduleStats, asyncModules).reduce((acc, val) => {
    val && acc.push(val);
    return acc;
  }, []);

  // region windowOnLoad
  // language=JavaScript
  const windowOnLoad = `
    window.loadDeferImages = function () {
      var deferImages = [...document.querySelectorAll('img[data-defer-load="true"]')];
      deferImages.forEach(function (elm) {
        elm.src = elm.getAttribute('data-src');
        elm.setAttribute('data-defer-load', false)
      });
    };
    window.addEventListener('load', function() {
      window.loadDeferImages();
    });
  `;
  // endregion

  const loadCssAsStyle = (assetPath, file) => {
    let cssFileContent = '';
    if (__PRODUCTION__) {
      cssFileContent = fs.readFileSync(`${assetPath}/${file.substr(file.lastIndexOf('/') + 1)}`, 'utf8');
    } else {
      const res = syncRequest('GET', `${__webpack_public_path__}${file.substr(file.lastIndexOf('/') + 1)}`);
      cssFileContent = res.getBody('utf8');
    }
    return <style data-name={file.substr(file.lastIndexOf('/') + 1)} dangerouslySetInnerHTML={{__html: cssFileContent}} />
  };

  const getManifestJson = () => {
    if (__DEVELOPMENT__) {
      return <link rel="manifest" href={`${__webpack_public_path__}manifest.json`} />
    }

    return <link rel="manifest" href="/mobile_assets/build/manifest.json" />
  };
  const asyncJs = asyncBundles
      .filter(bundle => bundle.file.endsWith('.js'))
      .map(bundle => `loadJS('${__webpack_public_path__}${bundle.file}', 'application/javascript')`);
  const asyncJsSourceMap = asyncBundles
      .filter(bundle => bundle.file.endsWith('.map'))
      .map(bundle => `loadJS('${__webpack_public_path__}${bundle.file}', 'application/json')`);


  return (
      <html lang="en">
      <head>
        <link rel="preload" as="script" href={assets.runtime.js} charSet="UTF-8"  />
        <link rel="preload" as="script" href={assets['vendor-react'].js} charSet="UTF-8"  />
        <link rel="preload" as="script" href={assets.main.js} charSet="UTF-8"  />
        <link rel="preload" as="script" href={assets["vendor-all"].js} />

        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {
          loadCssAsStyle(assetPath, assets.main.css)
        }
        {
          generateInlineStyle(asyncBundles, assetPath)
        }
        {injectCss && <style dangerouslySetInnerHTML={{ __html: injectCss }} />}
        {
          getManifestJson()
        }
      </head>
      <body>
      <div id="content" dangerouslySetInnerHTML={{ __html: content }} />

      <script charSet="UTF-8"
              dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} />

      <script charSet="UTF-8"
              dangerouslySetInnerHTML={{ __html: `
            window.addEventListener('load', function() {
              window.main();
            });`
              }} />

      <script src={assets.runtime.js} charSet="UTF-8" defer />
      <script src={assets['vendor-react'].js} charSet="UTF-8" defer />
      <script src={assets.main.js} charSet="UTF-8" defer />

      <script charSet="UTF-8"
              dangerouslySetInnerHTML={{ __html: `
                  var loadJS = function (src, type) {
                    var ref = document.getElementsByTagName("script")[0];
                    var script = document.createElement("script");
                    script.src = src;
                    script.async = true;
                    script.type = type;
                    script.crossorigin = "anonymous";
                    ref.parentNode.insertBefore(script, ref);
                    return script;
                  };

                  window.addEventListener('DOMContentLoaded', function () {
                    ${asyncJs.join(';')}
                    loadJS('${assets["vendor-all"].js}', 'application/javascript');
                  });

                  window.addEventListener('load', function () {
                    ${asyncJsSourceMap.join(';')}
                  });
                `
              }} />

      <script async defer charSet="UTF-8"
              dangerouslySetInnerHTML={{ __html: windowOnLoad }} />

      </body>
      </html>
  );
};

Html.propTypes = {
  assets: PropTypes.object.isRequired,
  component: PropTypes.node.isRequired,
  store: PropTypes.object.isRequired,
  assetPath: PropTypes.string.isRequired,
};

export default Html;
