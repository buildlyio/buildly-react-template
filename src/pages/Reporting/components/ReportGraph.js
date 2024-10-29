import React, { useState, useEffect, forwardRef } from 'react';
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
  } = props;

  return (
    <Grid
      ref={ref}
      container
      className="reportingContainer2"
    >
      <div className="reportingSwitchViewSection">
        <Typography className="reportingSectionTitleHeading" variant="h5">
          {!_.isEmpty(selectedShipment) && selectedShipment.name
            ? `Graph View - Shipment: ${selectedShipment.name}`
            : 'Graph View'}
        </Typography>
      </div>
      <Grid item xs={2} sm={1}>
        <List component="nav" aria-label="main graph-type" className="reportingGraphIconBar">
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
      <Grid item xs={10} sm={11}>
        <GraphComponent
          data={data[graphType]}
          selectedGraph={graphType}
        />
      </Grid>
    </Grid>
  );
});

export default ReportGraph;
