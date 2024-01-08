import * as actions from '../actions/authuser.actions';
import * as reducer from './authuser.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};

describe('Update User reducer', () => {
  it('update user Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_USER },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update user success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_USER_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('update user fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_USER_FAIL },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('invite User reducer', () => {
  it('invite user Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.INVITE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('invite user success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.INVITE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('invite user fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.INVITE_FAIL },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
