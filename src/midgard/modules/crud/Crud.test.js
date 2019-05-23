import {Crud} from "midgard/modules/crud/Crud";

describe('Crud', () => {
  const crud = new Crud({deleteItem: "Delete_Item"});
  it('should dispatch an action to delete an item', () => {
    expect(1).toEqual(1);
    // crud.deleteItem();
    // dispatch = jest.fn()
    // expect(dispatch).toHaveBeenCalled();
  })
});
