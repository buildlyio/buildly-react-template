import * as actions from '@redux/googleSheet/actions/googleSheet.actions';
import * as reducer from './googleSheet.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  filled: false,
};

describe('Add Data reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, { type: actions.ADD_DATA })).toEqual({
      loaded: false,
      loading: true,
      data: null,
      error: null,
      filled: false,
    });
  });

  it('add data success Reducer', () => {
    expect(reducer.default([], { type: actions.ADD_DATA_SUCCESS })).toEqual({
      loaded: true,
      loading: false,
      data: undefined,
      error: null,
      filled: true,
    });
  });

  it('add data fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_DATA_FAIL })
    ).toEqual({
      loaded: true,
      loading: false,
      data: null,
      error: undefined,
      filled: false,
    });
  });
});

describe('Check User reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.CHECK_FILLED })
    ).toEqual({
      loaded: false,
      loading: true,
      data: null,
      error: null,
      filled: false,
    });
  });

  it('check user success Reducer', () => {
    expect(reducer.default([], { type: actions.CHECK_FILLED_SUCCESS })).toEqual(
      {
        loaded: true,
        loading: false,
        data: null,
        error: null,
        filled: undefined,
      }
    );
  });

  it('check user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.CHECK_FILLED_FAIL })
    ).toEqual({
      loaded: true,
      loading: false,
      data: null,
      error: undefined,
      filled: false,
    });
  });
});
