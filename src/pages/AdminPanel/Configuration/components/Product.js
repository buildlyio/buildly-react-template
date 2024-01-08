import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getProductColumns } from '../../../../utils/constants';
import AddProduct from '../forms/AddProduct';
import { useQuery } from 'react-query';
import { getProductQuery } from '../../../../react-query/queries/items/getProductQuery';
import { getUnitQuery } from '../../../../react-query/queries/items/getUnitQuery';
import { useDeleteProductMutation } from '../../../../react-query/mutations/items/deleteProductMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '../../../../zustand/timezone/timezoneStore';

const Product = ({
  redirectTo,
  history,
}) => {
  const organization = getUser().organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.CONFIGURATION}/product/add`;

  const editPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.CONFIGURATION}/product/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const { data: productData, isLoading: isLoadingProducts } = useQuery(
    ['products', organization],
    () => getProductQuery(organization, displayAlert),
  );

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

  const { mutate: deleteProductMutation, isLoading: isDeletingProduct } = useDeleteProductMutation(organization, displayAlert);

  const handleDeleteModal = () => {
    deleteProductMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingUnits || isLoadingProducts || isDeletingProduct}
      rows={productData || []}
      columns={getProductColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
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

export default Product;
