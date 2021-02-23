import * as actions from "./items.actions";
describe("actions", () => {
  it("should create an action to get items by organization", () => {
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.GET_ITEMS,
      organization_uuid,
    };
    expect(actions.getItems(organization_uuid)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add items", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.ADD_ITEMS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addItem(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update item", () => {
    const payload = { id: 123 };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.EDIT_ITEMS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editItem(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete item", () => {
    const itemId = "123";
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.DELETE_ITEMS,
      itemId,
      organization_uuid
    };
    expect(actions.deleteItem(itemId, organization_uuid)).toEqual(expectedAction);
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
  it("should create an action to get item type by organization", () => {
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.GET_ITEMS_TYPE,
      organization_uuid,
    };
    expect(actions.getItemType(organization_uuid)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add item type", () => {
    const payload = {
      name: "test type",
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = {
      type: actions.ADD_ITEMS_TYPE,
      payload,
    };
    expect(actions.addItemType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to edit item type", () => {
    const payload = {
      name: "test type - edited",
      edit_date: new Date(),
    };
    const expectedAction = {
      type: actions.EDIT_ITEMS_TYPE,
      payload,
    };
    expect(actions.editItemType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete item type", () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_ITEMS_TYPE,
      id,
    };
    expect(actions.deleteItemType(id)).toEqual(expectedAction);
  });
});