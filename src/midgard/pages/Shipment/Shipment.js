import React, { useEffect, useState } from "react";
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
import {
  getCustodians,
  getCustodianType,
  getContact,
} from "../../redux/custodian/actions/custodian.actions";
import { getItems, getItemType } from "../../redux/items/actions/items.actions";
import {
  getGateways,
  getGatewayType,
} from "../../redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL } from "../../utils/utilMethods";
import {
  getShipmentDetails,
  saveShipmentFormData,
  deleteShipment,
} from "../../redux/shipment/actions/shipment.actions";
import ConfirmModal from "../../components/Modal/ConfirmModal";

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
  const {
    shipmentData,
    history,
    custodianData,
    dispatch,
    itemData,
    gatewayData,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  let rows = shipmentData || shipmentMock;
  let alerts = showAlert(rows);

  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails());
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
  }, []);

  const onAddButtonClick = () => {
    history.push(`${routes.SHIPMENT}/add`, {
      from: routes.SHIPMENT,
    });
  };

  const handleEdit = (item) => {
    dispatch(saveShipmentFormData(item));
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
    dispatch(deleteShipment(deleteItemId));
    setConfirmModal(false);
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
            rows={shipmentData || shipmentMock}
            columns={SHIPMENT_COLUMNS}
            hasSearch={true}
            searchValue={""}
            editAction={handleEdit}
            deleteAction={handleDelete}
            searchAction={() => {}}
            hasSort={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MapComponent
            isMarkerShown
            googleMapURL={MAP_API_URL}
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
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={"Are You sure you want to Delete this Shipment?"}
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
