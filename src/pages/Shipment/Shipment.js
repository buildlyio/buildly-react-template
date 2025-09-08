/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useMemo } from 'react';
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
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Assignment as NoteIcon } from '@mui/icons-material';
import CustomizedSteppers from '@components/CustomizedStepper/CustomizedStepper';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import Loader from '@components/Loader/Loader';
import MapComponent from '@components/MapComponent/MapComponent';
import { getUser } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import {
  getIcon,
  getShipmentFormattedRow,
  shipmentColumns,
  tempUnit,
} from '@utils/constants';
import { useQuery } from 'react-query';
import { getShipmentsQuery } from '@react-query/queries/shipments/getShipmentsQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getItemQuery } from '@react-query/queries/items/getItemQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getCountriesQuery } from '@react-query/queries/shipments/getCountriesQuery';
import { getAllGatewayQuery } from '@react-query/queries/sensorGateways/getAllGatewayQuery';
import { getCustodyQuery } from '@react-query/queries/custodians/getCustodyQuery';
import { getSensorReportQuery } from '@react-query/queries/sensorGateways/getSensorReportQuery';
import { getSensorAlertQuery } from '@react-query/queries/sensorGateways/getSensorAlertQuery';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import './ShipmentStyles.css';
import { TIVE_GATEWAY_TIMES } from '@utils/mock';
import { calculateLatLngBounds } from '@utils/utilMethods';
import UniversalFileViewer from '@components/UniversalFileViewer/UniversalFileViewer';
import { useTranslation } from 'react-i18next'; // For internationalization support

/**
 * Shipment Component
 * This component manages the display and interaction with shipment data.
 * It includes functionality for filtering shipments, viewing shipment details, and rendering maps and tables.
 */
const Shipment = ({ history }) => {
  const muiTheme = useTheme(); // Material-UI theme for styling
  const user = getUser(); // Fetch the current logged-in user
  const organization = user.organization.organization_uuid; // Get the organization UUID of the logged-in user
  const userLanguage = user && user.user_language; // Get the user's preferred language

  const { t } = useTranslation(); // Translation function for internationalization

  const { displayAlert } = useAlert(); // Hook to display alerts
  const { data } = useStore(); // Zustand store for timezone data

  let isShipmentDataAvailable = false;

  // State variables
  const [shipmentFilter, setShipmentFilter] = useState('Active'); // Tracks the current shipment filter (e.g., Active, Completed)
  const [rows, setRows] = useState([]); // Stores formatted shipment data for the table
  const [selectedShipment, setSelectedShipment] = useState(null); // Tracks the currently selected shipment
  const [markers, setMarkers] = useState([]); // Stores map markers for the selected shipment
  const [selectedMarker, setSelectedMarker] = useState({}); // Tracks the currently selected map marker
  const [allMarkers, setAllMarkers] = useState([]); // Stores all map markers for global view
  const [expandedRows, setExpandedRows] = useState([]); // Tracks expanded rows in the data table
  const [steps, setSteps] = useState([]); // Tracks the steps for the shipment timeline
  const [isLoading, setLoading] = useState(false); // Tracks the loading state for the component
  const [selectedCluster, setSelectedCluster] = useState({}); // Tracks the selected cluster on the map
  const [zoom, setZoom] = useState(4); // Tracks the zoom level for the map

  const [selectedFile, setSelectedFile] = useState(null);

  const [openFileViewerModal, setFileViewerModal] = useState(false);

  // Fetch shipment data
  const { data: shipmentData, isLoading: isLoadingShipments } = useQuery(
    ['shipments', shipmentFilter, organization],
    () => getShipmentsQuery(organization, shipmentFilter === 'Active' ? 'Planned,En route,Arrived' : shipmentFilter, displayAlert, 'Shipment'),
    { refetchOnWindowFocus: false },
  );

  isShipmentDataAvailable = !_.isEmpty(shipmentData) && !isLoadingShipments;

  // Fetch custodian data
  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert, 'Shipment'),
    { refetchOnWindowFocus: false },
  );

  // Fetch item data
  const { data: itemData, isLoading: isLoadingItems } = useQuery(
    ['items', organization],
    () => getItemQuery(organization, displayAlert, 'Shipment'),
    { refetchOnWindowFocus: false },
  );

  // Fetch unit data
  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert, 'Shipment'),
    { refetchOnWindowFocus: false },
  );

  // Fetch country data
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert, 'Shipment'),
    { refetchOnWindowFocus: false },
  );

  // Fetch gateway data
  const { data: allGatewayData, isLoading: isLoadingAllGateways } = useQuery(
    ['allGateways'],
    () => getAllGatewayQuery(displayAlert, 'Shipment'),
    { refetchOnWindowFocus: false },
  );

  // Fetch custody data
  const { data: custodyData, isLoading: isLoadingCustodies } = useQuery(
    ['custodies', shipmentData, shipmentFilter],
    () => getCustodyQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null))), displayAlert, 'Shipment'),
    {
      enabled: isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  // Fetch sensor alert data
  const { data: sensorAlertData, isLoading: isLoadingSensorAlerts } = useQuery(
    ['sensorAlerts', shipmentData, shipmentFilter],
    () => getSensorAlertQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null))), displayAlert, 'Shipment'),
    {
      enabled: isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  // Fetch sensor report data for global view
  const { data: reportData1, isLoading: isLoadingReports1 } = useQuery(
    ['sensorReports', 'bulk', shipmentData, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null))), 10, displayAlert, 'Shipment'),
    {
      enabled: _.isEmpty(selectedShipment) && _.isEmpty(expandedRows) && isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const country = _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country'))
    ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country')).unit_of_measure
    : 'United States';
  const organizationCountry = _.find(countriesData, (item) => item.country.toLowerCase() === country.toLowerCase())
    && _.find(countriesData, (item) => item.country.toLowerCase() === country.toLowerCase()).iso3;

  // Fetch sensor report data for selected shipment
  const {
    data: reportData2,
    isLoading: isLoadingReports2,
    refetch: refetchReports2,
  } = useQuery(
    ['sensorReports', 'single', shipmentData, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(selectedShipment.partner_shipment_id), null, displayAlert, 'Shipment'),
    {
      enabled: !_.isEmpty(selectedShipment) && !_.isEmpty(expandedRows) && isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const sensorReportData = useMemo(() => _.uniqWith(
    [...(reportData1 || []), ...(reportData2 || [])],
    _.isEqual,
  ), [reportData1, reportData2]);

  const isLoadingSensorReports = selectedShipment ? isLoadingReports2 : isLoadingReports1; // Determine which loading state to use

  const isLoaded = isLoadingShipments
    || isLoadingCustodians
    || isLoadingItems
    || isLoadingUnits
    || isLoadingCountries
    || isLoadingAllGateways
    || isLoadingCustodies
    || isLoadingSensorAlerts
    || isLoadingSensorReports
    || isLoading;

  // Effect to format and filter shipment rows based on the selected filter
  useEffect(() => {
    const formattedRows = getShipmentFormattedRow(
      shipmentData,
      custodianData,
      custodyData,
      itemData,
      allGatewayData,
      sensorAlertData,
      muiTheme.palette.error.main,
      muiTheme.palette.info.main,
      sensorReportData,
    );
    const filteredRows = _.filter(formattedRows, { type: shipmentFilter });
    if (_.isEmpty(selectedCluster)) {
      setRows(filteredRows);
    }
    setAllMarkers(_.map(filteredRows, 'allMarkers'));
  }, [shipmentFilter, shipmentData, custodianData, custodyData,
    itemData, allGatewayData, sensorAlertData, sensorReportData]);

  // Effect to handle delayed shipments and display alerts
  useEffect(() => {
    if (!_.isEmpty(shipmentData) && !_.isEqual(isLoaded, true)) {
      const localDelayedShipments = JSON.parse(localStorage.getItem('delayedShipments')) || [];
      const delayedShipments = _.filter(shipmentData, (item) => item.delayed === true && item.status === 'Planned');
      const newDelayedShipments = _.filter(delayedShipments, (item) => !localDelayedShipments.includes(item.name));
      if (!_.isEmpty(newDelayedShipments)) {
        newDelayedShipments.forEach((item) => {
          displayAlert('error', t('shipment.alertDelayed', { name: item.name }));
        });
      }
      const updatedDelayedShipments = [...localDelayedShipments, ...newDelayedShipments.map((item) => item.name)];
      localStorage.setItem('delayedShipments', JSON.stringify(updatedDelayedShipments));
    }
  }, [shipmentData, isLoaded]);

  // Effect to adjust map zoom level based on markers or selected cluster
  useEffect(() => {
    if (!_.isEmpty(markers) || !_.isEmpty(selectedCluster)) {
      setZoom(12);
    } else {
      setZoom(4);
    }
  }, [markers, selectedCluster]);

  // Effect to process markers for the selected shipment
  useEffect(() => {
    if (selectedShipment) {
      processMarkers(selectedShipment, true);
    }
  }, [sensorAlertData, sensorReportData, data]);

  // Effect to refetch reports for the selected shipment when expanded
  useEffect(() => {
    if (!_.isEmpty(selectedShipment)) {
      setLoading(true);
      refetchReports2();
    }
    if (expandedRows) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [selectedShipment, expandedRows]);

  // Effect to filter rows based on the selected cluster
  useEffect(() => {
    if (!_.isEmpty(selectedCluster) && !_.isEmpty(rows)) {
      const { lat, lng } = selectedCluster;
      const { radius } = user.organization;
      const values = calculateLatLngBounds(lat, lng, radius);
      const filteredRows = rows.filter((obj) => !_.isEmpty(obj.allMarkers));
      const clusterFilteredRows = filteredRows.filter((obj) => {
        const firstMarker = _.first(obj.allMarkers);
        const isLatInRange = firstMarker.lat >= values.minLat && firstMarker.lat <= values.maxLat;
        const isLngInRange = firstMarker.lng >= values.minLng && firstMarker.lng <= values.maxLng;
        return isLatInRange && isLngInRange;
      });
      setRows(clusterFilteredRows);
    }
  }, [selectedCluster]);

  /**
 * Process markers for a shipment and update the map and timeline.
 * This function processes sensor reports and alerts for a given shipment,
 * generates timeline steps, and updates map markers.
 *
 * @param {object} shipment - The selected shipment object.
 * @param {boolean} setExpanded - Whether to expand the row in the table (default: false).
 */
  const processMarkers = (shipment, setExpanded = false) => {
    // Extract date, time, and temperature formats from unit data
    const dateFormat = !_.isEmpty(unitData) && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure;
    const timeFormat = !_.isEmpty(unitData) && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure;
    const tempMeasure = !_.isEmpty(unitData) && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure;

    let markersToSet = []; // Array to store processed map markers
    const filteredReports = _.filter(sensorReportData, { shipment_id: shipment.partner_shipment_id }); // Filter sensor reports for the shipment
    const filteredAlerts = _.filter(sensorAlertData, { shipment_id: shipment.partner_shipment_id }); // Filter sensor alerts for the shipment

    let newSteps = []; // Array to store timeline steps
    let arrivedSteps = []; // Steps for alerts during arrival
    let activeSteps = []; // Steps for active alerts

    // Initialize timeline steps for shipment creation and start
    newSteps = [
      {
        id: 1,
        title: shipment.origin,
        titleColor: 'inherit',
        label: t('shipment.step.created'),
        content: moment(shipment.create_date).tz(data).format(`${dateFormat} ${timeFormat}`),
        active: true,
        error: false,
        info: false,
        completed: shipment.last_fujitsu_verification_datetime && _.lte(
          moment(shipment.create_date).unix(),
          moment(shipment.last_fujitsu_verification_datetime).unix(),
        ),
      },
      {
        id: 2,
        title: shipment.origin,
        titleColor: 'inherit',
        label: t('shipment.step.started'),
        content: _.isEmpty(shipment.actual_time_of_departure)
          ? moment(shipment.estimated_time_of_departure).tz(data).format(`${dateFormat} ${timeFormat}`)
          : moment(shipment.actual_time_of_departure).tz(data).format(`${dateFormat} ${timeFormat}`),
        caption: _.isEmpty(shipment.actual_time_of_departure) ? t('shipment.step.estimated') : t('shipment.step.actual'),
        active: !!shipment.actual_time_of_departure,
        error: false,
        info: false,
        completed: shipment.last_fujitsu_verification_datetime && _.lte(
          moment(shipment.actual_time_of_departure || shipment.estimated_time_of_departure).unix(),
          moment(shipment.last_fujitsu_verification_datetime).unix(),
        ),
      },
    ];

    // Process alerts for the shipment
    if (!_.isEmpty(filteredAlerts)) {
      const alerts = _.filter(filteredAlerts, (alert) => !alert.recovered_alert_id); // Filter unrecovered alerts

      // Separate alerts into "arrived" and "active" categories
      const arrivedAlerts = _.filter(alerts, (alert) => {
        const createDate = moment(alert.create_date).unix();
        return (
          createDate >= (moment(shipment.actual_time_of_departure).unix() || moment(shipment.estimated_time_of_departure).unix())
          && createDate <= (moment(shipment.actual_time_of_arrival).unix() || moment(shipment.estimated_time_of_arrival).unix())
        );
      });

      const activeAlerts = _.filter(alerts, (alert) => {
        const createDate = moment(alert.create_date).unix();
        return !(
          createDate >= (moment(shipment.actual_time_of_departure).unix() || moment(shipment.estimated_time_of_departure).unix())
          && createDate <= (moment(shipment.actual_time_of_arrival).unix() || moment(shipment.estimated_time_of_arrival).unix())
        );
      });

      // Generate timeline steps for alerts
      if (_.isEmpty(shipment.actual_time_of_arrival)) {
        arrivedSteps = _.map(alerts, (a) => createAlertStep(a, dateFormat, timeFormat, shipment));
      } else {
        arrivedSteps = _.map(arrivedAlerts, (a) => createAlertStep(a, dateFormat, timeFormat, shipment));
        activeSteps = _.map(activeAlerts, (a) => createAlertStep(a, dateFormat, timeFormat, shipment));
      }
    }

    // Add arrival and active alert steps to the timeline
    newSteps = [...newSteps, ...arrivedSteps];

    // Add a step for shipment arrival
    newSteps = [...newSteps, {
      id: _.maxBy(newSteps, 'id') ? (_.maxBy(newSteps, 'id').id + 1) : 3,
      title: shipment.destination,
      titleColor: 'inherit',
      label: t('shipment.step.arrived'),
      content: _.isEmpty(shipment.actual_time_of_arrival)
        ? moment(shipment.estimated_time_of_arrival).tz(data).format(`${dateFormat} ${timeFormat}`)
        : moment(shipment.actual_time_of_arrival).tz(data).format(`${dateFormat} ${timeFormat}`),
      caption: _.isEmpty(shipment.actual_time_of_arrival) ? t('shipment.step.estimated') : t('shipment.step.actual'),
      active: !!shipment.actual_time_of_arrival,
      error: false,
      info: false,
      completed: shipment.last_fujitsu_verification_datetime && _.lte(
        moment(shipment.actual_time_of_arrival || shipment.estimated_time_of_arrival).unix(),
        moment(shipment.last_fujitsu_verification_datetime).unix(),
      ),
    }];

    // Add active alert steps to the timeline
    newSteps = [...newSteps, ...activeSteps];

    // Add a step for shipment completion
    newSteps = [...newSteps, {
      id: _.maxBy(newSteps, 'id') ? (_.maxBy(newSteps, 'id').id + 2) : 4,
      title: shipment.destination,
      titleColor: 'inherit',
      label: t('shipment.step.completed'),
      content: _.isEqual(shipment.status, 'Completed')
        ? moment(shipment.actual_time_of_completion || shipment.edit_date).tz(data).format(`${dateFormat} ${timeFormat}`)
        : moment(shipment.actual_time_of_arrival || shipment.estimated_time_of_arrival).add(24, 'h').tz(data).format(`${dateFormat} ${timeFormat}`),
      caption: !_.isEqual(shipment.status, 'Completed') ? t('shipment.step.estimated') : t('shipment.step.actual'),
      active: _.isEqual(shipment.status, 'Completed'),
      error: false,
      info: false,
      completed: shipment.last_fujitsu_verification_datetime && _.lte(
        _.isEqual(shipment.status, 'Completed')
          ? moment(shipment.actual_time_of_completion || shipment.edit_date).unix()
          : moment(shipment.actual_time_of_arrival || shipment.estimated_time_of_arrival).add(24, 'h').unix(),
        moment(shipment.last_fujitsu_verification_datetime).unix(),
      ),
    }];

    // Process sensor reports to generate map markers
    if (!_.isEmpty(filteredReports)) {
      _.forEach(filteredReports, (report) => {
        const marker = createMarker(report, filteredAlerts, dateFormat, timeFormat, tempMeasure);
        if (marker) {
          markersToSet = [...markersToSet, marker];
        }
      });
    }

    // Update state with processed data
    if (setExpanded) {
      const rowIndex = _.findIndex(rows, (item) => item.id === shipment.id, 0);
      setExpandedRows([rowIndex]);
      setSteps(_.orderBy(newSteps, 'id'));
    }
    setSelectedShipment(shipment);
    setMarkers(_.orderBy(markersToSet, [(obj) => moment(`${obj.date} ${obj.time}`)], ['desc']));
    setSelectedMarker(markers[0]);
  };

  /**
   * Helper function to create a timeline step for an alert.
   * @param {object} alert - The alert object.
   * @param {string} dateFormat - The date format.
   * @param {string} timeFormat - The time format.
   * @param {object} shipment - The shipment object.
   * @returns {object} - The timeline step object.
   */
  const createAlertStep = (alert, dateFormat, timeFormat, shipment) => {
    const error = _.includes(_.toLower(alert.alert_type), 'max') || _.includes(_.toLower(alert.alert_type), 'shock') || _.includes(_.toLower(alert.alert_type), 'light');
    const info = _.includes(_.toLower(alert.alert_type), 'min');
    const item = {
      id: alert.parameter_type,
      color: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
      title: error
        ? t('shipment.alert.titleMax', { param: _.capitalize(alert.parameter_type) })
        : t('shipment.alert.titleMin', { param: _.capitalize(alert.parameter_type) }),
    };
    return {
      id: moment(alert.create_date).unix(),
      titleIcon: getIcon(item, t),
      title: alert.parameter_type === 'shock' || alert.parameter_type === 'light'
        ? `${_.toString(_.round(_.toNumber(alert.parameter_value.split(' ')[0]), 2))} ${alert.parameter_value.split(' ')[1]}`
        : alert.parameter_value,
      titleColor: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
      label: t('shipment.alert.exception'),
      content: moment(alert.create_date).tz(data).format(`${dateFormat} ${timeFormat}`),
      active: false,
      completed: shipment.last_fujitsu_verification_datetime && _.lte(
        moment(alert.create_date).unix(),
        moment(shipment.last_fujitsu_verification_datetime).unix(),
      ),
      error,
      info,
    };
  };

  /**
   * Helper function to create a map marker for a sensor report.
   * @param {object} report - The sensor report object.
   * @param {array} filteredAlerts - The filtered alerts for the shipment.
   * @param {string} dateFormat - The date format.
   * @param {string} timeFormat - The time format.
   * @param {string} tempMeasure - The temperature unit of measure.
   * @returns {object|null} - The map marker object or null if invalid.
   */
  const createMarker = (report, filteredAlerts, dateFormat, timeFormat, tempMeasure) => {
    const { report_entry } = report;
    const date = moment(report.activation_date).tz(data).format(dateFormat);
    const time = moment(report.activation_date).tz(data).format(timeFormat);

    // Validate latitude and longitude
    const latitude = report_entry.report_latitude || report_entry.report_location?.latitude;
    const longitude = report_entry.report_longitude || report_entry.report_location?.longitude;
    if (!latitude || !longitude || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return null;
    }

    // Create the marker object
    return {
      lat: latitude,
      lng: longitude,
      location: report_entry.report_location,
      label: t('shipment.map.clustered'),
      temperature: _.isEqual(_.lowerCase(tempMeasure), 'fahrenheit') ? report_entry.report_temp_fah : report_entry.report_temp_cel,
      light: report_entry.report_light,
      shock: report_entry.report_shock,
      tilt: report_entry.report_tilt,
      humidity: report_entry.report_humidity,
      battery: report_entry.report_battery,
      pressure: report_entry.report_pressure,
      probe: _.isEqual(_.lowerCase(tempMeasure), 'fahrenheit') ? report_entry.report_probe_fah : report_entry.report_probe_cel,
      color: muiTheme.palette.success.main,
      allAlerts: [], // Alerts can be added here if needed
      date,
      time,
    };
  };

  /**
   * Handle filter tab click to update the shipment filter.
   * @param {Event} event - The click event.
   * @param {string} filter - The selected filter.
   */
  const filterTabClicked = async (event, filter) => {
    isShipmentDataAvailable = false;
    setShipmentFilter(filter);
    setSelectedShipment(null);
    setMarkers([]);
    setSelectedMarker({});
    setExpandedRows([]);
    setSteps([]);
    setSelectedCluster({});
  };

  /**
   * Render sensor data for a marker.
   * @param {object} marker - The selected marker.
   * @returns {JSX.Element} - The rendered sensor data.
   */
  const renderSensorData = (marker) => {
    const isValidData = (
      marker.temperature !== null && marker.temperature !== undefined
      && marker.humidity !== null && marker.humidity !== undefined
      && marker.shock !== null && marker.shock !== undefined
      && marker.light !== null && marker.light !== undefined
      && marker.battery !== null && marker.battery !== undefined
    );
    const maxTemp = selectedShipment && _.orderBy(selectedShipment.max_excursion_temp, 'set_at', 'desc')[0];
    const minTemp = selectedShipment && _.orderBy(selectedShipment.min_excursion_temp, 'set_at', 'desc')[0];
    const maxHum = selectedShipment && _.orderBy(selectedShipment.max_excursion_humidity, 'set_at', 'desc')[0];
    const minHum = selectedShipment && _.orderBy(selectedShipment.min_excursion_humidity, 'set_at', 'desc')[0];
    const maxShock = selectedShipment && _.orderBy(selectedShipment.shock_threshold, 'set_at', 'desc')[0];
    const maxLight = selectedShipment && _.orderBy(selectedShipment.light_threshold, 'set_at', 'desc')[0];
    const temperatureUnit = tempUnit(_.find(unitData, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))));

    return isValidData && (
      <>
        <Grid container flex>
          <Typography component="div">
            {t('shipment.sensor.temp')}
            {' ('}
            <span className="shipmentMaxColor">{maxTemp.value}</span>
            /
            <span className="shipmentMinColor">{minTemp.value}</span>
            {` ${temperatureUnit}): ${marker.temperature} ${temperatureUnit}`}
          </Typography>
        </Grid>
        <Grid container flex>
          <Typography component="div">
            {t('shipment.sensor.humidity')}
            {' ('}
            <span className="shipmentMaxColor">{maxHum.value}</span>
            /
            <span className="shipmentMinColor">{minHum.value}</span>
            {` %): ${marker.humidity} %`}
          </Typography>
        </Grid>
        <Grid container flex>
          <Typography component="div">
            {t('shipment.sensor.shock')}
            {' ('}
            <span className="shipmentMaxColor">{maxShock.value}</span>
            {` G): ${marker.shock} G`}
          </Typography>
        </Grid>
        <Grid container flex>
          <Typography component="div">
            {t('shipment.sensor.light')}
            {' ('}
            <span className="shipmentMaxColor">{maxLight.value}</span>
            {` LUX): ${marker.light} LUX`}
          </Typography>
        </Grid>
        {user && user.organization && user.organization.enable_tilt && (
          <Typography>
            {`${t('shipment.sensor.tilt')}: `}
            {_.isEmpty(marker.tilt) ? 'N/A' : `${marker.tilt.roll}° X-axis / ${marker.tilt.pitch}° Y-axis`}
          </Typography>
        )}
        <Typography>{`${t('shipment.sensor.battery')}: ${marker.battery}`}</Typography>
      </>
    );
  };

  /**
   * Render irregular transmission data for a marker.
   * @param {object} marker - The selected marker.
   * @returns {JSX.Element} - The rendered irregular transmission data.
   */
  const renderIrregularTransmission = (marker) => {
    const hasInvalidData = (
      marker.temperature === null || marker.temperature === undefined
      || marker.humidity === null || marker.humidity === undefined
      || marker.shock === null || marker.shock === undefined
      || marker.light === null || marker.light === undefined
      || marker.battery === null || marker.battery === undefined
    );
    const maxTemp = selectedShipment && _.orderBy(selectedShipment.max_excursion_temp, 'set_at', 'desc')[0];
    const minTemp = selectedShipment && _.orderBy(selectedShipment.min_excursion_temp, 'set_at', 'desc')[0];
    const maxHum = selectedShipment && _.orderBy(selectedShipment.max_excursion_humidity, 'set_at', 'desc')[0];
    const minHum = selectedShipment && _.orderBy(selectedShipment.min_excursion_humidity, 'set_at', 'desc')[0];
    const maxShock = selectedShipment && _.orderBy(selectedShipment.shock_threshold, 'set_at', 'desc')[0];
    const maxLight = selectedShipment && _.orderBy(selectedShipment.light_threshold, 'set_at', 'desc')[0];
    const temperatureUnit = tempUnit(_.find(unitData, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')));

    return hasInvalidData && (
      <Grid item xs={12}>
        <Typography fontWeight={700} fontStyle="italic">
          {t('shipment.irregular.title')}
        </Typography>
        {renderSensorValue(`${t('shipment.sensor.temp')} `, marker.temperature, `${maxTemp.value} ${temperatureUnit}`, `${minTemp.value} ${temperatureUnit}`, temperatureUnit)}
        {renderSensorValue(`${t('shipment.sensor.humidity')} `, marker.humidity, `${maxHum.value} %`, `${minHum.value} %`, '%')}
        {renderSensorValue(`${t('shipment.sensor.shock')} `, marker.shock, `${maxShock.value} G`, null, 'G')}
        {renderSensorValue(`${t('shipment.sensor.light')} `, marker.light, `${maxLight.value} LUX`, null, 'LUX')}
        {renderSensorValue(`${t('shipment.sensor.battery')} `, marker.battery)}
      </Grid>
    );
  };

  /**
   * Render a sensor value with optional thresholds.
   * @param {string} label - The label for the sensor value.
   * @param {number} value - The sensor value.
   * @param {number} max - The maximum threshold (optional).
   * @param {number} min - The minimum threshold (optional).
   * @returns {JSX.Element} - The rendered sensor value.
   */
  const renderSensorValue = (label, value, max = null, min = null, unit = null) => (
    !_.isEqual(value, null) && !_.isEqual(value, undefined) && (
      <Grid container flex>
        <Typography>{label}</Typography>
        {(max || min) && (
          <Typography>(</Typography>
        )}
        {max && (
          <Typography className="shipmentMaxColor">{max}</Typography>
        )}
        {max && min && (
          <Typography>/</Typography>
        )}
        {min && (
          <Typography className="shipmentMinColor">{min}</Typography>
        )}
        {(max || min) && (
          <Typography>)</Typography>
        )}
        <Typography>{`: ${value} ${unit}`}</Typography>
      </Grid>
    )
  );

  const handleFileView = (file, link) => {
    setFileViewerModal(true);
    setSelectedFile({ file, link });
  };

  const closeFileView = () => {
    setFileViewerModal(false);
  };

  return (
    <Box mt={5} mb={5}>
      {/* Show loader if data is being loaded */}
      {isLoaded && <Loader open={isLoaded} />}

      {/* Button to create a new shipment */}
      <Button
        type="button"
        onClick={(e) => history.push(routes.CREATE_SHIPMENT)} // Navigate to the "Create Shipment" page
        className="shipmentCreateButton"
      >
        {t('shipment.cta.create')}
      </Button>

      {/* Button to go back to global view */}
      {!_.isEmpty(selectedCluster) && (
        <Button
          type="button"
          className="shipmentGoBackButton"
          onClick={() => {
            // Reset the view to show all shipments in the global view
            const formattedRows = getShipmentFormattedRow(
              shipmentData,
              custodianData,
              custodyData,
              itemData,
              allGatewayData,
              sensorAlertData,
              muiTheme.palette.error.main,
              muiTheme.palette.info.main,
              sensorReportData,
            );
            const filteredRows = _.filter(formattedRows, { type: shipmentFilter });
            setSelectedCluster({});
            setRows(filteredRows);
            setExpandedRows([]);
            setSelectedShipment(null);
            setSelectedMarker({});
            setAllMarkers(_.map(filteredRows, 'allMarkers'));
            setMarkers([]);
            setSteps([]);
          }}
        >
          {t('shipment.cta.goBackGlobal')}
        </Button>
      )}

      {/* Shipment title */}
      <Grid container>
        <Grid item xs={12}>
          <div className="shipmentTitle">
            <Typography variant="h6">
              {/* Display the selected shipment name or "All shipments" */}
              {selectedShipment ? selectedShipment.name : t('shipment.title.all')}
            </Typography>
          </div>
        </Grid>

        {/* Map component */}
        <Grid item xs={12}>
          <MapComponent
            allMarkers={allMarkers} // All markers for the global view
            isMarkerShown={!_.isEmpty(markers)} // Show markers if available
            showPath // Enable path visualization on the map
            markers={markers} // Markers for the selected shipment
            zoom={zoom} // Current zoom level
            setSelectedMarker={setSelectedMarker} // Function to set the selected marker
            containerStyle={{ height: '600px' }} // Map container height
            unitOfMeasure={unitData} // Unit of measure for the map
            setSelectedCluster={setSelectedCluster} // Function to set the selected cluster
            selectedCluster={selectedCluster} // Currently selected cluster
            mapCountry={organizationCountry} // Country for the map
            orgData={user.organization} // Organization data for the map
          />
        </Grid>

        {/* Shipment data table */}
        <Grid item xs={12} className="shipmentDataTable">
          <DataTableWrapper
            isShipmentTable // Flag to indicate if this is a shipment table
            hideAddButton // Hide the "Add" button
            loading={isLoading} // Show loading state
            filename={t('shipment.export.filename')} // Filename for export
            rows={rows} // Rows of shipment data
            columns={[
              {
                name: '',
                options: {
                  sort: false,
                  sortThirdClickReset: false,
                  filter: false,
                  customBodyRenderLite: (dataIndex) => (
                    rows[dataIndex] && rows[dataIndex].note ? (
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom-start"
                        title={<Typography>{rows[dataIndex].note}</Typography>} // Display note as a tooltip
                        className="shipmentTooltip"
                      >
                        <NoteIcon />
                      </Tooltip>
                    ) : <></>
                  ),
                },
              },
              {
                name: 'name',
                label: t('shipment.table.shipmentName'),
                options: {
                  sort: true,
                  sortThirdClickReset: true,
                  filter: true,
                  customBodyRenderLite: (dataIndex) => (
                    <Typography
                      className="shipmentName"
                      onClick={(e) => {
                        // Navigate to the "Create Shipment" page with the selected shipment data
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
                data,
                _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                  ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                  : '',
                userLanguage,
                muiTheme,
                t,
              ),
              {
                name: 'battery_levels',
                label: t('shipment.table.batteryWithIntervals'),
                options: {
                  sort: true,
                  sortThirdClickReset: true,
                  filter: true,
                  setCellProps: () => ({
                    style: {
                      width: '300px',
                      maxWidth: '300px',
                    },
                  }),
                  customBodyRenderLite: (dataIndex) => {
                    const ship = rows[dataIndex];
                    const filterMarker = _.find(
                      allMarkers,
                      (markerGroup) => Array.isArray(markerGroup)
                        && markerGroup.some(
                          (marker) => marker?.shipment?.partner_shipment_id === ship.partner_shipment_id,
                        ),
                    );
                    const tTime = _.find(TIVE_GATEWAY_TIMES, { value: ship.transmission_time });
                    const mTime = _.find(TIVE_GATEWAY_TIMES, { value: ship.measurement_time });

                    return (
                      <Grid container>
                        <Grid item className="shipmentGridTimeCenter">
                          <Typography variant="body1">
                            {ship.battery_levels}
                          </Typography>
                        </Grid>
                        <Grid item flex={1}>
                          <Typography variant="body1">
                            {`T: ${tTime ? (t(`createShipment.intervalGuidance.${tTime.short_label}`)) : 'N/A'}`}
                          </Typography>
                          <Typography variant="body1">
                            {`M: ${mTime ? (t(`createShipment.intervalGuidance.${mTime.short_label}`)) : 'N/A'}`}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  },
                },
              },
            ]}
            extraOptions={{
              expandableRows: true, // Enable expandable rows
              expandableRowsHeader: false, // Hide expandable rows header
              expandableRowsOnClick: true, // Expand rows on click
              download: false, // Disable download option
              filter: false, // Disable filter option
              print: false, // Disable print option
              search: true, // Enable search option
              viewColumns: false, // Disable column visibility toggle
              customToolbar: () => (
                <Grid item xs={12} className="shipmentDataTableHeader">
                  <ToggleButtonGroup
                    color="secondary"
                    value={shipmentFilter}
                  >
                    <ToggleButton
                      value="Active"
                      size="medium"
                      selected={shipmentFilter === 'Active'}
                      className="shipmentDataTableHeaderItem"
                      onClick={(event, value) => filterTabClicked(event, value)}
                    >
                      {t('shipment.filters.active')}
                    </ToggleButton>
                    <ToggleButton
                      value="Completed"
                      size="medium"
                      selected={shipmentFilter === 'Completed'}
                      className="shipmentDataTableHeaderItem"
                      onClick={(event, value) => filterTabClicked(event, value)}
                    >
                      {t('shipment.filters.completed')}
                    </ToggleButton>
                    <ToggleButton
                      value="Battery Depleted"
                      size="medium"
                      selected={shipmentFilter === 'Battery Depleted'}
                      className="shipmentDataTableHeaderItem"
                      onClick={(event, value) => filterTabClicked(event, value)}
                    >
                      {t('shipment.filters.batteryDepleted')}
                    </ToggleButton>
                    <ToggleButton
                      value="Damaged"
                      size="medium"
                      selected={shipmentFilter === 'Damaged'}
                      className="shipmentDataTableHeaderItem"
                      onClick={(event, value) => filterTabClicked(event, value)}
                    >
                      {t('shipment.filters.damaged')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              ),
              setRowProps: (row, dataIndex, rowIndex) => ({
                style: { color: _.isEqual(row[2], 'Planned') ? muiTheme.palette.background.light : 'inherit' },
              }),
              rowsExpanded: expandedRows, // Track expanded rows
              onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => {
                if (_.isEmpty(allExpanded)) {
                  // Reset state when no rows are expanded
                  setAllMarkers(_.map(rows, 'allMarkers'));
                  setSelectedShipment(null);
                  setMarkers([]);
                  setSelectedMarker({});
                  setExpandedRows([]);
                  setSteps([]);
                } else {
                  // Process markers for the expanded row
                  processMarkers(rows[_.last(allExpanded).dataIndex], true);
                }
              },
              renderExpandableRow: (rowData, rowMeta) => {
                const colSpan = rowData.length + 1;
                const ship = rows[rowMeta.dataIndex];

                return (
                  <>
                    <TableRow>
                      <TableCell colSpan={colSpan}>
                        {/* Render shipment timeline */}
                        <CustomizedSteppers steps={steps} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={colSpan}>
                        <Grid container spacing={2}>
                          {/* Render shipment details */}
                          <Grid item xs={2}>
                            <Grid container rowGap={1}>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  {t('shipment.details.orderId')}
                                </Typography>
                                <Typography>
                                  {ship.order_number}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  {t('shipment.details.items')}
                                </Typography>
                                {_.map(_.split(ship.itemNames, ','), (item, idx) => (
                                  <Typography key={`${item}-${idx}`}>{item}</Typography>
                                ))}
                              </Grid>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  {t('shipment.details.status')}
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
                                    {t('shipment.details.logisticsCompanyN', { n: idx + 1 })}
                                  </Typography>
                                  <Typography>
                                    {carr}
                                  </Typography>
                                </Grid>
                              ))}
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  {t('shipment.details.receiver')}
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
                                    {t('shipment.details.lastLocation')}
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
                                    {t('shipment.details.lastReading')}
                                  </Typography>
                                  <Typography component="span">
                                    {t('shipment.details.recordedAt')}
                                    <span>{` ${markers[0].date} ${markers[0].time}`}</span>
                                  </Typography>
                                  {/* Render sensor data */}
                                  {renderSensorData(markers[0])}
                                </Grid>
                                {/* Render irregular transmission data */}
                                {renderIrregularTransmission(markers[0])}
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
                                  label={t('shipment.details.note')}
                                  autoComplete="note"
                                  value={ship.note || ''} // Display shipment note
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <FormControl
                                  fullWidth
                                  component="fieldset"
                                  variant="outlined"
                                  className="shipmentAttachedFiles"
                                  style={{
                                    padding: _.isEmpty(ship.uploaded_pdf)
                                      ? muiTheme.spacing(3)
                                      : muiTheme.spacing(1.5),
                                  }}
                                >
                                  <FormLabel component="legend" className="shipmentLegend">
                                    {t('shipment.details.attachedFiles')}
                                  </FormLabel>
                                  <Stack direction="row" spacing={1}>
                                    {!_.isEmpty(ship.uploaded_pdf)
                                      && _.map(ship.uploaded_pdf, (file, idx) => (
                                        <Chip
                                          key={`${file}-${idx}`}
                                          variant="outlined"
                                          label={file}
                                          onClick={() => handleFileView(file, ship.uploaded_pdf_link[idx])}
                                        /> // Display attached files
                                      ))}
                                  </Stack>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </>
                );
              },
            }}
          />
        </Grid>
      </Grid>
      <UniversalFileViewer
        open={openFileViewerModal}
        closeFileView={closeFileView}
        selectedFile={selectedFile}
      />
    </Box>
  );
};

export default Shipment;
