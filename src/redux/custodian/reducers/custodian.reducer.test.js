import * as actions from '../actions/custodian.actions';
import * as reducer from './custodian.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  custodianData: [],
  custodianTypeList: [],
  contactInfo: [],
};

describe('Get custodian reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIANS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get custodian success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIANS_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: [],
    });
  });

  it('get custodian fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIANS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Custodian reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIANS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Custodian success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIANS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: [data],
    });
  });

  it('Add custodain fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIANS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Custodian reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODIANS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Custodian success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      { ...initialState, custodianData: [data] },
      { type: actions.EDIT_CUSTODIANS_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: [editedData],
    });
  });

  it('Edit Custodian fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODIANS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Custodian reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODIANS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Custodian success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, custodianData: [data] },
      { type: actions.DELETE_CUSTODIANS_SUCCESS, data: { custodianId: 1, contactId: 1 } },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: [],
    });
  });

  it('Delete Custodian fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODIANS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get custody reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get custody success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODY_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: [],
    });
  });

  it('Get custody fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add custody reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add custody success Reducer', () => {
    const data = { id: 1, name: 'Test data', custodian: 'XYZ' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODY_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: [data],
    });
  });

  it('Add custody fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit custody reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit custody success Reducer', () => {
    const data = { id: 1, name: 'Test data', custodian: 'XYZ' };
    const editedData = { id: 1, name: 'Test data edited', custodian: 'XYZ' };
    expect(reducer.default(
      { ...initialState, custodyData: [data] },
      { type: actions.EDIT_CUSTODY_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: [editedData],
    });
  });

  it('Edit custody fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete custody reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete custody success Reducer', () => {
    const data = { id: 1, name: 'Test data', custodian: 'XYZ' };
    expect(reducer.default(
      { ...initialState, custodyData: [data] },
      { type: actions.DELETE_CUSTODY_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: [],
    });
  });

  it('Delete custody fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Custodian type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIAN_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Custodian type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIAN_TYPE_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: [],
    });
  });

  it('Get Custodian type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIAN_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Custodian type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIAN_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Custodian type success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIAN_TYPE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: [data],
    });
  });

  it('Add Custodian type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIAN_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Custodian type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODIAN_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Custodian type success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      {
        ...initialState,
        custodianTypeList: [data],
      },
      { type: actions.EDIT_CUSTODIAN_TYPE_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: [editedData],
    });
  });

  it('Edit Custodian type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODIAN_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Custodian type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODIAN_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Custodian type success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, custodianTypeList: [data] },
      { type: actions.DELETE_CUSTODIAN_TYPE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: [],
    });
  });

  it('Delete Custodian type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODIAN_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get contact info reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CONTACT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get contact info success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CONTACT_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      contactInfo: [],
    });
  });

  it('Get contact info fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CONTACT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
