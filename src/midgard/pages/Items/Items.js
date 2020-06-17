import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DataTable from "../../components/Table/Table";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { routes } from "../../routes/routesConstants";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import Loader from "../../components/Loader/Loader";
import AddItems from "./forms/AddItems";
import { itemColumns } from "./ItemsConstants";
import {
  getItems,
  deleteItem,
  searchItem,
  getItemType,
} from "../../redux/items/actions/items.actions";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";

function Items({
  dispatch,
  history,
  location,
  data,
  loading,
  loaded,
  error,
  searchedData,
}) {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  let rows = [];
  if (searchedData && searchedData.length) {
    rows = searchedData;
  } else if (data && data.length) {
    rows = data;
  }

  useEffect(() => {
    dispatch(getItems());
    dispatch(getItemType());
  }, []);

  const editItem = (item) => {
    history.push(`${routes.ITEMS}/edit/:${item.id}`, {
      type: "edit",
      from: routes.ITEMS,
      data: item,
    });
  };
  const deletItem = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    dispatch(deleteItem(deleteItemId));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    setSearchValue(e.target.value);
    dispatch(searchItem(e.target.value, rows));
  };

  const onAddButtonClick = () => {
    history.push(`${routes.ITEMS}/add`, {
      from: routes.ITEMS,
    });
  };
  return (
    <DashboardWrapper
      loading={loading}
      onAddButtonClick={onAddButtonClick}
      dashboardHeading={"Items"}
      addButtonHeading={"Add Item"}
      editAction={editItem}
      deleteAction={deletItem}
      columns={itemColumns}
      rows={rows}
      hasSearch={true}
      search={{ searchValue, searchAction: searchTable }}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Delete Item"}
    >
      <Route path={`${routes.ITEMS}/add`} component={AddItems} />
      <Route path={`${routes.ITEMS}/edit/:id`} component={AddItems} />
    </DashboardWrapper>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});
export default connect(mapStateToProps)(Items);
