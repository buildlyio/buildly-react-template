import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  CartesianGrid, // Adds grid lines to the chart for better readability
  Line, // Represents each individual data line on the chart
  LineChart, // The main chart component from Recharts to plot line graphs
  ResponsiveContainer, // Makes the chart responsive to parent container size
  Tooltip, // Shows values when hovering over points on the chart
  XAxis, // X-axis component for horizontal data labels
  YAxis, // Y-axis component for vertical values
} from 'recharts';
import { Typography, useTheme } from '@mui/material'; // MUI components
import './GraphComponentStyles.css'; // Custom CSS styles for styling the graph, tooltips, and legends
import { useTranslation } from 'react-i18next';

// Main functional component to display a line chart
const GraphComponent = ({
  data, // Array of data points to plot. Each point contains { x, y, max, [min] }
  selectedGraph, // The currently selected graph type (e.g., "temperature", "speed")
}) => {
  const theme = useTheme(); // Hook to access Material-UI theme (used for consistent color theming)

  const { t } = useTranslation();

  const customDot = <circle r="0.5" />; // Tiny dot (currently unused)

  // Custom tooltip for showing detailed info when hovering on points
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="graphTooltip">
          {/* x-axis label (e.g., timestamp) */}
          <div>{label}</div>
          {/* y-axis value */}
          <div>{payload[0].value}</div>
        </div>
      );
    }
    return null; // If no tooltip data, render nothing
  };

  return (
    <div key={selectedGraph} style={{ marginLeft: 20 }}>
      {/* If data exists and has items, render the graph */}
      {data && _.size(data) > 0 ? (
        <>
          {/* Custom legend at top */}
          <div className="graphLegendDiv" style={{ marginBottom: 6, marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div className="graphNormalColor" />
              <Typography variant="body1">{t(`graph.metrics.${selectedGraph}`, selectedGraph)}</Typography>
            </div>
            {_.includes(_.keysIn(data[0]), 'max') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <div className="graphMaxColor" />
                <Typography variant="body1">{t(`graph.metrics.max_${selectedGraph}`)}</Typography>
              </div>
            )}
            {_.includes(_.keysIn(data[0]), 'min') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <div className="graphMinColor" />
                <Typography variant="body1">{t(`graph.metrics.min_${selectedGraph}`)}</Typography>
              </div>
            )}
            {_.includes(_.keysIn(data[0]), 'pitch') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <div className="graphPitchColor" />
                <Typography variant="body1">{t('graph.metrics.pitch')}</Typography>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={700}>
            <LineChart
              key={selectedGraph}
              width="100%"
              height="100%"
              data={data}
            >
              {/* Dotted grid lines */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* X-axis settings */}
              <XAxis
                dataKey="x" // Field to use for x-axis values
                angle={90} // Rotate labels for readability
                textAnchor="start"
                height={120}
                tick={{ fontSize: '8px' }} // Smaller font for dense data
                reversed // Reverse order (e.g., latest data on top)
              />
              {/* Y-axis with fixed width */}
              <YAxis width={30} />
              {/* Tooltip on hover */}
              <Tooltip content={<CustomTooltip />} />
              {/* Main data line: "y" values */}
              <Line
                connectNulls // Connect points even if some values are null
                dot={false} // No visible dots for cleaner look
                type="monotone" // Smooth curved line
                dataKey="y"
                stroke={theme.palette.background.dark} // Line color from theme
                fill={theme.palette.background.dark}
                strokeWidth={3}
                isAnimationActive={false}
              />
              {/* Max value line */}
              {_.includes(_.keysIn(data[0]), 'max') && (
                <Line
                  connectNulls
                  dot={false}
                  type="monotone"
                  dataKey="max"
                  stroke={theme.palette.error.main} // Error color for max (usually red)
                  fill={theme.palette.error.main}
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              )}
              {/* Min value line (conditionally shown only if "min" exists in data) */}
              {_.includes(_.keysIn(data[0]), 'min') && (
                <Line
                  connectNulls
                  dot={false}
                  type="monotone"
                  dataKey="min"
                  stroke={theme.palette.info.main} // Info color for min (usually blue)
                  fill={theme.palette.info.main}
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              )}
              {/* Pitch value line (conditionally shown only if "pitch" exists in data) */}
              {_.includes(_.keysIn(data[0]), 'pitch') && (
                <Line
                  connectNulls
                  dot={false}
                  type="monotone"
                  dataKey="pitch"
                  stroke={theme.palette.cluster.main} // Info color for pitch (usually blue)
                  fill={theme.palette.cluster.main}
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        // Fallback message if no data is available
        <Typography
          variant="body1"
          style={{ marginTop: theme.spacing(5), textAlign: 'center' }}
        >
          {t('graph.noData')}
        </Typography>
      )}
    </div>
  );
};

export default GraphComponent;
