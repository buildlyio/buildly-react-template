import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../context/User.context';
import { getContact, getCustodians } from '../../redux/custodian/actions/custodian.actions';
import { getUnitOfMeasure } from '../../redux/items/actions/items.actions';
import {
  getGateways,
  getGatewayType,
  deleteGateway,
} from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getShipmentDetails,
} from '../../redux/shipment/actions/shipment.actions';
import { routes } from '../../routes/routesConstants';
import { gatewayColumns, getGatewayFormattedRow } from '../../utils/constants';
import AddGateway from './forms/AddGateway';

const Gateway = ({
  dispatch,
  history,
  gatewayData,
  loading,
  gatewayTypeList,
  redirectTo,
  shipmentData,
  timezone,
  custodianData,
  unitOfMeasure,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteGatewayId, setDeleteGatewayId] = useState('');
  const [rows, setRows] = useState([]);

  const user = getUser();
  const organization = user.organization.organization_uuid;

  const addPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.TRACKERS}/gateway/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.TRACKERS}/gateway/edit`;

  useEffect(() => {
    dispatch(getGateways(organization));
    dispatch(getGatewayType());
    dispatch(getCustodians(organization));
    dispatch(getContact(organization));
    dispatch(getShipmentDetails(organization, 'Planned,En route,Arrived'));
    dispatch(getUnitOfMeasure(organization));
  }, []);

  useEffect(() => {
    if (!_.isEmpty(gatewayData) && !_.isEmpty(gatewayTypeList)) {
      setRows(getGatewayFormattedRow(gatewayData, gatewayTypeList, shipmentData, custodianData));
    }
  }, [gatewayData, gatewayTypeList, shipmentData, custodianData]);

  const editGatewayAction = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.TRACKERS,
      data: item,
    });
  };

  const deleteGatewayAction = (item) => {
    setDeleteGatewayId(item.id);
    setDeleteModal(true);
  };

  const handleDeleteModal = () => {
    dispatch(deleteGateway(deleteGatewayId, organization));
    setDeleteModal(false);
  };

  const onAddButtonClick = () => {
    history.push(addPath, {
      from: redirectTo || routes.TRACKERS,
    });
  };

  return (
    <DataTableWrapper
      hideAddButton
      centerLabel
      filename="GatewayData"
      tableHeader="Gateway"
      loading={loading}
      rows={rows || []}
      columns={gatewayColumns(
        timezone,
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
      )}
      addButtonHeading="Add Gateway"
      onAddButtonClick={onAddButtonClick}
      editAction={editGatewayAction}
      deleteAction={deleteGatewayAction}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to delete this Gateway?"
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
  ...state.custodianReducer,
  ...state.itemsReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.optionsReducer.loading
    || state.shipmentReducer.loading
    || state.custodianReducer.loading
    || state.itemsReducer.loading
    || state.authReducer.loading
  ),
});

export default connect(mapStateToProps)(Gateway);
