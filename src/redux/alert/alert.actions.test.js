import * as actions from '@redux/alert/alert.actions';

describe('actions', () => {
  it('should create an action to show alert', () => {
    const data = { type: 'type', open: true, message: 'message' };
    const expectedAction = {
      type: actions.SHOW_ALERT,
      data,
    };
    expect(actions.showAlert(data)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to hide alert', () => {
    const expectedAction = {
      type: actions.HIDE_ALERT,
    };
    expect(actions.hideAlert()).toEqual(expectedAction);
  });
});
