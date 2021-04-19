import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import {
  getShipmentFlag,
  deleteShipmentFlag,
} from "midgard/redux/shipment/actions/shipment.actions";
import DataTableWrapper from "midgard/components/DataTableWrapper/DataTableWrapper";
import { SHIPMENT_FLAG_COLUMNS } from "../ConfigurationConstants";
import { routes } from "midgard/routes/routesConstants";
import { Route } from "react-router-dom";
import AddShipmentFlag from "../forms/AddShipmentFlag";
import { UserContext } from "midgard/context/User.context";

const ShipmentFlag = (props) => {
  const { 
    dispatch,
    loading,
    shipmentFlag,
    redirectTo,
    history, 
  } = props;
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openConfirmModal, setConfirmModal] = useState(false);
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
      type: "edit",
      from: redirectTo || routes.CONFIGURATION,
      data: item,
    });
  };

  const deleteType = (item) => {
    setDeleteId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteShipmentFlag(deleteId));
    setConfirmModal(false);
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
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to Delete this Shipment Flag?"}
    >
      <Route path={`${addPath}`} component={AddShipmentFlag} />
      <Route path={`${editPath}/:id`} component={AddShipmentFlag} />
    </DataTableWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(ShipmentFlag);
