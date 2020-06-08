import * as actions from "./custodian.actions";
describe("actions", () => {
  it("should create an action to get custodians", () => {
    const payload = { id: 123 };
    const expectedAction = {
      type: actions.GET_CUSTODIANS,
      payload,
    };
    expect(actions.getCustodians()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add custodian", () => {
    const payload = { id: 123, name: "Abc" };
    const expectedAction = {
      type: actions.GET_CUSTODIANS,
      payload,
    };
    expect(actions.addCustodians(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update custodian", () => {
    const payload = { id: 123 };
    const expectedAction = {
      type: actions.GET_CUSTODIANS,
      payload,
    };
    expect(actions.editCustodian(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete custodian", () => {
    const payload = { id: 123 };
    const expectedAction = {
      type: actions.DELETE_CUSTODIANS,
      payload,
    };
    expect(actions.deleteCustodian(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to search custodian", () => {
    const payload = {
      searchItem: "abc",
      searchList: [{ id: "123", name: "abc" }],
    };
    const expectedAction = {
      type: actions.SEARCH,
      payload,
    };
    expect(actions.searchCustodian(payload)).toEqual(expectedAction);
  });
});
