import React, { useState, useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { environment } from "environments/environment";
import { sensorsColumns, getFormattedSensorRow } from "../Constants";
import DashboardWrapper from "../../../components/DashboardWrapper/DashboardWrapper";
import { routes } from "../../../routes/routesConstants";
import {
  getSensors,
  getSensorType,
  deleteSensor,
  searchSensorItem,
  GET_SENSOR_OPTIONS_SUCCESS,
  GET_SENSOR_OPTIONS_FAILURE,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";
import AddSensors from "../forms/AddSensors";
import { httpService } from "../../../modules/http/http.service";
import { UserContext } from "midgard/context/User.context";

function Sensors(props) {
  const {
    dispatch,
    history,
    location,
    data,
    loading,
    searchData,
    sensorTypeList,
    redirectTo,
    noSearch,
    gatewayData,
    sensorOptions,
  } = props;
  const addPath = redirectTo
    ? `${redirectTo}/sensors`
    : `${routes.SENSORS_GATEWAY}/sensor/add`;

  const editPath = redirectTo
    ? `${redirectTo}/sensors`
    : `${routes.SENSORS_GATEWAY}/sensor/edit`;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteSensorId, setDeleteSensorId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (data === null) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (sensorOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}sensors/sensor/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_SENSOR_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_SENSOR_OPTIONS_FAILURE, error: err });
        });
    }
  }, []);

  useEffect(() => {
    if (data && data.length && sensorTypeList && sensorTypeList.length) {
      setRows(getFormattedSensorRow(data, sensorTypeList, gatewayData));
      setFilteredRows(getFormattedSensorRow(data, sensorTypeList, gatewayData));
    }
  }, [data, sensorTypeList]);

  useEffect(() => {
    if (searchData) {
      setFilteredRows(searchData);
    }
  }, [searchData]);

  const editSensor = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.SENSORS_GATEWAY,
      data: item,
    });
  };
  const deleteSensorItem = (item) => {
    setDeleteSensorId(item.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    dispatch(deleteSensor(deleteSensorId, organization));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    let searchFields = [
      "id",
      "name",
      // "sensor_uuid",
      "activation_date",
      "sensor_type_value",
      "associated_gateway",
    ];
    setSearchValue(e.target.value);
    dispatch(searchSensorItem(e.target.value, rows, searchFields));
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
      dashboardHeading={"Sensors"}
      // addButtonHeading={"Add Sensor"}
      editAction={editSensor}
      deleteAction={deleteSensorItem}
      columns={sensorsColumns}
      redirectTo={redirectTo}
      rows={filteredRows}
      hasSearch={noSearch ? false : true}
      search={{ searchValue, searchAction: searchTable }}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to Delete this Sensor?"}
    >
      <Route path={`${addPath}`} component={AddSensors} />
      <Route path={`${editPath}/:id`} component={AddSensors} />
    </DashboardWrapper>
  );
}
export default Sensors;
