import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { routes } from "../../routes/routesConstants";
import { environment } from "environment";
import AddItems from "./forms/AddItems";
import { itemColumns, getFormattedRow } from "./ItemsConstants";
import {
  getItems,
  deleteItem,
  searchItem,
  getItemType,
  getUnitsOfMeasure,
  GET_ITEM_OPTIONS_SUCCESS,
  GET_ITEM_OPTIONS_FAILURE,
  getProducts,
  getProductType,
  GET_PRODUCTS_OPTIONS_SUCCESS,
  GET_PRODUCTS_OPTIONS_FAILURE,
} from "../../redux/items/actions/items.actions";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import { httpService } from "../../modules/http/http.service";

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
  unitsOfMeasure,
  products,
  itemOptions,
  productOptions,
}) {
  const addItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.ITEMS}/add`;

  const editItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.ITEMS}/edit`;

  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    if (itemData === null) {
      dispatch(getItems());
      dispatch(getItemType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (products === null) {
      dispatch(getProducts());
      dispatch(getProductType());
    }
    if (itemOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}shipment/item/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_ITEM_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_ITEM_OPTIONS_FAILURE, error: err });
        });
    }

    if (productOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}shipment/product/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_PRODUCTS_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_PRODUCTS_OPTIONS_FAILURE, error: err });
        });
    }
  }, []);

  useEffect(() => {
    if (
      itemData &&
      itemData.length &&
      itemTypeList &&
      itemTypeList.length &&
      unitsOfMeasure &&
      unitsOfMeasure.length
    ) {
      setRows(getFormattedRow(itemData, itemTypeList, unitsOfMeasure));
      setFilteredRows(getFormattedRow(itemData, itemTypeList, unitsOfMeasure));
    }
  }, [itemData, itemTypeList, unitsOfMeasure]);

  useEffect(() => {
    if (searchedData) {
      setFilteredRows(searchedData);
    }
  }, [searchedData]);

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
    let searchFields = [
      // "id",
      "name",
      "item_type_value",
      "unitsMeasure",
      "value",
      "gross_weight",
    ];
    setSearchValue(e.target.value);
    dispatch(searchItem(e.target.value, rows, searchFields));
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
      rows={filteredRows}
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
