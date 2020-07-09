import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DataTable from "../../components/Table/Table";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import { MapComponent } from "../../components/MapComponent/MapComponent";
import { numberWithCommas, MAP_API_URL } from "../../utils/utilMethods";
import { RECALL_DATA, DELAY_DATA } from "../../utils/mock";
import { HumidIcon } from "../../components/Icons/Icons";
import {
  getShipmentDetails,
  getShipmentFlag,
} from "../../redux/shipment/actions/shipment.actions";
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
} from "../../redux/custodian/actions/custodian.actions";
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from "../../redux/items/actions/items.actions";
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
} from "../../redux/sensorsGateway/actions/sensorsGateway.actions";
import { getFormattedRow, svgIcon } from "../Shipment/ShipmentConstants";
import {
  recallColumns,
  delayColumns,
  getFormattedShipmentRow,
} from "./DashboardConstants";

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
  },
  tileView: {
    display: "flex",
  },
  rowView: {
    display: "flex",
    flexDirection: "column",
  },
  switchViewSection: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  tileHeading: {
    flex: 1,
    padding: "8px",
  },
}));

/**
 * The current oauth user.
 */
let user = JSON.parse(localStorage.getItem("currentUser"));

/**
 * Outputs the profile page for the user.
 */
function Dashboard(props) {
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
    loading,
  } = props;
  const [tileView, setTileView] = useState(true);
  let classes = useStyles();
  const [delayedRows, setDelayedRows] = useState([]);
  const [excursionRows, setExcursionRows] = useState([]);
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails());
    }
    if (!shipmentFlag) {
      dispatch(getShipmentFlag());
    }
    if (custodianData === null) {
      dispatch(getCustodians());
      dispatch(getCustodianType());
      dispatch(getContact());
    }
    if (itemData === null) {
      dispatch(getItems());
      dispatch(getItemType());
    }
    if (gatewayData === null) {
      dispatch(getGateways());
      dispatch(getGatewayType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors());
      dispatch(getSensorType());
    }
  }, []);

  const returnIcon = (row) => {
    let flagType = row.flag_type;
    let flag = row.shipment_flag;
    return svgIcon(flagType, flag);
  };

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      itemData &&
      shipmentFlag
    ) {
      let routesInfo = [];
      let delayedInfo = [];
      let excursionInfo = [];
      let formattedRow = getFormattedShipmentRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData
      );
      formattedRow.forEach((row) => {
        if (row.custody_info && row.custody_info.length > 0) {
          row.custody_info.forEach((custody) => {
            if (
              custody.has_current_custody &&
              row.status.toLowerCase() === "enroute"
            ) {
              if (custody.start_of_custody_location) {
                routesInfo.push({
                  lat:
                    custody.start_of_custody_location &&
                    parseFloat(custody.start_of_custody_location.split(",")[0]),
                  lng:
                    custody.start_of_custody_location &&
                    parseFloat(custody.start_of_custody_location.split(",")[1]),
                  label: `${row.name}:${row.shipment_uuid}(Start Location)`,
                  excursion_name: row.shipment_flag,
                  excursion_type: row.flag_type,
                  icon: returnIcon(row),
                });
              }
              if (custody.end_of_custody_location) {
                routesInfo.push({
                  lat:
                    custody.end_of_custody_location &&
                    parseFloat(custody.end_of_custody_location.split(",")[0]),
                  lng:
                    custody.end_of_custody_location &&
                    parseFloat(custody.end_of_custody_location.split(",")[1]),
                  label: `${row.name}:${row.shipment_uuid}(End Location)`,
                  excursion_name: row.shipment_flag,
                  excursion_type: row.flag_type,
                  icon: returnIcon(row),
                });
              }
            }
          });
        }
        if (row.shipment_flag && row.shipment_flag.toLowerCase() === "delay") {
          delayedInfo.push(row);
        }
        if (
          row.shipment_flag &&
          ["temperature", "humidity", "recall"].indexOf(
            row.shipment_flag.toLowerCase()
          ) !== -1
        ) {
          excursionInfo.push(row);
        }
      });
      setMarkers(routesInfo);
      setDelayedRows(delayedInfo);
      setExcursionRows(excursionInfo);
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData]);

  return (
    <Box mt={3}>
      <div className={classes.dashboardContainer}>
        <Typography className={classes.dashboardHeading} variant={"h4"}>
          Producer Dashboard
        </Typography>
        <Box mt={3} mb={4}>
          <Grid container className={classes.root} spacing={2}>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant={"h4"}>{"-"}</Typography>
                <Typography variant={"subtitle2"}>Items in transit</Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant={"h4"}>{"-"}</Typography>
                <Typography variant={"subtitle2"}>Delayed Shipment</Typography>
              </div>
            </Grid>
            {/* <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant={"h4"}>{"-"}</Typography>
                <Typography variant={"subtitle2"}>Items at risk</Typography>
              </div>
            </Grid> */}
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant={"h4"}>{"-"}</Typography>
                <Typography variant={"subtitle2"}>Revenue Risk</Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant={"h4"}>{"-"}</Typography>
                <Typography variant={"subtitle2"}>
                  Perfect order rate
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={tileView ? 6 : 12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className={classes.switchViewSection}>
                  <Typography
                    color="primary"
                    variant="h5"
                    className={classes.tileHeading}
                  >
                    Delayed Shipments
                  </Typography>
                  <Hidden smDown>
                    <IconButton
                      className={classes.menuButton}
                      onClick={() => setTileView(!tileView)}
                      color="primary"
                      aria-label="menu"
                    >
                      {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
                    </IconButton>
                  </Hidden>
                </div>
                <DataTable rows={delayedRows} columns={delayColumns} />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className={classes.switchViewSection}>
                  <Typography
                    color="primary"
                    variant="h5"
                    className={classes.tileHeading}
                  >
                    Recalls and Violations
                  </Typography>
                  <Hidden smDown>
                    <IconButton
                      className={classes.menuButton}
                      onClick={() => setTileView(!tileView)}
                      color="primary"
                      aria-label="menu"
                    >
                      {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
                    </IconButton>
                  </Hidden>
                </div>
                <DataTable rows={excursionRows} columns={recallColumns} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={tileView ? 6 : 12}>
            <div className={classes.switchViewSection}>
              <Typography
                className={classes.tileHeading}
                color="primary"
                variant="h5"
              >
                Current Shipments
              </Typography>
              <Hidden smDown>
                <IconButton
                  className={classes.menuButton}
                  onClick={() => setTileView(!tileView)}
                  color="primary"
                  aria-label="menu"
                >
                  {!tileView ? <ViewCompactIcon /> : <ViewComfyIcon />}
                </IconButton>
              </Hidden>
            </div>
            <MapComponent
              isMarkerShown
              markers={markers}
              googleMapURL={MAP_API_URL}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `620px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.shipmentReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  ...state.sensorsGatewayReducer,
});
export default connect(mapStateToProps)(Dashboard);
