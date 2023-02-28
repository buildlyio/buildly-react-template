import * as actions from './alert.actions';

// Test for show alert
describe('show alert action', () => {
  it('should create an action to show alert', () => {
    const data = {
      type: 'success',
      open: true,
      message: 'Success message for alert.',
    };
    const expectedAction = {
      type: actions.SHOW_ALERT,
      data,
    };

    expect(actions.showAlert(data))
      .toEqual(expectedAction);
  });
});

// Test for hide alert
describe('hide alert action', () => {
  it('should create an action to hide alert', () => {
    const expectedAction = {
      type: actions.HIDE_ALERT,
    };

    expect(actions.hideAlert())
      .toEqual(expectedAction);
  });
});
