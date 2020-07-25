import {asyncConnect} from 'redux-connect';
import Loadable from 'react-loadable';
import _get from 'lodash/get';

import {fetchDetail} from './action';

const HomeAsync = Loadable({
  loader: () => import(/* webpackChunkName: 'home' */ './View'),
  loading: () => null
});

const asyncItems = [
  {promise: () => import('./View')},

];

const mapStateToProps = (state) => ({
  homePageDetails: state.home.data
});

const mapDispatchToProps = () => ({
  fetchDetail
});

export default asyncConnect(asyncItems, mapStateToProps, mapDispatchToProps)(HomeAsync);
