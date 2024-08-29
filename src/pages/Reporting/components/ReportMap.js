import React, { useState, useEffect, forwardRef } from 'react';
import _ from 'lodash';
import { Grid, Typography } from '@mui/material';
import MapComponent from '@components/MapComponent/MapComponent';

export const ReportMap = forwardRef((props, ref) => {
  const {
    selectedShipment,
    markers,
    setSelectedMarker,
    unitOfMeasure,
    hidden,
  } = props;

  return (
    <Grid container ref={ref} className={!!hidden && 'reportingContainer2'}>
      <Grid item xs={12}>
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
    </Grid>
  );
});

export default ReportMap;
