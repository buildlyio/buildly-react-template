import * as actions from '../actions/consortium.actions';
import * as reducer from './consortium.reducer';

const initialState = {
  loading: false,
  loaded: false,
  allConsortiums: null,
  orgConsortiums: null,
  error: null,
};

describe('Get all consortiums reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, {
      type: actions.GET_ALL_CONSORTIUMS,
    }))
      .toEqual({
        ...initialState,
        loading: true,
      });
  });

  it('get all consortiums success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ALL_CONSORTIUMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      allConsortiums: undefined,
    });
  });

  it('get all consortiums fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ALL_CONSORTIUMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get org consortiums reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, {
      type: actions.GET_ORG_CONSORTIUMS,
    }))
      .toEqual({
        ...initialState,
        loading: true,
      });
  });

  it('get org consortiums success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ORG_CONSORTIUMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      orgConsortiums: undefined,
    });
  });

  it('get org consortiums fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ORG_CONSORTIUMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Create consortium reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, {
      type: actions.CREATE_CONSORTIUM,
    }))
      .toEqual({
        ...initialState,
        loading: true,
      });
  });

  it('create consortium success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_CONSORTIUM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      allConsortiums: [undefined],
    });
  });

  it('create consortium fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_CONSORTIUM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit consortium reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, {
      type: actions.EDIT_CONSORTIUM,
    }))
      .toEqual({
        ...initialState,
        loading: true,
      });
  });

  it('edit consortium success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CONSORTIUM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      allConsortiums: [undefined],
    });
  });

  it('edit consortium fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_CONSORTIUM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete consortium reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, {
      type: actions.DELETE_CONSORTIUM,
    }))
      .toEqual({
        ...initialState,
        loading: true,
      });
  });

  it('delete consortium success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CONSORTIUM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      allConsortiums: [],
    });
  });

  it('delete consortium fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CONSORTIUM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
