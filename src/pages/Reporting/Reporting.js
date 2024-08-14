/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import _, { isArray } from 'lodash';
import moment from 'moment-timezone';
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
import {
  getShipmentOverview,
  REPORT_TYPES,
  getIcon,
  processReportsAndMarkers,
  SENSOR_REPORT_COLUMNS,
} from '@utils/constants';
import ReportingActiveShipmentDetails from './components/ReportingActiveShipmentDetails';
import ReportingDetailTable from './components/ReportingDetailTable';
import AlertsReport from './components/AlertsReport';
import SensorReport from './components/SensorReport';
import { useQuery } from 'react-query';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
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
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import './ReportingStyles.css';
import { isDesktop2 } from '@utils/mediaQuery';
import GenerateReport from './components/GenerateReport';
import { getTimezone } from '@utils/utilMethods';
import ExcelJS from 'exceljs';
import ReportGraph from './components/ReportGraph';

const Reporting = () => {
  const location = useLocation();
  const theme = useTheme();
  const organization = getUser().organization.organization_uuid;

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
  const [isGenerateReportLoading, setGenerateReportLoading] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const reportingDetailTableRef = useRef();
  const mapRef = useRef();
  const tempGraphRef = useRef();
  const humGraphRef = useRef();
  const shockGraphRef = useRef();
  const lightGraphRef = useRef();
  const batteryGraphRef = useRef();

  const { displayAlert } = useAlert();
  const { data: timeZone } = useStore();

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

  const { mutate: reportPDFDownloadMutation, isLoading: isReportPDFDownloading } = useReportPDFDownloadMutation(displayAlert);

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

  const downloadCSV = () => {
    const columns = SENSOR_REPORT_COLUMNS(unitData, selectedShipment);
    const data = _.orderBy(
      reports,
      (item) => moment(item.timestamp),
      ['desc'],
    );
    const escapeCSV = (text) => `"${text}"`;
    const csvHeader = columns.map((col) => {
      if (col.label === 'Date Time') {
        return escapeCSV(`${col.label} (${getTimezone(new Date(), timeZone)})`);
      }
      return escapeCSV(col.label);
    }).join(',');
    const csvBody = data.map((row) => columns.map((col, colIndex) => {
      let cell = row[col.name];
      if (!row.location || row.location === 'Error retrieving address') {
        row.location = 'N/A';
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
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SensorReportData.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    const columns = SENSOR_REPORT_COLUMNS(unitData, selectedShipment);
    const rows = _.orderBy(
      reports,
      (item) => moment(item.timestamp),
      ['desc'],
    );

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
      'Temp. Excursions',
      'Hum. Excursions',
      'Shock Excursions',
      'Light Excursions',
    ]);

    const descriptionRow1 = worksheet.addRow([
      'Red, Blue indicate Excursions',
      selectedShipment.tracker,
      selectedShipment.name,
      '',
      '',
      '',
      '',
    ]);

    const descriptionRow2 = worksheet.addRow([
      'Green indicates Recovery',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);

    const descriptionRow3 = worksheet.addRow([
      'Grey indicates Transit',
    ]);

    worksheet.addRow([]);

    const headerRow = worksheet.addRow(columns.map((col) => {
      if (col.label === 'Date Time') {
        return `Date Time (${getTimezone(new Date(), timeZone)})`;
      }
      return col.label;
    }));

    descriptionRow.eachCell((cell) => {
      cell.font = {
        color: { argb: theme.palette.background.black2.replace('#', '') },
        bold: true,
      };
    });

    descriptionRow1.getCell(1).value = {
      richText: [
        { text: 'Red', font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
        { text: ', ', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
        { text: 'Blue', font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
        { text: ' indicate Excursions', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
      ],
    };

    descriptionRow2.getCell(1).value = {
      richText: [
        { text: 'Green', font: { color: { argb: theme.palette.success.main.replace('#', '') } } },
        { text: ' indicates Recovery', font: { color: { argb: theme.palette.background.black2.replace('#', '') } } },
      ],
    };

    descriptionRow3.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: theme.palette.background.light6.replace('#', '') },
      };
    });

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
      if ([6, 7, 8, 9, 10, 11, 12, 13].includes(colNumber)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });

    const dateTimeColIndex = columns.findIndex((col) => col.label === 'Date Time') + 1;
    const departureTime = moment(selectedShipment.actual_time_of_departure).unix();
    const arrivalTime = moment(selectedShipment.actual_time_of_arrival).unix();

    rows.forEach((row, rowIndex) => {
      const dataRow = columns.map((col) => {
        let cellValue = row[col.name];
        if (col.name === 'location') {
          if (!cellValue || cellValue === 'Error retrieving address') {
            cellValue = 'N/A';
          }
        }
        if (col.name === 'allAlerts' && Array.isArray(cellValue)) {
          cellValue = cellValue.map((item) => item.title).join(', ');
        }
        return cellValue;
      });

      const rowRef = worksheet.addRow(dataRow);
      rowRef.eachCell((cell, colNumber) => {
        if (columns[colNumber - 1].name === 'allAlerts' && Array.isArray(row.allAlerts)) {
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
              const cell = worksheet.getCell(rowIndex + 7, colIndex + 1);
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

      const dateValue = moment(row[columns[dateTimeColIndex - 1].name]).unix();
      if (dateValue > departureTime && dateValue < arrivalTime) {
        rowRef.eachCell((cell) => {
          if (!cell.fill) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: theme.palette.background.light6.replace('#', '') },
            };
          }
        });
      }
    });

    descriptionRow1.getCell(4).value = {
      richText: [
        { text: maxTempExcursionsCount, font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
      ],
    };
    descriptionRow1.getCell(5).value = {
      richText: [
        { text: maxHumExcursionsCount, font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
      ],
    };
    descriptionRow1.getCell(6).value = {
      richText: [
        { text: maxShockExcursionsCount, font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
      ],
    };
    descriptionRow1.getCell(7).value = {
      richText: [
        { text: maxLightExcursionsCount, font: { color: { argb: theme.palette.error.main.replace('#', '') } } },
      ],
    };
    descriptionRow2.getCell(4).value = {
      richText: [
        { text: minTempExcursionsCount, font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
      ],
    };
    descriptionRow2.getCell(5).value = {
      richText: [
        { text: minHumExcursionsCount, font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
      ],
    };
    descriptionRow2.getCell(6).value = {
      richText: [
        { text: minShockExcursionsCount, font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
      ],
    };
    descriptionRow2.getCell(7).value = {
      richText: [
        { text: minLightExcursionsCount, font: { color: { argb: theme.palette.info.main.replace('#', '') } } },
      ],
    };

    [4, 5, 6, 7].forEach((colIndex) => {
      descriptionRow.getCell(colIndex).alignment = { vertical: 'middle', horizontal: 'center' };
      descriptionRow1.getCell(colIndex).alignment = { vertical: 'middle', horizontal: 'center' };
      descriptionRow2.getCell(colIndex).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const totalRows = rows.length + 6;
    const totalCols = columns.length;
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      for (let colIndex = 1; colIndex <= totalCols; colIndex++) {
        const cell = worksheet.getCell(rowIndex, colIndex);
        if (!cell.border) {
          cell.border = borderStyle;
        }
      }
    }

    worksheet.columns.forEach((column, index) => {
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
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SensorReportData.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box mt={5} mb={5}>
      {(isLoadingShipments
        || isLoadingUnits
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
        || isLoadingSensorProcessedData)
        && (
          <Loader open={isLoadingShipments
            || isLoadingUnits
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
            || isLoadingSensorProcessedData}
          />
        )}
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
            disabled={isGenerateReportLoading || isReportPDFDownloading}
          >
            Generate Report
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
        <Grid item xs={12} ref={mapRef}>
          <div className="reportingSwitchViewSection">
            <Typography
              className="reportingSectionTitleHeading"
              variant="h5"
            >
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
            markers={markers}
            googleMapURL={window.env.MAP_API_URL}
            zoom={_.isEmpty(markers) ? 4 : 12}
            setSelectedMarker={setSelectedMarker}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '625px' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            unitOfMeasure={unitData}
          />
        </Grid>
      </Grid>
      <Grid container className="reportingContainer" sx={{ marginTop: _.isEmpty(selectedShipment) ? 4 : -1 }}>
        <div className="reportingSwitchViewSection">
          <Typography
            className="reportingSectionTitleHeading"
            variant="h5"
          >
            {!_.isEmpty(selectedShipment) && selectedShipment.name ? (
              <>
                <span>Graph View - Shipment: </span>
                <span className="notranslate">{selectedShipment.name}</span>
              </>
            ) : 'Graph View'}
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
                timeGap={!_.isEmpty(selectedShipment) ? selectedShipment.measurement_time : 5}
                minColor={theme.palette.info.main}
                maxColor={theme.palette.error.main}
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
        selectedShipment={selectedShipment}
        selectedMarker={selectedShipment && selectedMarker}
        unitOfMeasure={unitData}
        timezone={timeZone}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
      />
      <AlertsReport
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
        hidden={!showGenerateReport}
      />
      <ReportGraph
        ref={humGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="humidity"
        data={allGraphs}
        hidden={!showGenerateReport}
      />
      <ReportGraph
        ref={shockGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="shock"
        data={allGraphs}
        hidden={!showGenerateReport}
      />
      <ReportGraph
        ref={lightGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="light"
        data={allGraphs}
        hidden={!showGenerateReport}
      />
      <ReportGraph
        ref={batteryGraphRef}
        selectedShipment={selectedShipment}
        unitOfMeasure={unitData}
        theme={theme}
        graphType="battery"
        data={allGraphs}
        hidden={!showGenerateReport}
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
        isGenerateReportLoading={isGenerateReportLoading}
        setGenerateReportLoading={setGenerateReportLoading}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
        reportPDFDownloadMutation={reportPDFDownloadMutation}
        selectedShipment={selectedShipment}
      />
    </Box>
  );
};

export default Reporting;
