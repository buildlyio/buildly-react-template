import * as actions from '../actions/googleSheet.actions';
import * as reducer from './googleSheet.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};

describe('Add Data reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, { type: actions.ADD_DATA }))
      .toEqual({ ...initialState, loading: true });
  });

  it('add data success Reducer', () => {
    expect(reducer.default(initialState, { type: actions.ADD_DATA_SUCCESS }))
      .toEqual({ ...initialState, loaded: true, data: undefined });
  });

  it('add data fail Reducer', () => {
    expect(reducer.default(initialState, { type: actions.ADD_DATA_FAIL }))
      .toEqual({ ...initialState, loaded: true, error: undefined });
  });
});
