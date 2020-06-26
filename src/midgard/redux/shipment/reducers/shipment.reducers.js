import { SAVE_SHIPMENT_FORM_DATA } from "../actions/shipment.actions";

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
        shipmentFormData: action.formDara,
      };
    default:
      return state;
  }
};
