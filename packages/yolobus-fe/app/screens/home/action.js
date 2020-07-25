import {homeApiUrl} from 'app/helpers/urlHelpers';

export const HOME_DETAIL_LOAD = 'HOME_DETAIL_LOAD';
export const HOME_DETAIL_SUCCESS = 'HOME_DETAIL_SUCCESS';
export const HOME_DETAIL_FAIL = 'HOME_DETAIL_FAIL';

export const fetchDetail = () => {
  return {
    types: [
      HOME_DETAIL_LOAD,
      HOME_DETAIL_SUCCESS,
      HOME_DETAIL_FAIL,
    ],
    promise: client => client.get(homeApiUrl()),
    withoutCamelCasing: false
  };
};
