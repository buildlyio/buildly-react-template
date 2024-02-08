import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import {
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
} from '@mui/icons-material';
import GraphComponent from '@components/GraphComponent/GraphComponent';
import Loader from '@components/Loader/Loader';
import MapComponent from '@components/MapComponent/MapComponent';
import { getUser } from '@context/User.context';
import {
  getShipmentOverview,
  SHIPMENT_OVERVIEW_COLUMNS,
  REPORT_TYPES,
  getIcon,
  processReportsAndMarkers,
} from '@utils/constants';
import AlertsReport from './components/AlertsReport';
import SensorReport from './components/SensorReport';
import { useQuery } from 'react-query';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getContactQuery } from '@react-query/queries/custodians/getContactQuery';
import { getShipmentsQuery } from '@react-query/queries/shipments/getShipmentsQuery';
import { getAllGatewayQuery } from '@react-query/queries/sensorGateways/getAllGatewayQuery';
import { getCustodyQuery } from '@react-query/queries/custodians/getCustodyQuery';
import { getSensorReportQuery } from '@react-query/queries/sensorGateways/getSensorReportQuery';
import { getSensorAlertQuery } from '@react-query/queries/sensorGateways/getSensorAlertQuery';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import './ReportingStyles.css';
import { isDesktop2 } from '@utils/mediaQuery';

const Reporting = () => {
  const location = useLocation();
  const theme = useTheme();
  const organization = getUser().organization.organization_uuid;

  const [locShipmentID, setLocShipmentID] = useState('');
  const [tileView, setTileView] = useState(true);
  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState([]);
  const [reports, setReports] = useState([]);
  const [allGraphs, setAllGraphs] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [isLoading, setLoading] = useState(false);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  let isShipmentDataAvailable = false;

  const { data: shipmentData, isLoading: isLoadingShipments, isFetching: isFetchingShipments } = useQuery(
    ['shipments', shipmentFilter, locShipmentID, organization],
    () => getShipmentsQuery(organization, (shipmentFilter === 'Active' ? 'Planned,En route,Arrived' : shipmentFilter), displayAlert, locShipmentID),
    { refetchOnWindowFocus: false },
  );

  isShipmentDataAvailable = !_.isEmpty(shipmentData) && !isLoadingShipments && !isFetchingShipments;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: contactInfo, isLoading: isLoadingContact } = useQuery(
    ['contact', organization],
    () => getContactQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: allGatewayData, isLoading: isLoadingAllGateways, isFetching: isFetchingAllGateways } = useQuery(
    ['allGateways'],
    () => getAllGatewayQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodyData, isLoading: isLoadingCustodies } = useQuery(
    ['custodies', shipmentData, shipmentFilter],
    () => getCustodyQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null))), displayAlert),
    {
      enabled: isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const { data: sensorAlertData, isLoading: isLoadingSensorAlerts, isFetching: isFetchingSensorAlerts } = useQuery(
    ['sensorAlerts', selectedShipment, shipmentFilter],
    () => getSensorAlertQuery(encodeURIComponent(selectedShipment.partner_shipment_id), displayAlert),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const { data: sensorReportData, isLoading: isLoadingSensorReports, isFetching: isFetchingSensorReports } = useQuery(
    ['sensorReports', selectedShipment, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(selectedShipment.partner_shipment_id), displayAlert),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (location.search) {
      setLocShipmentID(_.split(_.split(location.search, '?shipment=')[1], '&status=')[0]);
    } else {
      setLocShipmentID('');
    }
  }, [location.search]);

  useEffect(() => {
    if (shipmentData && custodianData && custodyData && contactInfo) {
      const overview = getShipmentOverview(
        shipmentData,
        custodianData,
        custodyData,
        contactInfo,
        allGatewayData,
      );
      if (!_.isEmpty(overview)) {
        setShipmentOverview(overview);
        if (selectedShipment) {
          const selected = _.find(overview, { id: selectedShipment.id });
          setSelectedShipment(selected);
        }
        if (locShipmentID) {
          const locShip = _.find(overview, { partner_shipment_id: locShipmentID });
          setSelectedShipment(locShip);
          setShipmentFilter(locShip.status);
        }
      }
    }
  }, [shipmentData, custodianData, custodyData, contactInfo, allGatewayData, locShipmentID]);

  useEffect(() => {
    const alerts = _.filter(
      sensorAlertData,
      (alert) => alert.parameter_type !== 'location' && selectedShipment && alert.shipment_id === selectedShipment.partner_shipment_id,
    );
    if (selectedShipment) {
      if (!_.isEmpty(sensorReportData)) {
        const { sensorReportInfo, markersToSet, graphs } = processReportsAndMarkers(
          sensorReportData,
          alerts,
          data,
          unitData,
          theme.palette.error.main,
          theme.palette.info.main,
          selectedShipment,
        );
        setReports(sensorReportInfo);
        setAllGraphs(graphs);
        setMarkers(markersToSet);
      } else {
        setReports([]);
        setAllGraphs([]);
        setMarkers([]);
      }
    }
  }, [sensorReportData, sensorAlertData, selectedShipment]);

  useEffect(() => {
    if (selectedShipment) {
      setLoading(true);
    }
    if (markers && allGraphs && reports) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [selectedShipment, markers, allGraphs, reports]);

  const getShipmentValue = (value) => {
    let returnValue;
    if (selectedShipment[value] !== null) {
      if (moment(selectedShipment[value], true).isValid()) {
        const dateFormat = _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '';
        const timeFormat = _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '';
        returnValue = moment(selectedShipment[value])
          .tz(data).format(`${dateFormat} ${timeFormat}`);
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
    history.replaceState(null, '', location.pathname);
    location.search = '';
    setLocShipmentID('');
    setSelectedShipment(shipment);
  };

  const makeFilterSelection = (value) => {
    history.replaceState(null, '', location.pathname);
    location.search = '';
    setLocShipmentID('');
    isShipmentDataAvailable = false;
    setShipmentFilter(value);
    setSelectedShipment(null);
    setReports([]);
    setAllGraphs([]);
    setMarkers([]);
  };

  return (
    <Box mt={5} mb={5}>
      {(isLoadingShipments
        || isLoadingUnits
        || isLoadingCustodians
        || isLoadingContact
        || isLoadingAllGateways
        || isLoadingCustodies
        || isLoadingSensorAlerts
        || isLoadingSensorReports
        || isLoading
        || isFetchingShipments
        || isFetchingAllGateways
        || isFetchingSensorAlerts
        || isFetchingSensorReports)
        && (
          <Loader open={isLoadingShipments
            || isLoadingUnits
            || isLoadingCustodians
            || isLoadingContact
            || isLoadingAllGateways
            || isLoadingCustodies
            || isLoadingSensorAlerts
            || isLoadingSensorReports
            || isLoading
            || isFetchingShipments
            || isFetchingAllGateways
            || isFetchingSensorAlerts
            || isFetchingSensorReports}
          />
        )}
      <Typography className="reportingDashboardHeading" variant="h4">
        Reporting
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className="reportingSwitchViewSection">
            <Typography
              className="reportingSectionTitleHeading"
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
                marginTop: 0.7,
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
            unitOfMeasure={unitData}
          />
        </Grid>
        <Grid item xs={12} md={tileView ? 6 : 12}>
          <div className="reportingSwitchViewSection">
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
              <ToggleButton
                value="Battery Depleted"
                size="medium"
                selected={shipmentFilter === 'Battery Depleted'}
                onClick={(event, value) => makeFilterSelection(value)}
              >
                Battery Depleted
              </ToggleButton>
              <ToggleButton
                value="Damaged"
                size="medium"
                selected={shipmentFilter === 'Damaged'}
                onClick={(event, value) => makeFilterSelection(value)}
              >
                Damaged
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="reportingSwitchViewSection2">
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="shipment-name"
              select
              required
              className="reportingSelectInput"
              label="Shipment Name"
              value={
                selectedShipment
                  ? selectedShipment.id
                  : ''
              }
              sx={{
                marginRight: isDesktop2() ? 0 : 1,
              }}
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
                marginTop: 0.75,
              }}
            >
              {!tileView
                ? <ViewCompactIcon />
                : <ViewComfyIcon />}
            </IconButton>
          </div>
          <div className="reportingInfoContainer">
            <Card>
              <CardContent>
                <Grid container>
                  {selectedShipment
                    ? (_.map(
                      SHIPMENT_OVERVIEW_COLUMNS,
                      (column, index) => (
                        <Grid
                          item
                          className="reportingInfoSection"
                          xs={12}
                          sm={6}
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
                                  {`Name: ${_.find(selectedShipment[column.name], { has_current_custody: true })
                                    ? _.find(selectedShipment[column.name], { has_current_custody: true }).custodian_name
                                    : 'N/A'}`}
                                </Typography>
                                <Typography variant="body1">
                                  {`Custodian Address: ${selectedShipment.contact_info[_.findIndex(selectedShipment[column.name], { has_current_custody: true })]
                                    ? selectedShipment.contact_info[_.findIndex(selectedShipment[column.name], { has_current_custody: true })].address
                                    : 'N/A'}`}
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
      <Grid container className="reportingContainer" sx={{ marginTop: _.isEmpty(selectedShipment) ? 4 : -1 }}>
        <div className="reportingSwitchViewSection">
          <Typography
            className="reportingSectionTitleHeading"
            variant="h5"
          >
            {selectedShipment
              && selectedShipment.name
              && `Graph View - Shipment: ${selectedShipment.name}`}
            {!selectedShipment && 'Graph View'}
          </Typography>
        </div>
        <Grid item xs={2} sm={1.1} md={1}>
          <List
            component="nav"
            aria-label="main graph-type"
            className="reportingGraphIconBar"
          >
            {_.map(REPORT_TYPES(unitData), (item, index) => (
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
        <Grid item xs={10} sm={10.9} md={11}>
          {selectedShipment && selectedGraph && allGraphs && !_.isEmpty(allGraphs) && allGraphs[selectedGraph]
            ? (
              <GraphComponent
                data={allGraphs[selectedGraph]}
                selectedGraph={selectedGraph}
                unitOfMeasure={unitData}
                minTemp={allGraphs.minTemp}
                maxTemp={allGraphs.maxTemp}
                minHumidity={allGraphs.minHumidity}
                maxHumidity={allGraphs.maxHumidity}
                shockThreshold={allGraphs.shockThreshold}
                lightThreshold={allGraphs.lightThreshold}
                timeGap={selectedShipment.measurement_time || 5}
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
        sensorReport={reports}
        alerts={_.filter(
          sensorAlertData,
          { shipment_id: selectedShipment && selectedShipment.partner_shipment_id },
        )}
        shipmentName={selectedShipment && selectedShipment.name}
        selectedMarker={selectedShipment && selectedMarker}
        unitOfMeasure={unitData}
        timezone={data}
      />
      <AlertsReport
        sensorReport={reports}
        alerts={_.filter(
          sensorAlertData,
          { shipment_id: selectedShipment && selectedShipment.partner_shipment_id },
        )}
        shipmentName={selectedShipment && selectedShipment.name}
        timezone={data}
        unitOfMeasure={unitData}
        shouldScroll={!!locShipmentID}
      />
    </Box>
  );
};

export default Reporting;
