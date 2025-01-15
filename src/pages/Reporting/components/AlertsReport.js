/* eslint-disable no-param-reassign */
import React, {
  useEffect, useState, useRef, forwardRef,
} from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getAlertsReportColumns } from '@utils/constants';
import '../ReportingStyles.css';
import { getTimezone } from '@utils/utilMethods';

const AlertsReport = forwardRef((props, ref) => {
  const {
    sensorReport, alerts, shipmentName, timezone, unitOfMeasure, shouldScroll,
  } = props;

  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const scrollRef = useRef(null);

  const dateFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
    : '';
  const timeFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
    : '';

  if (shouldScroll && scrollRef.current) {
    window.scrollTo({
      top: scrollRef.current.offsetTop - 50,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    if (alerts) {
      let editedAlerts = [];

      const filteredData = _.filter(
        alerts,
        (alert) => alert.parameter_type !== 'location',
      );
      _.forEach(filteredData, (alert) => {
        let alertObj = {};
        let location = 'N/A';
        let latitude = 'N/A';
        let longitude = 'N/A';
        if (alert.recovered_alert_id !== null) {
          alertObj = { id: alert.parameter_type, color: 'green', title: `${_.capitalize(alert.parameter_type)} Excursion Recovered` };
        } else if (alert) {
          switch (true) {
            case _.includes(_.toLower(alert.alert_type), 'max'):
            case _.includes(_.toLower(alert.alert_type), 'shock'):
            case _.includes(_.toLower(alert.alert_type), 'light'):
              alertObj = { id: alert.parameter_type, color: theme.palette.error.main, title: `Maximum ${_.capitalize(alert.parameter_type)} Excursion` };
              break;

            case _.includes(_.toLower(alert.alert_type), 'min'):
              alertObj = { id: alert.parameter_type, color: theme.palette.info.main, title: `Minimum ${_.capitalize(alert.parameter_type)} Excursion` };
              break;

            default:
              break;
          }
        }

        if (alert.create_date && alert.create_date !== '-') {
          const dt = moment(alert.create_date).tz(timezone).format(`${dateFormat} ${timeFormat}`);
          const report = _.find(sensorReport, { timestamp: dt });
          if (!_.isEmpty(report) && !_.isEqual(report.location, null) && !_.isEqual(report.location, undefined) && !_.isEqual(report.location, 'Error retrieving address')) {
            location = report.location;
          }
          if (!_.isEmpty(report) && !_.isEqual(report.lat, null)) {
            latitude = report.lat;
          }
          if (!_.isEmpty(report) && !_.isEqual(report.lat, null)) {
            longitude = report.lng;
          }
        }

        editedAlerts = [...editedAlerts, {
          ...alert, alertObj, location, latitude, longitude,
        }];
      });

      const sortedData = _.orderBy(
        editedAlerts,
        (item) => moment(item.create_date),
        ['desc'],
      );
      setRows(sortedData);
    }
  }, [alerts]);

  const buildCSV = (columns, data) => {
    const escapeCSV = (text) => `"${text}"`;
    const csvHeader = columns.map((col) => {
      if (col.label === 'Date/Time stamp') {
        const timeArray = _.split(timeFormat, ' ');
        const timePeriod = _.size(timeArray) === 1 ? '24-hour' : '12-hour';
        const formattedLabel = `${col.label} (${getTimezone(new Date(), timezone)}) (${dateFormat} ${timePeriod})`;
        return escapeCSV(formattedLabel);
      }
      return escapeCSV(col.label);
    }).join(',');
    const csvBody = data.map(({ data: row }) => row.map((cell, index) => {
      const column = columns[index];
      if (column.label === 'Date/Time stamp' && !_.isEmpty(cell)) {
        return escapeCSV(moment(cell).tz(timezone).format(`${dateFormat} ${timeFormat}`));
      }
      if (!row.location || row.location === 'Error retrieving address') {
        row.location = 'N/A';
      }
      if (row.location === 'N/A') {
        row.lat = 'N/A';
        row.lng = 'N/A';
      }
      if (!_.isEmpty(cell) && !_.isEmpty(cell.title)) {
        return escapeCSV(cell.title);
      }
      return escapeCSV(cell);
    }).join(',')).join('\n');
    return `${csvHeader}\n${csvBody}`;
  };

  return (
    <Grid className="reportingAlertRoot" container spacing={2} ref={scrollRef}>
      <Grid item xs={12} ref={ref}>
        <div className="reportingAlertTooltip">
          <Typography className="reportingAlertTitle" variant="h5">
            {shipmentName ? (
              <>
                <span>Alerts Report - Shipment: </span>
                <span className="notranslate">{shipmentName}</span>
              </>
            ) : 'Alerts Report'}
          </Typography>
        </div>
        <DataTableWrapper
          className="reportingAlertDataTable"
          noSpace
          hideAddButton
          filename="ShipmentAlerts"
          rows={rows}
          columns={getAlertsReportColumns(
            sensorReport,
            timezone,
            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
              ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
              : '',
            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
              ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
              : '',
          )}
          extraOptions={{
            onDownload: (buildHead, buildBody, columns, data) => buildCSV(columns, data),
          }}
        />
      </Grid>
    </Grid>
  );
});

export default AlertsReport;
