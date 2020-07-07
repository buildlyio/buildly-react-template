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
import {
  SHIPMENT_COLUMNS,
  getFormattedRow,
  getFormattedCustodyRows,
} from "./ShipmentConstants";
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
  getSensors,
  getSensorType,
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
import Loader from "../../components/Loader/Loader";

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
    sensorData,
    loading,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
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
    return function cleanup() {
      dispatch({ type: FILTER_SHIPMENT_SUCCESS, data: undefined });
    };
  }, []);

  useEffect(() => {
    if (
      shipmentData &&
      custodianData &&
      custodyData &&
      itemData &&
      shipmentFlag
    ) {
      let routesInfo = [];
      let formattedRow = getFormattedRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData
      );
      formattedRow.forEach((row) => {
        if (row.custody_info && row.custody_info.length > 0) {
          // if (row.status == "Planned") {
          //   if (row.custody_info[0].start_of_custody_location)
          //     routesInfo.push({
          //       lat:
          //         row.custody_info[0].start_of_custody_location &&
          //         parseFloat(
          //           row.custody_info[0].start_of_custody_location.split(",")[0]
          //         ),
          //       lng:
          //         row.custody_info[0].start_of_custody_location &&
          //         parseFloat(
          //           row.custody_info[0].start_of_custody_location.split(",")[1]
          //         ),
          //       label: `${row.name}:${row.shipment_uuid}(Start Location)`,
          //       icon: (
          //         <svg
          //           xmlns="http://www.w3.org/2000/svg"
          //           viewBox="0 0 24 24"
          //           width="24"
          //           height="24"
          //         >
          //           <path fill="none" d="M0 0h24v24H0z" />
          //           <path d="M8 5a4 4 0 1 1 8 0v5.255a7 7 0 1 1-8 0V5zm1.144 6.895a5 5 0 1 0 5.712 0L14 11.298V5a2 2 0 1 0-4 0v6.298l-.856.597zm1.856.231V5h2v7.126A4.002 4.002 0 0 1 12 20a4 4 0 0 1-1-7.874zM12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          //         </svg>
          //       ),
          //       excursion_name: row.shipment_flag,
          //       excursion_type: row.flag_type,
          //     });
          //   if (row.custody_info[0].end_of_custody_location)
          //     routesInfo.push({
          //       lat:
          //         row.custody_info[0].end_of_custody_location &&
          //         parseFloat(
          //           row.custody_info[0].end_of_custody_location.split(",")[0]
          //         ),
          //       lng:
          //         row.custody_info[0].end_of_custody_location &&
          //         parseFloat(
          //           row.custody_info[0].end_of_custody_location.split(",")[1]
          //         ),
          //       label: `${row.name}:${row.shipment_uuid}(End Location)`,

          //       excursion_name: row.shipment_flag,
          //       excursion_type: row.flag_type,
          //     });
          // }
          // else if (row.status === "Enroute") {
          row.custody_info.forEach((custody) => {
            if (custody.has_current_custody || custody.first_custody) {
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
                });
              }
            }
          });
          // }
        }
      });
      setMarkers(routesInfo);
      setRows(formattedRow);
      setFilteredRows(formattedRow);
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData]);

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
      {loading && <Loader open={loading} />}
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
            markers={markers}
            googleMapURL={MAP_API_URL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `550px` }} />}
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
