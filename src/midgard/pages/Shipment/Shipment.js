import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { MapComponent } from "../../components/MapComponent/MapComponent";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import {
  SHIPMENT_COLUMNS,
  getFormattedRow,
  svgIcon,
  MAP_TOOLTIP,
  SHIPMENT_LIST_TOOLTIP
} from "./ShipmentConstants";
import ShipmentList from "./components/ShipmentList";
import { routes } from "../../routes/routesConstants";
import { Route } from "react-router-dom";
import AddShipment from "./forms/AddShipment";
import AddOriginInfo from "./forms/AddOriginInfo";
import AddShipperInfo from "./forms/AddShipperInfo";
import AddDestinationInfo from "./forms/AddDestinationInfo";
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
  GET_CUSTODY_OPTIONS_SUCCESS,
  GET_CUSTODY_OPTIONS_FAILURE,
} from "midgard/redux/custodian/actions/custodian.actions";
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from "midgard/redux/items/actions/items.actions";
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
  getSensorReport,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL, convertUnitsOfMeasure } from "midgard/utils/utilMethods";
import {
  getShipmentDetails,
  deleteShipment,
  FILTER_SHIPMENT_SUCCESS,
  GET_SHIPMENT_OPTIONS_SUCCESS,
  GET_SHIPMENT_OPTIONS_FAILURE,
} from "midgard/redux/shipment/actions/shipment.actions";
import ConfirmModal from "midgard/components/Modal/ConfirmModal";
import AlertInfo from "./AlertInfo";
import Loader from "midgard/components/Loader/Loader";
import CustomizedTooltips from "midgard/components/ToolTip/ToolTip";
import { httpService } from "midgard/modules/http/http.service";
import { environment } from "environments/environment";
import { UserContext } from "midgard/context/User.context";
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
  tileHeading: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: "uppercase",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
  },
  addButton: {
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
    },
  },
  switchViewSection: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  menuButton: {
    marginLeft: "auto",
  },
}));

function Shipment(props) {
  const {
    shipmentData,
    history,
    custodianData,
    dispatch,
    itemData,
    gatewayData,
    shipmentFlag,
    unitsOfMeasure,
    filteredData,
    custodyData,
    sensorData,
    sensorReportData,
    loading,
    shipmentOptions,
    custodyOptions,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [mapShipmentFilter, setMapShipmentFilter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [zoomLevel,setZoomLevel] = useState(5);
  const [tileView, setTileView] = useState(true);
  const [isMapLoaded,setMapLoaded] = useState(false);
  let routesInfo = [];
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails(organization));
    }
    // if (!shipmentFlag) {
    //   dispatch(getShipmentFlag());
    // }
    if (custodianData === null) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (itemData === null) {
      dispatch(getItems(organization));
      dispatch(getItemType(organization));
    }
    if (gatewayData === null) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (!sensorReportData) {
      dispatch(getSensorReport());
    }
    if (shipmentOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}shipment/shipment/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_SHIPMENT_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_SHIPMENT_OPTIONS_FAILURE, error: err });
        });
    }

    if (custodyOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}custodian/custody/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_CUSTODY_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_CUSTODY_OPTIONS_FAILURE, error: err });
        });
    }

    return function cleanup() {
      dispatch({ type: FILTER_SHIPMENT_SUCCESS, data: undefined });
    };
  }, []);

  const returnIcon = (row) => {
    let flagType = "";
    let flag = "";
    let shipmentFlags = row.flag_list;
    if (shipmentFlags && shipmentFlags.length) {
      flagType = shipmentFlags[0].type;
      flag = shipmentFlags[0].name;
    }
    return svgIcon(flagType, flag);
  };

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      itemData &&
      sensorReportData &&
      shipmentFlag
    ) {
      routesInfo = [];
      let formattedRows = getFormattedRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData,
        sensorReportData
      );
      // formattedRows.forEach((row) => {
      //   if (row.custody_info && row.custody_info.length > 0) {
      //     row.custody_info.forEach((custody) => {
      //       if (
      //         (custody.has_current_custody || custody.first_custody) &&
      //         (row.status.toLowerCase() === "planned" ||
      //           row.status.toLowerCase() === "enroute")
      //       ) {
      //         if (custody.start_of_custody_location) {
      //           routesInfo.push({
      //             lat:
      //               custody.start_of_custody_location &&
      //               parseFloat(custody.start_of_custody_location.split(",")[0]),
      //             lng:
      //               custody.start_of_custody_location &&
      //               parseFloat(custody.start_of_custody_location.split(",")[1]),
      //             label: `${row.name}:${row.shipment_uuid}(Start Location)`,
      //             icon: returnIcon(row),
      //           });
      //         }
      //         if (custody.end_of_custody_location) {
      //           routesInfo.push({
      //             lat:
      //               custody.end_of_custody_location &&
      //               parseFloat(custody.end_of_custody_location.split(",")[0]),
      //             lng:
      //               custody.end_of_custody_location &&
      //               parseFloat(custody.end_of_custody_location.split(",")[1]),
      //             label: `${row.name}:${row.shipment_uuid}(End Location)`,
      //             icon: returnIcon(row),
      //           });
      //         }
      //       }
      //     });
      //   }


        // if (row.sensor_report && row.sensor_report.length > 0) {
        //   row.sensor_report.forEach((report) => {
        //     if (report.report_location != null && Array.isArray(report.report_location)) {
        //       try {
        //         // data uses single quotes which throws an error
        //         const parsedLocation = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));
        //         // console.log('Lat Long: ', parsedLocation);
        //       } catch(e) {
        //         console.log(e);
        //       }
        //     }
        //   });
        // }



      // });
      // setMarkers(routesInfo);
      setRows(formattedRows);
      setFilteredRows(formattedRows);
      if (!mapShipmentFilter && formattedRows.length) {
        setMapShipmentFilter(formattedRows[0])
      }
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData, sensorReportData]);

  useEffect(() => {
    if (filteredData && filteredData.length >= 0) {
      setFilteredRows(filteredData);
    }
  }, [filteredData]);

  useEffect(() => {
    if (mapShipmentFilter) {
      let markersToSet = [];
      let temperatureUnit = unitsOfMeasure.filter((obj) => {
        return obj.supported_class === "Temperature";
      })[0]["name"].toLowerCase()
      let tempConst = temperatureUnit[0].toUpperCase()
      let sampleLocationData = [
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/3278/",
          "id": 3278,
          "report_uuid": "fbfc22fe-bdab-493b-8670-4f94caadc480",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "21.5",
          "report_humidity": "39",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.604967, 'longitude': -122.059516, 'altitude': 79.5, 'positionUncertainty': 47.423622, 'locationMethod': 'GPS', 'timeOfPosition': 1613114116490}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-12T07:17:02.780879Z",
          "edit_date": "2021-02-12T07:17:02.780888Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1743/",
          "id": 1743,
          "report_uuid": "252171c3-fba7-49a5-bfc9-dd95704c3540",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.6",
          "report_humidity": "48",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.605091, 'longitude': -122.059825, 'altitude': 66.1, 'positionUncertainty': 53.15073, 'locationMethod': 'GPS', 'timeOfPosition': 1612178142786}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T11:30:00.690088Z",
          "edit_date": "2021-02-01T11:30:00.690097Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1744/",
          "id": 1744,
          "report_uuid": "ed73c6c4-d702-4c94-a8a9-a6691e71af69",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.5",
          "report_humidity": "48",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.604944, 'longitude': -122.059725, 'altitude': 137.9, 'positionUncertainty': 31.890438, 'locationMethod': 'GPS', 'timeOfPosition': 1612179040967}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T11:45:00.627719Z",
          "edit_date": "2021-02-01T11:45:00.627728Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1745/",
          "id": 1745,
          "report_uuid": "f91c1655-4e88-452c-88e3-f4bc05770791",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.4",
          "report_humidity": "49",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.605049, 'longitude': -122.059656, 'altitude': 107.8, 'positionUncertainty': 41.617306, 'locationMethod': 'GPS', 'timeOfPosition': 1612179980123}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T12:00:00.691841Z",
          "edit_date": "2021-02-01T12:00:00.691852Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1746/",
          "id": 1746,
          "report_uuid": "56dd1801-3af0-4789-a3c5-642c30e56907",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.4",
          "report_humidity": "47",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.604828, 'longitude': -122.059612, 'altitude': 107.5, 'positionUncertainty': 34.713108, 'locationMethod': 'GPS', 'timeOfPosition': 1612180845319}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T12:15:00.619211Z",
          "edit_date": "2021-02-01T12:15:00.619220Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1747/",
          "id": 1747,
          "report_uuid": "1d04d168-7900-4136-acc4-60a1e3ea3625",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.3",
          "report_humidity": "47",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.605227, 'longitude': -122.059882, 'altitude': 84, 'positionUncertainty': 56.859474, 'locationMethod': 'GPS', 'timeOfPosition': 1612181766424}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T12:30:00.698845Z",
          "edit_date": "2021-02-01T12:30:00.698853Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1748/",
          "id": 1748,
          "report_uuid": "3012fb9b-fc5c-4704-9f95-3474ba7bb6a2",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.3",
          "report_humidity": "48",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.604852, 'longitude': -122.059576, 'altitude': 110.3, 'positionUncertainty': 35.805027, 'locationMethod': 'GPS', 'timeOfPosition': 1612182649596}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T12:45:00.620736Z",
          "edit_date": "2021-02-01T12:45:00.620746Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1749/",
          "id": 1749,
          "report_uuid": "2bf5e6e5-35af-4066-88b7-88823d459533",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.2",
          "report_humidity": "48",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.605115, 'longitude': -122.05955, 'altitude': 47.8, 'positionUncertainty': 59.5063, 'locationMethod': 'GPS', 'timeOfPosition': 1612183565677}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T13:00:00.680729Z",
          "edit_date": "2021-02-01T13:00:00.680738Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        },
        {
          "url": "http://tp-dev-sensors.buildly.io/sensor_report/1750/",
          "id": 1750,
          "report_uuid": "04b6428b-899c-48a5-8209-8ab26dfa1b24",
          "shipment_id": [
            "120"
          ],
          "custodian_id": null,
          "excursion_flag": false,
          "warning_flag": false,
          "mac_address": null,
          "activation_date": null,
          "report_temp": "20.2",
          "report_humidity": "48",
          "report_frequency": null,
          "report_location": [
            "{'latitude': 47.604972, 'longitude': -122.059515, 'altitude': 102.3, 'positionUncertainty': 35.510563, 'locationMethod': 'GPS', 'timeOfPosition': 1612184440882}"
          ],
          "report_date_time": null,
          "create_date": "2021-02-01T13:15:00.657987Z",
          "edit_date": "2021-02-01T13:15:00.657997Z",
          "organization_uuid": null,
          "sensor": null,
          "gateway": "http://tp-dev-sensors.buildly.io/gateway/51/"
        }
      ]
      sampleLocationData.forEach((report) => {
      // mapShipmentFilter.sensor_report.forEach((report) => {
        if (report.report_location != null && Array.isArray(report.report_location)) {
          try {
            // data uses single quotes which throws an error
            const parsedLocation = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));
            const temperature = convertUnitsOfMeasure('celsius',report.report_temp,temperatureUnit,'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
            const humidity = report.report_humidity;
            const color = report.excursion_flag ? "red" : report.warning_flag ? "yellow" : "green";
            const marker = {
              lat: parsedLocation && parsedLocation.latitude,
              lng: parsedLocation && parsedLocation.longitude,
              label: parsedLocation && `Temperature: ${temperature}\u00b0${tempConst}, Humidity: ${humidity}% recorded at ${moment(parsedLocation.timeOfPosition).format('llll')}`,
              temp: temperature,
              humidity: humidity,
              color: color,
            }
            // Skip a marker on map only if temperature, humidity and lat long are all same.
            // Considered use case: If a shipment stays at some position for long, temperature and humidity changes can be critical
            const markerFound = markersToSet.some(pointer => (pointer.temperature === marker.temperature &&
              pointer.humidity === marker.humidity && pointer.lat === marker.lat && pointer.lng === marker.lng))
            if (!markerFound) {
              markersToSet.push(marker);
            }

          } catch(e) {
            console.log(e);
          }
        }
      });
      setMarkers(markersToSet);
      setZoomLevel(12);
    }
  }, [mapShipmentFilter]);

  useEffect(() => {
    if(markers && markers.length > 0)
    setTimeout(() => setMapLoaded(true), 3000)
  })
  const onAddButtonClick = () => {
    history.push(`${routes.SHIPMENT}/add`, {
      from: routes.SHIPMENT,
    });
  };

  const handleEdit = (item) => {
    // dispatch(saveShipmentFormData(item));
    history.push(`${routes.SHIPMENT}/edit/:${item.id}`, {
      type: "edit",
      data: item,
      from: routes.SHIPMENT,
    });
  };
  const handleDelete = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteShipment(deleteItemId, organization));
    setConfirmModal(false);
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <AlertInfo {...props} />
      <Box mb={3} mt={2}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.addButton}
          onClick={onAddButtonClick}
        >
          <AddIcon /> {"Add Shipment"}
        </Button>
      </Box>
      <Typography className={classes.dashboardHeading} variant={"h4"}>
        Shipments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <CustomizedTooltips toolTipText={SHIPMENT_LIST_TOOLTIP} />
            <Hidden smDown>
              <IconButton
                className={classes.menuButton}
                onClick={() => setTileView(!tileView)}
                color="default"
                aria-label="menu"
              >
                {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
              </IconButton>
            </Hidden>
          </div>
          <ShipmentList
            rows={rows}
            filteredRows={filteredRows}
            columns={SHIPMENT_COLUMNS}
            hasSearch={true}
            searchValue={""}
            dispatch={dispatch}
            editAction={handleEdit}
            deleteAction={handleDelete}
            hasSort={true}
            mapShipmentFilter={mapShipmentFilter}
            setMapShipmentFilter={setMapShipmentFilter}
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            {
              mapShipmentFilter
              ? (
                <Typography
                  className={classes.tileHeading}
                  variant="h5">
                  {mapShipmentFilter.name}
                  <CustomizedTooltips toolTipText={MAP_TOOLTIP} />
                </Typography>
              )
              : (<CustomizedTooltips toolTipText={MAP_TOOLTIP} />)
            }
            <Hidden smDown>
              <IconButton
                className={classes.menuButton}
                onClick={() => setTileView(!tileView)}
                color="default"
                aria-label="menu"
              >
                {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
              </IconButton>
            </Hidden>
          </div>
          <MapComponent
            isMarkerShown={isMapLoaded}
            markers={markers}
            googleMapURL={MAP_API_URL}
            zoom={zoomLevel}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `550px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
      </Grid>
      <Route path={`${routes.SHIPMENT}/add`} component={AddShipment} />
      <Route path={`${routes.SHIPMENT}/add/origin`} component={AddOriginInfo} />
      <Route
        path={`${routes.SHIPMENT}/add/shipper`}
        component={AddShipperInfo}
      />
      <Route
        path={`${routes.SHIPMENT}/add/destination`}
        component={AddDestinationInfo}
      />
      <Route path={`${routes.SHIPMENT}/edit/:id`} component={AddShipment} />
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={"Are You sure you want to Delete this Shipment? The shipment will be ended in other platforms"}
        submitText={"Delete"}
      />
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(Shipment);
