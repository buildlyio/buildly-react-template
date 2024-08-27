import React, { useState, useEffect, forwardRef } from 'react';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid, List, ListItem, Typography, useTheme,
} from '@mui/material';
import { getIcon, REPORT_TYPES } from '@utils/constants';
import GraphComponent from '@components/GraphComponent/GraphComponent';

const ReportGraph = forwardRef((props, ref) => {
  const {
    selectedShipment,
    unitOfMeasure,
    theme,
    graphType,
    data,
    hidden,
  } = props;

  return (
    <div ref={ref}>
      <Grid
        container
        className={!!hidden && 'reportingContainer2'}
        sx={{ marginTop: 4 }}
      >
        <div className="reportingSwitchViewSection">
          <Typography width="100%" className="reportingSectionTitleHeading" variant="h5">
            {!_.isEmpty(selectedShipment) && selectedShipment.name
              ? `Graph View - Shipment: ${selectedShipment.name}`
              : 'Graph View'}
          </Typography>
        </div>
        <Grid item xs={2} sm={1.1} md={1}>
          <List component="nav" aria-label="main graph-type" className="reportingGraphIconBar2">
            {_.map(REPORT_TYPES(unitOfMeasure), (item, index) => (
              <ListItem
                key={`iconItem${index}${item.id}`}
                style={{ paddingRight: '33px', marginTop: '12px' }}
                selected={item.id === graphType}
              >
                {getIcon({ ...item, color: theme.palette.background.dark })}
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} sm={10.9} md={11}>
          <GraphComponent
            data={data[graphType]}
            selectedGraph={graphType}
            unitOfMeasure={unitOfMeasure}
            selectedShipment={selectedShipment}
            minTemp={data.minTemp}
            maxTemp={data.maxTemp}
            minHumidity={data.minHumidity}
            maxHumidity={data.maxHumidity}
            shockThreshold={data.shockThreshold}
            lightThreshold={data.lightThreshold}
            timeGap={!_.isEmpty(selectedShipment) ? selectedShipment.measurement_time : 5}
            minColor={theme.palette.info.main}
            maxColor={theme.palette.error.main}
          />
        </Grid>
      </Grid>
    </div>
  );
});

export default ReportGraph;
