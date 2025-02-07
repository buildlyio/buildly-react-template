/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
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
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
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
import { getTimezone, getTranslatedLanguage } from '@utils/utilMethods';
import { useStore as useTimezoneStore } from '@zustand/timezone/timezoneStore';
import ReportingActiveShipmentDetails from './components/ReportingActiveShipmentDetails';
import ReportingDetailTable from './components/ReportingDetailTable';
import AlertsReport from './components/AlertsReport';
import SensorReport from './components/SensorReport';
import GenerateReport from './components/GenerateReport';
import ReportGraph from './components/ReportGraph';
import './ReportingStyles.css';
import { LANGUAGES } from '@utils/mock';

const Reporting = () => {
  const location = useLocation();
  const theme = useTheme();
  const user = getUser();
  const organization = user.organization.organization_uuid;
  const { options: tzOptions } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });

  const [locShipmentID, setLocShipmentID] = useState('');
  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipmentOverview, setShipmentOverview] = useState([]);
  const [reports, setReports] = useState([]);
  const [allGraphs, setAllGraphs] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const reportingDetailTableRef = useRef();
  const mapRef = useRef();
  const tempGraphRef = useRef();
  const humGraphRef = useRef();
  const shockGraphRef = useRef();
  const lightGraphRef = useRef();
  const batteryGraphRef = useRef();
  const alertsTableRef = useRef();

  const { displayAlert } = useAlert();
  const { data: timeZone } = useTimezoneStore();

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

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: itemData, isLoading: isLoadingItems } = useQuery(
    ['items', organization],
    () => getItemQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: itemTypesData, isLoading: isLoadingItemTypes } = useQuery(
    ['itemTypes', organization],
    () => getItemTypeQuery(organization, displayAlert),
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
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEmpty(selectedShipment.partner_shipment_id),
      refetchOnWindowFocus: false,
    },
  );

  const { data: sensorReportData, isLoading: isLoadingSensorReports, isFetching: isFetchingSensorReports } = useQuery(
    ['sensorReports', selectedShipment, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(selectedShipment.partner_shipment_id), null, displayAlert),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEmpty(selectedShipment.partner_shipment_id),
      refetchOnWindowFocus: false,
    },
  );

  const { data: sensorProcessedData, isLoading: isLoadingSensorProcessedData } = useQuery(
    ['processedSensorData', selectedShipment, shipmentFilter],
    () => getSensorProcessedDataQuery(selectedShipment, displayAlert),
    {
      enabled: !_.isEmpty(selectedShipment) && isShipmentDataAvailable && !_.isEqual(shipmentFilter, 'Active'),
      refetchOnWindowFocus: false,
    },
  );

  const { mutate: reportPDFDownloadMutation, isLoading: isReportPDFDownloading } = useReportPDFDownloadMutation((shipmentFilter === 'Active' ? 'Planned,En route,Arrived' : shipmentFilter), locShipmentID, organization, displayAlert);

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
          setShipmentFilter(_.includes(['Planned', 'En route', 'Arrived'], locShip.status) ? 'Active' : locShip.status);
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
    let returnValue = '';
    if (!_.isEqual(selectedShipment[value], null)) {
      if (moment(selectedShipment[value], true).isValid()) {
        returnValue = moment(selectedShipment[value])
          .tz(timeZone).format(`${dateFormat} ${timeFormat}`);
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
      returnValue = 'N/A';
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

  const downloadCSV = () => {
    const columns = SENSOR_REPORT_COLUMNS(unitData, selectedShipment).filter((col) => col.options.display !== false);
    const data = _.orderBy(
      reports,
      (item) => moment(item.timestamp),
      ['desc'],
    );
    const rows = _.cloneDeep(data);
    const escapeCSV = (text) => `"${text}"`;
    const csvHeader = columns.map((col) => {
      if (col.label === 'Date Time') {
        const timeArray = _.split(timeFormat, ' ');
        const timePeriod = _.size(timeArray) === 1 ? '24-hour' : '12-hour';
        const filteredTimeZone = _.find(tzOptions, (option) => option.value === timeZone);
        const formattedLabel = `${col.label} (${filteredTimeZone.abbrev}) (${dateFormat} ${timePeriod})`;
        return escapeCSV(formattedLabel);
      }
      if (col.name === 'temperature') {
        return escapeCSV(`TEMP ${tempUnit(_.find(unitData, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`);
      }
      if (col.name === 'battery') {
        return escapeCSV('BATTERY (%)');
      }
      return escapeCSV(col.label);
    }).join(',');

    const dateTimeColumnIndex = columns.findIndex((col) => col.label === 'Date Time');
    const departureTime = moment(selectedShipment.actual_time_of_departure).tz(timeZone).format(`${dateFormat} ${timeFormat}`);
    const arrivalTime = moment(selectedShipment.actual_time_of_arrival).isValid()
      ? moment(selectedShipment.actual_time_of_arrival).tz(timeZone).format(`${dateFormat} ${timeFormat}`)
      : null;
    const formattedDepartureTime = moment(departureTime).unix();
    const formattedArrivalTime = arrivalTime ? moment(arrivalTime).unix() : null;
    const rowsWithinTimeRange = rows.filter((row) => {
      const dateTimeValue = moment(row[columns[dateTimeColumnIndex].name]).unix();
      if (formattedArrivalTime) {
        return dateTimeValue >= formattedDepartureTime && dateTimeValue <= formattedArrivalTime;
      } else {
        return dateTimeValue >= formattedDepartureTime;
      }
    });
    if (_.size(rowsWithinTimeRange) > 0) {
      const firstRowIndex = rows.findIndex((row) => row === rowsWithinTimeRange[0]);
      const lastRowIndex = rows.findIndex((row) => row === rowsWithinTimeRange[_.size(rowsWithinTimeRange) - 1]);
      if (formattedArrivalTime) {
        rows[firstRowIndex].allAlerts.push({ title: 'Arrived', color: '#000' });
      }
      rows[lastRowIndex].allAlerts.push({ title: 'En route', color: '#000' });
    }

    const csvBody = rows.map((row) => columns.map((col, colIndex) => {
      let cell = row[col.name];
      if (!row.location || row.location === 'Error retrieving address') {
        row.location = 'N/A';
      }
      if (row.location === 'N/A') {
        row.lat = 'N/A';
        row.lng = 'N/A';
      }
      if (_.isEqual(cell, null) || _.isEqual(cell, undefined)) {
        cell = '';
      }
      if (Array.isArray(cell) && cell[0] && cell[0].title) {
        const titles = cell.map((item) => item.title).join(', ');
        return escapeCSV(titles);
      }
      return escapeCSV(cell);
    }).join(',')).join('\n');

    const csvData = `${csvHeader}\n${csvBody}`;
    const blob = new Blob([`\ufeff${csvData}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedShipment.name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const setThresholdsValues = (label, max_data, min_data, padding, unit) => {
    const timestamps = Array.from(
      new Set([
        ...max_data.map((x) => x.set_at),
        ...(!_.isEmpty(min_data) ? min_data.map((x) => x.set_at) : []),
      ]),
    ).sort((a, b) => new Date(b) - new Date(a));

    let previousMax = null;
    let previousMin = null;

    const richTextResult = [];

    timestamps.forEach((timestamp, index) => {
      const maxItem = max_data.find((item) => item.set_at === timestamp);
      const minItem = !_.isEmpty(min_data) && min_data.find((item) => item.set_at === timestamp);

      const currentMax = maxItem ? maxItem.value : previousMax;
      const currentMin = !_.isEmpty(min_data) ? (minItem ? minItem.value : previousMin) : null;

      if (currentMax !== null) previousMax = currentMax;
      if (currentMin !== null) previousMin = currentMin;

      if (index === 0) {
        richTextResult.push({ text: `${label}: ` });
      } else {
        richTextResult.push({ text: `\n${padding}` });
      }

      richTextResult.push({
        text: `${currentMax}${unit} `,
        font: { color: { argb: theme.palette.error.main.replace('#', '') } },
      });

      if (!_.isEmpty(min_data)) {
        richTextResult.push({
          text: `${currentMin}${unit}`,
          font: { color: { argb: theme.palette.info.main.replace('#', '') } },
        });
      }
    });
    return richTextResult;
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sensor Report Data');

    const borderStyle = {
      top: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
      left: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
      bottom: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
      right: { style: 'thin', color: { argb: theme.palette.background.black2.replace('#', '') } },
    };

    const columns = SENSOR_REPORT_COLUMNS(unitData, selectedShipment).filter((col) => col.options.display !== false);
    const data = _.orderBy(
      reports,
      (item) => moment(item.timestamp),
      ['desc'],
    );
    const rows = _.cloneDeep(data);
    const selectedItems = !_.isEmpty(itemData) && itemData.filter((obj) => selectedShipment.items.includes(obj.url));

    const custodiansArray = selectedShipment.custody_info.map((info) => {
      const custodianContact = selectedShipment.contact_info.find((contact) => info.custodian_data.contact_data.includes(contact.url)) || {};
      return {
        custodian_name: info.custodian_name,
        custodian_type: info.custodian_data.custodian_type.includes(1) ? 'Shipper' : info.custodian_data.custodian_type.includes(2) ? 'Logistics Provider' : info.custodian_data.custodian_type.includes(3) ? 'Warehouse' : 'Receiver',
        custodian_address: `${custodianContact.address1}, ${custodianContact.city}, ${custodianContact.state}, ${custodianContact.country}, ${custodianContact.postal_code}`,
      };
    });
    const sortedCustodiansArray = _.sortBy(custodiansArray, (custodian) => {
      if (custodian.custodian_type === 'Shipper') return 0;
      if (custodian.custodian_type === 'Receiver') return 2;
      return 1;
    });

    let maxTempExcursionsCount = 0;
    let maxHumExcursionsCount = 0;
    let maxShockExcursionsCount = 0;
    let maxLightExcursionsCount = 0;
    let minTempExcursionsCount = 0;
    let minHumExcursionsCount = 0;
    let minShockExcursionsCount = 0;
    let minLightExcursionsCount = 0;

    const descriptionRow = worksheet.addRow([
      'Color Key',
      'Tracker ID',
      'Shipment Name',
      'Item Name(s)',
      'Custodian Type',
      'Custodian Name',
      'Custodian Address',
      'Tracker Intervals',
      'Max. / Min. Thresholds',
      'Excursions',
      'Shipment Status',
    ]);

    descriptionRow.eachCell((cell) => {
      cell.font = {
        color: { argb: theme.palette.background.black2.replace('#', '') },
        bold: true,
      };
    });

    const descriptionRow1 = worksheet.addRow([
      '',
      selectedShipment.tracker,
      selectedShipment.name,
      `${!_.isEmpty(selectedItems) ? selectedItems.map((obj) => obj.name).join(', ') : ''}`,
      sortedCustodiansArray[0].custodian_type,
      sortedCustodiansArray[0].custodian_name,
      sortedCustodiansArray[0].custodian_address,
      `Transmission: ${selectedShipment.transmission_time} min.`,
      '',
      '',
      selectedShipment.status,
    ]);

    descriptionRow1.getCell(1).value = {
      richText: [
        { text: 'Red', font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
        { text: ', ', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
        { text: 'Blue', font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
        { text: ' indicate Excursions', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
      ],
    };

    descriptionRow1.getCell(9).value = { richText: setThresholdsValues('Temperature', selectedShipment.max_excursion_temp, selectedShipment.min_excursion_temp, '                         ', tempUnit(_.find(unitData, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))) };

    descriptionRow1.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });

    const descriptionRow2 = worksheet.addRow([
      '',
      '',
      '',
      '',
      sortedCustodiansArray[1].custodian_type,
      sortedCustodiansArray[1].custodian_name,
      sortedCustodiansArray[1].custodian_address,
      `Measurement: ${selectedShipment.measurement_time} min.`,
    ]);

    descriptionRow2.getCell(1).value = {
      richText: [
        { text: 'Green', font: { color: { argb: theme.palette.success.main.replace('#', '') } } },
        { text: ' indicates Recovery', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
      ],
    };

    descriptionRow2.getCell(9).value = { richText: setThresholdsValues('Humidity', selectedShipment.max_excursion_humidity, selectedShipment.min_excursion_humidity, '                   ', '%') };

    descriptionRow2.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });

    const descriptionRow3 = worksheet.addRow([
      'Grey indicates Transit',
      '',
      '',
      '',
      _.size(sortedCustodiansArray) > 2 ? sortedCustodiansArray[2].custodian_type : '',
      _.size(sortedCustodiansArray) > 2 ? sortedCustodiansArray[2].custodian_name : '',
      _.size(sortedCustodiansArray) > 2 ? sortedCustodiansArray[2].custodian_address : '',
    ]);

    descriptionRow3.eachCell((cell, colNumber) => {
      if (colNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: theme.palette.background.light6.replace('#', '') },
        };
      }
    });

    descriptionRow3.getCell(9).value = { richText: setThresholdsValues('Shock', selectedShipment.shock_threshold, null, '             ', 'G') };

    descriptionRow3.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });

    const descriptionRow4 = worksheet.addRow([]);

    descriptionRow4.getCell(5).value = _.size(sortedCustodiansArray) > 3 ? sortedCustodiansArray[3].custodian_type : '';
    descriptionRow4.getCell(6).value = _.size(sortedCustodiansArray) > 3 ? sortedCustodiansArray[3].custodian_name : '';
    descriptionRow4.getCell(7).value = _.size(sortedCustodiansArray) > 3 ? sortedCustodiansArray[3].custodian_address : '';

    descriptionRow4.getCell(9).value = { richText: setThresholdsValues('Light', selectedShipment.light_threshold, null, '           ', 'LUX') };

    descriptionRow4.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });

    sortedCustodiansArray.forEach((custodian, index) => {
      if (index > 3) {
        const descriptionRows = worksheet.addRow([]);
        descriptionRows.getCell(5).value = custodian.custodian_type;
        descriptionRows.getCell(6).value = custodian.custodian_name;
        descriptionRows.getCell(7).value = custodian.custodian_address;
      }
    });

    worksheet.addRow([]);

    const headerRow = worksheet.addRow(columns.map((col) => {
      if (col.label === 'Date Time') {
        const timeArray = _.split(timeFormat, ' ');
        const timePeriod = _.size(timeArray) === 1 ? '24-hour' : '12-hour';
        const filteredTimeZone = _.find(tzOptions, (option) => option.value === timeZone);
        const formattedLabel = `Date Time (${filteredTimeZone.abbrev}) (${dateFormat} ${timePeriod})`;
        return formattedLabel;
      }
      if (col.name === 'battery') {
        return 'BATTERY (%)';
      }
      return col.label;
    }));

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
      if ([6, 7, 8, 9, 10].includes(colNumber)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });

    const dateTimeColIndex = columns.findIndex((col) => col.label === 'Date Time') + 1;
    const departureTime = moment(selectedShipment.actual_time_of_departure).tz(timeZone).format(`${dateFormat} ${timeFormat}`);
    const arrivalTime = moment(selectedShipment.actual_time_of_arrival).isValid()
      ? moment(selectedShipment.actual_time_of_arrival).tz(timeZone).format(`${dateFormat} ${timeFormat}`)
      : null;
    const formattedDepartureTime = moment(departureTime).unix();
    const formattedArrivalTime = arrivalTime ? moment(arrivalTime).unix() : null;
    const greyRows = [];

    rows.forEach((row, rowIndex) => {
      const dataRow = columns.map((col) => {
        let cellValue = row[col.name];
        if (col.name === 'location') {
          if (!cellValue || cellValue === 'Error retrieving address') {
            cellValue = 'N/A';
          }
        }
        if (row.location === 'N/A') {
          row.lat = 'N/A';
          row.lng = 'N/A';
        }
        if (col.name === 'allAlerts' && Array.isArray(cellValue)) {
          cellValue = cellValue.map((item) => item.title).join(', ');
        }
        return cellValue;
      });

      const rowRef = worksheet.addRow(dataRow);
      rowRef.eachCell((cell, colNumber) => {
        const columnName = columns[colNumber - 1].name;
        if (columnName === 'allAlerts' && Array.isArray(row.allAlerts)) {
          const alerts = row.allAlerts;
          const richText = [];
          alerts.forEach((alert) => {
            richText.push({ text: alert.title, font: { color: { argb: _.includes(alert.color, 'green') ? theme.palette.success.main.replace('#', '') : alert.color.replace('#', '') } } });
            richText.push({ text: ', ' });
          });
          richText.pop();
          cell.value = { richText };
        }
        if (typeof cell.value === 'number') {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        if (columnName === 'lat' || columnName === 'lng') {
          cell.alignment = { horizontal: 'left' };
        }
      });

      if (Array.isArray(row.allAlerts)) {
        row.allAlerts.forEach((alert) => {
          const alertTitle = alert.title.toLowerCase();
          let colName;
          let fillColor;
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
          if (colName) {
            const colIndex = columns.findIndex((col) => col.name === colName);
            if (colIndex !== -1) {
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

      descriptionRow1.getCell(10).value = {
        richText: [
          { text: 'Temperature:' },
          {
            text: maxTempExcursionsCount > 0 ? ` ${maxTempExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.error.main.replace('#', '') } },
          },
          {
            text: minTempExcursionsCount > 0 ? ` ${minTempExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.info.main.replace('#', '') } },
          },
        ],
      };

      descriptionRow2.getCell(10).value = {
        richText: [
          { text: 'Humidity:' },
          {
            text: maxHumExcursionsCount > 0 ? ` ${maxHumExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.error.main.replace('#', '') } },
          },
          {
            text: minHumExcursionsCount > 0 ? ` ${minHumExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.info.main.replace('#', '') } },
          },
        ],
      };

      descriptionRow3.getCell(10).value = {
        richText: [
          { text: 'Shock:' },
          {
            text: maxShockExcursionsCount > 0 ? ` ${maxShockExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.error.main.replace('#', '') } },
          },
          {
            text: minShockExcursionsCount > 0 ? ` ${minShockExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.info.main.replace('#', '') } },
          },
        ],
      };

      descriptionRow4.getCell(10).value = {
        richText: [
          { text: 'Light:' },
          {
            text: maxLightExcursionsCount > 0 ? ` ${maxLightExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.error.main.replace('#', '') } },
          },
          {
            text: minLightExcursionsCount > 0 ? ` ${minLightExcursionsCount} ` : '',
            font: { color: { argb: theme.palette.info.main.replace('#', '') } },
          },
        ],
      };

      const dateValue = moment(row[columns[dateTimeColIndex - 1].name]).unix();
      if (formattedArrivalTime) {
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

    if (_.size(greyRows) > 0) {
      const firstGreyRow = worksheet.getRow(greyRows[0]);
      const lastGreyRow = worksheet.getRow(greyRows[greyRows.length - 1]);

      let firstGreyRowRichText = firstGreyRow.getCell(1).value.richText;
      let lastGreyRowRichText = lastGreyRow.getCell(1).value.richText;

      if (formattedArrivalTime) {
        if (_.size(firstGreyRowRichText) > 0) {
          firstGreyRowRichText = [
            ...firstGreyRowRichText,
            {
              text: ', Arrived',
              font: { color: { argb: theme.palette.background.black2.replace('#', '') } },
            },
          ];
        } else {
          firstGreyRowRichText = [
            { text: 'Arrived', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
          ];
        }
      }

      if (_.size(lastGreyRowRichText) > 0) {
        lastGreyRowRichText = [
          ...lastGreyRowRichText,
          {
            text: ', En route',
            font: { color: { argb: theme.palette.background.black2.replace('#', '') } },
          },
        ];
      } else {
        lastGreyRowRichText = [
          { text: 'En route', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
        ];
      }

      firstGreyRow.getCell(1).value = { richText: firstGreyRowRichText };
      lastGreyRow.getCell(1).value = { richText: lastGreyRowRichText };
    }

    const totalRows = _.size(sortedCustodiansArray) <= 4 ? rows.length + 7 : rows.length + 7 + _.size(sortedCustodiansArray) - 4;
    const totalCols = columns.length + 1;
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      for (let colIndex = 1; colIndex <= totalCols; colIndex++) {
        const cell = worksheet.getCell(rowIndex, colIndex);
        if (!cell.border) {
          cell.border = borderStyle;
        }
      }
    }

    worksheet.columns.forEach((column, index) => {
      if (index + 1 === 9) {
        column.width = 25;
      } else {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value
            ? cell.value.richText
              ? cell.value.richText.map((obj) => obj.text).join('')
              : cell.value.toString()
            : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
      }
    });

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
    || isLoading
    || isFetchingShipments
    || isFetchingAllGateways
    || isFetchingSensorAlerts
    || isFetchingSensorReports
    || isLoadingSensorProcessedData;

  return (
    <Box mt={5} mb={5}>
      {isLoaded && <Loader open={isLoaded} />}
      <Box className="reportingDashboardContainer">
        <Typography className="reportingDashboardHeading" variant="h4">
          Reporting
        </Typography>
        {!_.isEmpty(shipmentFilter) && !_.isEqual(shipmentFilter, 'Active') && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="reportingDashboardButton"
            onClick={() => setShowGenerateReport(true)}
            disabled={isReportPDFDownloading || _.isEmpty(selectedShipment)}
          >
            Insights Report
            <Tooltip placement="bottom" title="Beta version. Charges may apply for final version.">
              <InfoIcon fontSize="small" className="reportingDashboardButtonIcon" />
            </Tooltip>
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
              className="reportingSelectInput notranslate"
              label={(
                <span className="translate">Shipment Name</span>
              )}
              value={
                selectedShipment
                  ? selectedShipment.id
                  : ''
              }
              sx={{
                marginRight: isDesktop2() ? 0 : 1,
              }}
              SelectProps={{
                MenuProps: {
                  sx: { maxHeight: '350px' },
                },
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
                      className="notranslate"
                    >
                      {shipment.name}
                    </MenuItem>
                  ),
                )}
            </TextField>
          </div>
          {!_.isEmpty(shipmentFilter) && _.isEqual(shipmentFilter, 'Active')
            ? (
              <ReportingActiveShipmentDetails
                selectedShipment={selectedShipment}
                theme={theme}
                getShipmentValue={getShipmentValue}
              />
            )
            : (
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
        <Grid ref={mapRef} item xs={12}>
          <div className="reportingSwitchViewSection">
            <Typography className="reportingSectionTitleHeading" variant="h5">
              {!_.isEmpty(selectedShipment) && selectedShipment.name ? (
                <>
                  <span>Map View - Shipment: </span>
                  <span className="notranslate">{selectedShipment.name}</span>
                </>
              ) : 'Map View'}
            </Typography>
          </div>
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
            mapLanguage={getTranslatedLanguage()}
          />
        </Grid>
      </Grid>
      <Grid container className="reportingContainer" sx={{ marginTop: _.isEmpty(selectedShipment) ? 4 : -1 }}>
        <div className="reportingSwitchViewSection">
          <Typography className="reportingSectionTitleHeading" variant="h5">
            {!_.isEmpty(selectedShipment) && selectedShipment.name ? (
              <>
                <span>Graph View - Shipment: </span>
                <span className="notranslate">{selectedShipment.name}</span>
              </>
            ) : 'Graph View'}
          </Typography>
        </div>
        <Grid item xs={2} sm={1}>
          <List
            component="nav"
            aria-label="main graph-type"
            className="reportingGraphIconBar"
          >
            {_.map(REPORT_TYPES(unitData), (item, index) => (
              <ListItem
                key={`iconItem${index}${item.id} `}
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
        <Grid item xs={10} sm={11}>
          {selectedShipment && selectedGraph && allGraphs && !_.isEmpty(allGraphs) && allGraphs[selectedGraph]
            ? (
              <GraphComponent
                data={allGraphs[selectedGraph]}
                selectedGraph={selectedGraph}
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
        shipmentName={selectedShipment && selectedShipment.name}
        selectedShipment={selectedShipment}
        selectedMarker={selectedShipment && selectedMarker}
        unitOfMeasure={unitData}
        timezone={timeZone}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
      />
      <AlertsReport
        ref={alertsTableRef}
        sensorReport={reports}
        alerts={_.filter(
          sensorAlertData,
          { shipment_id: selectedShipment && selectedShipment.partner_shipment_id },
        )}
        shipmentName={selectedShipment && selectedShipment.name}
        timezone={timeZone}
        unitOfMeasure={unitData}
        shouldScroll={!!locShipmentID}
      />
      <ReportGraph
        ref={tempGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="temperature"
        data={allGraphs}
      />
      <ReportGraph
        ref={humGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="humidity"
        data={allGraphs}
      />
      <ReportGraph
        ref={shockGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="shock"
        data={allGraphs}
      />
      <ReportGraph
        ref={lightGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="light"
        data={allGraphs}
      />
      <ReportGraph
        ref={batteryGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="battery"
        data={allGraphs}
      />
      <GenerateReport
        open={showGenerateReport}
        setOpen={setShowGenerateReport}
        tableRef={reportingDetailTableRef}
        mapRef={mapRef}
        tempGraphRef={tempGraphRef}
        humGraphRef={humGraphRef}
        shockGraphRef={shockGraphRef}
        lightGraphRef={lightGraphRef}
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
