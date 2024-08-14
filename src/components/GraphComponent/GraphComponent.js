import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';
import moment from 'moment-timezone';
import { Typography, useTheme } from '@mui/material';

const GraphComponent = ({
  data,
  selectedGraph,
  unitOfMeasure,
  minTemp,
  maxTemp,
  minHumidity,
  maxHumidity,
  shockThreshold,
  lightThreshold,
  timeGap,
  minColor,
  maxColor,
}) => {
  const theme = useTheme();
  const [dataChart, setDataChart] = useState({});
  const dateFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
    : '';
  const timeFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
    : '';

  const options = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'minute',
            unitStepSize: timeGap,
            displayFormats: {
              minute: dateFormat,
            },
            tooltipFormat: `${dateFormat} ${timeFormat}`,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const generateDatasets = (type) => {
    let datasets = [{
      label: _.upperCase(selectedGraph),
      data: _.orderBy(
        data,
        (item) => moment(item.x),
        ['asc'],
      ),
      fill: false,
      showLine: true,
      spanGaps: true,
      borderColor: theme.palette.background.dark,
      backgroundColor: theme.palette.background.default,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: theme.palette.background.dark,
      pointBackgroundColor: theme.palette.background.default,
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: theme.palette.background.dark,
      pointHoverBorderColor: theme.palette.background.light,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    }];

    if (_.isEqual(selectedGraph, 'temperature')) {
      datasets = [
        ...datasets,
        {
          label: 'Max Temperature',
          data: maxTemp,
          fill: false,
          showLine: true,
          spanGaps: true,
          borderColor: maxColor,
          backgroundColor: maxColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: maxColor,
          pointBackgroundColor: maxColor,
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: maxColor,
          pointHoverBorderColor: maxColor,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'Min Temperature',
          data: minTemp,
          fill: false,
          showLine: true,
          spanGaps: true,
          borderColor: minColor,
          backgroundColor: minColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: minColor,
          pointBackgroundColor: minColor,
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: minColor,
          pointHoverBorderColor: minColor,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
        },
      ];
    }

    if (_.isEqual(selectedGraph, 'humidity')) {
      datasets = [
        ...datasets,
        {
          label: 'Max Humidity',
          data: maxHumidity,
          fill: false,
          showLine: true,
          spanGaps: true,
          borderColor: maxColor,
          backgroundColor: maxColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: maxColor,
          pointBackgroundColor: maxColor,
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: maxColor,
          pointHoverBorderColor: maxColor,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'Min Humidity',
          data: minHumidity,
          fill: false,
          showLine: true,
          spanGaps: true,
          borderColor: minColor,
          backgroundColor: minColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: minColor,
          pointBackgroundColor: minColor,
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: minColor,
          pointHoverBorderColor: minColor,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
        },
      ];
    }

    if (_.isEqual(selectedGraph, 'shock')) {
      datasets = [
        ...datasets,
        {
          label: 'Shock Threshold',
          data: shockThreshold,
          fill: false,
          showLine: true,
          spanGaps: true,
          borderColor: maxColor,
          backgroundColor: maxColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: maxColor,
          pointBackgroundColor: maxColor,
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: maxColor,
          pointHoverBorderColor: maxColor,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
        },
      ];
    }

    if (_.isEqual(selectedGraph, 'light')) {
      datasets = [
        ...datasets,
        {
          label: 'Light Threshold',
          data: lightThreshold,
          fill: false,
          showLine: true,
          spanGaps: true,
          borderColor: maxColor,
          backgroundColor: maxColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: maxColor,
          pointBackgroundColor: maxColor,
          pointBorderWidth: 1,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: maxColor,
          pointHoverBorderColor: maxColor,
          pointHoverBorderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
        },
      ];
    }

    return datasets;
  };

  useEffect(() => {
    if (data && data.length > 0 && selectedGraph) {
      setDataChart({
        labels: _.map(data, 'x'),
        datasets: generateDatasets(selectedGraph),
      });
    }
  }, [data, selectedGraph]);

  return (
    <div>
      {data && data.length > 0 ? (
        <Line data={dataChart} options={options} />
      ) : (
        <Typography
          variant="body1"
          style={{ marginTop: theme.spacing(5), textAlign: 'center' }}
        >
          No data to display
        </Typography>
      )}
    </div>
  );
};

export default GraphComponent;
