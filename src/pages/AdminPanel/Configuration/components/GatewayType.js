import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import { useQuery } from 'react-query';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { getGatewayTypeQuery } from '@react-query/queries/sensorGateways/getGatewayTypeQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { useDeleteGatewayTypeMutation } from '@react-query/mutations/sensorGateways/deleteGatewayTypeMutation';
import { routes } from '@routes/routesConstants';
import { getTrackerTypeColumns } from '@utils/constants';
import { useStore } from '@zustand/timezone/timezoneStore';
import AddGatewayType from '../forms/AddGatewayType';

const GatewayType = ({ redirectTo, history }) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const organization = getUser().organization.organization_uuid;

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/gateway-type`
    : `${routes.CONFIGURATION}/gateway-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateway-type`
    : `${routes.CONFIGURATION}/gateway-type/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: gatewayTypesData, isLoading: isLoadingGatewayTypes } = useQuery(
    ['gatewayTypes'],
    () => getGatewayTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
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

  const { mutate: deleteGatewayTypeMutation, isLoading: isDeletingGatewayType } = useDeleteGatewayTypeMutation(displayAlert);

  const handleDeleteModal = () => {
    deleteGatewayTypeMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingUnits || isLoadingGatewayTypes || isDeletingGatewayType}
      rows={gatewayTypesData || []}
      columns={getTrackerTypeColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="TrackerType"
      addButtonHeading="Tracker Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Tracker Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddGatewayType} />
      <Route path={`${editPath}/:id`} component={AddGatewayType} />
    </DataTableWrapper>
  );
};

export default GatewayType;
