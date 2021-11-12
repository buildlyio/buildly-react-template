import { shallow } from 'enzyme';
import React from 'react';
import { Crud } from './Crud';

function setup() {
  const props = {
    dispatch: jest.fn(),
    createAction: 'CREATE_ACTION',
    updateAction: 'UPDATE_ACTION',
    deleteAction: 'DELETE_ACTION',
    loadAction: 'LOAD_ACTION',
    children: jest.fn(),
  };

  const enzymeWrapper = shallow(<Crud {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

describe('Crud', () => {
  it('should dispatch an action to create an item', () => {
    const { enzymeWrapper, props } = setup();
    enzymeWrapper.instance().createItem({ id: 1 });
    expect(props.dispatch).toHaveBeenCalledWith({
      type: 'CREATE_ACTION',
      data: { id: 1 },
    });
  });

  it('should dispatch an action to update an item', () => {
    const { enzymeWrapper, props } = setup();
    enzymeWrapper.instance().updateItem({ id: 1 });
    expect(props.dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_ACTION',
      data: { id: 1 },
    });
  });

  it('should dispatch an action to delete an item', () => {
    const { enzymeWrapper, props } = setup();
    enzymeWrapper.instance().deleteItem({ id: 1 });
    expect(props.dispatch).toHaveBeenCalledWith({
      type: 'DELETE_ACTION',
      data: { id: 1 },
    });
  });

  it('should dispatch an action to load the data', () => {
    const { enzymeWrapper, props } = setup();
    enzymeWrapper.instance().loadData();
    expect(props.dispatch).toHaveBeenCalledWith({ type: 'LOAD_ACTION' });
  });
});
