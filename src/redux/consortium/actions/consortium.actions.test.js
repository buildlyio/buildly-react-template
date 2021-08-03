import * as actions from './consortium.actions';

// Test Get All Consortiums Action
describe('get all consortiums action', () => {
  it('should create an action to get all consortiums', () => {
    const expectedAction = {
      type: actions.GET_ALL_CONSORTIUMS,
    };
    expect(actions.getAllConsortiums()).toEqual(expectedAction);
  });
});

// Test Get Org Consortiums Action
describe('get org consortiums action', () => {
  it('should create an action to get org consortiums', () => {
    const organization_uuid = 'feu-ewgqu-egoo248w-3289hqv';
    const expectedAction = {
      type: actions.GET_ORG_CONSORTIUMS,
      organization_uuid,
    };
    expect(actions.getOrgConsortiums(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Create Consortium Action
describe('create consortium action', () => {
  it('should create an action to create consortium', () => {
    const data = { name: 'Test Consortium' };
    const expectedAction = {
      type: actions.CREATE_CONSORTIUM,
      data,
    };
    expect(actions.createConsortium(data)).toEqual(expectedAction);
  });
});

// Test Edit Consortium Action
describe('edit consortium action', () => {
  it('should create an action to edit consortium', () => {
    const data = { id: 1, name: 'Test Consortium - Edited' };
    const expectedAction = {
      type: actions.EDIT_CONSORTIUM,
      data,
    };
    expect(actions.editConsortium(data)).toEqual(expectedAction);
  });
});

// Test Delete Consortium Action
describe('delete consortium action', () => {
  it('should create an action to delete consortium', () => {
    const uuid = 'gweti-wgiuwe-3t982gwse-38wgugwbb';
    const expectedAction = {
      type: actions.DELETE_CONSORTIUM,
      uuid,
    };
    expect(actions.deleteConsortium(uuid)).toEqual(expectedAction);
  });
});
