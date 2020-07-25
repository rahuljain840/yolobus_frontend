import _get from 'lodash/get';
import config from '../../config';

const hostMapper = {
  'DEFAULT': {
    host: 'api',
    protocol: 'api_protocol'
  }
};

const formatURL = ({path, hostType = 'DEFAULT'} = {}) => {
  if (path.indexOf('http') >= 0) {
    return path;
  }
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  const adjustedPort = config.api.port ? ':' + config.api.port : '';   // eslint-disable-line prefer-template
  const adjustedHost = _get(config, `${hostMapper[hostType].host}.host`, config.api.host);
  const protocol = _get(config, `${hostMapper[hostType].host}.scheme`, config.api_protocol);
  return `${protocol}://${adjustedHost}${adjustedPort}${adjustedPath}`;
};

export {
  formatURL,
};
