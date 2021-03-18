import * as actions from '@redux/authuser/actions/authuser.actions';
import * as reducer from './authuser.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  socialLogin: null,
  orgNames: null,
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
      socialLogin: null,
      orgNames: null,
    });
  });

  it('login success Reducer', () => {
    expect(reducer.default([], { type: actions.LOGIN_SUCCESS })).toEqual({
      loaded: true,
      loading: false,
      data: undefined,
      error: null,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('login fail Reducer', () => {
    expect(reducer.default(initialState, { type: actions.LOGIN_FAIL })).toEqual(
      {
        error: undefined,
        loaded: true,
        loading: false,
        data: null,
        socialLogin: null,
        orgNames: null,
      }
    );
  });
});

describe('Register reducer', () => {
  it('Register Reducer', () => {
    expect(reducer.default(initialState, { type: actions.REGISTER })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('Register success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.REGISTER_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: undefined,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('Register fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.REGISTER_FAIL })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
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
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('update user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: undefined,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('update user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER_FAIL })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });
});

describe('invite User reducer', () => {
  it('invite user Reducer', () => {
    expect(reducer.default(initialState, { type: actions.INVITE })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('invite user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.INVITE_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: undefined,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('invite user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.INVITE_FAIL })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });
});

describe('Social Login reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.SOCIAL_LOGIN,
        provider: 'github',
      })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      socialLogin: 'github',
      orgNames: null,
    });
  });

  it('social login success Reducer', () => {
    expect(reducer.default([], { type: actions.SOCIAL_LOGIN_SUCCESS })).toEqual(
      {
        loaded: true,
        loading: false,
        data: undefined,
        error: null,
        socialLogin: null,
        orgNames: null,
      }
    );
  });

  it('social login fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.SOCIAL_LOGIN_FAIL })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });
});

describe('Load Organization Names reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_ORG_NAMES,
      })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });

  it('load org names success Reducer', () => {
    expect(
      reducer.default([], { type: actions.LOAD_ORG_NAMES_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      data: null,
      error: null,
      socialLogin: null,
      orgNames: undefined,
    });
  });

  it('load org names fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_ORG_NAMES_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      socialLogin: null,
      orgNames: null,
    });
  });
});
