import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MapComponent } from "../../components/MapComponent/MapComponent";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import _ from "lodash";

import { routes } from "../../routes/routesConstants";
import { environment } from "environments/environment";
import { UserContext } from "midgard/context/User.context";
import { MAP_API_URL, convertUnitsOfMeasure } from "midgard/utils/utilMethods";
import Loader from "midgard/components/Loader/Loader";
import {
  getFormattedRow,
  MAP_TOOLTIP,
  SHIPMENT_DATA_TABLE_TOOLTIP,
} from "../Shipment/ShipmentConstants";
import {
  getShipmentDetails
} from "midgard/redux/shipment/actions/shipment.actions";
import { getSensorReport } from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import { GraphComponent } from "../../components/GraphComponent/GraphComponent";
import { TempIcon, HumidIcon, LightIcon, BatteryIcon, PressureIcon, TiltIcon, ShockIcon } from "../../components/Icons/Icons";

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
}));

function Reporting(props) {
  const {
    dispatch,
    history,
    location,
    itemData,
    loading,
    loaded,
    error,
    sensorReportData,
    shipmentData,
  } = props;

  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [isMapLoaded, setMapLoaded] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [tileView, setTileView] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState("temperature");
  const [selectedShipment, setSelectedShipment] = useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedGraph(index);
  };

  const allData = _.range(0, 10, 0.001).map(x => ({
    x: x,
    y: Math.sin(Math.PI * x / 2) * x / 10
  }));

  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails(organization));
    }
    if (sensorReportData === null) {
      dispatch(getSensorReport());
    }
  });

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
              Graph View for {selectedShipment === null ? `Shipment` :selectedShipment.name}
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
              name="shipment-name"
              autoComplete="shipment-name"
              onChange={(event, newValue) => {
                setSelectedShipment(newValue);
              }}
              renderInput={(params) =>
                <TextField {...params}
                label="Shipment Name"
                variant="outlined"
                />}
            />
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
          <div>
            <div>
              <Typography>Shipment Status:</Typography>
              <Typography>Enroute</Typography>
            </div>
            <div>
              <Typography>Pickup Adress:</Typography>
              <Typography>some blvd portland OR 97124 US</Typography>
            </div>
            <div>
              <Typography>Earliest Pickup Date:</Typography>
              <Typography>2025-05-14 08:00:00</Typography>
            </div>
            <div>
              <Typography>Delivery Adress:</Typography>
              <Typography>some blvd portland OR 97124 US</Typography>
            </div>
            <div>
              <Typography>Delivery Date:</Typography>
              <Typography>2025-05-15 08:00:00</Typography>
            </div>
            <div>
              <Typography>Customer Name:</Typography>
              <Typography>James Bond</Typography>
            </div>
            <div>
              <Typography>Customer Email:</Typography>
              <Typography>JamesBond@mi6.co.uk</Typography>
            </div>
            <div>
              <Typography>ETA: TBD</Typography>
            </div>
            <div>
              <Typography>Shipping Units: 1</Typography>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={1} md={1}>
          {/* <div */}
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
        <Grid item xs={10} md={10}>
          <Typography
            className={classes.tileHeading}
            variant="h5">
            {selectedGraph}
          </Typography>
          <GraphComponent
            data={allData}
            maxPoints={100} />
        </Grid>
      </Grid>
    </Box>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(Reporting);