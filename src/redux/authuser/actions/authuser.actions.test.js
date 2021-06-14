import * as actions from './authuser.actions';

// Test Login Action
describe('login action', () => {
  it('should create an action to login', () => {
    const credentials = {
      username: 'TestUser',
      password: 'Testpassword@123',
    };
    const expectedAction = {
      type: actions.LOGIN,
      credentials,
    };
    expect(actions.login(credentials)).toEqual(expectedAction);
  });
});

// Test Logout Action
describe('logout action', () => {
  it('should create an action to logOut', () => {
    const expectedAction = {
      type: actions.LOGOUT,
    };
    expect(actions.logout()).toEqual(expectedAction);
  });
});

// Test Register Action
describe('register action', () => {
  it('should create an action to Register', () => {
    const data = {
      username: 'TestUserNew',
      password: 'password@123',
      email: 'test@test.com',
      organization_name: 'Test Org',
      first_name: 'Test',
      last_name: 'User',
    };
    const expectedAction = {
      type: actions.REGISTER,
      data,
    };
    expect(actions.register(data)).toEqual(expectedAction);
  });
});

// Test Update User action
describe('Update User action', () => {
  it('should create an action to Update User', () => {
    const data = {
      first_name: 'Test Edited',
      last_name: 'User Edited',
    };
    const expectedAction = {
      type: actions.UPDATE_USER,
      data,
    };
    expect(actions.updateUser(data)).toEqual(expectedAction);
  });
});

// Test Get User Action
describe('Get User action', () => {
  it('should create an action to Get User', () => {
    const expectedAction = {
      type: actions.GET_USER,
    };
    expect(actions.getUser()).toEqual(expectedAction);
  });
});

// Test Invite User Action
describe('Invite User action', () => {
  it('should create an action to Invite User', () => {
    const data = [
      'testuser1@test.com',
      'testuser2@test.com',
    ];
    const expectedAction = {
      type: actions.INVITE,
      data,
    };
    expect(actions.invite(data)).toEqual(expectedAction);
  });
});

// Test Get Organization Action
describe('Get Organization action', () => {
  it('should create an action to Get Organization', () => {
    const uuid = 'uirw-28f-3y28of-gy382g';
    const expectedAction = {
      type: actions.GET_ORGANIZATION,
      uuid,
    };
    expect(actions.getOrganization(uuid))
      .toEqual(expectedAction);
  });
});

// Test Update Organization Action
describe('Update Organization action', () => {
  it('should create an action to Update Organization', () => {
    const data = {
      organization_name: 'Test Org Edited',
    };
    const expectedAction = {
      type: actions.UPDATE_ORGANIZATION,
      data,
    };
    expect(actions.updateOrganization(data))
      .toEqual(expectedAction);
  });
});

// Test Send Reset Password Link Action
describe('Send Reset Password Link action', () => {
  it('should create an action to Send Reset Password Link', () => {
    const data = {
      email: 'test@test.com',
    };
    const expectedAction = {
      type: actions.RESET_PASSWORD,
      data,
    };
    expect(actions.resetPassword(data)).toEqual(expectedAction);
  });
});

// Test Reset Password Confirm Action
describe('Reset Password Confirm action', () => {
  it('should create an action to Reset Password Confirm', () => {
    const data = {
      new_password1: 'pwd@123',
      new_password2: 'pwd@123',
      uid: 'UA',
      token: 'qgefugwNwueqPDSVAD',
    };
    const history = {};
    const expectedAction = {
      type: actions.RESET_PASSWORD_CONFIRM,
      data,
      history,
    };
    expect(actions.confirmResetPassword(data, history))
      .toEqual(expectedAction);
  });
});

// Test Reset Password Check Action
describe('Reset Password Check action', () => {
  it('should create an action to Reset Password Check', () => {
    const data = {
      uid: 'UA',
      token: 'qgefugwNwueqPDSVAD',
    };
    const history = {};
    const expectedAction = {
      type: actions.RESET_PASSWORD_CHECK,
      data,
      history,
    };
    expect(actions.resetPasswordCheck(data, history))
      .toEqual(expectedAction);
  });
});

// Test Load Org Names
describe('actions', () => {
  it('should create an action to load org names', () => {
    const expectedAction = {
      type: actions.LOAD_ORG_NAMES,
    };
    expect(actions.loadOrgNames()).toEqual(expectedAction);
  });
});

// Test Load Org Types
describe('actions', () => {
  it('should create an action to load org types', () => {
    const expectedAction = {
      type: actions.GET_ORG_TYPES,
    };
    expect(actions.getOrgTypes()).toEqual(expectedAction);
  });
});

// Test Add Org Type
describe('actions', () => {
  it('should create an action to add org type', () => {
    const data = { name: 'Test' };
    const expectedAction = {
      type: actions.ADD_ORG_TYPE,
      data,
    };
    expect(actions.addOrgType(data)).toEqual(expectedAction);
  });
});

// Test Edit Org Type
describe('actions', () => {
  it('should create an action to edit org type', () => {
    const data = { id: 1, name: 'Test Edited' };
    const expectedAction = {
      type: actions.EDIT_ORG_TYPE,
      data,
    };
    expect(actions.editOrgType(data)).toEqual(expectedAction);
  });
});

// Test Delete Org Type
describe('actions', () => {
  it('should create an action to delete org type', () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_ORG_TYPE,
      id,
    };
    expect(actions.deleteOrgType(id)).toEqual(expectedAction);
  });
});
