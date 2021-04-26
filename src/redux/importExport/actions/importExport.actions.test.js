import * as actions from './importExport.actions';

// Test Clear Data action
describe('Clear Data action', () => {
  it('should create an action to clear data', () => {
    const expectedAction = {
      type: actions.CLEAR_DATA,
    };
    expect(actions.clearData()).toEqual(expectedAction);
  });
});

// Test Add From File action
describe('Add From File action', () => {
  it('should create an action to add from file', () => {
    const model = 'items';
    const formData = {};
    const expectedAction = {
      type: actions.ADD_FROM_FILE,
      model,
      formData,
    };
    expect(actions.addFromFile(model, formData))
      .toEqual(expectedAction);
  });
});

// Test Get API Response action
describe('Get API Response action', () => {
  it('should create an action to get API response', () => {
    const url = 'test.com';
    const header = '';
    const expectedAction = {
      type: actions.GET_API_RESPONSE,
      url,
      header,
    };
    expect(actions.getApiResponse(url, header))
      .toEqual(expectedAction);
  });
});

// Test Get Export data action
describe('Get Export data action', () => {
  it('should create an action to get export data', () => {
    const model = 'items';
    const fileType = 'csv';
    const expectedAction = {
      type: actions.GET_EXPORT_DATA,
      model,
      fileType,
    };
    expect(actions.getExportData(model, fileType))
      .toEqual(expectedAction);
  });
});

// Test Add API Setup action
describe('Add API Setup action', () => {
  it('should create an action to add API setup', () => {
    const url = 'test.com';
    const key_name = 'keyAPI';
    const key_placement = 'header';
    const key_value = 'TestAPIKey';
    const values_to_pick_response_from = 'items';
    const table_name = 'itmes';
    const mapping = { name: 'name' };
    const platform_name = {};
    const expectedAction = {
      type: actions.ADD_API_SETUP,
      payload: {
        url,
        key_name,
        key_placement,
        key_value,
        values_to_pick_response_from,
        table_name,
        mapping,
        platform_name,
      },
    };
    expect(actions.addApiSetup(
      url,
      key_name,
      key_placement,
      key_value,
      values_to_pick_response_from,
      table_name,
      mapping,
      platform_name,
    )).toEqual(expectedAction);
  });
});
