import * as actions from '@redux/authuser/actions/authuser.actions';

describe('actions', () => {
  it('should create an action to login', () => {
    const credentials = 'AUTH/LOGIN';
    const expectedAction = {
      type: actions.LOGIN,
      credentials,
    };
    expect(actions.login(credentials)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to logout', () => {
    const credentials = 'AUTH/LOGOUT';
    const expectedAction = {
      type: actions.LOGOUT,
    };
    expect(actions.logout(credentials)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to register', () => {
    const data = 'AUTH/REGISTER';
    const expectedAction = {
      data,
      type: actions.REGISTER,
    };
    expect(actions.register(data)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to update user', () => {
    const data = 'AUTH/UPDATE_USER';
    const expectedAction = {
      data,
      type: actions.UPDATE_USER,
    };
    expect(actions.updateUser(data)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to invite user', () => {
    const data = 'AUTH/INVITE_USER';
    const expectedAction = {
      data,
      type: actions.INVITE,
    };
    expect(actions.invite(data)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to social login', () => {
    const code = 'AUTH/SOCIAL_LOGIN';
    const expectedAction = {
      type: actions.SOCIAL_LOGIN,
      code,
    };
    expect(actions.socialLogin(code)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to load organizations', () => {
    const expectedAction = {
      type: actions.LOAD_ORG_NAMES,
    };
    expect(actions.loadOrgNames()).toEqual(expectedAction);
  });
});
