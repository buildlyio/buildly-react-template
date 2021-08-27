import _ from 'lodash';
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
  GET_DASHBOARD_ITEMS,
  GET_DASHBOARD_ITEMS_SUCCESS,
  GET_DASHBOARD_ITEMS_FAILURE,
  ADD_PDF_IDENTIFIER,
  ADD_PDF_IDENTIFIER_SUCCESS,
  ADD_PDF_IDENTIFIER_FAILURE,
} from '../actions/shipment.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentFormData: null,
  shipmentData: null,
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

    case GET_SHIPMENTS_SUCCESS: {
      const initialShipmentData = state.shipmentData || [];
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData: initialShipmentData.concat(action.data),
      };
    }

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
