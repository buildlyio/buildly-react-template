import * as React from "react";
import { connect } from 'react-redux'
import { FjButton, FjInputField } from 'freyja-react'

export const CrudContext = React.createContext({});


export interface CrudProps {
    /** action to create an item */
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

    createItem(item) {
        const {createAction, itemCreated, dispatch} = this.props;
        dispatch({type: createAction, item});
        return itemCreated
    };
    updateItem(item) {
        const {updateAction, itemUpdated, dispatch} = this.props;
        dispatch({type: updateAction, item});
        return itemUpdated
    };

    deleteItem(item) {
        const {deleteAction, itemDeleted, dispatch} = this.props;
        dispatch({type: deleteAction, item});
        return itemDeleted
    };

    getData() {
        return this.props.data;
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
