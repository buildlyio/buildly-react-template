import * as React from "react";
import { connect } from 'react-redux'
import { FjButton, FjInputField } from 'freyja-react'
import { crudCreate, crudDelete, crudLoadData, crudUpdate } from './redux/crud.actions';

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
  children: any;
  endPoint?: any;
}

export interface CrudState {
  dataLoaded: boolean;
}

/**
 * Crud component wrapper
 */
export class Crud extends React.Component<CrudProps, CrudState> {
  constructor(props: CrudProps) {
    super(props);
    this.state = {
      dataLoaded: false
    };
  }

  componentDidMount() {
    this.loadData();
  }

  /**
  * send a request to create an item
  * @param item - selected item
  * @public
  */
  public createItem = (item) => {
    const {createAction, itemCreated, dispatch, endPoint} = this.props;
      if (endPoint) {
          dispatch(crudCreate(item.data, endPoint, item.idProp, item.dataProp));
      }
    else if (createAction) {
      dispatch({type: createAction, data: item});
      return itemCreated
    }
  };

  /**
  * send a request to update an item
  * @param item - selected item
  */
  public updateItem = (item) => {
      const {updateAction, itemUpdated, dispatch, endPoint} = this.props;
      if (endPoint) {
          dispatch(crudUpdate(item.data, endPoint, item.idProp, item.dataProp));
      }
    else if (updateAction) {
      dispatch({type: updateAction, data: item});
      return itemUpdated
    }
  };

  /**
  * send a request to delete an item
  * @param item - selected item
  */
  public deleteItem = (item) => {
    const {deleteAction, itemDeleted, dispatch, endPoint} = this.props;
      if (endPoint) {
          dispatch(crudDelete(item.data, endPoint, item.idProp, item.dataProp));
      }
    else if (deleteAction) {
      dispatch({type: deleteAction, data: item});
      return itemDeleted
    }
  };

  /**
  * load the data to the store and returns it
  */
  public loadData = () => {
    const {loadAction, data, dispatch, endPoint} = this.props;
    if (endPoint) {
        dispatch(crudLoadData(endPoint, null,null));
    }
    else if (loadAction && !this.state.dataLoaded) {
      dispatch({type: loadAction});
    }
      this.setState({
          dataLoaded: true
      });
      return data;
  };
  /**
   * gets the data from the store
   */
  public getData = () => {
      const { data, endPoint} = this.props;
      if (endPoint && this.props[endPoint]) {
        return this.props[endPoint].data;
      }
    return data
  };

  render() {
    const {children} = this.props;
    return children({
        createItem: this.createItem,
        updateItem: this.updateItem,
        deleteItem: this.deleteItem,
        loadData: this.loadData,
        getData: this.getData
    })
  };
}

const mapStateToProps = (state, ownProps) => ({...state[ownProps.reducer], ...ownProps});

export default connect(mapStateToProps)(Crud);
