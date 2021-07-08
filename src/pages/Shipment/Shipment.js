import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment-timezone';
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
import SensorReport from '@pages/Reporting/components/SensorReport';
import {
  getConsortiums,
} from '@redux/consortium/actions/consortium.actions';
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
import {
  getShipmentDetails,
  deleteShipment,
} from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';
import {
  getFormattedRow,
  MAP_TOOLTIP,
  SHIPMENT_DATA_TABLE_TOOLTIP,
} from './ShipmentConstants';
import ShipmentDataTable from './components/ShipmentDataTable';
import AddShipment from './forms/AddShipment';

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
    timezone,
    sensorAlerts,
    consortiumData,
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
  const [selectedMarker, setSelectedMarker] = useState({});
  const [markers, setMarkers] = useState([]);
  const [tileView, setTileView] = useState(true);
  const [isMapLoaded, setMapLoaded] = useState(false);

  const subNav = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      const getUpdatedSensorData = !aggregateReportData;
      dispatch(getShipmentDetails(
        organization,
        null,
        getUpdatedSensorData,
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
    if (!consortiumData) {
      dispatch(getConsortiums());
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
      let markersToSet = [];
      let aggregateReportInfo = [];
      const temperatureUnit = _.filter(
        unitsOfMeasure,
        { supported_class: 'Temperature' },
      )[0].name.toLowerCase();

      _.forEach(selectedShipment.sensor_report, (report) => {
        if (report.report_entries.length > 0) {
          let color;
          if (report.excursion_flag) {
            color = 'red';
          } else if (report.warning_flag) {
            color = 'yellow';
          } else {
            color = 'green';
          }
          _.forEach(report.report_entries, (report_entry) => {
            try {
              const temperature = report_entry.report_temp;
              let dateTime;
              if ('report_timestamp' in report_entry) {
                if (report_entry.report_timestamp !== null) {
                  dateTime = moment(report_entry.report_timestamp)
                    .tz(timezone).format('MMM DD YYYY, h:mm:ss a');
                }
              } else if ('report_location' in report_entry) {
                dateTime = moment(
                  report_entry.report_location.timeOfPosition,
                ).tz(timezone).format('MMM DD YYYY, h:mm:ss a');
              }

              // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
              const latitude = report_entry.report_latitude
                || report_entry.report_location.latitude;
              const longitude = report_entry.report_longitude
                || report_entry.report_location.longitude;
              if (
                (latitude >= -90
                  && latitude <= 90)
                && (longitude >= -180
                  && longitude <= 180)
                && dateTime !== ''
              ) {
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
                  timestamp: dateTime,
                };
                // Considered use case: If a shipment stays at some
                // position for long, other value changes can be
                // critical
                const markerFound = _.find(markersToSet, {
                  lat: marker.lat,
                  lng: marker.lng,
                });

                if (!markerFound) {
                  markersToSet = [...markersToSet, marker];
                }
                aggregateReportInfo = [
                  ...aggregateReportInfo,
                  marker,
                ];
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
      selectedShipment.sensor_report_info = aggregateReportInfo;
    }
  }, [selectedShipment, timezone]);

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
      flags: item.flags,
      items: item.items,
    };

    history.push(`${routes.SHIPMENT}/add`, {
      type: 'copy',
      data: copyData,
      from: routes.SHIPMENT,
    });
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
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
            copyAction={handleCopy}
            rowsType={shipmentFilter}
            setSelectedShipment={setSelectedShipment}
            tileView={tileView}
            timezone={timezone}
            consortiumData={consortiumData}
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
        aggregateReport={selectedShipment?.sensor_report_info}
        shipmentName={selectedShipment?.name}
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
    || state.consortiumReducer.loading
  ),
  consortiumData: state.consortiumReducer.data,
});

export default connect(mapStateToProps)(Shipment);
