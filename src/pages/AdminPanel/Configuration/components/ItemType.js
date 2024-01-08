import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../../../../utils/constants';
import AddItemType from '../forms/AddItemType';
import { useQuery } from 'react-query';
import { getItemTypeQuery } from '../../../../react-query/queries/items/getItemTypeQuery';
import { getUnitQuery } from '../../../../react-query/queries/items/getUnitQuery';
import { useDeleteItemTypeMutation } from '../../../../react-query/mutations/items/deleteItemTypeMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '../../../../zustand/timezone/timezoneStore';

const ItemType = ({
  redirectTo,
  history,
}) => {
  const organization = getUser().organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/item-type`
    : `${routes.CONFIGURATION}/item-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/item-type`
    : `${routes.CONFIGURATION}/item-type/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const { data: itemTypesData, isLoading: isLoadingItemTypes } = useQuery(
    ['itemTypes', organization],
    () => getItemTypeQuery(organization, displayAlert),
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

  const { mutate: deleteItemTypeMutation, isLoading: isDeletingItemType } = useDeleteItemTypeMutation(organization, displayAlert);

  const handleDeleteModal = () => {
    deleteItemTypeMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingUnits || isLoadingItemTypes || isDeletingItemType}
      rows={itemTypesData || []}
      columns={getColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="ItemType"
      addButtonHeading="Item Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Item Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddItemType} />
      <Route path={`${editPath}/:id`} component={AddItemType} />
    </DataTableWrapper>
  );
};

export default ItemType;
