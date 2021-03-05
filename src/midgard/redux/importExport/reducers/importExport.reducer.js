import {
  GET_API_RESPONSE,
  GET_API_RESPONSE_SUCCESS,
  GET_API_RESPONSE_FAILURE,
} from "../actions/importExport.actions";

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  apiResponse: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_API_RESPONSE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_API_RESPONSE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        apiResponse: action.res,
      };

    case GET_API_RESPONSE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    default:
      return state;
  }
}