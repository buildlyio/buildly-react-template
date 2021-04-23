import * as actions from '../actions/importExport.actions';
import * as reducer from './importExport.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  apiResponse: null,
  exportData: null,
};

describe('Clear Data reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CLEAR_DATA },
    )).toEqual(initialState);
  });
});

describe('Get API Response reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_API_RESPONSE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get API response success Reducer', () => {
    const res = {};
    expect(reducer.default(
      initialState,
      { type: actions.GET_API_RESPONSE_SUCCESS, res },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      apiResponse: undefined,
    });
  });

  it('get API response fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_API_RESPONSE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Export Data reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_EXPORT_DATA },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get Export Data success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_EXPORT_DATA_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      exportData: undefined,
    });
  });

  it('get Export Data fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_EXPORT_DATA_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
