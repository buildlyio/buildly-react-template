import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, List, ListItem, Typography, TextField, IconButton, Hidden, } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MapComponent } from "../../components/MapComponent/MapComponent";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import _ from "lodash";

import { UserContext } from "midgard/context/User.context";
import { MAP_API_URL } from "midgard/utils/utilMethods";
import Loader from "midgard/components/Loader/Loader";
import {
  getShipmentOverview,
  SHIPMENT_OVERVIEW_COLUMNS,
  SHIPMENT_OVERVIEW_TOOL_TIP,
  REPORT_TYPES,
  getIcon,
} from "./ReportingConstants";
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
} from "midgard/redux/custodian/actions/custodian.actions";
import {
  getSensors,
  getSensorType,
  getAggregateReport,
  getSensorReportAlerts,
} from "midgard/redux/sensorsGateway/actions/sensorsGateway.actions";
import {
  getShipmentDetails,
} from "midgard/redux/shipment/actions/shipment.actions";
import {
  getUnitsOfMeasure,
} from "midgard/redux/items/actions/items.actions";
import { GraphComponent } from "../../components/GraphComponent/GraphComponent";
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
  dropDownSection: {
    padding: theme.spacing(1, 2),
    width: "100%",
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
    height: "100px",
  },
  gridContainer: {
    marginBottom: theme.spacing(4),
  },
  greyBackground: {
    backgroundColor: "#424242",
  },
  alignCenter: {
    marginLeft: "auto",
    marginRight: "auto",
  }
}));

function Reporting(props) {
  const {
    dispatch,
    loading,
    aggregateReportData,
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
  const [shipment,setShipment] = useState("");
  const [shipmentOverview, setShipmentOverview] = useState({});
  const [selectedMarker, setSelectedMarker] = useState({});

  const handleListItemClick = (event, index) => {
    setSelectedGraph(index);
  };

  const columns = SHIPMENT_OVERVIEW_COLUMNS.map(column => ({
    ...column,
  }));

  const getShipmentValue = (value) => {
    if (selectedShipment[value] !== null) {
      if (moment(selectedShipment[value], true).isValid()) {
        return moment(selectedShipment[value]).format("MMMM DD, YYYY hh:mm:ss")
      }
      else if (typeof (selectedShipment[value]) !== 'object') {
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
    if (!aggregateReportData) {
      dispatch(getAggregateReport(organization));
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
      aggregateReportData &&
      contactInfo &&
      unitsOfMeasure
    ) {
      let overview = getShipmentOverview(
        shipmentData,
        custodianData,
        custodyData,
        aggregateReportData,
        contactInfo,
        unitsOfMeasure,
      );
      setShipmentOverview(overview);

      if (!selectedShipment && overview.length) {
        setSelectedShipment(overview[0]);
      }
    }
  }, [shipmentData, custodianData, custodyData, aggregateReportData]);

  useEffect(() => {
    if (selectedShipment) {
      setShipment(selectedShipment.name);
      setMarkers(selectedShipment['markers_to_set']);
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
        <Grid item xs={12} md={tileView ? 6 : 12} className={classes.gridContainer}>
          <div className={classes.switchViewSection}>
            <Typography
              className={classes.tileHeading}
              variant="h5">
              {selectedShipment && selectedShipment.name &&
                `Map View - Shipment: ${selectedShipment.name}`}
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
            setSelectedMarker={setSelectedMarker}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `550px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <Autocomplete
              id="shipment-name"
              options={shipmentData || []}
              value={{name: shipment}}
              getOptionLabel={(option) => option && option.name}
              className={classes.dropDownSection}
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
          <div style={{ height: 525, overflowX: "auto" }} className={classes.greyBackground}>
            <Grid container className={classes.gridContainer}>
              {selectedShipment ? (columns.map((column, index) => (
                <Grid item
                  className={classes.infoSection} xs={10} md={6}
                  key={`col${index}:${column.name}`}>
                  {column.name !== "custody_info" ?
                  (<Typography variant="h6">{column.label}</Typography>) :
                  (<Typography variant="h6">Custody Details</Typography>)}
                  {column.name === "custody_info"  && selectedShipment[column.name] ? selectedShipment[column.name].map((key, index) => (
                    <div key={`custody_info_${index}`} style={{marginBottom:10, color: selectedShipment['custody_info'][index]['custody_type'] === 'Current' ? '#EBC645' : '#ffffff'}}>
                      <Typography variant="body1">Custody Type: {selectedShipment['custody_info'][index]['custody_type']}</Typography>
                      <Typography variant="body1">Custodian Address: {selectedShipment['contact_info'][index]['address']}</Typography>
                      </div>
                  )) : (
                      <Typography variant="body1">
                        {getShipmentValue(column.name)}
                      </Typography>)}
                </Grid>
              ))) : (
                  <Typography variant="h6" className={classes.alignCenter}>
                    {SHIPMENT_OVERVIEW_TOOL_TIP}
                  </Typography>
                )}
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid container className={classes.gridContainer + ' ' + classes.greyBackground}>
        <div className={classes.switchViewSection}>
          <Typography
            className={classes.tileHeading}
            variant="h5">
            {selectedShipment && selectedShipment.name &&
              `Graph View - Shipment: ${selectedShipment.name}`}
            <CustomizedTooltips toolTipText={SHIPMENT_OVERVIEW_TOOL_TIP} />
          </Typography>
        </div>
        <Grid item xs={1} md={1}>
          <List component="nav" aria-label="main graph-type" className={classes.iconBar}>
            {REPORT_TYPES.map((item, index) => (
              <React.Fragment key={`iconItem${index}${item.id}`}>
                <ListItem
                  button
                  selected={selectedGraph === item.id}
                  onClick={(event) => handleListItemClick(event, item.id)}
                >
                  {getIcon(item,'white')}
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} md={10}>
          {selectedShipment && selectedShipment[selectedGraph] ? (
            <GraphComponent
              data={selectedShipment[selectedGraph]}
              selectedGraph={selectedGraph} />) : (
              <Typography variant="h6" className={classes.alignCenter}>
                {SHIPMENT_OVERVIEW_TOOL_TIP}
              </Typography>
            )}
        </Grid>
        </Grid>
        <ShipmentSensorTable
          aggregateReport={selectedShipment?.sensor_report}
          shipmentName={selectedShipment?.name}
          selectedMarker={selectedShipment && selectedMarker}
        />
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