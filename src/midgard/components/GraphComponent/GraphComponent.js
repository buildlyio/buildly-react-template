import React, { useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";
import { Line } from 'react-chartjs-2';

export function GraphComponent(props) {
  const { data, selectedGraph } = props;
  const [dataChart, setDataChart] = useState ({});

  useEffect(() => {
    if (data && data.length > 0) {
      setDataChart({
        labels: data.map(({x}) => ([moment(x).format("MMM-DD")])),
        datasets: [
          {
            label: selectedGraph,
            data: _.map(data, 'y'),
            fill: false,
            borderColor: "#EBC645",
            lineTension: 0.1,
            backgroundColor: '#EBC645',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#EBC645',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#EBC645',
            pointHoverBorderColor: '#EBC645',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          }
        ]
      })
    }
    },[]);

  return (
    <div>
      { data && data.length > 0 ? (
        <Line data={dataChart} />
      ) :
        <div> No data to display </div>}
    </div>
  );
}
