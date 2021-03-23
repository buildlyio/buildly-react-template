import * as actions from '@redux/googleSheet/actions/googleSheet.actions';
import * as reducer from './googleSheet.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};

describe('Add Data reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, { type: actions.ADD_DATA })).toEqual({
      loaded: false,
      loading: true,
      data: null,
      error: null,
    });
  });

  it('add data success Reducer', () => {
    expect(reducer.default([], { type: actions.ADD_DATA_SUCCESS })).toEqual({
      loaded: true,
      loading: false,
      data: undefined,
      error: null,
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
    });
  });
});
