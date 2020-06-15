import * as actions from "./custodian.actions";
describe("actions", () => {
  it("should create an action to get custodians", () => {
    const expectedAction = {
      type: actions.GET_CUSTODIANS,
    };
    expect(actions.getCustodians()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add custodian", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const expectedAction = {
      type: actions.ADD_CUSTODIANS,
      payload,
      history,
    };
    expect(actions.addCustodians(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update custodian", () => {
    const payload = { id: 123 };
    const expectedAction = {
      type: actions.EDIT_CUSTODIANS,
      payload,
    };
    expect(actions.editCustodian(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete custodian", () => {
    const custodianId = "123";
    contactObjId = "21";
    const expectedAction = {
      type: actions.DELETE_CUSTODIANS,
      custodianId,
      contactObjId,
    };
    expect(actions.deleteCustodian(custodianId)).toEqual(expectedAction);
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
  it("should create an action to get contact info", () => {
    const expectedAction = {
      type: actions.GET_CONTACT,
    };
    expect(actions.getContact()).toEqual(expectedAction);
  });
});
