import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { gatewayColumns } from "../Constants";
import AddGateway from "../forms/AddGateway";
import DashboardWrapper from "../../../components/DashboardWrapper/DashboardWrapper";
import { routes } from "../../../routes/routesConstants";
import {
  getGateways,
  getGatewayType,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";

function Gateway(props) {
  console.log("props", props);
  const {
    dispatch,
    history,
    location,
    data,
    loading,
    searchedData,
    gatewayTypeList,
  } = props;
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
    dispatch(getGateways());
    dispatch(getGatewayType());
  }, []);

  const editGateway = (item) => {
    history.push(`${routes.ITEMS}/gateway/edit/:${item.id}`, {
      type: "edit",
      from: routes.SENSORS_GATEWAY,
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
    history.push(`${routes.SENSORS_GATEWAY}/gateway/add`, {
      from: routes.SENSORS_GATEWAY,
    });
  };
  return (
    <DashboardWrapper
      loading={loading}
      onAddButtonClick={onAddButtonClick}
      dashboardHeading={"Gateway"}
      addButtonHeading={"Add Gateway"}
      editAction={editGateway}
      deleteAction={deleteGateway}
      columns={gatewayColumns}
      rows={rows}
      hasSearch={true}
      search={{ searchValue, searchAction: searchTable }}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Delete Gateway"}
    >
      <Route
        path={`${routes.SENSORS_GATEWAY}/gateway/add`}
        component={AddGateway}
      />
      <Route
        path={`${routes.SENSORS_GATEWAY}/gateway/edit/:id`}
        component={AddGateway}
      />
    </DashboardWrapper>
  );
}
export default Gateway;
