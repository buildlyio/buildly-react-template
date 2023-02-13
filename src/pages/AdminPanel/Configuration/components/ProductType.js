import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getProductType,
  deleteProductType,
} from '../../../../redux/items/actions/items.actions';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../ConfigurationConstants';
import AddProductType from '../forms/AddProductType';

const ProductType = ({
  dispatch,
  loading,
  productType,
  redirectTo,
  history,
  timezone,
}) => {
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
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
    setDeleteModal(true);
  };

  const handleDeleteModal = () => {
    dispatch(deleteProductType(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={productType || []}
      columns={getColumns(timezone)}
      filename="ProductType"
      addButtonHeading="Product Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Product Type?"
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
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(ProductType);
