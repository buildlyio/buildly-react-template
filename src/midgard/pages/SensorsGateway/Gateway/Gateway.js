import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { gatewayColumns, getFormattedRow } from "../Constants";
import AddGateway from "../forms/AddGateway";
import DashboardWrapper from "../../../components/DashboardWrapper/DashboardWrapper";
import { routes } from "../../../routes/routesConstants";
import {
  getGateways,
  getGatewayType,
  editGateway,
  deleteGateway,
  searchGatewayItem,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";

function Gateway(props) {
  const {
    dispatch,
    history,
    location,
    data,
    loading,
    searchData,
    gatewayTypeList,
    redirectTo,
    noSearch,
  } = props;
  const addPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.SENSORS_GATEWAY}/gateway/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.SENSORS_GATEWAY}/gateway/edit`;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteGatewayId, setDeleteGatewayId] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (data === null) {
      dispatch(getGateways());
      dispatch(getGatewayType());
    }
  }, []);

  let rows = [];
  if (searchData && searchData.length) {
    rows = searchData;
  } else if (data && data.length) {
    rows = getFormattedRow(data, gatewayTypeList);
  }

  const editGatewayAction = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.SENSORS_GATEWAY,
      data: item,
    });
  };
  const deleteGatewayAction = (item) => {
    setDeleteGatewayId(item.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    dispatch(deleteGateway(deleteGatewayId));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    setSearchValue(e.target.value);
    dispatch(searchGatewayItem(e.target.value, rows));
  };
  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.SENSORS_GATEWAY,
    });
  };
  return (
    <DashboardWrapper
      loading={loading}
      onAddButtonClick={onAddButtonClick}
      dashboardHeading={"Gateway"}
      addButtonHeading={"Add Gateway"}
      editAction={editGatewayAction}
      deleteAction={deleteGatewayAction}
      columns={gatewayColumns}
      rows={rows}
      redirectTo={redirectTo}
      hasSearch={noSearch ? false : true}
      search={{ searchValue, searchAction: searchTable }}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are your sure you want to Delete this Gateway?"}
    >
      <Route path={`${addPath}`} component={AddGateway} />
      <Route path={`${editPath}/:id`} component={AddGateway} />
    </DashboardWrapper>
  );
}
export default Gateway;
