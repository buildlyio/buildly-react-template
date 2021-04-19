import * as actions from "./custodian.actions";
describe("actions", () => {
  it("should create an action to get custodians by organization", () => {
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.GET_CUSTODIANS,
      organization_uuid,
    };
    expect(actions.getCustodians(organization_uuid)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add custodian", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.ADD_CUSTODIANS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addCustodians(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update custodian", () => {
    const payload = { id: 123 };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.EDIT_CUSTODIANS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editCustodian(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete custodian", () => {
    const custodianId = "123";
    const contactObjId = "21";
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.DELETE_CUSTODIANS,
      custodianId,
      contactObjId,
      organization_uuid,
    };
    expect(actions.deleteCustodian(custodianId, contactObjId, organization_uuid)).toEqual(
      expectedAction
    );
  });
});

describe("actions", () => {
  it("should create an action to search custodian", () => {
    const searchItem = "abc";
    const searchList = [{ id: "123", name: "abc" }];
    const expectedAction = {
      type: actions.SEARCH,
      searchItem,
      searchList,
    };
    expect(actions.searchCustodian(searchItem, searchList)).toEqual(
      expectedAction
    );
  });
});

describe("actions", () => {
  it("should create an action to get custodian type", () => {
    const expectedAction = {
      type: actions.GET_CUSTODIAN_TYPE,
    };
    expect(actions.getCustodianType()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to get contact info by organization", () => {
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.GET_CONTACT,
      organization_uuid,
    };
    expect(actions.getContact(organization_uuid)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add custodian type", () => {
    const payload = {
      name: "test type",
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = {
      type: actions.ADD_CUSTODIAN_TYPE,
      payload,
    };
    expect(actions.addCustodianType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to edit custodian type", () => {
    const payload = {
      name: "test type - edited",
      edit_date: new Date(),
    };
    const expectedAction = {
      type: actions.EDIT_CUSTODIAN_TYPE,
      payload,
    };
    expect(actions.editCustodianType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete custodian type", () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_CUSTODIAN_TYPE,
      id,
    };
    expect(actions.deleteCustodianType(id)).toEqual(expectedAction);
  });
});