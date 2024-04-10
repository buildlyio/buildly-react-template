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

  useEffect(() => {
    if (data && data.length > 0 && selectedGraph) {
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
            data: _.map(data, (d) => ({ x: d.x, y: maxTemp.y })),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: maxTemp.color,
            backgroundColor: maxTemp.color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: maxTemp.color,
            pointBackgroundColor: maxTemp.color,
            pointBorderWidth: 1,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: maxTemp.color,
            pointHoverBorderColor: maxTemp.color,
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 10,
          },
          {
            label: 'Min Temperature',
            data: _.map(data, (d) => ({ x: d.x, y: minTemp.y })),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: minTemp.color,
            backgroundColor: minTemp.color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: minTemp.color,
            pointBackgroundColor: minTemp.color,
            pointBorderWidth: 1,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: minTemp.color,
            pointHoverBorderColor: minTemp.color,
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
            data: _.map(data, (d) => ({ x: d.x, y: maxHumidity.y })),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: maxHumidity.color,
            backgroundColor: maxHumidity.color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: maxHumidity.color,
            pointBackgroundColor: maxHumidity.color,
            pointBorderWidth: 1,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: maxHumidity.color,
            pointHoverBorderColor: maxHumidity.color,
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 10,
          },
          {
            label: 'Min Humidity',
            data: _.map(data, (d) => ({ x: d.x, y: minHumidity.y })),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: minHumidity.color,
            backgroundColor: minHumidity.color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: minHumidity.color,
            pointBackgroundColor: minHumidity.color,
            pointBorderWidth: 1,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: minHumidity.color,
            pointHoverBorderColor: minHumidity.color,
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
            data: _.map(data, (d) => ({ x: d.x, y: shockThreshold.y })),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: shockThreshold.color,
            backgroundColor: shockThreshold.color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: shockThreshold.color,
            pointBackgroundColor: shockThreshold.color,
            pointBorderWidth: 1,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: shockThreshold.color,
            pointHoverBorderColor: shockThreshold.color,
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
            data: _.map(data, (d) => ({ x: d.x, y: lightThreshold.y })),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: lightThreshold.color,
            backgroundColor: lightThreshold.color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: lightThreshold.color,
            pointBackgroundColor: lightThreshold.color,
            pointBorderWidth: 1,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: lightThreshold.color,
            pointHoverBorderColor: lightThreshold.color,
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 10,
          },
        ];
      }

      setDataChart({
        labels: _.map(data, 'x'),
        datasets,
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
