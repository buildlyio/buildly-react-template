/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */

// Importing necessary libraries and components
import React, { useState, useEffect, useRef } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import { useLocation } from 'react-router-dom';
import _, { isArray } from 'lodash';
import moment from 'moment-timezone';
import ExcelJS from 'exceljs';
import { useQuery } from 'react-query';
import {
  Box,
  Grid,
  List,
  ListItem,
  Typography,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Tooltip,
  Button,
  Autocomplete,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

// Importing custom components and utilities
import GraphComponent from '@components/GraphComponent/GraphComponent';
import Loader from '@components/Loader/Loader';
import MapComponent from '@components/MapComponent/MapComponent';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getCountriesQuery } from '@react-query/queries/shipments/getCountriesQuery';
import { getItemQuery } from '@react-query/queries/items/getItemQuery';
import { getItemTypeQuery } from '@react-query/queries/items/getItemTypeQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getContactQuery } from '@react-query/queries/custodians/getContactQuery';
import { getShipmentsQuery } from '@react-query/queries/shipments/getShipmentsQuery';
import { getAllGatewayQuery } from '@react-query/queries/sensorGateways/getAllGatewayQuery';
import { getCustodyQuery } from '@react-query/queries/custodians/getCustodyQuery';
import { getSensorReportQuery } from '@react-query/queries/sensorGateways/getSensorReportQuery';
import { getSensorAlertQuery } from '@react-query/queries/sensorGateways/getSensorAlertQuery';
import { getSensorProcessedDataQuery } from '@react-query/queries/sensorGateways/getSensorProcessedDataQuery';
import { useReportPDFDownloadMutation } from '@react-query/mutations/notifications/reportPDFDownloadMutation';
import {
  getShipmentOverview,
  REPORT_TYPES,
  getIcon,
  processReportsAndMarkers,
  SENSOR_REPORT_COLUMNS,
  tempUnit,
} from '@utils/constants';
import { isDesktop2 } from '@utils/mediaQuery';
import { getTimezone } from '@utils/utilMethods';
import { useStore as useTimezoneStore } from '@zustand/timezone/timezoneStore';

// Importing child components
import ReportingActiveShipmentDetails from './components/ReportingActiveShipmentDetails';
import ReportingDetailTable from './components/ReportingDetailTable';
import AlertsReport from './components/AlertsReport';
import SensorReport from './components/SensorReport';
import GenerateReport from './components/GenerateReport';
import ReportGraph from './components/ReportGraph';

// Importing styles
import './ReportingStyles.css';
import { geocodeAddress } from '@utils/getLocations';

import { useTranslation } from 'react-i18next';

const Reporting = () => {
  // React hooks for managing state and references
  const location = useLocation(); // Accessing the current URL location
  const theme = useTheme(); // Accessing the Material-UI theme
  const user = getUser(); // Fetching the current user details
  const organization = user.organization.organization_uuid; // Extracting organization ID from user details
  const enabledTilt = user.organization.enable_tilt; // Checking if tilt feature is enabled for the organization
  const { options: tzOptions } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones }); // Fetching timezone options
  const { t } = useTranslation();
  // State variables for managing component data
  const [locShipmentID, setLocShipmentID] = useState(''); // Shipment ID from URL
  const [shipmentFilter, setShipmentFilter] = useState('Active'); // Filter for shipment status
  const [selectedGraph, setSelectedGraph] = useState('temperature'); // Selected graph type
  const [selectedShipment, setSelectedShipment] = useState(null); // Currently selected shipment
  const [shipmentOverview, setShipmentOverview] = useState([]); // Overview of shipments
  const [reports, setReports] = useState([]); // Sensor reports data
  const [allGraphs, setAllGraphs] = useState([]); // Graph data for all parameters
  const [markers, setMarkers] = useState([]); // Map markers
  const [selectedMarker, setSelectedMarker] = useState({}); // Selected map marker
  const [isLoading, setLoading] = useState(false); // Loading state
  const [showGenerateReport, setShowGenerateReport] = useState(false); // State for showing the report generation modal

  // References for various components
  const reportingDetailTableRef = useRef();
  const mapRef = useRef();
  const tempGraphRef = useRef();
  const humGraphRef = useRef();
  const shockGraphRef = useRef();
  const lightGraphRef = useRef();
  const tiltGraphRef = useRef();
  const batteryGraphRef = useRef();
  const alertsTableRef = useRef();

  // Custom hooks and queries
  const { displayAlert } = useAlert(); // Custom hook for displaying alerts
  const { data: timeZone } = useTimezoneStore(); // Fetching the current timezone from the store

  let isShipmentDataAvailable = false; // Flag to check if shipment data is available

  // Query to fetch shipment data based on filters
  const { data: shipmentData, isLoading: isLoadingShipments } = useQuery(
    ['shipments', shipmentFilter, locShipmentID, organization],
    () => getShipmentsQuery(organization, (shipmentFilter === 'Active' ? 'Planned,En route,Arrived' : shipmentFilter), displayAlert, 'Reporting', locShipmentID),
    { refetchOnWindowFocus: false },
  );

  isShipmentDataAvailable = !_.isEmpty(shipmentData) && !isLoadingShipments;

  // Query to fetch unit data
  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch country data
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch item data
  const { data: itemData, isLoading: isLoadingItems } = useQuery(
    ['items', organization],
    () => getItemQuery(organization, displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch item type data
  const { data: itemTypesData, isLoading: isLoadingItemTypes } = useQuery(
    ['itemTypes', organization],
    () => getItemTypeQuery(organization, displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch custodian data
  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch contact information
  const { data: contactInfo, isLoading: isLoadingContact } = useQuery(
    ['contact', organization],
    () => getContactQuery(organization, displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch all gateway data
  const { data: allGatewayData, isLoading: isLoadingAllGateways } = useQuery(
    ['allGateways'],
    () => getAllGatewayQuery(displayAlert, 'Reporting'),
    { refetchOnWindowFocus: false },
  );

  // Query to fetch custody data
  const { data: custodyData, isLoading: isLoadingCustodies } = useQuery(
    ['custodies', shipmentData, shipmentFilter],
    () => getCustodyQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null))), displayAlert, 'Reporting'),
    {
      enabled: isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  // Query to fetch sensor alert data
  const { data: sensorAlertData, isLoading: isLoadingSensorAlerts, isFetching: isFetchingSensorAlerts } = useQuery(
    ['sensorAlerts', selectedShipment, shipmentFilter],
    () => getSensorAlertQuery(encodeURIComponent(selectedShipment.partner_shipment_id), displayAlert, 'Reporting'),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEmpty(selectedShipment.partner_shipment_id),
      refetchOnWindowFocus: false,
    },
  );

  // Query to fetch sensor report data
  const { data: sensorReportData, isLoading: isLoadingSensorReports, isFetching: isFetchingSensorReports } = useQuery(
    ['sensorReports', selectedShipment, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(selectedShipment.partner_shipment_id), null, displayAlert, 'Reporting'),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEmpty(selectedShipment.partner_shipment_id),
      refetchOnWindowFocus: false,
    },
  );

  // Query to fetch processed sensor data
  const { data: sensorProcessedData, isLoading: isLoadingSensorProcessedData } = useQuery(
    ['processedSensorData', selectedShipment, shipmentFilter],
    () => getSensorProcessedDataQuery(selectedShipment, displayAlert, 'Reporting'),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEqual(shipmentFilter, 'Active'),
      refetchOnWindowFocus: false,
    },
  );

  // Mutation for downloading PDF reports
  const { mutate: reportPDFDownloadMutation, isLoading: isReportPDFDownloading } = useReportPDFDownloadMutation((shipmentFilter === 'Active' ? 'Planned,En route,Arrived' : shipmentFilter), locShipmentID, organization, displayAlert, 'Reporting');

  // Extracting date and time formats from unit data
  const dateFormat = _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
    ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
    : '';
  const timeFormat = _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
    ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
    : '';
  const country = _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country'))
    ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country')).unit_of_measure
    : 'United States';
  const organizationCountry = _.find(countriesData, (item) => item.country.toLowerCase() === country.toLowerCase())
    && _.find(countriesData, (item) => item.country.toLowerCase() === country.toLowerCase()).iso3;

  // Effect to extract shipment ID from URL
  useEffect(() => {
    if (location.search) {
      setLocShipmentID(_.split(_.split(location.search, '?shipment=')[1], '&status=')[0]);
    } else {
      setLocShipmentID('');
    }
  }, [location.search]);

  // Effect to process shipment data and update state
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
          setShipmentFilter(_.includes(['Planned', 'En route', 'Arrived'], locShip.status) ? 'Active' : locShip.status);
        }
      }
    }
  }, [shipmentData, custodianData, custodyData, contactInfo, allGatewayData, locShipmentID]);

  // Effect to process sensor report data and update state
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
          timeZone,
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
  }, [sensorReportData, sensorAlertData, selectedShipment, timeZone]);

  // Function to get formatted shipment value
  const getShipmentValue = (value) => {
    let returnValue = '';
    if (!_.isEqual(selectedShipment[value], null)) {
      if (moment(selectedShipment[value], true).isValid()) {
        returnValue = moment(selectedShipment[value])
          .tz(timeZone).format(`${dateFormat} ${timeFormat}`);
      } else if (typeof (selectedShipment[value]) !== 'object') {
        if (value === 'had_alert') {
          returnValue = selectedShipment[value] ? t('reporting.common.yes') : t('reporting.common.no');
        } else {
          returnValue = selectedShipment[value];
        }
      }
    } else {
      returnValue = 'N/A';
    }
    return returnValue;
  };

  // Function to handle shipment selection
  const handleShipmentSelection = (shipment) => {
    history.replaceState(null, '', location.pathname);
    location.search = '';
    setLocShipmentID('');
    setSelectedShipment(shipment);
  };

  // Function to handle filter selection
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

  // Function to download CSV report
  const downloadCSV = () => {
    // Define the columns to be included in the CSV, filtering out those marked as not displayable
    const columns = SENSOR_REPORT_COLUMNS(unitData, selectedShipment, t).filter((col) => col.options.display !== false, null);

    // Sort the reports data in descending order based on the timestamp
    const data = _.orderBy(
      reports,
      (item) => moment(item.timestamp),
      ['desc'],
    );

    // Create a deep copy of the sorted data to avoid mutating the original data
    const rows = _.cloneDeep(data);

    // Helper function to escape CSV values by wrapping them in double quotes
    const escapeCSV = (text) => `"${text}"`;

    // Generate the CSV header row by mapping over the columns
    const csvHeader = columns.map((col) => {
      if (col.name === 'timestamp') {
        // Format the Date Time column header with timezone and date/time format
        const timeArray = _.split(timeFormat, ' ');
        const timePeriod = _.size(timeArray) === 1 ? '24-hour' : '12-hour';
        const filteredTimeZone = _.find(tzOptions, (option) => option.value === timeZone);
        const formattedLabel = `${col.label} (${filteredTimeZone.abbrev}) (${dateFormat} ${timePeriod})`;
        return escapeCSV(formattedLabel);
      }
      if (col.name === 'temperature') {
        const unit = tempUnit(_.find(unitData, (u) => _.isEqual(_.toLower(u.unit_of_measure_for), 'temperature')));
        // Format the temperature column header with the appropriate unit
        return escapeCSV(t('reporting.csv.headers.temperature', { unit }));
      }
      if (col.name === 'battery') {
        // Format the battery column header
        return escapeCSV(t('reporting.csv.headers.battery'));
      }
      return escapeCSV(col.label); // Default case for other columns
    }).join(',');

    // Find the index of the Date Time column
    const dateTimeColumnIndex = columns.findIndex((col) => col.name === 'timestamp');

    // Format the departure and arrival times for filtering rows within the time range
    const departureTime = moment(selectedShipment.actual_time_of_departure).tz(timeZone).format(`${dateFormat} ${timeFormat}`);
    const arrivalTime = moment(selectedShipment.actual_time_of_arrival).isValid()
      ? moment(selectedShipment.actual_time_of_arrival).tz(timeZone).format(`${dateFormat} ${timeFormat}`)
      : null;
    const formattedDepartureTime = moment(departureTime).unix();
    const formattedArrivalTime = arrivalTime ? moment(arrivalTime).unix() : null;

    // Filter rows to include only those within the departure and arrival time range
    const rowsWithinTimeRange = rows.filter((row) => {
      const dateTimeValue = moment(row[columns[dateTimeColumnIndex].name]).unix();
      if (formattedArrivalTime) {
        return dateTimeValue >= formattedDepartureTime && dateTimeValue <= formattedArrivalTime;
      } else {
        return dateTimeValue >= formattedDepartureTime;
      }
    });

    // Add "Arrived" and "En route" alerts to the first and last rows within the time range
    if (_.size(rowsWithinTimeRange) > 0) {
      const firstRowIndex = rows.findIndex((row) => row === rowsWithinTimeRange[0]);
      const lastRowIndex = rows.findIndex((row) => row === rowsWithinTimeRange[_.size(rowsWithinTimeRange) - 1]);
      if (formattedArrivalTime) {
        rows[firstRowIndex].allAlerts.push({ title: t('reporting.status.arrived'), color: '#000' });
      }
      rows[lastRowIndex].allAlerts.push({ title: t('reporting.status.enRoute'), color: '#000' });
    }

    // Generate the CSV body by mapping over the rows and columns
    const csvBody = rows.map((row) => columns.map((col, colIndex) => {
      let cell = row[col.name];
      // Handle missing or invalid location data
      if (!row.location || row.location === 'Error retrieving address') {
        row.location = 'N/A';
      }
      if (row.location === 'N/A') {
        row.lat = 'N/A';
        row.lng = 'N/A';
      }
      // Replace null or undefined values with an empty string
      if (_.isEqual(cell, null) || _.isEqual(cell, undefined)) {
        cell = '';
      }
      // Handle array values (e.g., alerts) by joining their titles
      if (Array.isArray(cell) && cell[0] && cell[0].title) {
        const titles = cell.map((item) => item.title).join(', ');
        return escapeCSV(titles);
      }
      return escapeCSV(cell); // Escape and return the cell value
    }).join(',')).join('\n');

    // Combine the header and body to form the complete CSV data
    const csvData = `${csvHeader}\n${csvBody}`;

    // Create a Blob object for the CSV data and trigger a download
    const blob = new Blob([`\ufeff${csvData}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedShipment.name}.csv`; // Set the file name based on the shipment name
    document.body.appendChild(link);
    link.click(); // Simulate a click to start the download
    document.body.removeChild(link); // Clean up by removing the link element
  };

  /**
 * Function to generate rich text values for thresholds based on timestamps.
 * This function processes maximum and minimum threshold data for a given label and unit,
 * and returns a formatted array of rich text objects for display.
 *
 * @param {string} label - The label for the threshold (e.g., "Temperature").
 * @param {Array} max_data - Array of objects containing maximum threshold data with timestamps.
 * @param {Array} min_data - Array of objects containing minimum threshold data with timestamps.
 * @param {string} unit - The unit of measurement for the thresholds (e.g., "°C").
 * @returns {Array} richTextResult - Array of rich text objects for thresholds.
 */
  const setThresholdsValues = (label, max_data, min_data, unit) => {
    // Extract unique timestamps from both max_data and min_data, and sort them in descending order.
    const timestamps = Array.from(
      new Set([
        ...(Array.isArray(max_data) ? max_data.map((x) => x.set_at) : []),
        ...(Array.isArray(min_data) ? min_data.map((x) => x.set_at) : []),
      ]),
    ).sort((a, b) => new Date(b) - new Date(a));

    // Variables to store the previous maximum and minimum values for continuity.
    let previousMax = null;
    let previousMin = null;

    // Array to store the formatted rich text result.
    const richTextResult = [];

    // Iterate over each timestamp to process the threshold values.
    timestamps.forEach((timestamp, index) => {
      // Find the maximum threshold value for the current timestamp.
      const maxItem = (Array.isArray(max_data) ? max_data : []).find((item) => item.set_at === timestamp);

      // Find the minimum threshold value for the current timestamp, if available.
      const minItem = !_.isEmpty(min_data) && min_data.find((item) => item.set_at === timestamp);

      // Use the current maximum value if available, otherwise use the previous maximum value.
      const currentMax = maxItem ? maxItem.value : previousMax;

      // Use the current minimum value if available, otherwise use the previous minimum value.
      const currentMin = !_.isEmpty(min_data) ? (minItem ? minItem.value : previousMin) : null;

      // Update the previous maximum and minimum values for the next iteration.
      if (currentMax !== null) previousMax = currentMax;
      if (currentMin !== null) previousMin = currentMin;

      // Add the label to the rich text result, with different formatting for the first and subsequent entries.
      richTextResult.push({
        text: index !== 0 ? `\n${label}: ` : `${label}: `,
        font: index !== 0 ? { color: { argb: 'FFFFFF' } } : { color: { argb: '000000' } },
      });

      // Add the current maximum value to the rich text result, formatted in the error color.
      richTextResult.push({
        text: `${currentMax}${unit} `,
        font: { color: { argb: theme.palette.error.main.replace('#', '') } },
      });

      // If minimum data is available, add the current minimum value to the rich text result, formatted in the info color.
      if (!_.isEmpty(min_data)) {
        richTextResult.push({
          text: `${currentMin}${unit}`,
          font: { color: { argb: theme.palette.info.main.replace('#', '') } },
        });
      }
    });

    // Return the formatted rich text result.
    return richTextResult;
  };

  // Sanitize worksheet name by removing invalid characters and limiting length
  const sanitizeWorksheetName = (name) => {
    // Remove characters that are invalid in Excel worksheet names
    // Replace with underscore: \/?*[]:'
    // eslint-disable-next-line no-useless-escape
    let safeName = name.replace(/[\\/?*\[\]:']/g, '_');
    // Remove any other non-printable characters
    // eslint-disable-next-line no-control-regex
    safeName = safeName.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    // Trim leading/trailing spaces and limit length to 31 characters (Excel limit)
    return safeName.trim().substring(0, 31);
  };

  /**
   * Downloads sensor report data as an Excel file
   *
   * This function creates a detailed Excel report containing sensor data with formatting
   * for excursions, transit periods, and other important information. The report includes:
   * - Shipment and tracker information
   * - Custodian details
   * - Sensor data with color-coded excursion indicators
   * - Transit period highlighting
   *
   * @async
   * @function downloadExcel
   * @returns {Promise<void>} - No return value, triggers download of Excel file
   */
  const downloadExcel = async () => {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sanitizeWorksheetName(selectedShipment.name));

    // Define border style for consistent cell formatting
    const borderStyle = {
      top: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
      left: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
      bottom: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
      right: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
    };

    // Filter columns to only include those marked for display
    const columns = SENSOR_REPORT_COLUMNS(unitData, selectedShipment, enabledTilt, t).filter((col) => col.options.display !== false, null);

    // Sort report data by timestamp in descending order (newest first)
    const data = _.orderBy(
      reports,
      (item) => moment(item.timestamp),
      ['desc'],
    );

    // Deep clone the data to avoid modifying the original
    const rows = _.cloneDeep(data);

    // Filter item data to include only items in the selected shipment
    const selectedItems = !_.isEmpty(itemData) && itemData.filter((obj) => selectedShipment.items.includes(obj.url));

    /**
     * Create an array of custodian information including:
     * - Custodian name
     * - Custodian type (Shipper, Logistics Provider, Warehouse, or Receiver)
     * - Custodian address (formatted from contact info)
     */
    const custodiansArray = selectedShipment.custody_info.map((info) => {
      const custodianContact = selectedShipment.contact_info.find((contact) => info.custodian_data.contact_data.includes(contact.url)) || {};
      const type = info.custodian_data.custodian_type.includes(1)
        ? t('reporting.excel.custodianTypes.shipper')
        : info.custodian_data.custodian_type.includes(2)
          ? t('reporting.excel.custodianTypes.logisticsProvider')
          : info.custodian_data.custodian_type.includes(3)
            ? t('reporting.excel.custodianTypes.warehouse')
            : t('reporting.excel.custodianTypes.receiver');
      return {
        custodian_name: info.custodian_name,
        custodian_type: type,
        custodian_address: `${custodianContact.address1}, ${custodianContact.city}, ${custodianContact.state}, ${custodianContact.country}, ${custodianContact.postal_code}`,
      };
    });

    // Sort custodians by type: Shipper first, Receiver last, others in between
    const sortedCustodiansArray = _.sortBy(custodiansArray, (custodian) => {
      if (custodian.custodian_type === t('reporting.excel.custodianTypes.shipper')) return 0;
      if (custodian.custodian_type === t('reporting.excel.custodianTypes.receiver')) return 2;
      return 1;
    });

    // Initialize counters for different types of excursions
    let maxTempExcursionsCount = 0;
    let maxHumExcursionsCount = 0;
    let maxShockExcursionsCount = 0;
    let maxLightExcursionsCount = 0;
    let minTempExcursionsCount = 0;
    let minHumExcursionsCount = 0;
    let minShockExcursionsCount = 0;
    let minLightExcursionsCount = 0;

    // Add description header row with column labels
    const descriptionRow = worksheet.addRow([
      t('reporting.excel.headers.colorKey'),
      t('reporting.excel.headers.trackerId'),
      t('reporting.excel.headers.shipmentName'),
      t('reporting.excel.headers.itemNames'),
      t('reporting.excel.headers.custodianType'),
      t('reporting.excel.headers.custodianName'),
      t('reporting.excel.headers.custodianAddress'),
      t('reporting.excel.headers.trackerIntervals'),
      t('reporting.excel.headers.thresholds'),
      t('reporting.excel.headers.excursions'),
      t('reporting.excel.headers.shipmentStatus'),
    ]);

    // Apply bold font to all cells in the description row
    descriptionRow.eachCell((cell) => {
      cell.font = {
        color: { argb: theme.palette.background.black2.replace('#', '') },
        bold: true,
      };
    });

    const formattedCustodianAddress = await geocodeAddress(!_.isEmpty(sortedCustodiansArray[0]) && sortedCustodiansArray[0].custodian_address);

    // Add first description row with shipment information and color key explanation
    const descriptionRow1 = worksheet.addRow([
      '',
      selectedShipment.tracker,
      selectedShipment.name,
      `${!_.isEmpty(selectedItems) ? selectedItems.map((obj) => obj.name).join(', ') : ''}`,
      sortedCustodiansArray[0].custodian_type,
      sortedCustodiansArray[0].custodian_name,
      formattedCustodianAddress,
      t('reporting.excel.labels.transmission', { minutes: selectedShipment.transmission_time }),
      '',
      '',
      selectedShipment.status,
    ]);

    // Add color key explanation with rich text formatting for different colors
    descriptionRow1.getCell(1).value = {
      richText: [
        { text: t('reporting.excel.colors.red'), font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
        { text: t('reporting.excel.punctuation.commaSpace'), font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
        { text: t('reporting.excel.colors.blue'), font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
        { text: ` ${t('reporting.excel.labels.indicateExcursions')}`, font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
      ],
    };

    // Add temperature threshold values using helper function
    descriptionRow1.getCell(9).value = { richText: setThresholdsValues(t('temperature'), selectedShipment.max_excursion_temp, selectedShipment.min_excursion_temp, tempUnit(_.find(unitData, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))) };

    // Apply styling to all cells in the first description row
    descriptionRow1.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: theme.palette.background.default.replace('#', '') },
      };
    });

    const formattedCustodian2Address = await geocodeAddress(!_.isEmpty(sortedCustodiansArray[1]) && sortedCustodiansArray[1].custodian_address);

    // Add second description row with additional custodian and measurement interval info
    const descriptionRow2 = worksheet.addRow([
      '',
      '',
      '',
      '',
      sortedCustodiansArray[1].custodian_type,
      sortedCustodiansArray[1].custodian_name,
      formattedCustodian2Address,
      t('reporting.excel.labels.measurement', { minutes: selectedShipment.measurement_time }),
    ]);

    // Add green color key explanation for recovery indicators
    descriptionRow2.getCell(1).value = {
      richText: [
        { text: t('reporting.excel.colors.green'), font: { color: { argb: theme.palette.success.main.replace('#', '') } } },
        { text: ` ${t('reporting.excel.labels.indicatesRecovery')}`, font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
      ],
    };

    // Add humidity threshold values
    descriptionRow2.getCell(9).value = { richText: setThresholdsValues(t('humidity'), selectedShipment.max_excursion_humidity, selectedShipment.min_excursion_humidity, '%') };

    // Apply styling to all cells in the second description row
    descriptionRow2.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: theme.palette.background.default.replace('#', '') },
      };
    });

    const formattedCustodian3Address = await geocodeAddress(!_.isEmpty(sortedCustodiansArray[2]) && sortedCustodiansArray[2].custodian_address);

    // Add third description row with grey color key for transit and additional custodian if available
    const descriptionRow3 = worksheet.addRow([
      t('reporting.excel.labels.greyIndicatesTransit'),
      '',
      '',
      '',
      _.size(sortedCustodiansArray) > 2 ? sortedCustodiansArray[2].custodian_type : '',
      _.size(sortedCustodiansArray) > 2 ? sortedCustodiansArray[2].custodian_name : '',
      _.size(sortedCustodiansArray) > 2 ? formattedCustodian3Address : '',
    ]);

    // Apply grey fill color to transit indicator cell
    descriptionRow3.eachCell((cell, colNumber) => {
      if (colNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: theme.palette.background.light6.replace('#', '') },
        };
      }
    });

    // Add shock threshold values
    descriptionRow3.getCell(9).value = { richText: setThresholdsValues(t('shock'), selectedShipment.shock_threshold, null, 'G') };

    // Apply styling to all cells in the third description row
    descriptionRow3.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: theme.palette.background.default.replace('#', '') },
      };
    });

    // Add fourth description row with additional custodian if available
    const descriptionRow4 = worksheet.addRow([]);

    const formattedCustodian4Address = await geocodeAddress(!_.isEmpty(sortedCustodiansArray[3]) && sortedCustodiansArray[3].custodian_address);

    // Add custodian information if there are more than 3 custodians
    descriptionRow4.getCell(5).value = _.size(sortedCustodiansArray) > 3 ? sortedCustodiansArray[3].custodian_type : '';
    descriptionRow4.getCell(6).value = _.size(sortedCustodiansArray) > 3 ? sortedCustodiansArray[3].custodian_name : '';
    descriptionRow4.getCell(7).value = _.size(sortedCustodiansArray) > 3 ? formattedCustodianAddress : '';

    // Add light threshold values
    descriptionRow4.getCell(9).value = { richText: setThresholdsValues(t('light'), selectedShipment.light_threshold, null, 'LUX') };

    // Apply styling to all cells in the fourth description row
    descriptionRow4.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: theme.palette.background.default.replace('#', '') },
      };
    });

    // Add rows for any additional custodians beyond the first 4
    for (let index = 0; index < sortedCustodiansArray.length; index++) {
      const custodian = sortedCustodiansArray[index];
      if (index > 3) {
        const descriptionRows = worksheet.addRow([]);
        const formattedNextCustodianAddress = await geocodeAddress(!_.isEmpty(custodian) && custodian.custodian_address);
        descriptionRows.getCell(5).value = custodian.custodian_type;
        descriptionRows.getCell(6).value = custodian.custodian_name;
        descriptionRows.getCell(7).value = formattedNextCustodianAddress;
      }
    }

    // Add empty row as separator between description and data
    worksheet.addRow([]);

    /**
     * Create header row with properly formatted column labels:
     * - Date Time column includes timezone and format information
     * - Battery column is shown as percentage
     * - Other columns use their standard labels
     */
    const headerRow = worksheet.addRow(columns.map((col) => {
      if (col.name === 'timestamp') {
        const timeArray = _.split(timeFormat, ' ');
        const timePeriod = _.size(timeArray) === 1 ? '24-hour' : '12-hour';
        const filteredTimeZone = _.find(tzOptions, (option) => option.value === timeZone);
        const formattedLabel = `${col.label} (${filteredTimeZone.abbrev}) (${dateFormat} ${timePeriod})`;
        return formattedLabel;
      }
      if (col.name === 'battery') {
        return t('reporting.excel.headers.battery');
      }
      return col.label;
    }));

    // Apply styling to the header row cells
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: theme.palette.warning.dark.replace('#', '') },
      };
      cell.font = {
        color: { argb: theme.palette.background.black2.replace('#', '') },
        bold: true,
      };
      // Center align specific columns (6, 7, 8, 9, 10)
      if ([6, 7, 8, 9, 10].includes(colNumber)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });

    // Determine the column index for the date/time column
    const dateTimeColIndex = columns.findIndex((col) => col.name === 'timestamp') + 1;

    // Format departure and arrival times for the shipment in the selected timezone
    const departureTime = moment(selectedShipment.actual_time_of_departure).tz(timeZone).format(`${dateFormat} ${timeFormat}`);
    const arrivalTime = moment(selectedShipment.actual_time_of_arrival).isValid()
      ? moment(selectedShipment.actual_time_of_arrival).tz(timeZone).format(`${dateFormat} ${timeFormat}`)
      : null;

    // Convert formatted times to Unix timestamps for comparison
    const formattedDepartureTime = moment(departureTime).unix();
    const formattedArrivalTime = arrivalTime ? moment(arrivalTime).unix() : null;

    // Track rows that should be highlighted as transit (grey background)
    const greyRows = [];

    /**
     * Process each data row:
     * 1. Format cell values
     * 2. Apply styling based on alerts and excursions
     * 3. Track different types of excursions
     * 4. Highlight transit periods
     */
    rows.forEach((row, rowIndex) => {
      // Map column data to create a row in the Excel sheet
      const dataRow = columns.map((col) => {
        let cellValue = row[col.name];
        // Format location data
        if (col.name === 'location') {
          if (!cellValue || cellValue === 'Error retrieving address') {
            cellValue = 'N/A';
          }
        }
        // Handle N/A locations by also setting lat/lng to N/A
        if (row.location === 'N/A') {
          row.lat = 'N/A';
          row.lng = 'N/A';
        }
        // Convert alert arrays to comma-separated strings
        if (col.name === 'allAlerts' && Array.isArray(cellValue)) {
          cellValue = cellValue.map((item) => item.title).join(', ');
        }
        return cellValue;
      });

      // Add the data row to the worksheet
      const rowRef = worksheet.addRow(dataRow);

      // Apply cell-specific formatting for each cell in the row
      rowRef.eachCell((cell, colNumber) => {
        const columnName = columns[colNumber - 1].name;

        // Format alerts with appropriate colors using rich text
        if (columnName === 'allAlerts' && Array.isArray(row.allAlerts)) {
          const alerts = row.allAlerts;
          const richText = [];
          alerts.forEach((alert) => {
            richText.push({ text: alert.title, font: { color: { argb: _.includes(alert.color, 'green') ? theme.palette.success.main.replace('#', '') : alert.color.replace('#', '') } } });
            richText.push({ text: ', ' });
          });
          richText.pop(); // Remove the last comma
          cell.value = { richText };
        }

        // Center align numeric values
        if (typeof cell.value === 'number') {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }

        // Left align latitude and longitude values
        if (columnName === 'lat' || columnName === 'lng') {
          cell.alignment = { horizontal: 'left' };
        }
      });

      /**
       * Process alerts for coloring cells and counting excursions:
       * - Highlight temperature, humidity, shock and light excursions with appropriate colors
       * - Track count of each type of excursion for summary
       */
      if (Array.isArray(row.allAlerts)) {
        row.allAlerts.forEach((alert) => {
          const alertTitle = alert.title.toLowerCase();
          let colName;
          let fillColor;

          // Determine type of excursion and update corresponding counter
          if (alertTitle.includes('maximum temperature excursion')) {
            colName = 'temperature';
            fillColor = theme.palette.error.light.replace('#', '');
            maxTempExcursionsCount++;
          } else if (alertTitle.includes('maximum humidity excursion')) {
            colName = 'humidity';
            fillColor = theme.palette.error.light.replace('#', '');
            maxHumExcursionsCount++;
          } else if (alertTitle.includes('maximum shock excursion')) {
            colName = 'shock';
            fillColor = theme.palette.error.light.replace('#', '');
            maxShockExcursionsCount++;
          } else if (alertTitle.includes('maximum light excursion')) {
            colName = 'light';
            fillColor = theme.palette.error.light.replace('#', '');
            maxLightExcursionsCount++;
          } else if (alertTitle.includes('minimum temperature excursion')) {
            colName = 'temperature';
            fillColor = theme.palette.info.light.replace('#', '');
            minTempExcursionsCount++;
          } else if (alertTitle.includes('minimum humidity excursion')) {
            colName = 'humidity';
            fillColor = theme.palette.info.light.replace('#', '');
            minHumExcursionsCount++;
          } else if (alertTitle.includes('minimum shock excursion')) {
            colName = 'shock';
            fillColor = theme.palette.info.light.replace('#', '');
            minShockExcursionsCount++;
          } else if (alertTitle.includes('minimum light excursion')) {
            colName = 'light';
            fillColor = theme.palette.info.light.replace('#', '');
            minLightExcursionsCount++;
          }

          // Apply fill color to the appropriate cell if an excursion is detected
          if (colName) {
            const colIndex = columns.findIndex((col) => col.name === colName);
            if (colIndex !== -1) {
              // Calculate correct row index based on number of custodians
              const cell = worksheet.getCell(_.size(sortedCustodiansArray) <= 4 ? rowIndex + 8 : rowIndex + 8 + _.size(sortedCustodiansArray) - 4, colIndex + 1);
              if (cell.value) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: fillColor },
                };
              }
            }
          }
        });
      }

      // Update temperature excursion count in the summary area
      const tempRichText = [{ text: `${t('temperature')}:` }];
      if (maxTempExcursionsCount > 0) {
        tempRichText.push({
          text: ` ${maxTempExcursionsCount} `,
          font: { color: { argb: theme.palette.error.main.replace('#', '') } },
        });
      }
      if (minTempExcursionsCount > 0) {
        tempRichText.push({
          text: ` ${minTempExcursionsCount} `,
          font: { color: { argb: theme.palette.info.main.replace('#', '') } },
        });
      }
      descriptionRow1.getCell(10).value = { richText: tempRichText };

      // Update humidity excursion count in the summary area
      const humRichText = [{ text: `${t('humidity')}:` }];
      if (maxHumExcursionsCount > 0) {
        humRichText.push({
          text: ` ${maxHumExcursionsCount} `,
          font: { color: { argb: theme.palette.error.main.replace('#', '') } },
        });
      }
      if (minHumExcursionsCount > 0) {
        humRichText.push({
          text: ` ${minHumExcursionsCount} `,
          font: { color: { argb: theme.palette.info.main.replace('#', '') } },
        });
      }
      descriptionRow2.getCell(10).value = { richText: humRichText };

      // Update shock excursion count in the summary area
      const shockRichText = [{ text: `${t('shock')}:` }];
      if (maxShockExcursionsCount > 0) {
        shockRichText.push({
          text: ` ${maxShockExcursionsCount} `,
          font: { color: { argb: theme.palette.error.main.replace('#', '') } },
        });
      }
      if (minShockExcursionsCount > 0) {
        shockRichText.push({
          text: ` ${minShockExcursionsCount} `,
          font: { color: { argb: theme.palette.info.main.replace('#', '') } },
        });
      }
      descriptionRow3.getCell(10).value = { richText: shockRichText };

      // Update light excursion count in the summary area
      const lightRichText = [{ text: `${t('light')}:` }];
      if (maxLightExcursionsCount > 0) {
        lightRichText.push({
          text: ` ${maxLightExcursionsCount} `,
          font: { color: { argb: theme.palette.error.main.replace('#', '') } },
        });
      }
      if (minLightExcursionsCount > 0) {
        lightRichText.push({
          text: ` ${minLightExcursionsCount} `,
          font: { color: { argb: theme.palette.info.main.replace('#', '') } },
        });
      }
      descriptionRow4.getCell(10).value = { richText: lightRichText };

      // Check if the row's timestamp is within the transit period (between departure and arrival)
      const dateValue = moment(row[columns[dateTimeColIndex - 1].name]).unix();

      // Apply grey background to rows within the transit period
      if (formattedArrivalTime) {
        // If arrival time exists, highlight rows between departure and arrival
        if (dateValue >= formattedDepartureTime && dateValue <= formattedArrivalTime) {
          rowRef.eachCell((cell, colNumber) => {
            if (!cell.fill) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: theme.palette.background.light6.replace('#', '') },
              };
            }
          });
          greyRows.push(rowRef.number);
        }
      } else {
        // If no arrival time, highlight rows after departure
        if (dateValue >= formattedDepartureTime) {
          rowRef.eachCell((cell, colNumber) => {
            if (!cell.fill) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: theme.palette.background.light6.replace('#', '') },
              };
            }
          });
          greyRows.push(rowRef.number);
        }
      }
    });

    /**
     * Add 'Arrived' and 'En route' labels to the first and last transit rows
     * to visually mark the beginning and end of transit period
     */
    if (_.size(greyRows) > 0) {
      const firstGreyRow = worksheet.getRow(greyRows[0]);
      const lastGreyRow = worksheet.getRow(greyRows[greyRows.length - 1]);

      let firstGreyRowRichText = firstGreyRow.getCell(1).value.richText;
      let lastGreyRowRichText = lastGreyRow.getCell(1).value.richText;

      // Add 'Arrived' text to the first row of transit period if arrival time exists
      if (formattedArrivalTime) {
        if (_.size(firstGreyRowRichText) > 0) {
          firstGreyRowRichText = [
            ...firstGreyRowRichText,
            {
              text: `, ${t('reporting.status.arrived')}`,
              font: { color: { argb: theme.palette.background.black2.replace('#', '') } },
            },
          ];
        } else {
          firstGreyRowRichText = [
            { text: t('reporting.status.arrived'), font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
          ];
        }
      }

      // Add 'En route' text to the last row of transit period
      if (_.size(lastGreyRowRichText) > 0) {
        lastGreyRowRichText = [
          ...lastGreyRowRichText,
          {
            text: `, ${t('reporting.status.enRoute')}`,
            font: { color: { argb: theme.palette.background.black2.replace('#', '') } },
          },
        ];
      } else {
        lastGreyRowRichText = [
          { text: t('reporting.status.enRoute'), font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
        ];
      }

      // Apply the updated rich text to the first and last grey rows
      firstGreyRow.getCell(1).value = { richText: firstGreyRowRichText };
      lastGreyRow.getCell(1).value = { richText: lastGreyRowRichText };
    }

    // Calculate total number of rows in the sheet, accounting for variable number of custodians
    const totalRows = _.size(sortedCustodiansArray) <= 4 ? rows.length + 7 : rows.length + 7 + _.size(sortedCustodiansArray) - 4;
    const totalCols = columns.length + 1;

    // Apply border style to all cells in the worksheet
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      for (let colIndex = 1; colIndex <= totalCols; colIndex++) {
        const cell = worksheet.getCell(rowIndex, colIndex);
        if (!cell.border) {
          cell.border = borderStyle;
        }
      }
    }

    /**
     * Adjust column widths based on content:
     * - Column 9 has a fixed width of 25
     * - All other columns are sized based on their content plus 2 characters of padding
     */
    worksheet.columns.forEach((column, index) => {
      if (index + 1 === 9) {
        column.width = 25;
      } else {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value
            ? cell.value.richText
              ? cell.value.richText.map((obj) => obj.text).join('')
              : typeof cell.value === 'object'
                ? JSON.stringify(cell.value)
                : cell.value.toString()
            : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
      }
    });

    /**
     * Generate and download the Excel file:
     * 1. Convert workbook to buffer
     * 2. Create blob from buffer
     * 3. Create download link with shipment name as filename
     * 4. Trigger download and cleanup
     */
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedShipment.name}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoaded = isLoadingShipments
    || isLoadingUnits
    || isLoadingCountries
    || isLoadingItems
    || isLoadingItemTypes
    || isLoadingCustodians
    || isLoadingContact
    || isLoadingAllGateways
    || isLoadingCustodies
    || isLoadingSensorAlerts
    || isLoadingSensorReports
    || isFetchingSensorAlerts
    || isFetchingSensorReports
    || isLoadingSensorProcessedData;

  return (
    // Main container with vertical margins
    <Box mt={5} mb={5}>

      {/* Loader spinner shown when data is loading */}
      {isLoaded && <Loader open={isLoaded} />}

      {/* Header section with title and conditional report button */}
      <Box className="reportingDashboardContainer">
        <Typography className="reportingDashboardHeading" variant="h4">
          {t('reporting.title')}
        </Typography>

        {/* Show "Insights Report" button only if shipment filter is not empty and not 'Active' */}
        {!_.isEmpty(shipmentFilter) && !_.isEqual(shipmentFilter, 'Active') && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="reportingDashboardButton"
            onClick={() => setShowGenerateReport(true)}
            disabled={isReportPDFDownloading || _.isEmpty(selectedShipment)}
          >
            {t('reporting.buttons.insightsReport')}
            {/* Tooltip explaining report is in beta */}
            <Tooltip placement="bottom" title={t('reporting.tooltips.insightsReport')}>
              <InfoIcon fontSize="small" className="reportingDashboardButtonIcon" />
            </Tooltip>
          </Button>
        )}
      </Box>

      {/* Grid layout for shipment details, filter toggles and map */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Toggle buttons to filter shipments by status */}
          <div className="reportingSwitchViewSection">
            <ToggleButtonGroup
              color="secondary"
              value={shipmentFilter}
              exclusive
              fullWidth
            >
              {/* Filters for different shipment statuses */}
              {[t('reporting.filters.active'), t('reporting.filters.completed'), t('reporting.filters.batteryDepleted'), t('reporting.filters.damaged')].map((statusKeyLabel, idx) => {
                const valueMap = ['Active', 'Completed', 'Battery Depleted', 'Damaged'];
                const value = valueMap[idx];
                return (
                  <ToggleButton
                    key={value}
                    value={value}
                    size="medium"
                    selected={shipmentFilter === value}
                    onClick={(event) => makeFilterSelection(value)}
                  >
                    {statusKeyLabel}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </div>

          {/* Dropdown to select a shipment based on selected filter */}
          <div className="reportingSwitchViewSection2">
            <Autocomplete
              id="shipment-name"
              fullWidth
              freeSolo
              options={_.filter(shipmentOverview, { type: shipmentFilter })}
              getOptionLabel={(option) => option && option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedShipment || null}
              onChange={(event, newValue) => {
                handleShipmentSelection(newValue);
              }}
              renderOption={(props, option) => (
                <li
                  {...props}
                  className={`${props.className}`}
                >
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  required
                  margin="normal"
                  label={t('reporting.fields.shipmentName')}
                />
              )}
            />
          </div>

          {/* Render appropriate details table based on filter */}
          {!_.isEmpty(shipmentFilter) && _.isEqual(shipmentFilter, 'Active')
            ? (
              <ReportingActiveShipmentDetails
                selectedShipment={selectedShipment}
                theme={theme}
                getShipmentValue={getShipmentValue}
              />
            ) : (
              <ReportingDetailTable
                ref={reportingDetailTableRef}
                selectedShipment={selectedShipment}
                allGatewayData={allGatewayData}
                timeZone={timeZone}
                sensorAlertData={sensorAlertData}
                theme={theme}
                unitOfMeasure={unitData}
                sensorReportData={sensorReportData}
                itemData={itemData}
                itemTypesData={itemTypesData}
                sensorProcessedData={sensorProcessedData}
              />
            )}
        </Grid>

        {/* Map view section showing shipment path and markers */}
        <Grid ref={mapRef} item xs={12}>
          <div className="reportingSwitchViewSection">
            <Typography className="reportingSectionTitleHeading" variant="h5">
              {!_.isEmpty(selectedShipment) && selectedShipment.name ? (
                <>
                  <span>{t('reporting.map.titleWithNamePrefix')}</span>
                  <span>{selectedShipment.name}</span>
                </>
              ) : t('reporting.map.title')}
            </Typography>
          </div>

          {/* Map component with markers, paths, and configurations */}
          <MapComponent
            isMarkerShown={!_.isEmpty(markers)}
            showPath
            screenshotMapCenter
            noInitialInfo
            markers={markers}
            zoom={4}
            setSelectedMarker={setSelectedMarker}
            containerStyle={{ height: '625px' }}
            unitOfMeasure={unitData}
            mapCountry={organizationCountry}
            orgData={user.organization}
          />
        </Grid>
      </Grid>

      {/* Graph View with vertical layout */}
      <Grid container className="reportingContainer" sx={{ marginTop: _.isEmpty(selectedShipment) ? 4 : -1 }}>
        <div className="reportingSwitchViewSection">
          <Typography className="reportingSectionTitleHeading" variant="h5">
            {!_.isEmpty(selectedShipment) && selectedShipment.name ? (
              <>
                <span>{t('reporting.graph.titleWithNamePrefix')}</span>
                <span>{selectedShipment.name}</span>
              </>
            ) : t('reporting.graph.title')}
          </Typography>
        </div>

        {/* Vertical icon list to select graph types */}
        <Grid item xs={2} sm={1}>
          <List component="nav" aria-label="main graph-type" className="reportingGraphIconBar">
            {_.map(REPORT_TYPES(unitData, enabledTilt), (item, index) => (
              <ListItem
                key={`iconItem${index}${item.id}`}
                button
                selected={selectedGraph === item.id}
                onClick={() => setSelectedGraph(item.id)}
                style={{ margin: '12px 0' }}
              >
                {getIcon({ ...item, color: theme.palette.background.dark }, t)}
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Main graph display area */}
        <Grid item xs={10} sm={11}>
          {selectedShipment && selectedGraph && allGraphs && !_.isEmpty(allGraphs) && allGraphs[selectedGraph]
            ? (
              <GraphComponent
                data={allGraphs[selectedGraph]}
                selectedGraph={selectedGraph}
              />
            ) : (
              <Typography variant="h6" align="center">
                {t('reporting.graph.noDataPrompt')}
              </Typography>
            )}
        </Grid>
      </Grid>

      {/* Additional report sections for sensor data and alerts */}
      <SensorReport
        key={selectedShipment && selectedShipment.partner_shipment_id}
        sensorReport={reports}
        shipmentName={selectedShipment && selectedShipment.name}
        selectedShipment={selectedShipment}
        selectedMarker={selectedShipment && selectedMarker}
        unitOfMeasure={unitData}
        timezone={timeZone}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
        enabled_tilt={enabledTilt}
      />

      <AlertsReport
        ref={alertsTableRef}
        sensorReport={reports}
        alerts={_.filter(sensorAlertData, { shipment_id: selectedShipment && selectedShipment.partner_shipment_id })}
        shipmentName={selectedShipment && selectedShipment.name}
        timezone={timeZone}
        unitOfMeasure={unitData}
        shouldScroll={!!locShipmentID}
      />

      {/* Graph snapshots for each sensor type (used in report generation) */}
      <ReportGraph enabledTilt={enabledTilt} ref={tempGraphRef} selectedShipment={selectedShipment} unitOfMeasure={unitData} theme={theme} graphType="temperature" data={allGraphs} />
      <ReportGraph enabledTilt={enabledTilt} ref={humGraphRef} selectedShipment={selectedShipment} unitOfMeasure={unitData} theme={theme} graphType="humidity" data={allGraphs} />
      <ReportGraph enabledTilt={enabledTilt} ref={shockGraphRef} selectedShipment={selectedShipment} unitOfMeasure={unitData} theme={theme} graphType="shock" data={allGraphs} />
      <ReportGraph enabledTilt={enabledTilt} ref={lightGraphRef} selectedShipment={selectedShipment} unitOfMeasure={unitData} theme={theme} graphType="light" data={allGraphs} />
      {enabledTilt && (
        <ReportGraph enabledTilt={enabledTilt} ref={tiltGraphRef} selectedShipment={selectedShipment} unitOfMeasure={unitData} theme={theme} graphType="tilt" data={allGraphs} />
      )}
      <ReportGraph enabledTilt={enabledTilt} ref={batteryGraphRef} selectedShipment={selectedShipment} unitOfMeasure={unitData} theme={theme} graphType="battery" data={allGraphs} />

      {/* Generate Report modal component with all visual sections' refs passed in */}
      <GenerateReport
        open={showGenerateReport}
        setOpen={setShowGenerateReport}
        enabledTilt={enabledTilt}
        tableRef={reportingDetailTableRef}
        mapRef={mapRef}
        tempGraphRef={tempGraphRef}
        humGraphRef={humGraphRef}
        shockGraphRef={shockGraphRef}
        lightGraphRef={lightGraphRef}
        tiltGraphRef={tiltGraphRef}
        batteryGraphRef={batteryGraphRef}
        alertsTableRef={alertsTableRef}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
        reportPDFDownloadMutation={reportPDFDownloadMutation}
        selectedShipment={selectedShipment}
      />
    </Box>
  );
};

export default Reporting;
