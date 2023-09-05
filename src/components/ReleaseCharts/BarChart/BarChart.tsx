import React from "react";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// style={{ maxHeight: "600px" }}

const BarChart = ({
  id,
  labels,
  label,
  data,
  backgroundColor,
  borderWidth,
  borderColor,
}: any) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: label,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    maintainAspectRatio: false,
  };

  const chartData = {
    labels,
    datasets: data,
  };
  return <Bar id={id} options={options} data={chartData} />;
};

BarChart.propTypes = {
  id: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  label: PropTypes.string,
  data: PropTypes.array.isRequired,
  backgroundColor: PropTypes.string,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
};

export default BarChart;
