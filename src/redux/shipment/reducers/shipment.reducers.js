import _ from 'lodash';
import {
  GET_SHIPMENTS,
  GET_SHIPMENTS_FAILURE,
  GET_SHIPMENTS_SUCCESS,
} from '../actions/shipment.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIPMENTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_SHIPMENTS_FAILURE:
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

    default:
      return state;
  }
};
