import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({
  productFeatures,
  productIssues,
}) => {
  const barData = {
    labels: ['Number of Tickets'],
    datasets: [
      {
        label: 'Features',
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#bf8700',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: [productFeatures.length],
        barThickness: 32,
        barPercentage: 3.5,
      },
      {
        label: 'Issues',
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#ec6547',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: [productIssues.length],
        barThickness: 32,
        barPercentage: 3.5,
      },
    ],
  };

  return (
    <div style={{ marginTop: 50 }}>
      <Bar
        data={barData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          tooltips: {
            enabled: true,
          },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      />
    </div>
  );
};

export default BarChart;
