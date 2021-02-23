import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getItemType,
  deleteItemType,
} from "midgard/redux/items/actions/items.actions";
import DataTableWrapper from "midgard/components/DataTableWrapper/DataTableWrapper";
import { 
  ITEM_TYPE_TOOLTIP,
  ITEM_TYPE_COLUMNS,
} from "../ConfigurationConstants";
import { routes } from "midgard/routes/routesConstants";
import { Route } from "react-router-dom";
import AddItemType from "../forms/AddItemType";

const ItemType = (props) => {
  const { 
    dispatch,
    loading,
    itemTypeList,
    redirectTo,
    history, 
  } = props;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/item-type`
    : `${routes.CONFIGURATION}/item-type/add`;
  const editPath = redirectTo
  ? `${redirectTo}/item-type`
  : `${routes.CONFIGURATION}/item-type/edit`;

  useEffect(() => {
    if (!loading && !itemTypeList) {
      dispatch(getItemType());
    }
  }, [itemTypeList]);

  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.CONFIGURATION,
    });
  };

  const editType = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.CONFIGURATION,
      data: item,
    });
  };

  const deleteType = (item) => {
    setDeleteId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteItemType(deleteId));
    setConfirmModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={itemTypeList || []}
      columns={ITEM_TYPE_COLUMNS}
      filename="ItemType"
      toolTipTitle="Item Type"
      toolTipText={ITEM_TYPE_TOOLTIP}
      addButtonHeading="Item Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to Delete this Item Type?"}
    >
      <Route path={`${addPath}`} component={AddItemType} />
      <Route path={`${editPath}/:id`} component={AddItemType} />
    </DataTableWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(ItemType);
