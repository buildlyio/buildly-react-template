import * as actions from '../actions/shipment.actions';
import * as reducer from './shipment.reducers';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentFormData: null,
  shipmentData: null,
  countries: null,
  currencies: null,
};

describe('Save Shipment Form Data reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.SAVE_SHIPMENT_FORM_DATA },
    )).toEqual({
      ...initialState,
      loaded: true,
      shipmentFormData: undefined,
    });
  });
});

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
      { type: actions.GET_SHIPMENTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: [undefined],
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
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentData: undefined,
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

describe('Get DashBoard Items reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DASHBOARD_ITEMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get DashBoard Items success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DASHBOARD_ITEMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      dashboardItems: undefined,
    });
  });

  it('Get DashBoard Items fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DASHBOARD_ITEMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add PDF Identifier reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PDF_IDENTIFIER },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add PDF Identifier success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PDF_IDENTIFIER_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentFormData: {
        ...initialState.shipmentFormData,
        uploaded_pdf: undefined,
        uploaded_pdf_link: undefined,
        unique_identifier: undefined,
      },
    });
  });

  it('Add PDF Identifier fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PDF_IDENTIFIER_FAILURE },
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
