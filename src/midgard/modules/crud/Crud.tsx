import * as React from "react";
import { connect } from 'react-redux'
import { FjButton, FjInputField } from 'freyja-react'

export const CrudContext = React.createContext({});


export interface CrudProps {
    /** action to create an item */
    createAction: string;
    updateAction: string;
    [key: string]: string;
}
/**
 * Crud component wrapper
 *
 * @param {object} props Component props
 * @param {bool} props.createAction action to create an item
 * @param {function} props.updateAction Form submit callback function
 */
 function Crud({children, createAction, updateAction, deleteAction, itemCreated, itemUpdated, itemDeleted, dispatch, data, loading, reducer}: CrudProps) {
    /**
     * Submit the form to the backend and attempts to authenticate
     * @param {Event} event the default submit event
     */
    const deleteItem = (item) => {
        console.log('crud', data, item);
        // dispatch({type: deleteAction, item});
        // return itemDeleted
    };

    return (
        <CrudContext.Provider value={{deleteItem}}>
            {children}
        </CrudContext.Provider>
    );
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});

export default connect(mapStateToProps)(Crud);
