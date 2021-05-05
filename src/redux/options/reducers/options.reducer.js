import {
  GET_USER_OPTIONS,
  GET_USER_OPTIONS_SUCCESS,
  GET_USER_OPTIONS_FAILURE,
  GET_ORGANIZATION_OPTIONS,
  GET_ORGANIZATION_OPTIONS_SUCCESS,
  GET_ORGANIZATION_OPTIONS_FAILURE,
  GET_CUSTODIAN_OPTIONS,
  GET_CUSTODIAN_OPTIONS_SUCCESS,
  GET_CUSTODIAN_OPTIONS_FAILURE,
  GET_CUSTODY_OPTIONS,
  GET_CUSTODY_OPTIONS_SUCCESS,
  GET_CUSTODY_OPTIONS_FAILURE,
  GET_CONTACT_OPTIONS,
  GET_CONTACT_OPTIONS_SUCCESS,
  GET_CONTACT_OPTIONS_FAILURE,
  GET_ITEM_OPTIONS,
  GET_ITEM_OPTIONS_SUCCESS,
  GET_ITEM_OPTIONS_FAILURE,
  GET_PRODUCTS_OPTIONS,
  GET_PRODUCTS_OPTIONS_SUCCESS,
  GET_PRODUCTS_OPTIONS_FAILURE,
  GET_GATEWAY_OPTIONS,
  GET_GATEWAY_OPTIONS_SUCCESS,
  GET_GATEWAY_OPTIONS_FAILURE,
  GET_SENSOR_OPTIONS,
  GET_SENSOR_OPTIONS_SUCCESS,
  GET_SENSOR_OPTIONS_FAILURE,
  GET_SHIPMENT_OPTIONS,
  GET_SHIPMENT_OPTIONS_SUCCESS,
  GET_SHIPMENT_OPTIONS_FAILURE,
} from '../actions/options.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  userOptions: null,
  orgOptions: null,
  custodianOptions: null,
  custodyOptions: null,
  contactOptions: null,
  itemOptions: null,
  productOptions: null,
  gatewayOptions: null,
  sensorOptions: null,
  shipmentOptions: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        userOptions: null,
        error: null,
      };

    case GET_USER_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        userOptions: action.data,
        error: null,
      };

    case GET_USER_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        userOptions: null,
        error: action.error,
      };

    case GET_ORGANIZATION_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        orgOptions: null,
        error: null,
      };

    case GET_ORGANIZATION_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgOptions: action.data,
        error: null,
      };

    case GET_ORGANIZATION_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgOptions: null,
        error: action.error,
      };

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

    case GET_CUSTODY_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        custodyOptions: null,
        error: null,
      };

    case GET_CUSTODY_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyOptions: action.data,
        error: null,
      };

    case GET_CUSTODY_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyOptions: null,
        error: action.error,
      };

    case GET_CONTACT_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        contactOptions: null,
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

    case GET_GATEWAY_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        gatewayOptions: null,
        error: null,
      };

    case GET_GATEWAY_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayOptions: action.data,
        error: null,
      };

    case GET_GATEWAY_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayOptions: null,
        error: action.error,
      };

    case GET_SENSOR_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        sensorOptions: null,
        error: null,
      };

    case GET_SENSOR_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorOptions: action.data,
        error: null,
      };

    case GET_SENSOR_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorOptions: null,
        error: action.error,
      };

    case GET_SHIPMENT_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        shipmentOptions: null,
        error: null,
      };

    case GET_SHIPMENT_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentOptions: action.data,
        error: null,
      };

    case GET_SHIPMENT_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentOptions: null,
        error: action.error,
      };

    default:
      return state;
  }
};
