import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getShipmentFlag,
  deleteShipmentFlag,
} from '@redux/shipment/actions/shipment.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { SHIPMENT_FLAG_COLUMNS } from '../ConfigurationConstants';
import AddShipmentFlag from '../forms/AddShipmentFlag';

const ShipmentFlag = ({
  dispatch,
  loading,
  shipmentFlag,
  redirectTo,
  history,
}) => {
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/shipment-flag`
    : `${routes.CONFIGURATION}/shipment-flag/add`;

  const editPath = redirectTo
    ? `${redirectTo}/shipment-flag`
    : `${routes.CONFIGURATION}/shipment-flag/edit`;

  useEffect(() => {
    if (!loading && !shipmentFlag) {
      dispatch(getShipmentFlag(organization));
    }
  }, [shipmentFlag]);

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
    dispatch(deleteShipmentFlag(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={shipmentFlag || []}
      columns={SHIPMENT_FLAG_COLUMNS}
      filename="ShipmentFlag"
      addButtonHeading="Shipment Flag"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Shipment Flag?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddShipmentFlag} />
      <Route path={`${editPath}/:id`} component={AddShipmentFlag} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(ShipmentFlag);
