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
import { SHIPMENT_COLUMNS, getFormattedRow } from "./ShipmentConstants";
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
} from "../../redux/sensorsGateway/actions/sensorsGateway.actions";
import { MAP_API_URL } from "../../utils/utilMethods";
import {
  getShipmentDetails,
  saveShipmentFormData,
  deleteShipment,
  getShipmentFlag,
  FILTER_SHIPMENT_SUCCESS,
} from "../../redux/shipment/actions/shipment.actions";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import AlertInfo from "./AlertInfo";

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
  addButton: {
    backgroundColor: "#000",
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
    },
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
    filteredData,
    custodyData,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
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
    return function cleanup() {
      dispatch({ type: FILTER_SHIPMENT_SUCCESS, data: undefined });
    };
  }, []);

  useEffect(() => {
    if (shipmentData && custodianData && itemData && shipmentFlag) {
      setRows(
        getFormattedRow(shipmentData, custodianData, itemData, shipmentFlag)
      );
      setFilteredRows(
        getFormattedRow(shipmentData, custodianData, itemData, shipmentFlag)
      );
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag]);

  useEffect(() => {
    if (filteredData && filteredData.length >= 0) {
      setFilteredRows(filteredData);
    }
  }, [filteredData]);

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
    dispatch(deleteShipment(deleteItemId));
    setConfirmModal(false);
  };

  return (
    <Box mt={5} mb={5}>
      <AlertInfo {...props} />
      <Box mb={3} mt={2}>
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
            rows={rows}
            filteredRows={filteredRows}
            columns={SHIPMENT_COLUMNS}
            hasSearch={true}
            searchValue={""}
            dispatch={dispatch}
            editAction={handleEdit}
            deleteAction={handleDelete}
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
