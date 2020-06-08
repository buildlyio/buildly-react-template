import {
  ADD_CUSTODIANS,
  ADD_CUSTODIANS_SUCCESS,
  ADD_CUSTODIANS_FAILURE,
  GET_CUSTODIANS,
  GET_CUSTODIANS_FAILURE,
  GET_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS,
  EDIT_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS,
  DELETE_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS_SUCCESS,
  SEARCH,
  SEARCH_SUCCESS,
} from "../actions/custodian.actions";

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
      };
    case GET_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
      };
    case ADD_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
        error: null,
      };

    case EDIT_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
      };
    case DELETE_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case SEARCH:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
      };
    default:
      return state;
  }
};
