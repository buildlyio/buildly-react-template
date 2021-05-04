import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '@context/User.context';
import {
  getGateways,
  getGatewayType,
  deleteGateway,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getGatewayOptions,
} from '@redux/options/actions/options.actions';
import { routes } from '@routes/routesConstants';
import { gatewayColumns, getFormattedRow } from '../Constants';
import AddGateway from '../forms/AddGateway';

const Gateway = ({
  dispatch,
  history,
  gatewayData,
  loading,
  gatewayTypeList,
  redirectTo,
  gatewayOptions,
  shipmentData,
}) => {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteGatewayId, setDeleteGatewayId] = useState('');
  const [rows, setRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.SENSORS_GATEWAY}/gateway/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.SENSORS_GATEWAY}/gateway/edit`;

  useEffect(() => {
    if (gatewayData === null) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (gatewayOptions === null) {
      dispatch(getGatewayOptions());
    }
  }, []);

  useEffect(() => {
    if (
      gatewayData
      && gatewayData.length
      && gatewayTypeList
      && gatewayTypeList.length
    ) {
      setRows(getFormattedRow(gatewayData, gatewayTypeList, shipmentData));
    }
  }, [gatewayData, gatewayTypeList, shipmentData]);

  const editGatewayAction = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.SENSORS_GATEWAY,
      data: item,
    });
  };

  const deleteGatewayAction = (item) => {
    setDeleteGatewayId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteGateway(deleteGatewayId, organization));
    setConfirmModal(false);
  };

  const onAddButtonClick = () => {
    history.push(addPath, {
      from: redirectTo || routes.SENSORS_GATEWAY,
    });
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={rows || []}
      columns={gatewayColumns}
      filename="GatewayData"
      addButtonHeading="Add Gateway"
      onAddButtonClick={onAddButtonClick}
      editAction={editGatewayAction}
      deleteAction={deleteGatewayAction}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle="Are you sure you want to delete this Gateway?"
      tableHeader="Gateway"
      hideAddButton
    >
      <Route path={`${addPath}`} component={AddGateway} />
      <Route path={`${editPath}/:id`} component={AddGateway} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
  ...state.shipmentReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.optionsReducer.loading
    || state.shipmentReducer.loading
  ),
});

export default connect(mapStateToProps)(Gateway);
