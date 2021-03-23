import * as actions from '@redux/googleSheet/actions/googleSheet.actions';

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
