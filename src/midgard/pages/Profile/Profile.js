import React, { useState } from "react";
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
import { numberWithCommas } from "../../utils/utilMethods";
import { RECALL_DATA, DELAY_DATA } from "../../utils/mock";

const recallColumns = [
  { id: "shipmentId", label: "Shipment ID", minWidth: 150 },
  { id: "issue", label: "Issue", minWidth: 150 },
  {
    id: "affected",
    label: "Affected Items",
    minWidth: 150,
  },
  {
    id: "custodian",
    label: "Current Custodians",
    minWidth: 170,
  },
];

const delayColumns = [
  { id: "shipmentId", label: "Shipment ID", minWidth: 150 },
  {
    id: "delay",
    label: "Delay(hrs)",
    minWidth: 150,
  },
  {
    id: "itemNo",
    label: "Items",
    minWidth: 170,
  },
  {
    id: "risk",
    label: "Revenue Risk",
    minWidth: 170,
    format: (value) => `$${numberWithCommas(value)}`,
  },
  {
    id: "custodian",
    label: "Current Custodians",
    minWidth: 170,
  },
];

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
function Profile({ dispatch, history, location }) {
  const [tileView, setTileView] = useState(true);
  let classes = useStyles();
  let dashboardItems = [
    { id: 0, name: "Items in transit", number: numberWithCommas(18400) },
    { id: 0, name: "Delayed Shipment", number: 483 },
    { id: 1, name: "Items at risk", number: numberWithCommas(19000) },
    { id: 0, name: "Perfect order rate", number: "80%" },
  ];
  return (
    <Box mt={3}>
      <div className={classes.dashboardContainer}>
        <Typography className={classes.dashboardHeading} variant={"h4"}>
          Producer Dashboard
        </Typography>
        <Box mt={3} mb={4}>
          <Grid container className={classes.root} spacing={2}>
            {dashboardItems.map((items, index) => {
              return (
                <Grid item md={3} xs={6} key={`${items.name}${index}`}>
                  <div className={classes.dashboardHeaderItems}>
                    <Typography variant={"h4"}>{items.number}</Typography>
                    <Typography variant={"subtitle2"}>{items.name}</Typography>
                  </div>
                </Grid>
              );
            })}
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
                    Recalls and Excursions
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
                <DataTable rows={RECALL_DATA} columns={recallColumns} />
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
                <DataTable rows={DELAY_DATA} columns={delayColumns} />
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
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `500px` }} />}
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
});
export default connect(mapStateToProps)(Profile);
