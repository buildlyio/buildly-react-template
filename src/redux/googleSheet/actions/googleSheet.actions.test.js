import * as actions from './googleSheet.actions';

describe('actions', () => {
  it('should create an action to add data', () => {
    const data = { name: 'test data' };
    const expectedAction = {
      type: actions.ADD_DATA,
      data,
    };
    expect(actions.addData(data)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to check filled', () => {
    const name = 'Test User';
    const expectedAction = {
      type: actions.CHECK_FILLED,
      name,
    };
    expect(actions.checkFilled(name)).toEqual(expectedAction);
  });
});
