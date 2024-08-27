import MapComponent from '@components/MapComponent/MapComponent';
import { Grid, Typography } from '@mui/material';
import _ from 'lodash';
import React, { useState, useEffect, forwardRef } from 'react';

export const ReportMap = forwardRef((props, ref) => {
  const {
    selectedShipment,
    markers,
    setSelectedMarker,
    unitOfMeasure,
    hidden,
  } = props;

  return (
    <div ref={ref}>
      <Grid item xs={12} className={!!hidden && 'reportingContainer2'}>
        <div className="reportingSwitchViewSection">
          <Typography
            className="reportingSectionTitleHeading"
            variant="h5"
          >
            {!_.isEmpty(selectedShipment) && selectedShipment.name ? (
              <>
                <span>Map View - Shipment: </span>
                <span className="notranslate">{selectedShipment.name}</span>
              </>
            ) : 'Map View'}
          </Typography>
        </div>
        <MapComponent
          isMarkerShown={!_.isEmpty(markers)}
          showPath
          screenshotMapCenter
          noInfoIndex
          markers={markers}
          googleMapURL={window.env.MAP_API_URL}
          zoom={7}
          setSelectedMarker={setSelectedMarker}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '625px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          unitOfMeasure={unitOfMeasure}
        />
      </Grid>
    </div>
  );
});

export default ReportMap;
