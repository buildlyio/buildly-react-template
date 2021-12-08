import * as actions from './project.actions';

// Test Get Product Teams
describe('Get Product Team action', () => {
  it('should create an action to get product team', () => {
    const organization_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const product_team_uuid = 'a9446cfa-6e45-4b2f-b250-6fa0059a1c5e'
    const expectedAction = {
      type: actions.GET_PRODUCTTEAMS,
      organization_uuid,
      product_team_uuid,
    };
    expect(actions.getProductteams(organization_uuid, product_team_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Product Team
describe('Add Product Team action', () => {
  it('should create an action to add product team', () => {
    const payload = { product_team_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_PRODUCTTEAM,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addProductteam(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Product Team
describe('Edit Product Team action', () => {
  it('should create an action to edit product team', () => {
    const payload = { product_team_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_PRODUCTTEAM,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateProductteam(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Product Team
describe('Delete Product Team action', () => {
  it('should create an action to delete product team', () => {
    const product_team_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_PRODUCTTEAM,
      product_team_uuid,
    };
    expect(actions.deleteProductteam(
      product_team_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Products
describe('Get Product action', () => {
  it('should create an action to get product', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const organization_uuid = 'a9446cfa-6e45-4b2f-b250-6fa0059a1c5e'
    const expectedAction = {
      type: actions.GET_PRODUCTS,
      organization_uuid,
      project_uuid,
    };
    expect(actions.getProducts(organization_uuid,project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Product
describe('Add Product action', () => {
  it('should create an action to add product', () => {
    const payload = { product_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_PRODUCT,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addProduct(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Product
describe('Edit Product action', () => {
  it('should create an action to edit product', () => {
    const payload = { product_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_PRODUCT,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateProduct(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Product
describe('Delete Product action', () => {
  it('should create an action to delete product', () => {
    const product_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_PRODUCT,
      product_uuid,
    };
    expect(actions.deleteProduct(
      product_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Thirdpartytools
describe('Get Thirdpartytool action', () => {
  it('should create an action to get thirdpartytool', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_THIRDPARTYTOOLS,
      project_uuid,
    };
    expect(actions.getThirdpartytools(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Thirdpartytool
describe('Add Thirdpartytool action', () => {
  it('should create an action to add thirdpartytool', () => {
    const payload = { project_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_THIRDPARTYTOOL,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addThirdpartytool(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Thirdpartytool
describe('Edit Thirdpartytool action', () => {
  it('should create an action to edit thirdpartytool', () => {
    const payload = { project_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_THIRDPARTYTOOL,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateThirdpartytool(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Thirdpartytool
describe('Delete Thirdpartytool action', () => {
  it('should create an action to delete thirdpartytool', () => {
    const thirdpartytool_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_THIRDPARTYTOOL,
      thirdpartytool_uuid,
    };
    expect(actions.deleteThirdpartytool(
      thirdpartytool_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Credentials
describe('Get Credential action', () => {
  it('should create an action to get credential', () => {
    const thirdpartytool_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_CREDENTIALS,
      thirdpartytool_uuid,
    };
    expect(actions.getCredentials(thirdpartytool_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Credential
describe('Add Credential action', () => {
  it('should create an action to add credential', () => {
    const payload = { credential_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_CREDENTIAL,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addCredential(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Credential
describe('Edit Credential action', () => {
  it('should create an action to edit credential', () => {
    const payload = { credential_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_CREDENTIAL,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateCredential(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Credential
describe('Delete Credential action', () => {
  it('should create an action to delete credential', () => {
    const credential_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_CREDENTIAL,
      credential_uuid,
    };
    expect(actions.deleteCredential(
      credential_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Releases
describe('Get Release action', () => {
  it('should create an action to get release', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const dev_team_uuid = 'a9446cfa-6e45-4b2f-b250-6fa0059a1c5e';
    const release_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_RELEASES,
      project_uuid,
      release_uuid,
      dev_team_uuid,
    };
    expect(actions.getReleases(project_uuid, release_uuid, dev_team_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Release
describe('Add Release action', () => {
  it('should create an action to add release', () => {
    const payload = { release_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_RELEASE,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addRelease(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Release
describe('Edit Release action', () => {
  it('should create an action to edit release', () => {
    const payload = { release_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_RELEASE,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateRelease(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Release
describe('Delete Release action', () => {
  it('should create an action to delete release', () => {
    const release_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_RELEASE,
      release_uuid,
    };
    expect(actions.deleteRelease(
      release_uuid,
    )).toEqual(expectedAction);
  });
});

