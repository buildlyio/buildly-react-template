import * as actions from '../actions/shipment.actions';
import * as reducer from './shipment.reducers';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  shipmentFormData: null,
  shipmentData: null,
  shipmentFlag: null,
  shipmentAlerts: { show: true, data: [] },
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
      shipmentData: undefined,
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

describe('Get Shipment Flag reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENT_FLAG },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Shipment Flag success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENT_FLAG_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentFlag: undefined,
    });
  });

  it('Get Shipment Flag fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SHIPMENT_FLAG_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Shipment Flag reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_FLAG },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Shipment Flag success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        shipmentFlag: [],
      },
      { type: actions.ADD_SHIPMENT_FLAG_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentFlag: [undefined],
    });
  });

  it('Add Shipment Flag fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SHIPMENT_FLAG_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Shipment Flag reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT_FLAG },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Shipment Flag success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        shipmentFlag: [],
      },
      { type: actions.EDIT_SHIPMENT_FLAG_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentFlag: [],
    });
  });

  it('Edit Shipment Flag fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SHIPMENT_FLAG_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Shipment Flag reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_FLAG },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Shipment Flag success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_FLAG_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      shipmentFlag: undefined,
    });
  });

  it('Delete Shipment Flag fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SHIPMENT_FLAG_FAILURE },
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

describe('Set Shipment Alerts reducer', () => {
  it('Empty Reducer', () => {
    const alerts = {};
    expect(reducer.default(
      initialState,
      { type: actions.SET_SHIPMENT_ALERTS, alerts },
    )).toEqual({
      ...initialState,
      shipmentAlerts: {
        show: undefined,
        data: undefined,
      },
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
