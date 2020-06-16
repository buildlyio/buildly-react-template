import * as actions from "./items.actions";
describe("actions", () => {
  it("should create an action to get items", () => {
    const expectedAction = {
      type: actions.GET_ITEMS,
    };
    expect(actions.getItems()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add items", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const expectedAction = {
      type: actions.ADD_ITEMS,
      payload,
      history,
    };
    expect(actions.addItem(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update item", () => {
    const payload = { id: 123 };
    const expectedAction = {
      type: actions.EDIT_ITEMS,
      payload,
    };
    expect(actions.editItem(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete item", () => {
    const itemId = "123";
    const expectedAction = {
      type: actions.DELETE_CUSTODIANS,
      itemId,
    };
    expect(actions.deleteItem(itemId)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to search item", () => {
    const searchItem = "abc";
    const searchList = [{ id: "123", name: "abc" }];
    const expectedAction = {
      type: actions.SEARCH,
      searchItem,
      searchList,
    };
    expect(actions.searchItem(searchItem, searchList)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to get item type", () => {
    const expectedAction = {
      type: actions.GET_ITEMS_TYPE,
    };
    expect(actions.getItemType()).toEqual(expectedAction);
  });
});
