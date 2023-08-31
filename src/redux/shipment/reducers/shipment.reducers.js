import _ from 'lodash';
import {
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
  GET_COUNTRIES_STATES,
  GET_COUNTRIES_STATES_SUCCESS,
  GET_COUNTRIES_STATES_FAILURE,
  GET_CURRENCIES,
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_FAILURE,
  GET_SHIPMENT_TEMPLATES,
  GET_SHIPMENT_TEMPLATES_SUCCESS,
  GET_SHIPMENT_TEMPLATES_FAILURE,
  ADD_SHIPMENT_TEMPLATE,
  ADD_SHIPMENT_TEMPLATE_SUCCESS,
  ADD_SHIPMENT_TEMPLATE_FAILURE,
  EDIT_SHIPMENT_TEMPLATE,
  EDIT_SHIPMENT_TEMPLATE_SUCCESS,
  EDIT_SHIPMENT_TEMPLATE_FAILURE,
  DELETE_SHIPMENT_TEMPLATE,
  DELETE_SHIPMENT_TEMPLATE_SUCCESS,
  DELETE_SHIPMENT_TEMPLATE_FAILURE,
} from '../actions/shipment.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentData: [],
  countries: [],
  currencies: [],
  templates: [],
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIPMENTS:
    case ADD_SHIPMENT:
    case EDIT_SHIPMENT:
    case DELETE_SHIPMENT:
    case GET_COUNTRIES_STATES:
    case GET_CURRENCIES:
    case GET_SHIPMENT_TEMPLATES:
    case ADD_SHIPMENT_TEMPLATE:
    case EDIT_SHIPMENT_TEMPLATE:
    case DELETE_SHIPMENT_TEMPLATE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_SHIPMENTS_FAILURE:
    case ADD_SHIPMENT_FAILURE:
    case EDIT_SHIPMENT_FAILURE:
    case DELETE_SHIPMENT_FAILURE:
    case GET_COUNTRIES_STATES_FAILURE:
    case GET_CURRENCIES_FAILURE:
    case GET_SHIPMENT_TEMPLATES_FAILURE:
    case ADD_SHIPMENT_TEMPLATE_FAILURE:
    case EDIT_SHIPMENT_TEMPLATE_FAILURE:
    case DELETE_SHIPMENT_TEMPLATE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_SHIPMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData: action.data,
      };

    case ADD_SHIPMENT_SUCCESS:
    case EDIT_SHIPMENT_SUCCESS: {
      const found = _.find(
        state.shipmentData,
        { id: action.shipment.id },
      );
      const shipmentData = found
        ? _.map(state.shipmentData, (shipment) => (
          shipment.id === action.shipment.id
            ? action.shipment
            : shipment
        ))
        : [...state.shipmentData, action.shipment];
      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData,
      };
    }

    case DELETE_SHIPMENT_SUCCESS: {
      const shipmentData = _.filter(state.shipmentData, (shipment) => shipment.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        shipmentData,
      };
    }

    case GET_COUNTRIES_STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        countries: action.countries,
      };

    case GET_CURRENCIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        currencies: action.currencies,
      };

    case GET_SHIPMENT_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        templates: action.data,
      };

    case ADD_SHIPMENT_TEMPLATE_SUCCESS:
    case EDIT_SHIPMENT_TEMPLATE_SUCCESS: {
      const found = _.find(
        state.templates,
        { id: action.template.id },
      );
      const templates = found
        ? _.map(state.templates, (template) => (
          template.id === action.template.id
            ? action.template
            : template
        ))
        : [...state.templates, action.template];
      return {
        ...state,
        loading: false,
        loaded: true,
        templates,
      };
    }

    case DELETE_SHIPMENT_TEMPLATE_SUCCESS: {
      const templates = _.filter(state.templates, (tmp) => tmp.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        templates,
      };
    }

    default:
      return state;
  }
};
