import React, { useState } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const onMarkerDrag = (e) => {
  console.log(e);
};

export const MapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
      {props.isMarkerShown && (
        <Marker
          draggable
          onDrag={(e) => onMarkerDrag(e)}
          position={{ lat: -34.397, lng: 150.644 }}
        />
      )}
    </GoogleMap>
  ))
);
