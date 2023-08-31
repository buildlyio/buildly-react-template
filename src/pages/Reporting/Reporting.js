import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Box,
  Grid,
  List,
  ListItem,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  CardContent,
  Card,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
} from '@mui/icons-material';
import GraphComponent from '../../components/GraphComponent/GraphComponent';
import Loader from '../../components/Loader/Loader';
import MapComponent from '../../components/MapComponent/MapComponent';
import { UserContext } from '../../context/User.context';
import {
  getCustodians,
  getContact,
} from '../../redux/custodian/actions/custodian.actions';
import {
  getUnitOfMeasure,
} from '../../redux/items/actions/items.actions';
import { getGateways, getSensorReports } from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getShipmentDetails,
} from '../../redux/shipment/actions/shipment.actions';
import {
  getShipmentOverview,
  SHIPMENT_OVERVIEW_COLUMNS,
  REPORT_TYPES,
  getIcon,
  processReportsAndMarkers,
} from '../../utils/constants';
import AlertsReport from './components/AlertsReport';
import SensorReport from './components/SensorReport';

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
  switchViewSection: {
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  switchViewSection2: {
    background: theme.palette.primary.light,
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  iconBar: {
    backgroundColor: theme.palette.primary.light,
    height: '100%',
    '& svg': {
      margin: '0 auto',
    },
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    flexDirection: 'column',
    height: '100px',
  },
  infoContainer: {
    height: '550px',
    overflowX: 'auto',
    overflowY: 'hidden',
    '& .MuiPaper-root': {
      boxShadow: 'none',
    },
  },
  reportContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  selectInput: {
    marginLeft: theme.spacing(1),
  },
}));

const Reporting = ({
  dispatch,
  loading,
  shipmentData,
  custodianData,
  custodyData,
  contactInfo,
  unitOfMeasure,
  timezone,
  allSensorAlerts,
  sensorReports,
  gatewayData,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [tileView, setTileView] = useState(true);
  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState([]);
  const [reports, setReports] = useState([]);
  const [allGraphs, setAllGraphs] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});

  useEffect(() => {
    dispatch(getUnitOfMeasure(organization));
    dispatch(getCustodians(organization));
    dispatch(getContact(organization));
    dispatch(getGateways(organization));
    dispatch(getShipmentDetails(organization, 'Planned,Enroute', true));
  }, []);

  useEffect(() => {
    if (shipmentFilter === 'Active') {
      dispatch(getShipmentDetails(organization, 'Planned,Enroute', true));
    } else {
      const completedShipments = _.filter(shipmentData, (shipment) => shipment.type === 'Completed');
      // const cancelledShipments =
      // _.filter(shipmentData, (shipment) => shipment.type === 'Cancelled');

      if (_.isEmpty(completedShipments) && shipmentFilter === 'Completed') {
        dispatch(getShipmentDetails(organization, 'Completed', true));
      }
      // if (_.isEmpty(cancelledShipments) && shipmentFilter === 'Completed') {
      //   dispatch(getShipmentDetails(organization, 'Cancelled', true));
      // }
    }
    if (_.isEmpty(custodianData)) {
      dispatch(getCustodians(organization));
      dispatch(getContact(organization));
    }
  }, [shipmentFilter]);

  useEffect(() => {
    if (shipmentData && custodianData && custodyData && contactInfo) {
      const overview = getShipmentOverview(
        shipmentData,
        custodianData,
        custodyData,
        contactInfo,
        gatewayData,
      );
      if (!_.isEmpty(overview)) {
        setShipmentOverview(overview);
        if (selectedShipment) {
          const selected = _.find(overview, { id: selectedShipment.id });
          setSelectedShipment(selected);
        }
      }
    }
  }, [shipmentData, custodianData, custodyData, contactInfo, gatewayData]);

  useEffect(() => {
    const alerts = _.filter(
      allSensorAlerts,
      (alert) => alert.parameter_type !== 'location' && selectedShipment && alert.shipment_id === selectedShipment.partner_shipment_id,
    );
    if (selectedShipment && !_.isEmpty(sensorReports)) {
      const { sensorReportInfo, markersToSet, graphs } = processReportsAndMarkers(
        sensorReports,
        alerts,
        timezone,
        unitOfMeasure,
        theme.palette.error.main,
        theme.palette.info.main,
        selectedShipment,
      );

      setReports(sensorReportInfo);
      setAllGraphs(graphs);
      setMarkers(markersToSet);
    }
  }, [sensorReports, allSensorAlerts, timezone]);

  const getShipmentValue = (value) => {
    let returnValue;
    if (selectedShipment[value] !== null) {
      if (moment(selectedShipment[value], true).isValid()) {
        const dateFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure;
        const timeFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure;
        returnValue = moment(selectedShipment[value])
          .tz(timezone).format(`${dateFormat} ${timeFormat}`);
      } else if (typeof (selectedShipment[value]) !== 'object') {
        if (value === 'had_alert') {
          returnValue = selectedShipment[value]
            ? 'YES'
            : 'NO';
        } else {
          returnValue = selectedShipment[value];
        }
      }
    } else {
      returnValue = 'NA';
    }
    return returnValue;
  };

  const handleShipmentSelection = (shipment) => {
    setSelectedShipment(shipment);
    if (shipment.partner_shipment_id) {
      dispatch(getSensorReports(encodeURIComponent(shipment.partner_shipment_id)));
    }
  };

  const makeFilterSelection = (value) => {
    setShipmentFilter(value);
    setSelectedShipment(null);
    setReports([]);
    setAllGraphs([]);
    setMarkers([]);
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <Typography className={classes.dashboardHeading} variant="h4">
        Reporting
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <Typography
              className={classes.tileHeading}
              variant="h5"
            >
              {selectedShipment
              && selectedShipment.name
              && `Map View - Shipment: ${selectedShipment.name}`}
              {!selectedShipment && 'Map View'}
            </Typography>
            <IconButton
              onClick={() => setTileView(!tileView)}
              color="inherit"
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
            isMarkerShown={!_.isEmpty(markers)}
            showPath
            markers={markers}
            googleMapURL={window.env.MAP_API_URL}
            zoom={_.isEmpty(markers) ? 4 : 12}
            setSelectedMarker={setSelectedMarker}
            loadingElement={
              <div style={{ height: '100%' }} />
            }
            containerElement={
              <div style={{ height: '625px' }} />
            }
            mapElement={
              <div style={{ height: '100%' }} />
            }
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <ToggleButtonGroup
              color="secondary"
              value={shipmentFilter}
              exclusive
              fullWidth
            >
              <ToggleButton
                selected={shipmentFilter === 'Active'}
                size="medium"
                value="Active"
                onClick={(event, value) => makeFilterSelection(value)}
              >
                Active

              </ToggleButton>
              <ToggleButton
                value="Completed"
                size="medium"
                selected={shipmentFilter === 'Completed'}
                onClick={(event, value) => makeFilterSelection(value)}
              >
                Completed

              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className={classes.switchViewSection2}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="shipment-name"
              select
              required
              className={classes.selectInput}
              label="Shipment Name"
              value={
                selectedShipment
                  ? selectedShipment.id
                  : ''
              }
              onChange={(e) => {
                const selected = _.find(shipmentOverview, { id: e.target.value });
                handleShipmentSelection(selected);
              }}
            >
              <MenuItem value="">Select</MenuItem>
              {shipmentOverview && !_.isEmpty(shipmentOverview)
              && _.map(
                _.filter(shipmentOverview, { type: shipmentFilter }),
                (shipment, index) => (
                  <MenuItem
                    key={index}
                    value={shipment.id}
                  >
                    {shipment.name}
                  </MenuItem>
                ),
              )}
            </TextField>
            <IconButton
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
          <div className={classes.infoContainer}>
            <Card>
              <CardContent>
                <Grid container>
                  {selectedShipment
                    ? (_.map(
                      SHIPMENT_OVERVIEW_COLUMNS,
                      (column, index) => (
                        <Grid
                          item
                          className={classes.infoSection}
                          xs={10}
                          md={6}
                          key={`col${index}:${column.name}`}
                        >
                          <Typography variant="h6">
                            {column.label}
                          </Typography>
                          {column.name === 'custody_info' && selectedShipment[column.name]
                            ? (
                              <div
                                key="custody_info_last"
                                style={{
                                  marginBottom: 10,
                                  color: theme.palette.background.dark,
                                }}
                              >
                                <Typography variant="body1">
                                  {`Name: ${_.find(selectedShipment[column.name], { has_current_custody: true }).custodian_name}`}
                                </Typography>
                                <Typography variant="body1">
                                  {`Custodian Address: ${selectedShipment.contact_info[_.findIndex(selectedShipment[column.name], { has_current_custody: true })].address}`}
                                </Typography>
                              </div>
                            ) : (
                              <Typography variant="body1">
                                {getShipmentValue(column.name)}
                              </Typography>
                            )}
                        </Grid>
                      ),
                    ))
                    : (
                      <Typography
                        variant="h6"
                        align="center"
                      >
                        Select a shipment to view reporting data
                      </Typography>
                    )}
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
      <Grid container className={classes.reportContainer}>
        <div className={classes.switchViewSection}>
          <Typography
            className={classes.tileHeading}
            variant="h5"
          >
            {selectedShipment
            && selectedShipment.name
            && `Graph View - Shipment: ${selectedShipment.name}`}
            {!selectedShipment && 'Graph View'}
          </Typography>
        </div>
        <Grid item xs={1} md={1}>
          <List
            component="nav"
            aria-label="main graph-type"
            className={classes.iconBar}
          >
            {_.map(REPORT_TYPES(unitOfMeasure), (item, index) => (
              <ListItem
                key={`iconItem${index}${item.id}`}
                button
                selected={selectedGraph === item.id}
                onClick={() => setSelectedGraph(item.id)}
                style={{ margin: '12px 0' }}
              >
                {getIcon({ ...item, color: theme.palette.background.dark })}
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} md={10}>
          {selectedGraph && allGraphs && !_.isEmpty(allGraphs) && allGraphs[selectedGraph]
            ? (
              <GraphComponent
                data={allGraphs[selectedGraph]}
                selectedGraph={selectedGraph}
                unitOfMeasure={unitOfMeasure}
                minTemp={allGraphs.minTemp}
                maxTemp={allGraphs.maxTemp}
                minHumidity={allGraphs.minHumidity}
                maxHumidity={allGraphs.maxHumidity}
                shockThreshold={allGraphs.shockThreshold}
                lightThreshold={allGraphs.lightThreshold}
              />
            )
            : (
              <Typography
                variant="h6"
                align="center"
              >
                Select a shipment to view reporting data
              </Typography>
            )}
        </Grid>
      </Grid>
      <SensorReport
        loading={loading}
        sensorReport={reports}
        alerts={_.filter(
          allSensorAlerts,
          { shipment_id: selectedShipment && selectedShipment.partner_shipment_id },
        )}
        shipmentName={selectedShipment && selectedShipment.name}
        selectedMarker={selectedShipment && selectedMarker}
        unitOfMeasure={unitOfMeasure}
        timezone={timezone}
      />
      <AlertsReport
        loading={loading}
        sensorReport={reports}
        alerts={_.filter(
          allSensorAlerts,
          { shipment_id: selectedShipment && selectedShipment.partner_shipment_id },
        )}
        shipmentName={selectedShipment && selectedShipment.name}
        timezone={timezone}
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.sensorsGatewayReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  ...state.optionsReducer,
  loading: (
    state.shipmentReducer.loading
    || state.sensorsGatewayReducer.loading
    || state.custodianReducer.loading
    || state.itemsReducer.loading
    || state.optionsReducer.loading
  ),
});

export default connect(mapStateToProps)(Reporting);
