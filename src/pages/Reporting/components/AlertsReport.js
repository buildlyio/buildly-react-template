import React, { useEffect, useState, useRef } from 'react';
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

const AlertsReport = ({
  sensorReport, alerts, shipmentName, timezone, unitOfMeasure, shouldScroll,
}) => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const scrollRef = useRef(null);

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

        editedAlerts = [...editedAlerts, { ...alert, alertObj }];
      });

      const sortedData = _.orderBy(
        editedAlerts,
        (item) => moment(item.create_date),
        ['desc'],
      );
      setRows(sortedData);
    }
  }, [alerts]);

  return (
    <Grid className="reportingAlertRoot" container spacing={2} ref={scrollRef}>
      <Grid item xs={12}>
        <div className="reportingAlertTooltip">
          <Typography
            className="reportingAlertTitle"
            variant="h5"
          >
            {shipmentName
              ? `Alerts Report - Shipment: ${shipmentName}`
              : 'Alerts Report'}
          </Typography>
        </div>
        <DataTableWrapper
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
        />
      </Grid>
    </Grid>
  );
};

export default AlertsReport;
