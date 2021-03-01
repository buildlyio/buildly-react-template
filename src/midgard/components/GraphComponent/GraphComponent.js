import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Scatter } from 'react-chartjs-2';

export function GraphComponent(props) {
  const { data, selectedGraph } = props;
  const [dataChart, setDataChart] = useState({});
  const options = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          parser: 'YYYY-MM-DD hh:mm:ss',
          tooltipFormat: 'YYYY-MM-DD hh:mm:ss'
        }
      }]
    }
  }
  useEffect(() => {
    if (data && data.length > 0 && selectedGraph) {
      setDataChart({
        labels: _.map(data,'x'),
        datasets: [
          {
            label: selectedGraph.toUpperCase(),
            data: data,
            fill: false,
            showLine: true,
            borderColor: "#EBC645",
            backgroundColor: '#383636',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#424242',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#424242',
            pointHoverBorderColor: '#EBC645',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          }
        ]
      })
    }
  }, [data,selectedGraph]);

  return (
    <div>
      { data && data.length > 0 ? (
        <Scatter data={dataChart} options={options} />
      ) :
        <div> No data to display </div>}
    </div>
  );
}
