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
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
} from '@mui/icons-material';
import GraphComponent from '../../components/GraphComponent/GraphComponent';
import Loader from '../../components/Loader/Loader';
import MapComponent from '../../components/MapComponent/MapComponent';
import CustomizedTooltips from '../../components/ToolTip/ToolTip';
import { UserContext } from '../../context/User.context';
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
} from '../../redux/custodian/actions/custodian.actions';
import {
  getSensors,
  getSensorType,
} from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getShipmentDetails,
  getReportAndAlerts,
} from '../../redux/shipment/actions/shipment.actions';
import {
  getUnitOfMeasure,
} from '../../redux/items/actions/items.actions';
import AlertsReport from './components/AlertsReport';
import SensorReport from './components/SensorReport';
import {
  getShipmentOverview,
  SHIPMENT_OVERVIEW_COLUMNS,
  SHIPMENT_OVERVIEW_TOOL_TIP,
  REPORT_TYPES,
  getIcon,
} from './ReportingConstants';

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
    background: theme.palette.background.dark,
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  iconBar: {
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
    height: '525px',
    overflowX: 'auto',
    backgroundColor: theme.palette.common.darkGrey2,
  },
  reportContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.common.darkGrey2,
  },
  selectInput: {
    marginLeft: theme.spacing(1),
  },
}));

const Reporting = ({
  dispatch,
  loading,
  aggregateReportData,
  shipmentData,
  custodianData,
  custodyData,
  sensorData,
  contactInfo,
  unitOfMeasure,
  timezone,
  allAlerts,
}) => {
  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [tileView, setTileView] = useState(true);
  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState([]);
  const [isMapLoaded, setMapLoaded] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [formattedShipmentData, setFormattedShipmentData] = useState([]);

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
      dispatch(getReportAndAlerts(shipment.partner_shipment_id));
    }
  };

  const makeFilterSelection = (value) => {
    setShipmentFilter(value);
    setSelectedShipment(null);
    setMarkers([]);
  };

  useEffect(() => {
    if (!unitOfMeasure) {
      dispatch(getUnitOfMeasure(organization));
    }
  }, []);

  useEffect(() => {
    if (!shipmentData || shipmentFilter === 'Active') {
      const aggregate = !aggregateReportData;
      const custody = !custodyData;
      dispatch(getShipmentDetails(
        organization,
        'Planned,Enroute',
        null,
        aggregate,
        custody,
        'get',
      ));
    } else {
      const completedShipments = _.filter(shipmentData, (shipment) => shipment.type === 'Completed');
      // const cancelledShipments =
      // _.filter(shipmentData, (shipment) => shipment.type === 'Cancelled');

      if (!completedShipments.length || shipmentFilter === 'Completed') {
        dispatch(getShipmentDetails(
          organization,
          'Completed',
          null,
          true,
          true,
          'get',
        ));
      }
      // if (!cancelledShipments.length) {
      //   dispatch(getShipmentDetails(
      //     organization,
      //     'Cancelled',
      //     null,
      //     true,
      //     true,
      //     'get',
      //   ));
      // }
      const UUIDS = _.map(shipmentData, 'shipment_uuid');
      const encodedUUIDs = encodeURIComponent(UUIDS);
      if (encodedUUIDs) {
        dispatch(getCustody(encodedUUIDs));
      }
    }
    if (!custodianData) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    // if (!custodyData) {
    //   dispatch(getCustody());
    // }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
  }, [shipmentFilter]);

  useEffect(() => {
    if (selectedShipment && selectedShipment.markers_to_set) {
      setMarkers(selectedShipment.markers_to_set);
    }
  }, [selectedShipment, shipmentOverview]);

  useEffect(() => {
    if (markers && markers.length > 0) {
      setTimeout(() => setMapLoaded(true), 1000);
    }
  });

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
        unitOfMeasure,
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

  useEffect(() => {
    if (shipmentData) {
      let shipmentList = [];
      _.forEach(shipmentData, (shipment) => {
        const editedShipment = shipment;

        switch (_.lowerCase(shipment.status)) {
          case 'planned':
          case 'enroute':
            editedShipment.type = 'Active';
            break;

          case 'completed':
            editedShipment.type = 'Completed';
            break;

          case 'cancelled':
            editedShipment.type = 'Cancelled';
            break;

          default:
            break;
        }
        shipmentList = [...shipmentList, editedShipment];
      });
      setFormattedShipmentData(_.orderBy(shipmentList,
        (shipment) => moment(shipment.estimated_time_of_departure)
          && moment(shipment.create_date),
        ['desc']));
    }
  }, [shipmentData]);

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
              <CustomizedTooltips
                toolTipText={SHIPMENT_OVERVIEW_TOOL_TIP}
              />
            </Typography>
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
          <MapComponent
            isMarkerShown={isMapLoaded}
            showPath
            markers={markers}
            googleMapURL={window.env.MAP_API_URL}
            zoom={12}
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
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className={classes.switchViewSection}>
            <ToggleButtonGroup
              color="primary"
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
          <div className={classes.switchViewSection}>
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
                const selected = _.find(formattedShipmentData, { id: e.target.value });
                handleShipmentSelection(selected);
              }}
            >
              <MenuItem value="">Select</MenuItem>
              {formattedShipmentData
              && formattedShipmentData.length > 0
              && _.map(
                _.filter(formattedShipmentData, { type: shipmentFilter }),
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
            <CustomizedTooltips
              toolTipText={SHIPMENT_OVERVIEW_TOOL_TIP}
            />
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
                          {column.name === 'custody_info'
                      && selectedShipment[column.name]
                            ? _.map(
                              selectedShipment[column.name],
                              (value, idx) => (
                                <div
                                  key={`custody_info_${idx}`}
                                  style={{
                                    marginBottom: 10,
                                    color: value.custody_type === 'Current'
                                      ? '#EBC645'
                                      : '#ffffff',
                                  }}
                                >
                                  <Typography variant="body1">
                                    {`Custody Type: ${value.custody_type}`}
                                  </Typography>
                                  <Typography variant="body1">
                                    {`Custodian Address: ${selectedShipment.contact_info[idx].address}`}
                                  </Typography>
                                </div>
                              ),
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
                        {SHIPMENT_OVERVIEW_TOOL_TIP}
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
            <CustomizedTooltips
              toolTipText={SHIPMENT_OVERVIEW_TOOL_TIP}
            />
          </Typography>
        </div>
        <Grid item xs={1} md={1}>
          <List
            component="nav"
            aria-label="main graph-type"
            className={classes.iconBar}
          >
            {_.map(REPORT_TYPES(unitOfMeasure), (item, index) => (
              <React.Fragment
                key={`iconItem${index}${item.id}`}
              >
                <ListItem
                  button
                  selected={selectedGraph === item.id}
                  onClick={() => setSelectedGraph(item.id)}
                >
                  {getIcon(item, 'white')}
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} md={10}>
          {selectedShipment
          && selectedShipment[selectedGraph]
            ? (
              <GraphComponent
                data={selectedShipment[selectedGraph]}
                selectedGraph={selectedGraph}
              />
            )
            : (
              <Typography
                variant="h6"
                align="center"
              >
                {SHIPMENT_OVERVIEW_TOOL_TIP}
              </Typography>
            )}
        </Grid>
      </Grid>
      <SensorReport
        loading={loading}
        aggregateReport={(!loading && selectedShipment && selectedShipment.sensor_report) || []}
        alerts={_.filter(
          allAlerts,
          { shipment_id: selectedShipment && selectedShipment.partner_shipment_id },
        )}
        shipmentName={selectedShipment && selectedShipment.name}
        selectedMarker={selectedShipment && selectedMarker}
        unitOfMeasure={unitOfMeasure}
      />
      <AlertsReport
        loading={loading}
        alerts={_.filter(
          allAlerts,
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
