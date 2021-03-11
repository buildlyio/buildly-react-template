import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { crudCreate, crudDelete, crudLoadData, crudUpdate } from "./redux/crud.actions";

/**
 * Crud component wrapper
 */
export class Crud extends React.Component {
  constructor(props) {
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
  createItem = (item) => {
    const {createAction, itemCreated, dispatch, endpoint} = this.props;
      if (endpoint) {
          dispatch(crudCreate(item.data, endpoint, item.idProp, item.dataProp));
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
  updateItem = (item) => {
      const {updateAction, itemUpdated, dispatch, endpoint} = this.props;
      if (endpoint) {
          dispatch(crudUpdate(item.data, endpoint, item.idProp, item.dataProp));
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
  deleteItem = (item) => {
    const { deleteAction, itemDeleted, dispatch, endpoint } = this.props;
    if (endpoint) {
      dispatch(crudDelete(item.data, endpoint, item.idProp, item.dataProp));
    } else if (deleteAction) {
      dispatch({ type: deleteAction, data: item });
      return itemDeleted;
    }
  };

  /**
  * load the data to the store and returns it
  */
  loadData = () => {
    const {loadAction, data, dispatch, endpoint} = this.props;
    if (endpoint) {
        dispatch(crudLoadData(endpoint, null,null));
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
  getData = () => {
      const { data, endpoint} = this.props;
      if (endpoint && this.props[endpoint]) {
        return this.props[endpoint].data;
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

Crud.propTypes = {
  loadAction: PropTypes.string,
  createAction: PropTypes.string,
  updateAction: PropTypes.string,
  deleteAction: PropTypes.string,
  itemCreated: PropTypes.any,
  itemUpdated: PropTypes.any,
  itemDeleted: PropTypes.any,
  data: PropTypes.any,
  reducer: PropTypes.any,
  dispatch: PropTypes.any,
  children: PropTypes.any,
  endpoint: PropTypes.any
}

const mapStateToProps = (state, ownProps) => ({...state[ownProps.reducer], ...ownProps});

export default connect(mapStateToProps)(Crud);
