import * as actions from './googleSheet.actions';

describe('actions', () => {
  it('should create an action to add data', () => {
    const data = { name: 'test data' };
    const history = {};
    const expectedAction = {
      type: actions.ADD_DATA,
      data,
      history,
    };
    expect(actions.addData(data, history)).toEqual(expectedAction);
  });
});
