import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getItemType,
  deleteItemType,
} from '@redux/items/actions/items.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { ITEM_TYPE_COLUMNS } from '../ConfigurationConstants';
import AddItemType from '../forms/AddItemType';

const ItemType = ({
  dispatch,
  loading,
  itemTypeList,
  redirectTo,
  history,
}) => {
  const organization = useContext(UserContext).organization.organization_uuid;
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
      dispatch(getItemType(organization));
    }
  }, [itemTypeList]);

  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.CONFIGURATION,
    });
  };

  const editType = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
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
      addButtonHeading="Item Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle="Are you sure you want to Delete this Item Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddItemType} />
      <Route path={`${editPath}/:id`} component={AddItemType} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(ItemType);
