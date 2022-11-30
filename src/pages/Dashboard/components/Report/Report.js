import React from 'react';
import TimelineComponent from '@components/Timeline/TimelineComponent';
import Card from '@mui/material/Card';
import PieChartComponent from '@components/charts/PieChart/PieChartComponent';

const Report = ({ product }) => {
  const data = [];
  return (
    <>

      <div className={'report-card'}>
        <Card>
          <PieChartComponent />
        </Card>

      </div>
      <div className={'report-card col-md-6'}>
        <Card>
          <TimelineComponent />
        </Card>
      </div>
    </>
  );
};

export default Report;
