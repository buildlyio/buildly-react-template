import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { routes } from "../../routes/routesConstants";
import { environment } from "environments/environment";
import { httpService } from "../../modules/http/http.service";
import { UserContext } from "midgard/context/User.context";

import _ from "lodash";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { MapComponent } from "../../components/MapComponent/MapComponent";
import CustomizedTooltips from "midgard/components/ToolTip/ToolTip";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import { MAP_API_URL, convertUnitsOfMeasure } from "midgard/utils/utilMethods";
import Loader from "midgard/components/Loader/Loader";
import {
  getFormattedRow,
  MAP_TOOLTIP,
  SHIPMENT_DATA_TABLE_TOOLTIP,
} from "../Shipment/ShipmentConstants";
import { GraphComponent } from "../../components/GraphComponent/GraphComponent";
import { TempIcon, HumidIcon, LightIcon, BatteryIcon, PressureIcon, TiltIcon, ShockIcon} from "../../components/Icons/Icons";
const useStyles = makeStyles((theme) => ({
  grid: {
    backgroundColor: "#fff",
  },
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
  graphContainer: {
    height:"400px",
  }
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
  } = props;

  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;
  const [isMapLoaded, setMapLoaded] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [tileView, setTileView] = useState(true);
  const [selectedGraph,setSelectedGraph] = useState("temperature");
  // const [selectedShipment, setSelectedShipment] = useState("Graph View for ID: 135");

  const handleListItemClick = (event, index) => {
    setSelectedGraph(index);
  };
  const allData = _.range(0, 10, 0.001).map(x => ({
    x: x,
    y: Math.sin(Math.PI*x/2) * x / 10
  }));

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
              Graph View for ID: 135
        </Typography>
            {/* {
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
            } */}
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
            {/* <CustomizedTooltips toolTipText={SHIPMENT_DATA_TABLE_TOOLTIP} /> */}
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
          <TempIcon color="#000"/>
        </ListItem>
        <ListItem
          button
          selected={selectedGraph === "light"}
          onClick={(event) => handleListItemClick(event, "light")}
        >
          <LightIcon color="#000"/>
        </ListItem>
        <ListItem
          button
          selected={selectedGraph === "shock"}
          onClick={(event) => handleListItemClick(event, "shock")}
        >
          <ShockIcon color="#000"/>
        </ListItem>
        <ListItem
          button
          selected={selectedGraph === "tilt"}
          onClick={(event) => handleListItemClick(event, "tilt")}
        >
          <TiltIcon color="#000"/>
        </ListItem>
        <ListItem
          button
          selected={selectedGraph === "humidity"}
          onClick={(event) => handleListItemClick(event, "humidity")}
        >
          <HumidIcon color="#000"/>
        </ListItem>
        <ListItem
          button
          selected={selectedGraph === "battery"}
          onClick={(event) => handleListItemClick(event, "battery")}
        >
          <BatteryIcon color="#000"/>
        </ListItem>
        <ListItem
          button
          selected={selectedGraph === "pressure"}
          onClick={(event) => handleListItemClick(event, "pressure")}
        >
          <PressureIcon color="#000"/>
        </ListItem>
        </List>
        </Grid>
        <Grid item xs={10} md={10}>
        <Typography
            className={classes.tileHeading}
            variant="h5">
            {selectedGraph}
        </Typography>
        <GraphComponent data={allData} maxPoints={100} className={classes.graphContainer}/>
        </Grid>
      </Grid>
    </Box>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(Reporting);