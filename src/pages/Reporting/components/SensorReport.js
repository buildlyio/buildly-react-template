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
} from '../../../utils/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  tooltip: {
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
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
  sensorReport,
  shipmentName,
  selectedMarker,
  unitOfMeasure,
  timezone,
}) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);

  const columns = _.map(
    SENSOR_REPORT_COLUMNS(unitOfMeasure, timezone),
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
    const sortedData = _.orderBy(
      sensorReport,
      (item) => moment(item.timestamp),
      ['desc'],
    );
    setRows(sortedData);
  }, [sensorReport]);

  useEffect(() => {
    if (selectedMarker) {
      const highlightIndex = _.findIndex(rows, {
        lat: selectedMarker.lat, lng: selectedMarker.lng,
      });
      setSelected([highlightIndex]);
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
            {!shipmentName && 'Sensor Report'}
          </Typography>
        </div>
        <DataTableWrapper
          noSpace
          hideAddButton
          filename="SensorReportData"
          tableHeight="500px"
          loading={loading}
          rows={rows}
          columns={columns}
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
