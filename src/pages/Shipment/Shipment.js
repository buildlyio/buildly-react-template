import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
  getFormattedRow,
  MAP_TOOLTIP,
  SHIPMENT_DATA_TABLE_TOOLTIP,
  SHIPMENT_SENSOR_COLUMNS,
} from "./ShipmentConstants";
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
  getAggregateReport,
  getSensorReportAlerts,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL, convertUnitsOfMeasure, getLocalDateTime } from "midgard/utils/utilMethods";
import {
  getShipmentDetails,
  deleteShipment,
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
import ShipmentSensorTable from "./components/ShipmentSensorTable";
import ShipmentDataTable from "./components/ShipmentDataTable";

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
  tabContainer: {
    backgroundColor: "#383636",
    margin: "0",
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
    custodyData,
    sensorData,
    aggregateReportData,
    loading,
    shipmentOptions,
    custodyOptions,
    sensorReportAlerts,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [activeRows, setActiveRows] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentFilter, setShipmentFilter] = useState("Active");
  const subNav = [
    { label: "Active", value: "Active" },
    { label: "Completed", value: "Completed" },
  ];
  const [selectedMarker, setSelectedMarker] = useState({});
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [tileView, setTileView] = useState(true);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails(organization));
    }
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
    if (!aggregateReportData) {
      dispatch(getAggregateReport(organization));
    }
    if (!sensorReportAlerts) {
      dispatch(getSensorReportAlerts(organization));
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
  }, []);

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      itemData &&
      aggregateReportData &&
      shipmentFlag
    ) {

      let formattedRows = getFormattedRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData,
        aggregateReportData,
      );
      setRows(formattedRows);
      let activeRows = formattedRows.filter((row) => {
        return row.type === "Active"
      });
      let completedRows = formattedRows.filter((row) => {
        return row.type === "Completed"
      });
      setActiveRows(activeRows);
      setCompletedRows(completedRows);
      if (!selectedShipment && formattedRows.length) {
        if (shipmentFilter === "Completed")
          setSelectedShipment(completedRows[0]);
        else
          setSelectedShipment(activeRows[0]);
      }
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData, aggregateReportData]);

  useEffect(() => {
    if (selectedShipment) {
      let markersToSet = [];
      let aggregateReportInfo = [];
      let temperatureUnit = unitsOfMeasure.filter((obj) => {
        return obj.supported_class === "Temperature";
      })[0]["name"].toLowerCase()
      selectedShipment.sensor_report.forEach((report) => {
        if (report.report_entries.length > 0) {
          const alert_status = report.excursion_flag ? "Excursion" : report.warning_flag ? "Warning" : "Normal";
          const color = report.excursion_flag ? "red" : report.warning_flag ? "yellow" : "green";
          report.report_entries.forEach((report_entry) => {
            try {
              const temperature = convertUnitsOfMeasure('celsius', report_entry.report_temp, temperatureUnit, 'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
              let localDateTime = getLocalDateTime(report_entry.report_location.timeOfPosition)
              if ("report_timestamp" in report_entry) {
                if (report_entry["report_timestamp"] !== null)
                    localDateTime = getLocalDateTime(report_entry["report_timestamp"])
              }
              if (report_entry.report_location.locationMethod !== "NoPosition") {
                const marker = {
                  lat: report_entry.report_location.latitude,
                  lng: report_entry.report_location.longitude,
                  label: 'Clustered',
                  temperature: temperature,
                  light: report_entry.report_light,
                  shock: report_entry.report_shock,
                  tilt: report_entry.report_tilt,
                  humidity: report_entry.report_humidity,
                  battery: report_entry.report_battery,
                  pressure: report_entry.report_pressure,
                  color: color,
                  timestamp: localDateTime,
                  alert_status: alert_status,
                }
                // Considered use case: If a shipment stays at some position for long, other value changes can be critical
                const markerFound = _.find(markersToSet, {
                  lat: marker.lat,
                  lng: marker.lng,
                  // temperature: marker.temperature,
                  // humidity: marker.humidity,
                });

                if (!markerFound) {
                  markersToSet.push(marker);
                }
                aggregateReportInfo.push(marker);
              }
            } catch (e) {
              console.log(e);
            }
          });
        }
      });
      setMarkers(_.orderBy(markersToSet, (item) => {return moment(item.timestamp)}, ['asc']));
      setZoomLevel(12);
      selectedShipment['sensor_report_info'] = aggregateReportInfo;
    }
  }, [selectedShipment]);

  useEffect(() => {
    if (markers && markers.length > 0)
      setTimeout(() => setMapLoaded(true), 1000)
  })

  useEffect(() => {
    if (shipmentFilter && rows.length > 0) {
      if (shipmentFilter === "Completed")
        setSelectedShipment(completedRows[0]);
      else
        setSelectedShipment(activeRows[0]);
    }
  }, [shipmentFilter])

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

  const filterTabClicked = (event, filter) => {
    setShipmentFilter(filter);
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
            <CustomizedTooltips toolTipText={SHIPMENT_DATA_TABLE_TOOLTIP} />
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
          <Box mb={3} className={classes.tabContainer}>
            <Tabs value={shipmentFilter} onChange={filterTabClicked}>
              {subNav.map((itemProps, index) => <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />)}
            </Tabs>
          </Box>
          <ShipmentDataTable
            rows={shipmentFilter === "Completed" ? completedRows : activeRows}
            editAction={handleEdit}
            deleteAction={handleDelete}
            setSelectedShipment={setSelectedShipment}
            tileView={tileView}
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            {
              selectedShipment
                ? (
                  <Typography
                    className={classes.tileHeading}
                    variant="h5">
                    {selectedShipment.name}
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
            showPath={true}
            markers={markers}
            googleMapURL={MAP_API_URL}
            zoom={zoomLevel}
            setSelectedMarker={setSelectedMarker}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `550px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
      </Grid>
      <ShipmentSensorTable
        aggregateReport={selectedShipment?.sensor_report_info}
        shipmentName={selectedShipment?.name}
        selectedMarker={selectedShipment && selectedMarker}
        cols={SHIPMENT_SENSOR_COLUMNS}
      />
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
