import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  Button,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Add as AddIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
} from '@mui/icons-material';
import Loader from '../../components/Loader/Loader';
import { MapComponent } from '../../components/MapComponent/MapComponent';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import CustomizedTooltips from '../../components/ToolTip/ToolTip';
import { UserContext } from '../../context/User.context';
import SensorReport from '../../pages/Reporting/components/SensorReport';
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
} from '../../redux/custodian/actions/custodian.actions';
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from '../../redux/items/actions/items.actions';
import {
  getCustodyOptions,
  getShipmentOptions,
} from '../../redux/options/actions/options.actions';
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
  getAggregateReport,
  editGateway,
} from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getShipmentDetails,
  deleteShipment,
  getReportAndAlerts,
} from '../../redux/shipment/actions/shipment.actions';
import { routes } from '../../routes/routesConstants';
import {
  getShipmentFormattedRow,
  MAP_TOOLTIP,
} from './ShipmentConstants';
import ShipmentDataTable from './components/ShipmentDataTable';
import { getShipmentOverview } from '../Reporting/ReportingConstants';
import AddShipment from './forms/AddShipment';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
  },
  tileHeading: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: 'uppercase',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
  },
  switchViewSection: {
    background: theme.palette.background.dark,
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 'auto',
    zIndex: '5',
  },
  tabContainer: {
    backgroundColor: theme.palette.common.tab,
    margin: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiTabs-root': {
      zIndex: '5',
    },
  },
}));

const Shipment = (props) => {
  const {
    shipmentData,
    history,
    custodianData,
    dispatch,
    itemData,
    gatewayData,
    unitsOfMeasure,
    custodyData,
    sensorData,
    aggregateReportData,
    loading,
    shipmentOptions,
    custodyOptions,
    timezone,
    shipmentFormData,
    contactInfo,
    allAlerts,
  } = props;
  const classes = useStyles();

  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [activeRows, setActiveRows] = useState([]);
  // const [completedRows, setCompletedRows] = useState([]);
  const [cancelledRows, setCancelledRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState([]);
  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [selectedMarker, setSelectedMarker] = useState({});
  const [markers, setMarkers] = useState([]);
  const [tileView, setTileView] = useState(false);
  const [isMapLoaded, setMapLoaded] = useState(false);

  const subNav = [
    { label: 'Active', value: 'Active' },
    // { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (!shipmentData) {
      const getUpdatedSensorData = !aggregateReportData;
      const getUpdatedCustody = !custodyData;
      dispatch(getShipmentDetails(
        organization,
        'Planned,Enroute',
        null,
        getUpdatedSensorData,
        getUpdatedCustody,
        'get',
      ));
    } else {
      const UUIDS = _.map(_.filter(shipmentData, (shipment) => shipment.type === 'Active'), 'shipment_uuid');
      const uuids = _.toString(_.without(UUIDS, null));
      const encodedUUIDs = encodeURIComponent(uuids);
      if (encodedUUIDs) {
        dispatch(getCustody(encodedUUIDs));
      }
      const IDS = _.map(_.filter(shipmentData, (shipment) => shipment.type === 'Active'), 'partner_shipment_id');
      const ids = _.toString(_.without(IDS, null));
      const encodedIds = encodeURIComponent(ids);
      if (encodedIds) {
        dispatch(getAggregateReport(encodedIds));
      }
    }
    if (!custodianData) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (!itemData) {
      dispatch(getItems(organization));
      dispatch(getItemType(organization));
    }
    if (!gatewayData) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (!shipmentOptions) {
      dispatch(getShipmentOptions());
    }
    if (!custodyOptions) {
      dispatch(getCustodyOptions());
    }
  }, []);

  useEffect(() => {
    if (
      shipmentData
      && custodianData
      && custodyData
      && contactInfo
    ) {
      const formattedRows = getShipmentFormattedRow(
        shipmentData,
        custodianData,
        custodyData,
        aggregateReportData,
        shipmentFormData,
        dispatch,
      );
      const ACTIVE_ROWS = _.filter(
        formattedRows,
        { type: 'Active' },
      );
      // const COMPLETED_ROWS = _.filter(
      //   formattedRows,
      //   { type: 'Completed' },
      // );
      const CANCELLED_ROWS = _.filter(
        formattedRows,
        { type: 'Cancelled' },
      );
      setRows(formattedRows);
      setActiveRows(ACTIVE_ROWS);
      // setCompletedRows(COMPLETED_ROWS);
      setCancelledRows(CANCELLED_ROWS);
      if (!selectedShipment && formattedRows.length) {
        if (shipmentFilter === 'Cancelled') {
          handleShipmentSelection(CANCELLED_ROWS[0]);
        // } else if (shipmentFilter === 'Completed') {
        //   handleShipmentSelection(COMPLETED_ROWS[0]);
        } else {
          handleShipmentSelection(ACTIVE_ROWS[0]);
        }
      }
    }
  }, [shipmentData, custodianData, custodyData, contactInfo, timezone]);

  useEffect(() => {
    if (selectedShipment && selectedShipment.markers_to_set) {
      setMarkers(selectedShipment.markers_to_set);
    }
  }, [selectedShipment, timezone, shipmentOverview]);

  useEffect(() => {
    if (markers && markers.length > 0) {
      setTimeout(() => setMapLoaded(true), 1000);
    }
  });

  useEffect(() => {
    if (shipmentFilter && rows.length) {
      if (shipmentFilter === 'Cancelled') {
        handleShipmentSelection(cancelledRows[0]);
      // } else if (shipmentFilter === 'Completed') {
      //   handleShipmentSelection(completedRows[0]);
      } else {
        handleShipmentSelection(activeRows[0]);
      }
    }
  }, [shipmentFilter, shipmentData]);

  useEffect(() => {
    if (aggregateReportData
      && shipmentData
      && allAlerts
      && custodianData
      && custodyData
      && contactInfo) {
      const overview = getShipmentOverview(
        shipmentData,
        custodianData,
        custodyData,
        aggregateReportData,
        allAlerts,
        contactInfo,
        timezone,
      );
      if (overview.length > 0) {
        setShipmentOverview(overview);
        if (selectedShipment) {
          const selected = _.find(overview, { id: selectedShipment.id });
          setSelectedShipment(selected);
        }
      }
    }
  }, [aggregateReportData, allAlerts]);

  const handleEdit = (item) => {
    history.push(`${routes.SHIPMENT}/edit/:${item.id}`, {
      type: 'edit',
      data: item,
      from: routes.SHIPMENT,
    });
  };

  const handleDelete = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    if (selectedShipment.gateway_ids.length > 0) {
      let attachedGateway = null;
      attachedGateway = _.filter(
        gatewayData, (gateway) => gateway.gateway_uuid === selectedShipment.gateway_ids[0],
      );
      dispatch(
        editGateway({
          ...attachedGateway[0],
          gateway_status: 'available',
          shipment_ids: [],
        }),
      );
    }
    dispatch(deleteShipment(deleteItemId, organization));
    setConfirmModal(false);
  };

  const filterTabClicked = (event, filter) => {
    handleShipmentSelection(null);
    setMarkers({});
    setShipmentFilter(filter);
    let shipmentStatus = '';
    switch (filter) {
      case 'Active':
      default:
        shipmentStatus = 'Planned,Enroute';
        break;
      // case 'Completed':
      case 'Cancelled':
        shipmentStatus = filter;
        break;
    }
    const shipmentRows = _.filter(shipmentData, { type: filter });

    if (shipmentRows.length === 0) {
      dispatch(getShipmentDetails(
        organization,
        shipmentStatus,
        null,
        true,
        true,
        'get',
      ));
    }
  };

  const handleCopy = (item) => {
    const copyData = {
      transport_mode: item.transport_mode,
      status: 'Planned',
      max_excursion_temp: item.max_excursion_temp,
      min_excursion_temp: item.min_excursion_temp,
      max_excursion_humidity: item.max_excursion_humidity,
      min_excursion_humidity: item.min_excursion_humidity,
      max_warning_temp: item.max_warning_temp,
      min_warning_temp: item.min_warning_temp,
      max_warning_humidity: item.max_warning_humidity,
      min_warning_humidity: item.min_warning_humidity,
      route_description: item.route_description,
      unit_of_measure: item.unit_of_measure,
      value: item.value,
      gross_weight: item.gross_weight,
      net_weight: item.net_weight,
      organization_uuid: item.organization_uuid,
      uom_weight: item.uom_weight,
      uom_temp: item.uom_temp,
      uom_distance: item.uom_distance,
      items: item.items,
    };

    history.push(`${routes.SHIPMENT}/add`, {
      type: 'copy',
      data: copyData,
      from: routes.SHIPMENT,
    });
  };

  const onAddButtonClick = () => {
    // history.push(routes.CREATE_SHIPMENT);
    history.push(`${routes.SHIPMENT}/add`, {
      from: routes.SHIPMENT,
    });
  };

  const handleShipmentSelection = (shipment) => {
    setSelectedShipment(shipment);
    if (shipment && shipment.partner_shipment_id) {
      dispatch(getReportAndAlerts(shipment.partner_shipment_id));
    }
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <Box mb={3} mt={2}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={onAddButtonClick}
        >
          <AddIcon />
          Add Shipment
        </Button>
      </Box>
      <Box mb={3} mt={2} display="flex" alignItems="center" justifyContent="space-between">

        <Typography
          className={classes.dashboardHeading}
          variant="h4"
        >
          Shipments
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <Box mb={3} className={classes.tabContainer}>
            <Tabs
              value={shipmentFilter}
              onChange={filterTabClicked}
            >
              {subNav.map((itemProps, index) => (
                <Tab
                  {...itemProps}
                  key={`tab${index}:${itemProps.value}`}
                />
              ))}
            </Tabs>
            <IconButton
              className={classes.menuButton}
              onClick={() => setTileView(!tileView)}
              color="default"
              aria-label="menu"
              sx={{
                display: {
                  xs: 'none',
                  md: 'block',
                },
              }}
            >
              {!tileView
                ? <ViewCompactIcon />
                : <ViewComfyIcon />}
            </IconButton>
          </Box>
          <ShipmentDataTable
            rows={
              // // eslint-disable-next-line no-nested-ternary
              // shipmentFilter === 'Cancelled'
              //   ? cancelledRows
              //   : shipmentFilter === 'Completed'
              //     ? completedRows
              //     : activeRows
              shipmentFilter === 'Cancelled' ? cancelledRows : activeRows
            }
            editAction={handleEdit}
            deleteAction={handleDelete}
            copyAction={handleCopy}
            rowsType={shipmentFilter}
            setSelectedShipment={handleShipmentSelection}
            tileView={tileView}
            timezone={timezone}
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            {
              selectedShipment
                ? (
                  <Typography
                    className={classes.tileHeading}
                    variant="h5"
                  >
                    {selectedShipment.name}
                  </Typography>
                )
                : (
                  <CustomizedTooltips toolTipText={MAP_TOOLTIP} />
                )
            }
            <IconButton
              className={classes.menuButton}
              onClick={() => setTileView(!tileView)}
              color="default"
              aria-label="menu"
              sx={{
                display: {
                  xs: 'none',
                  md: 'block',
                },
              }}
            >
              {!tileView
                ? <ViewCompactIcon />
                : <ViewComfyIcon />}
            </IconButton>
          </div>
          <MapComponent
            isMarkerShown={isMapLoaded}
            showPath
            markers={markers}
            shipmentFilter={shipmentFilter}
            googleMapURL={window.env.MAP_API_URL}
            zoom={12}
            setSelectedMarker={setSelectedMarker}
            loadingElement={
              <div style={{ height: '100%' }} />
            }
            containerElement={
              <div style={{ height: '600px' }} />
            }
            mapElement={
              <div style={{ height: '100%' }} />
            }
          />
        </Grid>
      </Grid>
      <SensorReport
        loading={loading}
        aggregateReport={selectedShipment && selectedShipment.sensor_report}
        shipmentName={selectedShipment && selectedShipment.name}
        selectedMarker={selectedShipment && selectedMarker}
      />
      <Route
        path={`${routes.SHIPMENT}/add`}
        component={AddShipment}
      />
      <Route
        path={`${routes.SHIPMENT}/edit/:id`}
        component={AddShipment}
      />
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title="Are You sure you want to Delete this Shipment? The shipment will be ended in other platforms"
        submitText="Delete"
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
  loading: (
    state.shipmentReducer.loading
    || state.custodianReducer.loading
    || state.itemsReducer.loading
    || state.sensorsGatewayReducer.loading
    || state.optionsReducer.loading
  ),
});

export default connect(mapStateToProps)(Shipment);
