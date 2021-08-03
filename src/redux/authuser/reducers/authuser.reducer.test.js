import * as actions from '../actions/authuser.actions';
import * as reducer from './authuser.reducer';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  organizationData: null,
  allOrgs: null,
  orgNames: null,
  orgTypes: null,
};

describe('Empty reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, actions.LOGIN))
      .toEqual(initialState);
  });
});

describe('Login reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(initialState, { type: actions.LOGIN }))
      .toEqual({
        ...initialState,
        loading: true,
      });
  });

  it('login success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.LOGIN_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('login fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.LOGIN_FAIL },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Register reducer', () => {
  it('Register Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.REGISTER },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Register success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.REGISTER_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('Register fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.REGISTER_FAIL },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('logout success reducer', () => {
  it('logout Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.LOGOUT_SUCCESS },
    )).toEqual(initialState);
  });
});

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

describe('get user reducer', () => {
  it('get user Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_USER },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get user success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_USER_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('get user fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_USER_FAIL },
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

describe('Get Organization reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ORGANIZATION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get organization success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ORGANIZATION_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
    });
  });

  it('get organization fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ORGANIZATION_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update Organization reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ORGANIZATION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update organization success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ORGANIZATION_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      data: undefined,
    });
  });

  it('update organization fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ORGANIZATION_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Reset Password reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('reset password success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
    });
  });

  it('reset password fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Reset Password Confirm reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_CONFIRM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('reset password confirm success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_CONFIRM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
    });
  });

  it('reset password confirm fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_CONFIRM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Reset Password Check reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_CHECK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('reset password check success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_CHECK_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      resetPasswordCheckData: undefined,
    });
  });

  it('reset password check fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESET_PASSWORD_CHECK_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Load Organizations reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_ALL_ORGS,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
    });
  });

  it('load orgs success Reducer', () => {
    expect(
      reducer.default(
        initialState,
        { type: actions.LOAD_ALL_ORGS_SUCCESS },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      allOrgs: undefined,
    });
  });

  it('load orgs fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.LOAD_ALL_ORGS_FAILURE,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
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
      loading: true,
      loaded: false,
    });
  });

  it('load org names success Reducer', () => {
    expect(
      reducer.default(
        initialState,
        { type: actions.LOAD_ORG_NAMES_SUCCESS },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
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
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get Organization Types reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_ORG_TYPES,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
    });
  });

  it('get org types success Reducer', () => {
    expect(
      reducer.default(
        initialState,
        { type: actions.GET_ORG_TYPES_SUCCESS },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      orgTypes: undefined,
    });
  });

  it('get org types fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_ORG_TYPES_FAILURE,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Add Organization Type reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_ORG_TYPE,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
    });
  });

  it('add org type success Reducer', () => {
    const orgType = { id: 1, name: 'Test' };
    expect(
      reducer.default(initialState, {
        type: actions.ADD_ORG_TYPE_SUCCESS,
        orgType,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      orgTypes: [orgType],
    });
  });

  it('add org type fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_ORG_TYPE_FAILURE,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Edit Organization Type reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_ORG_TYPE,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
    });
  });

  it('edit org type success Reducer', () => {
    const orgType = { id: 1, name: 'Test Edited' };
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_ORG_TYPE_SUCCESS,
        orgType,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      orgTypes: [orgType],
    });
  });

  it('edit org type fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_ORG_TYPE_FAILURE,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete Organization Type reducer', () => {
  it('Empty Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_ORG_TYPE,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
      loaded: false,
    });
  });

  it('delete org type success Reducer', () => {
    const id = 1;
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_ORG_TYPE_SUCCESS,
        id,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      orgTypes: [],
    });
  });

  it('delete org type fail Reducer', () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_ORG_TYPE_FAILURE,
      }),
    ).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});
