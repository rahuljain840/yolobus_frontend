export const INITIAL_STATE = { loaded: false, loading: false, data: {} };

export const getLoadState = state => {
  return { ...state, loaded: false, loading: true };
};

export const getFailState = (state, errors) => {
  return { ...state, loaded: false, loading: false, errors };
};

export const getSuccessState = (state, { metaData } = {}) => {
  return { ...state, ...{ data: {}, metaData }, loaded: true, loading: false };
};
