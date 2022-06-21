import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomizedTooltips from '../../../components/ToolTip/ToolTip';
import DataTableWrapper from '../../../components/DataTableWrapper/DataTableWrapper';
import {
  getAlertsReportColumns,
  ALERTS_REPORT_TOOLTIP,
} from '../ReportingConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  tooltip: {
    background: theme.palette.background.dark,
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: 'uppercase',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
  },
}));

const AlertsReport = ({
  loading,
  alerts,
  shipmentName,
  timezone,
}) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (alerts) {
      const filteredData = _.filter(
        alerts,
        (alert) => alert.parameter_type !== 'location',
      );
      const sortedData = _.orderBy(
        filteredData,
        (item) => moment(item.create_date),
        ['desc'],
      );
      setRows(sortedData);
    }
  }, [alerts]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.tooltip}>
          <Typography
            className={classes.title}
            variant="h5"
          >
            {shipmentName
            && `Alerts Report - Shipment: ${shipmentName}`}
            <CustomizedTooltips
              toolTipText={ALERTS_REPORT_TOOLTIP}
            />
          </Typography>
        </div>
        <DataTableWrapper
          noCustomTheme
          noSpace
          loading={loading}
          rows={rows}
          columns={getAlertsReportColumns(timezone)}
          filename="ShipmentAlerts"
          hideAddButton
        />
      </Grid>
    </Grid>
  );
};

export default AlertsReport;
