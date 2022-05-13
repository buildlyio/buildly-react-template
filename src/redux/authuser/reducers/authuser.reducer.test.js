import * as actions from '../actions/authuser.actions';
import * as reducer from './authuser.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  socialLogin: null,
  orgNames: null,
  stripeProducts: null,
};

describe('Empty reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default([], actions.LOGIN)).toEqual([]);
  });
});

describe('Login reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, { type: actions.LOGIN })).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('login success Reducer', () => {
    expect(reducer.default(initialState, { type: actions.LOGIN_SUCCESS })).toEqual({
      ...initialState,
      data: undefined,
      loaded: true,
      loading: false,
    });
  });

  it('login fail Reducer', () => {
    expect(reducer.default(initialState, { type: actions.LOGIN_FAIL })).toEqual(
      {
        ...initialState,
        error: undefined,
        loaded: true,
        loading: false,
      },
    );
  });
});

describe('Register reducer', () => {
  it('Register Reducer', () => {
    expect(reducer.default(initialState, { type: actions.REGISTER })).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('Register success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.REGISTER_SUCCESS }),
    ).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('Register fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.REGISTER_FAIL }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('logout success reducer', () => {
  it('logout Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.LOGOUT_SUCCESS }),
    ).toEqual(initialState);
  });
});

describe('Update User reducer', () => {
  it('update user Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER }),
    ).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('update user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER_SUCCESS }),
    ).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('update user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.UPDATE_USER_FAIL }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('invite User reducer', () => {
  it('invite user Reducer', () => {
    expect(reducer.default(initialState, { type: actions.INVITE })).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('invite user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.INVITE_SUCCESS }),
    ).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('invite user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.INVITE_FAIL }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Social Login reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.SOCIAL_LOGIN,
        provider: 'github',
      }),
    ).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
      socialLogin: 'github',
    });
  });

  it('social login success Reducer', () => {
    expect(reducer.default(initialState, { type: actions.SOCIAL_LOGIN_SUCCESS })).toEqual(
      {
        ...initialState,
        data: undefined,
        loaded: true,
        loading: false,
      },
    );
  });

  it('social login fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.SOCIAL_LOGIN_FAIL }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Load Organization Names reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_ORG_NAMES,
      }),
    ).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('load org names success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.LOAD_ORG_NAMES_SUCCESS }),
    ).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      orgNames: undefined,
    });
  });

  it('load org names fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_ORG_NAMES_FAILURE,
      }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Organization for Social User reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ORG_SOCIAL_USER }),
    ).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('add organization for social user success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ORG_SOCIAL_USER_SUCCESS }),
    ).toEqual({
      ...initialState,
      data: undefined,
      loaded: true,
      loading: false,
    });
  });

  it('add organization for social user fail Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ORG_SOCIAL_USER_FAIL }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Load Stripe Products reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_STRIPE_PRODUCTS,
      }),
    ).toEqual({
      ...initialState,
      loaded: false,
      loading: true,
    });
  });

  it('load stripe products success Reducer', () => {
    expect(
      reducer.default(initialState, { type: actions.LOAD_STRIPE_PRODUCTS_SUCCESS }),
    ).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      stripeProducts: undefined,
    });
  });

  it('load stripe products fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_STRIPE_PRODUCTS_FAIL,
      }),
    ).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
