import * as React from "react";
import { connect } from 'react-redux'
import { FjButton, FjInputField } from 'freyja-react'

export const CrudContext = React.createContext({});


export interface CrudProps {
  /**
   * action to load data
   */
  loadAction?: string;
  /**
   * action to create an item
   */
  createAction?: string;
  /**
   * action to update an item
   */
  updateAction?: string;
  /**
   * action to delete an item
   */
  deleteAction?: string;
  /**
   * function that is returned when an item is created
   */
  itemCreated?: any;
  /**
   * function that is returned when an item is updated
   */
  itemUpdated?: any;
  /**
   * function that is returned when an item is deleted
   */
  itemDeleted?: any;
  /**
   * data from the store
   */
  data?: any;
  /**
   * reducer to get data from
   */
  reducer?: any;
  dispatch?: any;
}

/**
 * Crud component wrapper
 */
class Crud extends React.Component<CrudProps> {
  constructor(props: CrudProps) {
    super(props);
    this.createItem = this.createItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  /**
  * send a request to create an item
  * @param item - selected item
  * @public
  */
  public createItem(item) {
    const {createAction, itemCreated, dispatch} = this.props;
    dispatch({type: createAction, item});
    return itemCreated
  };

  /**
  * send a request to update an item
  * @param item - selected item
  */
  updateItem(item) {
    const {updateAction, itemUpdated, dispatch} = this.props;
    dispatch({type: updateAction, item});
    return itemUpdated
  };

  /**
  * send a request to delete an item
  * @param item - selected item
  */
  deleteItem(item) {
    const {deleteAction, itemDeleted, dispatch} = this.props;
    dispatch({type: deleteAction, item});
    return itemDeleted
  };

  /**
  * load the data to the store and returns it
  */
  loadData() {
    const {loadAction, data, dispatch} = this.props;
    dispatch({type: loadAction});
    return data;
  }

  render() {
    const {children} = this.props;
    return (
      <CrudContext.Provider value={
        {
          createItem: this.createItem,
          updateItem: this.updateItem,
          deleteItem: this.deleteItem,
          getData: this.loadData()
        }
      }>
        { children }
      </CrudContext.Provider>
    );
  };
}

const mapStateToProps = (state, ownProps) => ({...state[ownProps.reducer], ...ownProps});

export default connect(mapStateToProps)(Crud);
