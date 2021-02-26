import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, List, ListItem, Typography, TextField, IconButton, Hidden } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MapComponent } from "../../components/MapComponent/MapComponent";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import _ from "lodash";

import { routes } from "../../routes/routesConstants";
import { environment } from "environments/environment";
import { UserContext } from "midgard/context/User.context";
import { MAP_API_URL, convertUnitsOfMeasure } from "midgard/utils/utilMethods";
import Loader from "midgard/components/Loader/Loader";
import { getShipmentOverview, SHIPMENT_OVERVIEW_COLUMNS, SHIPMENT_OVERVIEW_TOOL_TIP } from "./ReportingConstants";
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
  GET_CUSTODY_OPTIONS_SUCCESS,
  GET_CUSTODY_OPTIONS_FAILURE,
} from "midgard/redux/custodian/actions/custodian.actions";
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
  getSensorReport,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import {
  getShipmentDetails,
  deleteShipment,
  GET_SHIPMENT_OPTIONS_SUCCESS,
  GET_SHIPMENT_OPTIONS_FAILURE,
} from "midgard/redux/shipment/actions/shipment.actions";
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from "midgard/redux/items/actions/items.actions";
import { GraphComponent } from "../../components/GraphComponent/GraphComponent";
import { TempIcon, HumidIcon, LightIcon, BatteryIcon, PressureIcon, TiltIcon, ShockIcon } from "../../components/Icons/Icons";
import ShipmentSensorTable from "../Shipment/components/ShipmentSensorTable";
import CustomizedTooltips from "midgard/components/ToolTip/ToolTip";

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
  iconBar: {
    '& svg': {
      margin: "0 auto",
    }
  },
  infoSection: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    flexDirection: "column",
  },
}));

function Reporting(props) {
  const {
    dispatch,
    loading,
    sensorReportData,
    shipmentData,
    custodianData,
    custodyData,
    sensorData,
    contactInfo,
    unitsOfMeasure,
  } = props;

  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [isMapLoaded, setMapLoaded] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [tileView, setTileView] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState("temperature");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState({});

  const handleListItemClick = (event, index) => {
    setSelectedGraph(index);
  };

  const allData = _.range(0, 10, 0.001).map(x => ({
    x: x,
    y: Math.sin(Math.PI * x / 2) * x / 10
  }));

  const columns = SHIPMENT_OVERVIEW_COLUMNS.map(column => ({
    ...column,
  }));

  const getShipmentValue = (value) => {
    if (selectedShipment[value] !== null) {
      if (moment(selectedShipment[value], true).isValid()) {
        return moment(selectedShipment[value]).format("MM/DD/yyyy hh:mm:ss")
      }
      else if (typeof selectedShipment[value] !== 'object') {
        return selectedShipment[value]
      }
    }
    else {
      return 'NA'
    }
  }
  useEffect(() => {
    if (!shipmentData) {
      dispatch(getShipmentDetails(organization));
    }
    if (!sensorReportData) {
      dispatch(getSensorReport());
    }
    if (!custodianData) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
  }, []);

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      sensorReportData &&
      contactInfo
    ) {
      let overview = getShipmentOverview(
        shipmentData,
        custodianData,
        custodyData,
        sensorReportData,
        contactInfo,
      );
      setShipmentOverview(overview);
    }
  }, [shipmentData, custodianData, custodyData, sensorReportData]);

  useEffect(() => {
    if (selectedShipment) {
      let markersToSet = [];
      let temperatureUnit = unitsOfMeasure.filter((obj) => {
        return obj.supported_class === "Temperature";
      })[0]["name"].toLowerCase()
      let tempConst = temperatureUnit[0].toUpperCase()
      let index = 1;
      selectedShipment.sensor_report.forEach((report) => {
        if (report.report_location != null && Array.isArray(report.report_location)) {
          try {
            // data uses single quotes which throws an error
            const parsedLocation = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));
            const temperature = convertUnitsOfMeasure('celsius', report.report_temp, temperatureUnit, 'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
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

          } catch (e) {
            console.log(e);
          }
        }
      });
      setMarkers(markersToSet);
      setZoomLevel(12);
    }
  }, [selectedShipment]);

  useEffect(() => {
    if (markers && markers.length > 0)
      setTimeout(() => setMapLoaded(true), 1000)
  })

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <Typography className={classes.dashboardHeading} variant={"h4"}>
        Reporting
        </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <Typography
              className={classes.tileHeading}
              variant="h5">
              Graph View for {selectedShipment === null ? `Shipment` : selectedShipment.name}
              <CustomizedTooltips toolTipText={SHIPMENT_OVERVIEW_TOOL_TIP} />
            </Typography>
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
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <Autocomplete
              id="shipment-name"
              options={shipmentData}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              onChange={(event, newValue) => {
                setSelectedShipment(newValue);
              }}
              renderInput={(params) =>
                <TextField {...params}
                  label="Shipment Name"
                  variant="outlined"
                />}
            />
            <CustomizedTooltips toolTipText={SHIPMENT_OVERVIEW_TOOL_TIP} />
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
          <div style={{ padding: 20 }}>
            <Grid container spacing={4}>
              {selectedShipment ? (columns.map((column, index) => (
                <Grid item
                  className={classes.infoSection} xs={10} md={6}
                  key={`col${index}:${column.name}`}>
                  <Typography variant="subtitle1">{column.label}</Typography>
                  {column.name === "custody_info" && selectedShipment[column.name] ? (
                    <div>
                      <Typography variant="caption">{selectedShipment['contact_info']['name']}</Typography>
                      <Typography variant="caption">{selectedShipment['contact_info']['address']}</Typography>
                      <Typography variant="caption">{selectedShipment['contact_info']['email_address']}</Typography>
                      <Typography variant="caption">{selectedShipment['contact_info']['phone']}</Typography>
                    </div>
                  ) : (
                      <Typography variant="caption">
                        {getShipmentValue(column.name)}
                      </Typography>)}
                </Grid>
              ))) : (
                  <Typography variant="h6">
                    {SHIPMENT_OVERVIEW_TOOL_TIP}
                  </Typography>
                )}
            </Grid>
          </div>

        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={1} md={1}>
          <List component="nav" aria-label="main graph-type" className={classes.iconBar}>
            <ListItem
              button
              selected={selectedGraph === "temperature"}
              onClick={(event) => handleListItemClick(event, "temperature")}
            >
              <TempIcon color="#000" />
            </ListItem>
            <ListItem
              button
              selected={selectedGraph === "light"}
              onClick={(event) => handleListItemClick(event, "light")}
            >
              <LightIcon color="#000" />
            </ListItem>
            <ListItem
              button
              selected={selectedGraph === "shock"}
              onClick={(event) => handleListItemClick(event, "shock")}
            >
              <ShockIcon color="#000" />
            </ListItem>
            <ListItem
              button
              selected={selectedGraph === "tilt"}
              onClick={(event) => handleListItemClick(event, "tilt")}
            >
              <TiltIcon color="#000" />
            </ListItem>
            <ListItem
              button
              selected={selectedGraph === "humidity"}
              onClick={(event) => handleListItemClick(event, "humidity")}
            >
              <HumidIcon color="#000" />
            </ListItem>
            <ListItem
              button
              selected={selectedGraph === "battery"}
              onClick={(event) => handleListItemClick(event, "battery")}
            >
              <BatteryIcon color="#000" />
            </ListItem>
            <ListItem
              button
              selected={selectedGraph === "pressure"}
              onClick={(event) => handleListItemClick(event, "pressure")}
            >
              <PressureIcon color="#000" />
            </ListItem>
          </List>
        </Grid>
        {selectedShipment && (<Grid item xs={10} md={10}>
          <Typography
            className={classes.tileHeading}
            variant="h5">
            {selectedGraph}
          </Typography>
          {/* <GraphComponent
            data={selectedShipment.sensor_report[selectedGraph]}
            maxPoints={100} /> */}
        </Grid>)}
        <ShipmentSensorTable
          sensorReport={selectedShipment?.sensor_report}
          shipmentName={selectedShipment?.name}
        />
      </Grid>
    </Box>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.sensorsGatewayReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(Reporting);