import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import {
  makeStyles,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  Button,
  IconButton,
  Hidden,
} from '@material-ui/core';
import {
  Add as AddIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
} from '@material-ui/icons';
import Loader from '@components/Loader/Loader';
import { MapComponent } from '@components/MapComponent/MapComponent';
import ConfirmModal from '@components/Modal/ConfirmModal';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { UserContext } from '@context/User.context';
import { environment } from '@environments/environment';
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
} from '@redux/custodian/actions/custodian.actions';
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from '@redux/items/actions/items.actions';
import {
  getCustodyOptions,
  getShipmentOptions,
} from '@redux/options/actions/options.actions';
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import { convertUnitsOfMeasure } from '@utils/utilMethods';
import {
  getShipmentDetails,
  deleteShipment,
} from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';
import {
  getFormattedRow,
  MAP_TOOLTIP,
  SHIPMENT_DATA_TABLE_TOOLTIP,
  SHIPMENT_SENSOR_COLUMNS,
} from './ShipmentConstants';
import AlertInfo from './AlertInfo';
import ShipmentSensorTable from './components/ShipmentSensorTable';
import ShipmentDataTable from './components/ShipmentDataTable';
import AddShipment from './forms/AddShipment';
import AddOriginInfo from './forms/AddOriginInfo';
import AddShipperInfo from './forms/AddShipperInfo';
import AddDestinationInfo from './forms/AddDestinationInfo';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  tileHeading: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: 'uppercase',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
    },
  },
  switchViewSection: {
    background: '#383636',
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 'auto',
  },
  tabContainer: {
    backgroundColor: '#383636',
    margin: '0',
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
    shipmentFlag,
    unitsOfMeasure,
    custodyData,
    sensorData,
    aggregateReportData,
    loading,
    shipmentOptions,
    custodyOptions,
    sensorReportAlerts,
  } = props;
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [activeRows, setActiveRows] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [cancelledRows, setCancelledRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const subNav = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];
  const [selectedMarker, setSelectedMarker] = useState({});
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [tileView, setTileView] = useState(true);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      const aggregate = !aggregateReportData;
      const alerts = !sensorReportAlerts;
      dispatch(getShipmentDetails(
        organization,
        null,
        aggregate,
        alerts,
      ));
    }
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
      dispatch(getGateways(organization));
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
      dispatch(getShipmentOptions());
    }
    if (custodyOptions === null) {
      dispatch(getCustodyOptions());
    }
  }, []);

  useEffect(() => {
    if (
      shipmentData
      && custodianData
      && custodyData
      && itemData
      && aggregateReportData
      && shipmentFlag
    ) {
      const formattedRows = getFormattedRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData,
        aggregateReportData,
      );
      const ACTIVE_ROWS = _.filter(
        formattedRows,
        { type: 'Active' },
      );
      const COMPLETED_ROWS = _.filter(
        formattedRows,
        { type: 'Completed' },
      );
      const CANCELLED_ROWS = _.filter(
        formattedRows,
        { type: 'Cancelled' },
      );

      setRows(formattedRows);
      setActiveRows(ACTIVE_ROWS);
      setCompletedRows(COMPLETED_ROWS);
      setCancelledRows(CANCELLED_ROWS);
      if (!selectedShipment && formattedRows.length) {
        if (shipmentFilter === 'Cancelled') {
          setSelectedShipment(CANCELLED_ROWS[0]);
        } else if (shipmentFilter === 'Completed') {
          setSelectedShipment(COMPLETED_ROWS[0]);
        } else {
          setSelectedShipment(ACTIVE_ROWS[0]);
        }
      }
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData, aggregateReportData]);

  useEffect(() => {
    if (selectedShipment) {
      const markersToSet = [];
      const aggregateReportInfo = [];
      const temperatureUnit = unitsOfMeasure.filter((obj) => obj.supported_class === 'Temperature')[0].name.toLowerCase();

      selectedShipment.sensor_report.forEach((report) => {
        if (report.report_entries.length > 0) {
          let alert_status;
          let color;
          if (report.excursion_flag) {
            alert_status = 'Excursion';
            color = 'red';
          } else if (report.warning_flag) {
            alert_status = 'Warning';
            color = 'yellow';
          } else {
            alert_status = 'Normal';
            color = 'green';
          }
          report.report_entries.forEach((report_entry) => {
            try {
              const temperature = selectedShipment.platform_name === 'tive'
                ? report_entry.report_temp
                : convertUnitsOfMeasure(
                  'celsius',
                  report_entry.report_temp,
                  temperatureUnit,
                  'temperature',
                );
              let localDateTime;
              if ('report_timestamp' in report_entry) {
                if (report_entry.report_timestamp !== null) {
                  localDateTime = moment(
                    report_entry.report_timestamp,
                  ).format('MMM DD YYYY, h:mm:ss a');
                }
              } else if ('report_location' in report_entry) {
                localDateTime = moment(
                  report_entry.report_location.timeOfPosition,
                ).format('MMM DD YYYY, h:mm:ss a');
              }
              // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
              const latitude = report_entry.report_latitude
                || report_entry.report_location.latitude;
              const longitude = report_entry.report_longitude
                || report_entry.report_location.longitude;
              if ((latitude >= -90 && latitude <= 90) && (longitude >= -180 && longitude <= 180) && localDateTime !== '') {
                const marker = {
                  lat: latitude,
                  lng: longitude,
                  label: 'Clustered',
                  temperature,
                  light: report_entry.report_light,
                  shock: report_entry.report_shock,
                  tilt: report_entry.report_tilt,
                  humidity: report_entry.report_humidity,
                  battery: report_entry.report_battery,
                  pressure: report_entry.report_pressure,
                  color,
                  timestamp: localDateTime,
                  alert_status,
                };
                // Considered use case: If a shipment stays at some
                // position for long, other value changes can be
                // critical
                const markerFound = _.find(markersToSet, {
                  lat: marker.lat,
                  lng: marker.lng,
                  // temperature: marker.temperature,
                  // humidity: marker.humidity,
                });

                if (!markerFound) {
                  markersToSet.push(marker);
                }
                aggregateReportInfo.push(marker);
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          });
        }
      });
      setMarkers(_.orderBy(
        markersToSet,
        (item) => moment(item.timestamp),
        ['asc'],
      ));
      setZoomLevel(12);
      selectedShipment.sensor_report_info = aggregateReportInfo;
    }
  }, [selectedShipment]);

  useEffect(() => {
    if (markers && markers.length > 0) {
      setTimeout(() => setMapLoaded(true), 1000);
    }
  });

  useEffect(() => {
    if (shipmentFilter && rows.length > 0) {
      if (shipmentFilter === 'Cancelled') {
        setSelectedShipment(cancelledRows[0]);
      } else if (shipmentFilter === 'Completed') {
        setSelectedShipment(completedRows[0]);
      } else {
        setSelectedShipment(activeRows[0]);
      }
    }
  }, [shipmentFilter]);

  const onAddButtonClick = () => {
    history.push(`${routes.SHIPMENT}/add`, {
      from: routes.SHIPMENT,
    });
  };

  const handleEdit = (item) => {
    // dispatch(saveShipmentFormData(item));
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
    dispatch(deleteShipment(deleteItemId, organization));
    setConfirmModal(false);
  };

  const filterTabClicked = (event, filter) => {
    setShipmentFilter(filter);
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
          <AddIcon />
          {' '}
          Add Shipment
        </Button>
      </Box>
      <Typography
        className={classes.dashboardHeading}
        variant="h4"
      >
        Shipments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <CustomizedTooltips
              toolTipText={SHIPMENT_DATA_TABLE_TOOLTIP}
            />
            <Hidden smDown>
              <IconButton
                className={classes.menuButton}
                onClick={() => setTileView(!tileView)}
                color="default"
                aria-label="menu"
              >
                {!tileView
                  ? <ViewCompactIcon />
                  : <ViewComfyIcon />}
              </IconButton>
            </Hidden>
          </div>
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
          </Box>
          <ShipmentDataTable
            rows={
              // eslint-disable-next-line no-nested-ternary
              shipmentFilter === 'Cancelled'
                ? cancelledRows
                : shipmentFilter === 'Completed'
                  ? completedRows
                  : activeRows
            }
            editAction={handleEdit}
            deleteAction={handleDelete}
            setSelectedShipment={setSelectedShipment}
            tileView={tileView}
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
                    <CustomizedTooltips toolTipText={MAP_TOOLTIP} />
                  </Typography>
                )
                : (
                  <CustomizedTooltips toolTipText={MAP_TOOLTIP} />
                )
            }
            <Hidden smDown>
              <IconButton
                className={classes.menuButton}
                onClick={() => setTileView(!tileView)}
                color="default"
                aria-label="menu"
              >
                {!tileView
                  ? <ViewCompactIcon />
                  : <ViewComfyIcon />}
              </IconButton>
            </Hidden>
          </div>
          <MapComponent
            isMarkerShown={isMapLoaded}
            showPath
            markers={markers}
            googleMapURL={environment.MAP_API_URL}
            zoom={zoomLevel}
            setSelectedMarker={setSelectedMarker}
            loadingElement={
              <div style={{ height: '100%' }} />
            }
            containerElement={
              <div style={{ height: '550px' }} />
            }
            mapElement={
              <div style={{ height: '100%' }} />
            }
          />
        </Grid>
      </Grid>
      <ShipmentSensorTable
        aggregateReport={selectedShipment?.sensor_report_info}
        shipmentName={selectedShipment?.name}
        selectedMarker={selectedShipment && selectedMarker}
        cols={SHIPMENT_SENSOR_COLUMNS}
      />
      <Route
        path={`${routes.SHIPMENT}/add`}
        component={AddShipment}
      />
      <Route
        path={`${routes.SHIPMENT}/add/origin`}
        component={AddOriginInfo}
      />
      <Route
        path={`${routes.SHIPMENT}/add/shipper`}
        component={AddShipperInfo}
      />
      <Route
        path={`${routes.SHIPMENT}/add/destination`}
        component={AddDestinationInfo}
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
