import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { gatewayColumns, getGatewayFormattedRow } from '@utils/constants';
import AddGateway from './forms/AddGateway';
import { useQuery } from 'react-query';
import { getGatewayQuery } from '@react-query/queries/sensorGateways/getGatewayQuery';
import { getGatewayTypeQuery } from '@react-query/queries/sensorGateways/getGatewayTypeQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getContactQuery } from '@react-query/queries/custodians/getContactQuery';
import { getShipmentsQuery } from '@react-query/queries/shipments/getShipmentsQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { useDeleteGatewayMutation } from '@react-query/mutations/sensorGateways/deleteGatewayMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';

const Gateway = ({ history, redirectTo }) => {
  const user = getUser();
  const organization = user.organization.organization_uuid;

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const [rows, setRows] = useState([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteGatewayId, setDeleteGatewayId] = useState('');

  const { data: gatewayData, isLoading: isLoadingGateways } = useQuery(
    ['gateways', organization],
    () => getGatewayQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: gatewayTypesData, isLoading: isLoadingGatewayTypes } = useQuery(
    ['gatewayTypes'],
    () => getGatewayTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: contactInfo, isLoading: isLoadingContact } = useQuery(
    ['contact', organization],
    () => getContactQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: shipmentData, isLoading: isLoadingShipments } = useQuery(
    ['shipments', organization],
    () => getShipmentsQuery(organization, 'Planned,En route,Arrived', displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const addPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.TRACKERS}/gateway/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.TRACKERS}/gateway/edit`;

  useEffect(() => {
    if (!_.isEmpty(gatewayData) && !_.isEmpty(gatewayTypesData)) {
      setRows(
        getGatewayFormattedRow(
          gatewayData,
          gatewayTypesData,
          shipmentData,
          custodianData,
        ),
      );
    }
  }, [gatewayData, gatewayTypesData, shipmentData, custodianData]);

  const editGatewayAction = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.TRACKERS,
      data: item,
      gatewayTypesData,
      unitData,
      custodianData,
      contactInfo,
    });
  };

  const deleteGatewayAction = (item) => {
    setDeleteGatewayId(item.id);
    setDeleteModal(true);
  };

  const { mutate: deleteGatewayMutation, isLoading: isDeletingGateway } = useDeleteGatewayMutation(organization, displayAlert);

  const handleDeleteModal = () => {
    setDeleteModal(false);
    deleteGatewayMutation(deleteGatewayId);
  };

  const onAddButtonClick = () => {
    history.push(addPath, {
      from: redirectTo || routes.TRACKERS,
      gatewayTypesData,
      unitData,
      custodianData,
      contactInfo,
    });
  };

  return (
    <div>
      <DataTableWrapper
        hideAddButton
        centerLabel
        filename="TrackerData"
        tableHeader="Trackers"
        loading={
          isLoadingGateways || isLoadingGatewayTypes || isLoadingCustodians || isLoadingContact || isLoadingShipments || isLoadingUnits || isDeletingGateway
        }
        rows={rows || []}
        columns={gatewayColumns(
          data,
          _.find(
            unitData,
            (unit) => _.toLower(unit.unit_of_measure_for) === 'date',
          )
            ? _.find(
              unitData,
              (unit) => _.toLower(unit.unit_of_measure_for) === 'date',
            ).unit_of_measure
            : '',
        )}
        addButtonHeading="Add Tracker"
        onAddButtonClick={onAddButtonClick}
        editAction={editGatewayAction}
        deleteAction={deleteGatewayAction}
        openDeleteModal={openDeleteModal}
        setDeleteModal={setDeleteModal}
        handleDeleteModal={handleDeleteModal}
        deleteModalTitle="Are you sure you want to delete this Tracker?"
      >
        <Route path={`${addPath}`} component={AddGateway} />
        <Route path={`${editPath}/:id`} component={AddGateway} />
      </DataTableWrapper>
    </div>
  );
};

export default Gateway;
