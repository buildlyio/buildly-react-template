import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getGatewayType,
  deleteGatewayType,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import DataTableWrapper from "midgard/components/DataTableWrapper/DataTableWrapper";
import { GATEWAY_TYPE_COLUMNS } from "../ConfigurationConstants";
import { routes } from "midgard/routes/routesConstants";
import { Route } from "react-router-dom";
import AddGatewayType from "../forms/AddGatewayType";

const GatewayType = (props) => {
  const { 
    dispatch,
    loading,
    gatewayTypeList,
    redirectTo,
    history, 
  } = props;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/gateway-type`
    : `${routes.CONFIGURATION}/gateway-type/add`;
  const editPath = redirectTo
  ? `${redirectTo}/gateway-type`
  : `${routes.CONFIGURATION}/gateway-type/edit`;

  useEffect(() => {
    if (!loading && !gatewayTypeList) {
      dispatch(getGatewayType());
    }
  }, [gatewayTypeList]);

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
    dispatch(deleteGatewayType(deleteId));
    setConfirmModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={gatewayTypeList || []}
      columns={GATEWAY_TYPE_COLUMNS}
      filename="GatewayType"
      addButtonHeading="Gateway Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to Delete this Gateway Type?"}
    >
      <Route path={`${addPath}`} component={AddGatewayType} />
      <Route path={`${editPath}/:id`} component={AddGatewayType} />
    </DataTableWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(GatewayType);
