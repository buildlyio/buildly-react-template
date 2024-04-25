import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Typography,
} from '@mui/material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { SENSOR_REPORT_COLUMNS } from '@utils/constants';
import '../ReportingStyles.css';

const SensorReport = ({
  sensorReport,
  shipmentName,
  selectedMarker,
  unitOfMeasure,
  timezone,
}) => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);

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
    <Grid className="reportingSensorRoot" container spacing={2}>
      <Grid item xs={12}>
        <div className="reportingSensorTooltip">
          <Typography
            className="reportingSensorReportTitle"
            variant="h5"
          >
            {shipmentName
              ? `Sensor Report - Shipment: ${shipmentName}`
              : 'Sensor Report'}
          </Typography>
        </div>
        <DataTableWrapper
          noSpace
          hideAddButton
          filename="SensorReportData"
          rows={rows}
          columns={SENSOR_REPORT_COLUMNS(
            unitOfMeasure,
            timezone,
            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
              ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
              : '',
            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
              ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
              : '',
          )}
          selectable={{
            rows: 'multiple',
            rowsHeader: false,
            rowsHideCheckboxes: true,
          }}
          selected={selected}
          customSort={customSort}
          extraOptions={{
            customToolbar: () => (
              <Typography variant="caption" className="reportingSensorTableTitle">
                <span style={{ fontStyle: 'italic', fontWeight: '700' }}>bold/italic alerts</span>
                {' '}
                indicates alerts outside of selected transmission
              </Typography>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SensorReport;
