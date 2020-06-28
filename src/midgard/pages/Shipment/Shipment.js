import React from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { MapComponent } from "../../components/MapComponent/MapComponent";
import DataTable from "../../components/Table/Table";
import { SHIPMENT_COLUMNS } from "./ShipmentConstants";
import ShipmentList from "./components/ShipmentList";
import { shipmentMock } from "../../utils/mock";
import moment from "moment";
import { routes } from "../../routes/routesConstants";
import { Route } from "react-router-dom";
import AddShipment from "./forms/AddShipment";
import AddOriginInfo from "./forms/AddOriginInfo";
import AddShipperInfo from "./forms/AddShipperInfo";
import AddDestinationInfo from "./forms/AddDestinationInfo";

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
  addButton: {
    backgroundColor: "#000",
  },
}));

function showAlert(data) {
  let alerts = [];
  if (data) {
    data.forEach((element) => {
      if (
        moment(element.actual_time_of_arrival).isAfter(
          element.estimated_time_of_arrival,
          "day"
        )
      ) {
        alerts.push({
          id: element.id,
          alertId: "delay",
          message: "Delay warning",
          severity: "warning",
        });
      }
    });
  }
  return alerts;
}

const ShowAlerts = (props) => {
  let { alertData } = props;
  const uniqueAlertsId = [];
  alertData.forEach((data) => {});
};

function Shipment(props) {
  const { shipmentData, history } = props;
  const classes = useStyles();
  let rows = shipmentData || shipmentMock;
  let alerts = showAlert(rows);

  const onAddButtonClick = () => {
    console.log("ffff");
    history.push(`${routes.SHIPMENT}/add`, {
      from: routes.SHIPMENT,
    });
  };
  return (
    <Box mt={5} mb={5}>
      {/* {alerts.length > 0 && <ShowAlerts alertData={alerts} />} */}
      <Box mb={3}>
        <Button
          type="button"
          // fullWidth
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
        <Grid item xs={12} sm={6}>
          <ShipmentList
            rows={shipmentMock}
            columns={SHIPMENT_COLUMNS}
            hasSearch={true}
            searchValue={""}
            searchAction={() => {}}
            hasSort={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MapComponent
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOxE87ZNM_xe5X1BH1KYwUo9S4Qs1BV5w&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `500px` }} />}
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
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(Shipment);
