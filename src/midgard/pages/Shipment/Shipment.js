import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import _ from "lodash";
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
  getSensorReport,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL, convertUnitsOfMeasure } from "midgard/utils/utilMethods";
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
import moment from 'moment';
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
    sensorReportData,
    loading,
    shipmentOptions,
    custodyOptions,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
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
  }, []);

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      itemData &&
      sensorReportData &&
      shipmentFlag
    ) {

      let formattedRows = getFormattedRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData,
        sensorReportData,
        "active",
      );
      setRows(formattedRows);
      if (!selectedShipment && formattedRows.length) {
        setSelectedShipment(formattedRows[0])
      }
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData, sensorReportData]);

  useEffect(() => {
    if (selectedShipment) {
      let markersToSet = [];
      let temperatureUnit = unitsOfMeasure.filter((obj) => {
        return obj.supported_class === "Temperature";
      })[0]["name"].toLowerCase()
      let tempConst = temperatureUnit[0].toUpperCase()
      let index = 1;
      selectedShipment.sensor_report.forEach((report) => {
        if (report.report_entry != null && typeof(report.report_entry) == 'object') {
          try {
            const report_entry = report.report_entry;
            const parsedLocation = report_entry.report_location;
            const temperature = convertUnitsOfMeasure('celsius',report_entry.report_temp,temperatureUnit,'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
            const humidity = report_entry.report_humidity;
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
            const markerFound = _.find(markersToSet, {
              temp: marker.temp,
              humidity: marker.humidity,
              lat: marker.lat,
              lng: marker.lng,
            });
            if (!markerFound) {
              markersToSet.push(marker);
              index++;
            }

          } catch(e) {
            console.log(e);
          }
        }
      });
      setMarkers(markersToSet);
      setZoomLevel(12);
    }
  }, [selectedShipment]);

  useEffect(() => {
    if(markers && markers.length > 0)
    setTimeout(() => setMapLoaded(true), 1000)
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
          <ShipmentDataTable
            rows={rows}
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
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `550px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
      </Grid>
      <ShipmentSensorTable
        sensorReport={selectedShipment?.sensor_report}
        shipmentName={selectedShipment?.name}
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
