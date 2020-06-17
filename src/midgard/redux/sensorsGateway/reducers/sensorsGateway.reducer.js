import {
  GET_GATEWAYS,
  GET_GATEWAYS_SUCCESS,
  GET_GATEWAYS_FAILURE,
  ADD_GATEWAY,
  ADD_GATEWAY_SUCCESS,
  ADD_GATEWAY_FAILURE,
  EDIT_GATEWAY,
  EDIT_GATEWAY_SUCCESS,
  EDIT_GATEWAY_FAILURE,
  DELETE_GATEWAY,
  DELETE_GATEWAY_SUCCESS,
  GET_GATEWAYS_TYPE,
  GET_GATEWAYS_TYPE_SUCCESS,
  GET_GATEWAYS_TYPE_FAILURE,
  GATEWAY_SEARCH_SUCCESS,
  GATEWAY_SEARCH,
  DELETE_GATEWAY_FAILURE,
} from "../actions/sensorsGateway.actions";

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayTypeList: null,
  gatewayData: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GATEWAYS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_GATEWAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };
    case GET_GATEWAYS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_GATEWAY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_GATEWAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };
    case ADD_GATEWAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_GATEWAY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_GATEWAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
        error: null,
      };

    case EDIT_GATEWAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_GATEWAY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_GATEWAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };
    case DELETE_GATEWAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case GATEWAY_SEARCH:
      return {
        ...state,
        error: null,
      };
    case GATEWAY_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewaySearchedData: action.data,
      };
    case GET_GATEWAYS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_GATEWAYS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList: action.data,
      };
    case GET_GATEWAYS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    default:
      return state;
  }
};
