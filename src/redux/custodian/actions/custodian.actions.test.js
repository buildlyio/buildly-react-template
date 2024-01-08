import * as actions from './custodian.actions';

describe('Get Custody action', () => {
  it('should create an action to get custody', () => {
    const expectedAction = {
      type: actions.GET_CUSTODY,
    };
    expect(actions.getCustody()).toEqual(expectedAction);
  });
});
