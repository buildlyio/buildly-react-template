import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getProductType,
  deleteProductType,
} from '@redux/items/actions/items.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { PRODUCT_TYPE_COLUMNS } from '../ConfigurationConstants';
import AddProductType from '../forms/AddProductType';

const ProductType = ({
  dispatch,
  loading,
  productType,
  redirectTo,
  history,
}) => {
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/product-type`
    : `${routes.CONFIGURATION}/product-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/product-type`
    : `${routes.CONFIGURATION}/product-type/edit`;

  useEffect(() => {
    if (!loading && !productType) {
      dispatch(getProductType(organization));
    }
  }, [productType]);

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
    dispatch(deleteProductType(deleteId));
    setConfirmModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={productType || []}
      columns={PRODUCT_TYPE_COLUMNS}
      filename="ProductType"
      addButtonHeading="Product Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle="Are you sure you want to Delete this Product Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddProductType} />
      <Route path={`${editPath}/:id`} component={AddProductType} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(ProductType);
