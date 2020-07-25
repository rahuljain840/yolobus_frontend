import {HOME_DETAIL_LOAD, HOME_DETAIL_SUCCESS, HOME_DETAIL_FAIL} from './action';

const initialState = {
  loaded: false,
  loading: false,
  data: {}
};

export default function home(state = initialState, action = {}) {
  switch (action.type) {
    case HOME_DETAIL_LOAD:
      return {
        ...state,
        loaded: false,
        loading: true
      };
    case HOME_DETAIL_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        data: JSON.parse(action.result.data)
      };
    case HOME_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false
      };
    default:
      return state;
  }
}
