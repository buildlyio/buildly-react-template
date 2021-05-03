import {
  GET_CUSTODIAN_OPTIONS,
  GET_CUSTODIAN_OPTIONS_SUCCESS,
  GET_CUSTODIAN_OPTIONS_FAILURE,
  GET_CONTACT_OPTIONS,
  GET_CONTACT_OPTIONS_SUCCESS,
  GET_CONTACT_OPTIONS_FAILURE,
  GET_ITEM_OPTIONS,
  GET_ITEM_OPTIONS_SUCCESS,
  GET_ITEM_OPTIONS_FAILURE,
  GET_PRODUCTS_OPTIONS,
  GET_PRODUCTS_OPTIONS_SUCCESS,
  GET_PRODUCTS_OPTIONS_FAILURE,
} from '../actions/options.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  custodianOptions: null,
  contactOptions: null,
  itemOptions: null,
  productOptions: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTODIAN_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        custodianOptions: null,
        error: null,
      };

    case GET_CUSTODIAN_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianOptions: action.data,
        error: null,
      };

    case GET_CUSTODIAN_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianOptions: null,
        error: action.error,
      };

    case GET_CONTACT_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        custodianOptions: null,
        error: null,
      };

    case GET_CONTACT_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        contactOptions: action.data,
        error: null,
      };

    case GET_CONTACT_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        contactOptions: null,
        error: action.error,
      };

    case GET_ITEM_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        itemOptions: null,
        error: null,
      };

    case GET_ITEM_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemOptions: action.data,
        error: null,
      };

    case GET_ITEM_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemOptions: null,
        error: action.error,
      };

    case GET_PRODUCTS_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        productOptions: null,
        error: null,
      };

    case GET_PRODUCTS_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productOptions: action.data,
        error: null,
      };

    case GET_PRODUCTS_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        productOptions: null,
        error: action.error,
      };

    default:
      return state;
  }
};
