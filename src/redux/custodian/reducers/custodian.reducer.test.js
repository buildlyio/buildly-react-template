import * as actions from '../actions/custodian.actions';
import * as reducer from './custodian.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  custodyData: [],
};

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
