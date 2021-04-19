import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

export function GraphComponent(props) {
  const { data, selectedGraph } = props;
  const [dataChart, setDataChart] = useState({});
  const options = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "minute",
            unitStepSize: 1,
            displayFormats: {
              minute: "MMM DD",
            },
            tooltipFormat: "MMMM DD, YYYY HH:mm:ss",
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
      setDataChart({
        labels: _.map(data, "x"),
        datasets: [
          {
            label: selectedGraph.toUpperCase(),
            data: _.orderBy(
              data,
              (item) => {
                return moment(item.x);
              },
              ["asc"]
            ),
            fill: false,
            showLine: true,
            spanGaps: true,
            borderColor: "#EBC645",
            backgroundColor: "#383636",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#424242",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#424242",
            pointHoverBorderColor: "#EBC645",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          },
        ],
      });
    }
  }, [data, selectedGraph]);

  return (
    <div>
      {data && data.length > 0 ? (
        <Line data={dataChart} options={options} />
      ) : (
        <Typography
          variant={"body1"}
          align={"center"}
          style={{ marginTop: 40 }}
        >
          No data to display
        </Typography>
      )}
    </div>
  );
}
