import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../../../../utils/constants';
import AddProductType from '../forms/AddProductType';
import { useQuery } from 'react-query';
import { getProductTypeQuery } from '../../../../react-query/queries/items/getProductTypeQuery';
import { getUnitQuery } from '../../../../react-query/queries/items/getUnitQuery';
import { useDeleteProductTypeMutation } from '../../../../react-query/mutations/items/deleteProductTypeMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '../../../../zustand/timezone/timezoneStore';

const ProductType = ({
  redirectTo,
  history,
}) => {
  const organization = getUser().organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/product-type`
    : `${routes.CONFIGURATION}/product-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/product-type`
    : `${routes.CONFIGURATION}/product-type/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const { data: productTypesData, isLoading: isLoadingProductTypes } = useQuery(
    ['productTypes', organization],
    () => getProductTypeQuery(organization, displayAlert),
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

  const { mutate: deleteProductTypeMutation, isLoading: isDeletingProductType } = useDeleteProductTypeMutation(organization, displayAlert);

  const handleDeleteModal = () => {
    deleteProductTypeMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingUnits || isLoadingProductTypes || isDeletingProductType}
      rows={productTypesData || []}
      columns={getColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
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

export default ProductType;
