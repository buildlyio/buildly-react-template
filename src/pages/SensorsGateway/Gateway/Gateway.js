import React, { useState, useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { environment } from "environments/environment";
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
  GET_GATEWAY_OPTIONS,
  GET_GATEWAY_OPTIONS_FAILURE,
  GET_GATEWAY_OPTIONS_SUCCESS,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";
import { httpService } from "../../../modules/http/http.service";
import { UserContext } from "midgard/context/User.context";

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
    gatewayOptions,
    shipmentData,
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
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (data === null) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (gatewayOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}sensors/gateway/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_GATEWAY_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_GATEWAY_OPTIONS_FAILURE, error: err });
        });
    }
  }, []);

  useEffect(() => {
    if (
      data &&
      data.length &&
      gatewayTypeList &&
      gatewayTypeList.length &&
      shipmentData &&
      shipmentData.length
    ) {
      setRows(getFormattedRow(data, gatewayTypeList, shipmentData));
      setFilteredRows(getFormattedRow(data, gatewayTypeList, shipmentData));
    }
  }, [data, gatewayTypeList]);

  useEffect(() => {
    if (searchData) {
      setFilteredRows(searchData);
    }
  }, [searchData]);

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
    dispatch(deleteGateway(deleteGatewayId, organization));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    let searchFields = [
      "id",
      "name",
      // "gateway_uuid",
      "gateway_type_value",
      "last_known_battery_level",
      "gateway_status",
      "shipment",
      "activation_date",
    ];
    setSearchValue(e.target.value);
    dispatch(searchGatewayItem(e.target.value, rows, searchFields));
  };
  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.SENSORS_GATEWAY,
    });
  };
  return (
    <DashboardWrapper
      loading={loading}
      // onAddButtonClick={onAddButtonClick}
      dashboardHeading={"Gateway"}
      // addButtonHeading={"Add Gateway"}
      editAction={editGatewayAction}
      deleteAction={deleteGatewayAction}
      columns={gatewayColumns}
      rows={filteredRows}
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
