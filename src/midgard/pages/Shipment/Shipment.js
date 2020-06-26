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

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
  addButton: {
    backgroundColor: "#000",
  },
}));

function Shipment(props) {
  const { shipmentData } = props;
  const classes = useStyles();
  let rows = shipmentData;
  return (
    <Box mt={5} mb={5}>
      <Box mb={3}>
        <Button
          type="button"
          // fullWidth
          variant="contained"
          color="primary"
          className={classes.addButton}
          onClick={() => {}}
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
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(Shipment);
