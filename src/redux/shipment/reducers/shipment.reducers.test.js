import * as actions from '../actions/shipment.actions';
import * as reducer from './shipment.reducers';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentData: [],
  countries: [],
  currencies: [],
  templates: [],
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

describe('Add Shipment reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Shipment success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_SUCCESS, shipment: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: [data],
    });
  });

  it('Add Shipment fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Shipment reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Shipment success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      { ...initialState, shipmentData: [data] },
      { type: actions.EDIT_SHIPMENT_SUCCESS, shipment: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: [editedData],
    });
  });

  it('Edit Shipment fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Shipment reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Shipment success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, shipmentData: [data] },
      { type: actions.DELETE_SHIPMENT_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: [],
    });
  });

  it('Delete Shipment fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get countries and related states reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_COUNTRIES_STATES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get countries and related states success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_COUNTRIES_STATES_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      countries: undefined,
    });
  });

  it('Get countries and related states fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_COUNTRIES_STATES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get currencies reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CURRENCIES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get currencies success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CURRENCIES_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      currencies: undefined,
    });
  });

  it('Get currencies fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CURRENCIES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Shipment Template reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENT_TEMPLATES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get Shipment Template success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENT_TEMPLATES_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      templates: [],
    });
  });

  it('get Shipment Template fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENT_TEMPLATES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Shipment Template reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_TEMPLATE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Shipment Template success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_TEMPLATE_SUCCESS, template: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      templates: [data],
    });
  });

  it('Add Shipment Template fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_TEMPLATE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Shipment Template reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT_TEMPLATE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Shipment Template success Reducer', () => {
    const data = { id: 1, name: 'Test template' };
    const editedData = { id: 1, name: 'Test template edited' };
    expect(reducer.default(
      { ...initialState, templates: [data] },
      { type: actions.EDIT_SHIPMENT_TEMPLATE_SUCCESS, template: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      templates: [editedData],
    });
  });

  it('Edit Shipment Template fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT_TEMPLATE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Shipment Template reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_TEMPLATE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Shipment Template success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, templates: [data] },
      { type: actions.DELETE_SHIPMENT_TEMPLATE_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      templates: [],
    });
  });

  it('Delete Shipment Template fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_TEMPLATE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
