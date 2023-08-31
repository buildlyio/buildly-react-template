import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Box,
  Button,
  Chip,
  Fade,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
  useTheme,
} from '@mui/material';
import { Assignment as NoteIcon } from '@mui/icons-material';
import { makeStyles, styled } from '@mui/styles';
import Loader from '../../components/Loader/Loader';
import MapComponent from '../../components/MapComponent/MapComponent';
import DataTableWrapper from '../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../context/User.context';
import {
  getContact,
  getCustodians,
} from '../../redux/custodian/actions/custodian.actions';
import { getItems, getUnitOfMeasure } from '../../redux/items/actions/items.actions';
import { getGateways } from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import { getShipmentDetails } from '../../redux/shipment/actions/shipment.actions';
import { routes } from '../../routes/routesConstants';
import { getShipmentFormattedRow, shipmentColumns } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
  },
  tabs: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiTabs-scroller': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      top: '24%',
      left: '0',
    },
  },
  tab: {
    color: theme.palette.background.default,
  },
  dataTable: {
    marginTop: '-40px',
    '& .MuiTableCell-root': {
      color: 'inherit',
    },
    '& .MuiTableCell-paddingCheckbox': {
      display: 'none',
    },
  },
  attachedFiles: {
    border: `1px solid ${theme.palette.background.light}`,
    borderRadius: theme.spacing(0.5),
    height: '100%',
  },
  legend: {
    fontSize: theme.spacing(1.5),
  },
  shipmentName: {
    textDecoration: 'underline',
    textDecorationColor: theme.palette.background.light,
    cursor: 'pointer',
  },
  createButton: {
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const Shipment = ({
  shipmentData,
  custodianData,
  dispatch,
  itemData,
  gatewayData,
  custodyData,
  loading,
  timezone,
  unitOfMeasure,
  allSensorAlerts,
  history,
  sensorReports,
}) => {
  const classes = useStyles();
  const muiTheme = useTheme();
  const subNav = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [rows, setRows] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [allMarkers, setAllMarkers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const organization = useContext(UserContext).organization.organization_uuid;

  const HeaderElements = () => (
    <Tabs
      value={shipmentFilter}
      onChange={filterTabClicked}
      className={classes.tabs}
    >
      {_.map(subNav, (itemProps, index) => (
        <Tab
          {...itemProps}
          key={`tab${index}:${itemProps.value}`}
          className={classes.tab}
        />
      ))}
    </Tabs>
  );

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.dark,
      maxWidth: theme.spacing(40),
      border: `1px solid ${theme.palette.background.light}`,
    },
  }));

  useEffect(() => {
    dispatch(getShipmentDetails(organization, 'Planned,Enroute', true, true));
    dispatch(getCustodians(organization));
    dispatch(getContact(organization));
    dispatch(getItems(organization));
    dispatch(getGateways(organization));
    dispatch(getUnitOfMeasure(organization));
  }, []);

  useEffect(() => {
    const formattedRows = getShipmentFormattedRow(
      shipmentData,
      custodianData,
      custodyData,
      itemData,
      gatewayData,
      allSensorAlerts,
      muiTheme.palette.error.main,
      muiTheme.palette.info.main,
      sensorReports,
    );

    const filteredRows = _.filter(formattedRows, { type: shipmentFilter });
    setRows(filteredRows);
    setAllMarkers(_.map(filteredRows, 'allMarkers'));
  }, [shipmentFilter, shipmentData, custodianData, custodyData,
    itemData, gatewayData, allSensorAlerts, sensorReports]);

  useEffect(() => {
    if (selectedShipment) {
      processMarkers(selectedShipment);
    }
  }, [allSensorAlerts, sensorReports, timezone]);

  const processMarkers = (shipment, setExpanded = false) => {
    const dateFormat = !_.isEmpty(unitOfMeasure) && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure;
    const timeFormat = !_.isEmpty(unitOfMeasure) && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure;
    const tempMeasure = !_.isEmpty(unitOfMeasure) && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure;
    let markersToSet = [];
    const filteredReports = _.filter(sensorReports, {
      shipment_id: shipment.partner_shipment_id,
    });
    const filteredAlerts = _.filter(allSensorAlerts, { shipment_id: shipment.partner_shipment_id });

    if (!_.isEmpty(filteredReports)) {
      _.forEach(filteredReports, (report) => {
        const { report_entry } = report;
        let marker = {};
        let date = '';
        let time = '';
        let color = muiTheme.palette.success.main;
        let allAlerts = [];

        const preAlerts = _.orderBy(
          _.filter(filteredAlerts, (alert) => _.lte(_.toNumber(alert.report_id), report.id)),
          'create_date',
        );
        const recoveryAlerts = _.filter(preAlerts, (pa) => !!pa.recovered_alert_id);
        const recoveredIDs = _.uniq(_.map(recoveryAlerts, 'recovered_alert_id'));
        const recoveredTypeDateTime = _.map(recoveryAlerts, (ra) => (
          { parameter_type: ra.parameter_type, create_date: ra.create_date }
        ));
        const alertsTillNow = _.filter(preAlerts, (alert) => {
          const found = _.find(recoveredTypeDateTime, (radt) => (
            _.isEqual(radt.parameter_type, alert.parameter_type)
            && !!_.gt(radt.create_date, alert.create_date)
          ));

          return !found && !alert.recovered_alert_id
            && !_.includes(recoveredIDs, _.toString(alert.id));
        });

        let uniqueAlerts = [];
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })];
        }
        uniqueAlerts = _.orderBy(uniqueAlerts, 'create_date');

        const exactAlertID = _.filter(preAlerts, { report_id: _.toString(report.id) });
        _.forEach(exactAlertID, (alert) => {
          if (alert.recovered_alert_id) {
            _.remove(uniqueAlerts, { parameter_type: alert.parameter_type });
            allAlerts = [...allAlerts, { id: alert.parameter_type, color, title: `${_.capitalize(alert.parameter_type)} Excursion Recovered` }];
          }
        });

        _.forEach(uniqueAlerts, (alert) => {
          if (alert) {
            let alertColor = '';
            let title = '';
            const found = _.find(allAlerts, { id: alert.parameter_type });
            if (found) {
              _.remove(allAlerts, { id: alert.parameter_type });
            }

            switch (true) {
              case _.includes(_.toLower(alert.alert_type), 'max'):
              case _.includes(_.toLower(alert.alert_type), 'shock'):
              case _.includes(_.toLower(alert.alert_type), 'light'):
                color = muiTheme.palette.error.main;
                alertColor = muiTheme.palette.error.main;
                title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              case _.includes(_.toLower(alert.alert_type), 'min'):
                if (color !== muiTheme.palette.error.main) {
                  color = muiTheme.palette.info.main;
                }
                alertColor = muiTheme.palette.info.main;
                title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              default:
                break;
            }

            allAlerts = [...allAlerts, { id: alert.parameter_type, color: alertColor, title }];
          }
        });

        const temperature = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_temp_fah
          : _.round(report_entry.report_temp_cel, 2).toFixed(2);
        const probe = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_probe_fah
          : _.round(report_entry.report_probe_cel, 2).toFixed(2);

        if ('report_timestamp' in report_entry) {
          if (report_entry.report_timestamp !== null) {
            date = moment(report_entry.report_timestamp).tz(timezone).format(dateFormat);
            time = moment(report_entry.report_timestamp).tz(timezone).format(timeFormat);
          }
        } else if ('report_location' in report_entry) {
          date = moment(
            report_entry.report_location.timeOfPosition,
          ).tz(timezone).format(dateFormat);
          time = moment(
            report_entry.report_location.timeOfPosition,
          ).tz(timezone).format(timeFormat);
        }

        // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
        if (report_entry.report_location !== null
          && report_entry.report_latitude !== null
          && report_entry.report_longitude !== null) {
          const latitude = report_entry.report_latitude
            || report_entry.report_location.latitude;
          const longitude = report_entry.report_longitude
            || report_entry.report_location.longitude;
          if (
            (latitude >= -90 && latitude <= 90)
            && (longitude >= -180 && longitude <= 180)
            && date && time
          ) {
            marker = {
              lat: latitude,
              lng: longitude,
              location: report_entry.report_location,
              label: 'Clustered',
              temperature,
              light: report_entry.report_light,
              shock: report_entry.report_shock,
              tilt: report_entry.report_tilt,
              humidity: report_entry.report_humidity,
              battery: report_entry.report_battery,
              pressure: report_entry.report_pressure,
              probe,
              color,
              allAlerts,
              date,
              time,
            };

            markersToSet = [...markersToSet, marker];
          }
        } else {
          marker = {
            lat: '*',
            lng: '*',
            location: 'N/A',
            label: 'Clustered',
            temperature,
            light: report_entry.report_light,
            shock: report_entry.report_shock,
            tilt: report_entry.report_tilt,
            humidity: report_entry.report_humidity,
            battery: report_entry.report_battery,
            pressure: report_entry.report_pressure,
            probe,
            color,
            allAlerts,
            date,
            time,
          };
        }
      });
    }

    if (setExpanded) {
      const rowIndex = _.findIndex(rows, shipment);
      setExpandedRows([...expandedRows, rowIndex]);
    }

    setSelectedShipment(shipment);
    setMarkers(markersToSet);
    setSelectedMarker(markersToSet[0]);
  };

  const filterTabClicked = (event, filter) => {
    let shipmentStatus = '';
    setShipmentFilter(filter);

    switch (filter) {
      case 'Active':
      default:
        shipmentStatus = 'Planned,Enroute';
        break;

      case 'Completed':
      case 'Cancelled':
        shipmentStatus = filter;
        break;
    }

    dispatch(getShipmentDetails(organization, shipmentStatus, true, true));
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <Button type="button" onClick={(e) => history.push(routes.CREATE_SHIPMENT)} className={classes.createButton}>
        + Create Shipment
      </Button>
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.title}>
            <Typography className={classes.tileHeading} variant="h6">
              {selectedShipment ? selectedShipment.name : 'All shipments'}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          <MapComponent
            allMarkers={allMarkers}
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
              <div style={{ height: '600px' }} />
            }
            mapElement={
              <div style={{ height: '100%' }} />
            }
            clusterClick={processMarkers}
          />
        </Grid>

        <Grid item xs={12} className={classes.dataTable}>
          <DataTableWrapper
            hideAddButton
            filename="ShipmentData"
            loading={loading}
            rows={rows}
            columns={[
              {
                name: '',
                options: {
                  sort: false,
                  sortThirdClickReset: false,
                  filter: false,
                  customBodyRenderLite: (dataIndex) => (
                    rows[dataIndex] && rows[dataIndex].note
                      ? (
                        <HtmlTooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="bottom-start"
                          title={<Typography>{rows[dataIndex].note}</Typography>}
                        >
                          <NoteIcon />
                        </HtmlTooltip>
                      ) : <></>
                  ),
                },
              },
              {
                name: 'name',
                label: 'Shipment Name',
                options: {
                  sort: true,
                  sortThirdClickReset: true,
                  filter: true,
                  customBodyRenderLite: (dataIndex) => (
                    <Typography
                      className={classes.shipmentName}
                      onClick={(e) => {
                        history.push(routes.CREATE_SHIPMENT, {
                          ship: _.omit(rows[dataIndex], ['type', 'itemNames', 'tracker', 'battery_levels', 'alerts', 'allMarkers']),
                        });
                      }}
                    >
                      {rows[dataIndex].name}
                    </Typography>
                  ),
                },
              },
              ...shipmentColumns(
                timezone,
                _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                  ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                  : '',
              ),
            ]}
            extraOptions={{
              expandableRows: true,
              expandableRowsHeader: false,
              expandableRowsOnClick: true,
              customToolbar: () => (<HeaderElements style={{ right: '180%' }} />),
              setRowProps: (row, dataIndex, rowIndex) => ({
                style: { color: _.isEqual(row[2], 'Planned') ? muiTheme.palette.background.light : 'inherit' },
              }),
              rowsExpanded: expandedRows,
              onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => {
                if (_.isEmpty(allExpanded)) {
                  setAllMarkers(_.map(rows, 'allMarkers'));
                  setSelectedShipment(null);
                  setMarkers([]);
                  setSelectedMarker({});
                } else {
                  processMarkers(rows[_.last(allExpanded).dataIndex]);
                }
                setExpandedRows(_.map(allExpanded, 'dataIndex'));
              },
              renderExpandableRow: (rowData, rowMeta) => {
                const colSpan = rowData.length + 1;
                const ship = rows[rowMeta.rowIndex];

                return (
                  <TableRow>
                    <TableCell colSpan={colSpan}>
                      <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <Grid container rowGap={1}>
                            <Grid item xs={12}>
                              <Typography fontWeight={700}>
                                Order ID:
                              </Typography>
                              <Typography>
                                {ship.order_number}
                              </Typography>
                            </Grid>

                            <Grid item xs={12}>
                              <Typography fontWeight={700}>
                                Items:
                              </Typography>
                              {_.map(_.split(ship.itemNames, ','), (item, idx) => (
                                <Typography key={`${item}-${idx}`}>{item}</Typography>
                              ))}
                            </Grid>

                            <Grid item xs={12}>
                              <Typography fontWeight={700}>
                                Status:
                              </Typography>
                              <Typography>
                                {ship.type}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={2}>
                          <Grid container rowGap={1}>
                            {_.map(ship.carriers, (carr, idx) => (
                              <Grid key={`${carr}-${idx}`} item xs={12}>
                                <Typography fontWeight={700}>
                                  {`Logistics company ${idx + 1}:`}
                                </Typography>
                                <Typography>
                                  {carr}
                                </Typography>
                              </Grid>
                            ))}

                            <Grid item xs={12}>
                              <Typography fontWeight={700}>
                                Receiver:
                              </Typography>
                              <Typography>
                                {ship.destination}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={2}>
                          {!_.isEmpty(markers) && markers[0] && (
                            <Grid container rowGap={1}>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  Last location:
                                </Typography>
                                <Typography>
                                  {markers[0].location}
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>

                        <Grid item xs={2}>
                          {!_.isEmpty(markers) && markers[0] && (
                            <Grid container rowGap={1}>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  Last Reading:
                                </Typography>
                                <Typography>
                                  {`Recorded at: ${markers[0].date} ${markers[0].time}`}
                                </Typography>
                                <Typography>
                                  {`Temp: ${markers[0].temperature}`}
                                </Typography>
                                <Typography>
                                  {`Humidity: ${markers[0].humidity}`}
                                </Typography>
                                <Typography>
                                  {`Shock: ${markers[0].shock}`}
                                </Typography>
                                <Typography>
                                  {`Light: ${markers[0].light}`}
                                </Typography>
                                <Typography>
                                  {`Battery: ${markers[0].battery}`}
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>

                        <Grid item xs={4} alignItems="end" justifyContent="end">
                          <Grid container rowGap={1}>
                            <Grid item xs={12}>
                              <TextField
                                variant="outlined"
                                disabled
                                multiline
                                fullWidth
                                maxRows={4}
                                id="note"
                                name="note"
                                label="Note"
                                autoComplete="note"
                                value={ship.note || ''}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl
                                fullWidth
                                component="fieldset"
                                variant="outlined"
                                className={classes.attachedFiles}
                                style={{
                                  padding: _.isEmpty(ship.uploaded_pdf)
                                    ? muiTheme.spacing(3)
                                    : muiTheme.spacing(1.5),
                                }}
                              >
                                <FormLabel component="legend" className={classes.legend}>
                                  Attached Files
                                </FormLabel>

                                <Stack direction="row" spacing={1}>
                                  {!_.isEmpty(ship.uploaded_pdf)
                                  && _.map(ship.uploaded_pdf, (file, idx) => (
                                    <Chip key={`${file}-${idx}`} variant="outlined" label={file} />
                                  ))}
                                </Stack>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              },
            }}
          />
        </Grid>
      </Grid>
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
