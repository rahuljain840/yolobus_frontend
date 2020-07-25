const createApiReducer = (types = [], initialValues = {}) => {
  if (!Array.isArray(types) || types.length !== 3) {
    // TODO: Fix logger and remove console logs
    console.log('Invalid types passed to createApiReducer. types should be an array of length three');
    return state => state;
  }

  const [LOAD, LOAD_SUCCESS, LOAD_FAIL] = types;

  const initialState = {
    loaded: false,
    ...initialValues
  };

  return (
    state = initialState,
    action = {}
  ) => {
    switch (action.type) {
      case LOAD:
        return {
          ...state,
          loaded: false,
          loading: true
        };
      case LOAD_SUCCESS:
        return {
          ...state,
          loading: false,
          loaded: true,
          data: action.result && action.result.data,
          errors: null
        };
      case LOAD_FAIL:
        return {
          ...state,
          loading: false,
          loaded: false,
          errors: action.error && action.error.errors
        };
      default:
        return state;
    }
  };
};

export default createApiReducer;
