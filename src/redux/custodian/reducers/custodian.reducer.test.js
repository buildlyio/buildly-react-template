import * as actions from '../actions/custodian.actions';
import * as reducer from './custodian.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  custodianData: null,
  custodianTypeList: null,
  contactInfo: null,
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
      { type: actions.GET_CUSTODIANS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODIANS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODIANS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: undefined,
    });
  });

  it('Edit Custodianr fail Reducer', () => {
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
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODIANS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianData: undefined,
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
      { type: actions.GET_CUSTODY_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CUSTODY_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CUSTODY_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodyData: undefined,
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

  it('Get Custodian typen success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CUSTODIAN_TYPE_SUCCESS },
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
    expect(reducer.default(
      {
        ...initialState,
        custodianTypeList: [],
      },
      { type: actions.ADD_CUSTODIAN_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: [undefined],
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
    expect(reducer.default(
      {
        ...initialState,
        custodianTypeList: [],
      },
      { type: actions.EDIT_CUSTODIAN_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: [],
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
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CUSTODIAN_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      custodianTypeList: undefined,
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
      { type: actions.GET_CONTACT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      contactInfo: undefined,
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
