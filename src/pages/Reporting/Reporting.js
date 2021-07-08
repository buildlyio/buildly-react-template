import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  makeStyles,
  Box,
  Grid,
  List,
  ListItem,
  Typography,
  TextField,
  IconButton,
  Hidden,
  MenuItem,
} from '@material-ui/core';
import {
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
} from '@material-ui/icons';
import GraphComponent from '@components/GraphComponent/GraphComponent';
import Loader from '@components/Loader/Loader';
import { MapComponent } from '@components/MapComponent/MapComponent';
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
  getSensors,
  getSensorType,
  getAllSensorAlerts,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getShipmentDetails,
} from '@redux/shipment/actions/shipment.actions';
import {
  getUnitsOfMeasure,
} from '@redux/items/actions/items.actions';
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
    background: '#383636',
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
    backgroundColor: '#424242',
  },
  reportContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    backgroundColor: '#424242',
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
  unitsOfMeasure,
  timezone,
  allAlerts,
}) => {
  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [tileView, setTileView] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState([]);
  const [isMapLoaded, setMapLoaded] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});

  const getShipmentValue = (value) => {
    let returnValue;
    if (selectedShipment[value] !== null) {
      if (moment(selectedShipment[value], true).isValid()) {
        returnValue = moment(selectedShipment[value])
          .tz(timezone).format('MMMM DD, YYYY hh:mm:ss a');
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

  useEffect(() => {
    if (!shipmentData) {
      const aggregate = !aggregateReportData;
      dispatch(getShipmentDetails(
        organization,
        null,
        aggregate,
      ));
    }
    if (!custodianData) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
  }, []);

  useEffect(() => {
    if (
      shipmentData
      && custodianData
      && custodyData
      && aggregateReportData
      && contactInfo
      && unitsOfMeasure
    ) {
      const overview = getShipmentOverview(
        shipmentData,
        custodianData,
        custodyData,
        aggregateReportData,
        contactInfo,
        unitsOfMeasure,
        timezone,
      );
      if (overview.length > 0) {
        setShipmentOverview(overview);
      }
      if (!selectedShipment && overview.length > 0) {
        setSelectedShipment(overview[0]);
      }
    }

    if (shipmentData && shipmentData.length) {
      const ships = _.filter(shipmentData, { had_alert: true });
      const ids = _.toString(_.map(ships, 'partner_shipment_id'));
      const encodedIds = encodeURIComponent(ids);
      dispatch(getAllSensorAlerts(encodedIds));
    }
  }, [shipmentData, custodianData, custodyData, aggregateReportData, timezone]);

  useEffect(() => {
    if (selectedShipment) {
      setMarkers(selectedShipment.markers_to_set);
    }
  }, [selectedShipment]);

  useEffect(() => {
    if (markers && markers.length > 0) {
      setTimeout(() => setMapLoaded(true), 1000);
    }
  });

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
            <Hidden smDown>
              <IconButton
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
              <div style={{ height: '550px' }} />
            }
            mapElement={
              <div style={{ height: '100%' }} />
            }
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
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
                const selected = _.find(shipmentOverview, { id: e.target.value });
                setSelectedShipment(selected);
              }}
            >
              <MenuItem value="">Select</MenuItem>
              {shipmentData
              && shipmentData.length > 0
              && _.map(
                shipmentData,
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
            <Hidden smDown>
              <IconButton
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
          <div className={classes.infoContainer}>
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
            {_.map(REPORT_TYPES, (item, index) => (
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
        aggregateReport={selectedShipment?.sensor_report}
        shipmentName={selectedShipment?.name}
        selectedMarker={selectedShipment && selectedMarker}
      />
      <AlertsReport
        loading={loading}
        alerts={_.filter(
          allAlerts,
          { shipment_id: selectedShipment?.partner_shipment_id },
        )}
        shipmentName={selectedShipment?.name}
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
