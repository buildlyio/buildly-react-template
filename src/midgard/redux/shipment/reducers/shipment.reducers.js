import {
  SAVE_SHIPMENT_FORM_DATA,
  GET_SHIPMENTS,
  GET_SHIPMENTS_FAILURE,
  GET_SHIPMENTS_SUCCESS,
  ADD_SHIPMENT,
  ADD_SHIPMENT_SUCCESS,
  ADD_SHIPMENT_FAILURE,
  EDIT_SHIPMENT,
  EDIT_SHIPMENT_SUCCESS,
  EDIT_SHIPMENT_FAILURE,
  DELETE_SHIPMENT,
  DELETE_SHIPMENT_SUCCESS,
  DELETE_SHIPMENT_FAILURE,
  FILTER_SHIPMENT,
  FILTER_SHIPMENT_SUCCESS,
  FILTER_SHIPMENT_FAILURE,
  GET_SHIPMENT_FLAG,
  GET_SHIPMENT_FLAG_SUCCESS,
  GET_SHIPMENT_FLAG_FAILURE,
} from "../actions/shipment.actions";

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentData: null,
  shipmentFormData: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_SHIPMENT_FORM_DATA:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        shipmentFormData: action.formData,
      };
    case GET_SHIPMENTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_SHIPMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData: action.data,
      };
    case GET_SHIPMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_SHIPMENT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData: action.data,
      };
    case ADD_SHIPMENT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_SHIPMENT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData: action.data,
        error: null,
      };

    case EDIT_SHIPMENT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_SHIPMENT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData: action.data,
      };
    case DELETE_SHIPMENT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case FILTER_SHIPMENT:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case FILTER_SHIPMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        filteredData: action.data,
      };
    case GET_SHIPMENT_FLAG:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_SHIPMENT_FLAG_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentFlag: action.data,
      };
    case GET_SHIPMENT_FLAG_FAILURE:
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
