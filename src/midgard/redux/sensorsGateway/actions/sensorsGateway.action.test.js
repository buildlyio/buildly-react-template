import * as actions from "./sensorsGateway.actions";
describe("actions", () => {
  it("should create an action to get Gateway", () => {
    const expectedAction = {
      type: actions.GET_GATEWAYS,
    };
    expect(actions.getGateways()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add Gateway", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const expectedAction = {
      type: actions.ADD_GATEWAY,
      payload,
      history,
    };
    expect(actions.addGateway(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update Gateway", () => {
    const payload = { id: 123 };
    const expectedAction = {
      type: actions.EDIT_GATEWAY,
      payload,
    };
    expect(actions.editGateway(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete Gateway", () => {
    const gatewayId = "123";
    const expectedAction = {
      type: actions.DELETE_GATEWAY,
      gatewayId,
    };
    expect(actions.deleteGateway(gatewayId)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to search Gateway", () => {
    const searchItem = "abc";
    const searchList = [{ id: "123", name: "abc" }];
    const expectedAction = {
      type: actions.GATEWAY_SEARCH,
      searchItem,
      searchList,
    };
    expect(actions.searchGatewayItem(searchItem, searchList)).toEqual(
      expectedAction
    );
  });
});

describe("actions", () => {
  it("should create an action to get Gateway type", () => {
    const expectedAction = {
      type: actions.GET_GATEWAYS_TYPE,
    };
    expect(actions.getGatewayType()).toEqual(expectedAction);
  });
});
