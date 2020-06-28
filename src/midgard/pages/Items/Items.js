import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { routes } from "../../routes/routesConstants";
import AddItems from "./forms/AddItems";
import { itemColumns, getFormattedRow } from "./ItemsConstants";
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
  itemData,
  loading,
  loaded,
  error,
  searchedData,
  itemTypeList,
  redirectTo,
  noSearch,
}) {
  const addItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.CUSTODIANS}/add`;

  const editItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.CUSTODIANS}/edit`;

  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  let rows = [];
  if (searchedData && searchedData.length) {
    rows = searchedData;
  } else if (itemData && itemData.length) {
    rows = getFormattedRow(itemData, itemTypeList);
  }

  useEffect(() => {
    if (itemData === null) {
      dispatch(getItems());
      dispatch(getItemType());
    }
  }, []);

  const editItem = (item) => {
    history.push(`${editItemPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.ITEMS,
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
    history.push(`${addItemPath}`, {
      from: redirectTo || routes.ITEMS,
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
      redirectTo={redirectTo}
      rows={rows}
      hasSearch={noSearch ? false : true}
      search={{ searchValue, searchAction: searchTable }}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to delete this Item?"}
    >
      <Route path={`${addItemPath}`} component={AddItems} />
      <Route path={`${editItemPath}/:id`} component={AddItems} />
    </DashboardWrapper>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});
export default connect(mapStateToProps)(Items);
