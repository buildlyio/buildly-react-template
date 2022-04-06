import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DataTableWrapper from '../../../components/DataTableWrapper/DataTableWrapper';
import {
  SENSOR_REPORT_COLUMNS,
} from '../ReportingConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  tooltip: {
    background: '#383636',
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
  leftHeader: {
    '& span': {
      textAlign: 'left',
    },
  },
}));

const SensorReport = ({
  loading,
  aggregateReport,
  shipmentName,
  selectedMarker,
}) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);

  const columns = _.map(
    SENSOR_REPORT_COLUMNS,
    (column) => ({
      ...column,
      options: {
        ...column.options,
        setCellHeaderProps: () => ({
          className: classes.leftHeader,
        }),
      },
    }),
  );

  useEffect(() => {
    if (aggregateReport) {
      const sortedData = _.orderBy(
        aggregateReport,
        (item) => moment(item.timestamp),
        ['desc'],
      );
      setRows(sortedData);
    } else {
      setRows([]);
    }
  }, [aggregateReport]);

  useEffect(() => {
    if (selectedMarker) {
      const selectedIndex = _.map(
        _.keys(
          _.pickBy(
            rows,
            { lat: selectedMarker.lat, lng: selectedMarker.lng },
          ),
        ),
        Number,
      );
      setSelected(selectedIndex);
    } else {
      setSelected([]);
    }
  }, [selectedMarker]);

  const customSort = (data, colIndex, order, meta) => {
    if (colIndex === 1) {
      return _.orderBy(
        data,
        (item) => moment(item.data[colIndex]),
        [order],
      );
    }
    return data.sort((a, b) => (a.data[colIndex].length < b.data[colIndex].length
      ? -1
      : 1
    ) * (order === 'desc' ? 1 : -1));
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.tooltip}>
          <Typography
            className={classes.title}
            variant="h5"
          >
            {shipmentName
            && `Sensor Report - Shipment: ${shipmentName}`}
          </Typography>
        </div>
        <DataTableWrapper
          noCustomTheme
          noSpace
          loading={loading}
          rows={rows}
          columns={columns}
          filename="AggregateReportData"
          tableHeight="500px"
          hideAddButton
          selectable={{
            rows: 'multiple',
            rowsHeader: false,
            rowsHideCheckboxes: true,
          }}
          selected={selected}
          customSort={customSort}
        />
      </Grid>
    </Grid>
  );
};

export default SensorReport;
