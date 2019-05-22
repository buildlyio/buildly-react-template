import * as React from "react";
import { connect } from 'react-redux'
import { FjButton, FjInputField } from 'freyja-react'

export const CrudContext = React.createContext({});


export interface CrudProps {
    /** action to create an item */
    loadAction: string;
    createAction: string;
    updateAction: string;
    deleteAction: string;
    itemCreated: string;
    itemUpdated: string;
    itemDeleted: string;
    data: any;
    dispatch: any;
}
/**
 * Crud component wrapper
 */
class Crud extends React.Component<CrudProps> {
  constructor(props: CrudProps) {
    super(props);
  }

  /**
  * send a request to create an item
  * @param item - selected item
  */
  createItem(item) {
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
  getData() {
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
          getData: this.getData
        }
      }>
        { children }
      </CrudContext.Provider>
    );
  };
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});

export default connect(mapStateToProps)(Crud);
