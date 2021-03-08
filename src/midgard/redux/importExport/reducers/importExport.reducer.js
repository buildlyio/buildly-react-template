import {
  CLEAR_DATA,
  GET_API_RESPONSE,
  GET_API_RESPONSE_SUCCESS,
  GET_API_RESPONSE_FAILURE,
  GET_EXPORT_DATA,
  GET_EXPORT_DATA_SUCCESS,
  GET_EXPORT_DATA_FAILURE,
} from "../actions/importExport.actions";

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  apiResponse: null,
  exportData: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_DATA:
      return initialState;

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

    case GET_EXPORT_DATA:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_EXPORT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        exportData: action.data,
      };

    case GET_EXPORT_DATA_FAILURE:
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