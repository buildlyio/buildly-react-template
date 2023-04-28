import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getProducts,
  deleteProduct,
  getUnitOfMeasure,
} from '../../../../redux/items/actions/items.actions';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getProductColumns } from '../ConfigurationConstants';
import AddProduct from '../forms/AddProduct';

const Product = ({
  dispatch,
  loading,
  products,
  redirectTo,
  history,
  timezone,
  unitOfMeasure,
}) => {
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.CONFIGURATION}/product/add`;

  const editPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.CONFIGURATION}/product/edit`;

  useEffect(() => {
    if (!loading && !products) {
      dispatch(getProducts(organization));
    }
  }, [products]);

  useEffect(() => {
    if (!loading) {
      if (_.isEmpty(unitOfMeasure)) {
        dispatch(getUnitOfMeasure(organization));
      }
    }
  }, [unitOfMeasure]);

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
    dispatch(deleteProduct(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={products || []}
      columns={getProductColumns(
        timezone,
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight')).unit_of_measure
          : '',
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="Products"
      addButtonHeading="Product"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Product?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddProduct} />
      <Route path={`${editPath}/:id`} component={AddProduct} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(Product);
