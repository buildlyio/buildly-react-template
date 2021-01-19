import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { MapComponent } from "../../components/MapComponent/MapComponent";
import DataTable from "../../components/Table/Table";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import {
  SHIPMENT_COLUMNS,
  getFormattedRow,
  getFormattedCustodyRows,
  svgIcon,
  MAP_TOOLTIP,
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
  GET_CUSTODY_OPTIONS_SUCCESS,
  GET_CUSTODY_OPTIONS_FAILURE,
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
  GET_SHIPMENT_OPTIONS_SUCCESS,
  GET_SHIPMENT_OPTIONS_FAILURE,
} from "../../redux/shipment/actions/shipment.actions";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import AlertInfo from "./AlertInfo";
import Loader from "../../components/Loader/Loader";
import CustomizedTooltips from "../../components/ToolTip/ToolTip";
import { httpService } from "../../modules/http/http.service";
import { environment } from "../../../../environment";
import { UserContext } from "midgard/context/User.context";

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
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
    shipmentOptions,
    custodyOptions,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [tileView, setTileView] = useState(true);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      dispatch(getShipmentDetails(organization));
    }
    // if (!shipmentFlag) {
    //   dispatch(getShipmentFlag());
    // }
    if (custodianData === null) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (itemData === null) {
      dispatch(getItems(organization));
      dispatch(getItemType(organization));
    }
    if (gatewayData === null) {
      dispatch(getGateways(organization,is_active));
      dispatch(getGatewayType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (shipmentOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}shipment/shipment/?organization_uuid=${organization}`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_SHIPMENT_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_SHIPMENT_OPTIONS_FAILURE, error: err });
        });
    }

    if (custodyOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}custodian/custody/`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_CUSTODY_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_CUSTODY_OPTIONS_FAILURE, error: err });
        });
    }

    return function cleanup() {
      dispatch({ type: FILTER_SHIPMENT_SUCCESS, data: undefined });
    };
  }, []);

  const returnIcon = (row) => {
    let flagType = "";
    let flag = "";
    let shipmentFlags = row.flag_list;
    if (shipmentFlags && shipmentFlags.length) {
      flagType = shipmentFlags[0].type;
      flag = shipmentFlags[0].name;
    }
    return svgIcon(flagType, flag, row);
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
      let formattedRow = getFormattedRow(
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
              (custody.has_current_custody || custody.first_custody) &&
              (row.status.toLowerCase() === "planned" ||
                row.status.toLowerCase() === "enroute")
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
                  icon: returnIcon(row),
                });
              }
            }
          });
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
    dispatch(deleteShipment(deleteItemId,organization));
    setConfirmModal(false);
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <AlertInfo {...props} />
      <Box mb={3} mt={2}>
        <Button
          type="button"
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
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
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
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <CustomizedTooltips toolTipText={MAP_TOOLTIP} />
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
