import * as actions from '@redux/authuser/authuser.actions';
import * as reducer from './authuser.reducer';
const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};
describe('Empty reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default([], actions.LOGIN)).toEqual([]);
  });
});

describe('Login reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, { type: actions.LOGIN })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });
  it('login success Reducer', () => {
    expect(reducer.default([], { type: actions.LOGIN_SUCCESS })).toEqual({
      loaded: true,
      loading: false,
      data: undefined,
    });
  });
});

describe('Login fail reducer', () => {
  it('login fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.LOGIN_FAIL })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe('Register reducer', () => {
  it('Register Reducer', () => {
    expect(reducer.default(initialState, { type: actions.REGISTER })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });

  it('Register success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.REGISTER_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
  it('Register fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.REGISTER_FAIL })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe('logout success reducer', () => {
  it('logout Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.LOGOUT_SUCCESS })
    ).toEqual(initialState);
  });
});

describe('Update User reducer', () => {
  it('update user Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER })
    ).toEqual({ error: null, loaded: false, loading: true, data: null });
  });

  it('update user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
  it('update user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER_FAIL })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe('invite User reducer', () => {
  it('invite user Reducer', () => {
    expect(reducer.default(initialState, { type: actions.INVITE })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });

  it('invite user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.INVITE_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
  it('invite user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.INVITE_FAIL })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});
