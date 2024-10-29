import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Typography, useTheme } from '@mui/material';
import './GraphComponent.css';

const GraphComponent = ({
  data,
  selectedGraph,
}) => {
  const theme = useTheme();

  const legendContent = (
    <div className="graphLegendDiv">
      <div className="graphNormalColor" />
      {_.capitalize(selectedGraph)}
      <div className="graphMaxColor" />
      {`Max ${_.capitalize(selectedGraph)}`}
      {_.size(data) > 0 && _.includes(_.keysIn(data[0]), 'min') && (<div className="graphMinColor" />)}
      {_.size(data) > 0 && _.includes(_.keysIn(data[0]), 'min') && `Min ${_.capitalize(selectedGraph)}`}
    </div>
  );

  const customDot = <circle r="0.5" />;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="graphTooltip">
          <div>{label}</div>
          <div>{payload[0].value}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {data && _.size(data) > 0 ? (
        <ResponsiveContainer width="100%" height={700}>
          <LineChart width="100%" height="100%" data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" angle={90} textAnchor="start" height={120} tick={{ fontSize: '8px' }} reversed />
            <YAxis width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} content={legendContent} />
            <Line connectNulls dot={false} type="monotone" dataKey="y" stroke={theme.palette.background.dark} fill={theme.palette.background.dark} strokeWidth={3} />
            <Line connectNulls dot={false} type="monotone" dataKey="max" stroke={theme.palette.error.main} fill={theme.palette.error.main} strokeWidth={3} />
            {_.includes(_.keysIn(data[0]), 'min') && (
              <Line connectNulls dot={false} type="monotone" dataKey="min" stroke={theme.palette.info.main} fill={theme.palette.info.main} strokeWidth={3} />
            )}
          </LineChart>
        </ResponsiveContainer>
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
