import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { sensorsColumns } from "../Constants";
import DashboardWrapper from "../../../components/DashboardWrapper/DashboardWrapper";
import { routes } from "../../../routes/routesConstants";
import {
  getGateways,
  getGatewayType,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";
import AddSensors from "../forms/AddSensors";

function Sensors(props) {
  const {
    dispatch,
    history,
    location,
    data,
    loading,
    searchedData,
    gatewayTypeList,
    redirectTo,
    noSearch,
  } = props;
  const addPath = redirectTo
    ? `${redirectTo}/sensors`
    : `${routes.SENSORS_GATEWAY}/sensor/add`;

  const editPath = redirectTo
    ? `${redirectTo}/sensors`
    : `${routes.SENSORS_GATEWAY}/sensor/edit`;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteGatewayId, setDeleteGatewayId] = useState("");
  const [searchValue, setSearchValue] = useState("");

  let rows = [];
  if (searchedData && searchedData.length) {
    rows = searchedData;
  } else if (data && data.length) {
    rows = data;
  }

  useEffect(() => {
    // dispatch(getGateways());
    // dispatch(getGatewayType());
  }, []);

  const editGateway = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.SENSORS_GATEWAY,
      data: item,
    });
  };
  const deleteGateway = (item) => {
    setDeleteGatewayId(item.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    // dispatch(deleteItem(deleteGatewayId));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    setSearchValue(e.target.value);
    // dispatch(searchItem(e.target.value, rows));
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
      dashboardHeading={"Sensors"}
      addButtonHeading={"Add Sensor"}
      editAction={editGateway}
      deleteAction={deleteGateway}
      columns={sensorsColumns}
      redirectTo={redirectTo}
      rows={rows}
      hasSearch={noSearch ? false : true}
      search={{ searchValue, searchAction: searchTable }}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Delete Sensor"}
    >
      <Route path={`${addPath}`} component={AddSensors} />
      <Route path={`${editPath}/:id`} component={AddSensors} />
    </DashboardWrapper>
  );
}
export default Sensors;
