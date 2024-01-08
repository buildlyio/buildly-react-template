import * as actions from './authuser.actions';

// Test Update User action
describe('Update User action', () => {
  it('should create an action to Update User', () => {
    const data = {
      first_name: 'Test Edited',
      last_name: 'User Edited',
    };
    const history = {};
    const expectedAction = {
      type: actions.UPDATE_USER,
      data,
      history,
    };
    expect(actions.updateUser(data, history)).toEqual(expectedAction);
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
