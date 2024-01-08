import * as actions from '../actions/shipment.actions';
import * as reducer from './shipment.reducers';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentData: [],
};

describe('Get Shipment Details reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get Shipment Details success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENTS_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: [],
    });
  });

  it('get Shipment Details fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
