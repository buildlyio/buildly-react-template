import _ from "lodash";
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
  GET_SHIPMENT_FLAG,
  GET_SHIPMENT_FLAG_SUCCESS,
  GET_SHIPMENT_FLAG_FAILURE,
  GET_DASHBOARD_ITEMS,
  GET_DASHBOARD_ITEMS_SUCCESS,
  GET_DASHBOARD_ITEMS_FAILURE,
  GET_ALERTS,
  SET_SHIPMENT_ALERTS,
  GET_SHIPMENT_OPTIONS,
  GET_SHIPMENT_OPTIONS_SUCCESS,
  GET_SHIPMENT_OPTIONS_FAILURE,
  ADD_SHIPMENT_FLAG,
  ADD_SHIPMENT_FLAG_SUCCESS,
  ADD_SHIPMENT_FLAG_FAILURE,
  EDIT_SHIPMENT_FLAG,
  EDIT_SHIPMENT_FLAG_SUCCESS,
  EDIT_SHIPMENT_FLAG_FAILURE,
  DELETE_SHIPMENT_FLAG,
  DELETE_SHIPMENT_FLAG_SUCCESS,
  DELETE_SHIPMENT_FLAG_FAILURE,
  ADD_PDF_IDENTIFIER,
  ADD_PDF_IDENTIFIER_SUCCESS,
  ADD_PDF_IDENTIFIER_FAILURE,
} from "../actions/shipment.actions";

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentData: null,
  shipmentFormData: null,
  shipmentAlerts: { show: true, data: [] },
  shipmentOptions: null,
  shipmentFlag: null,
};

// Reducer
export default (state = initialState, action) => {
  let deletedShipmentFlag;
  let editedShipmentFlag = state.shipmentFlag;
  let shipmentFlagPresent = _.remove(editedShipmentFlag, { id: action.shipmentFlag?.id })[0];
  if (shipmentFlagPresent) {
    deletedShipmentFlag = editedShipmentFlag;
    editedShipmentFlag = [ ...editedShipmentFlag, action.shipmentFlag ];
  };

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

    case GET_DASHBOARD_ITEMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_DASHBOARD_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        dashboardItems: action.data,
      };

    case GET_DASHBOARD_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case SET_SHIPMENT_ALERTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        shipmentAlerts: { show: action.alerts.show, data: action.alerts.data },
        error: null,
      };

    case GET_SHIPMENT_OPTIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_SHIPMENT_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentOptions: action.data,
      };

    case GET_SHIPMENT_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_SHIPMENT_FLAG:
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };

    case ADD_SHIPMENT_FLAG_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentFlag: [
          ...state.shipmentFlag, action.shipmentFlag
        ],
      };

    case ADD_SHIPMENT_FLAG_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_SHIPMENT_FLAG:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_SHIPMENT_FLAG_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentFlag: editedShipmentFlag,
      };

    case EDIT_SHIPMENT_FLAG_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_SHIPMENT_FLAG:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_SHIPMENT_FLAG_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentFlag: deletedShipmentFlag,
      };

    case DELETE_SHIPMENT_FLAG_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_PDF_IDENTIFIER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_PDF_IDENTIFIER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentFormData: {
          ...state.shipmentFormData,
          uploaded_pdf: action.uploaded_pdf,
          uploaded_pdf_link: action.uploaded_pdf_link,
          unique_identifier: action.unique_identifier,
        },
      };
      
    case ADD_PDF_IDENTIFIER_FAILURE:
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
