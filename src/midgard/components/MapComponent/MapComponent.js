import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

export function MapComponent(props) {
  const { markers } = props;
  const [center, setCenter] = useState({ lat: 41.850033, lng: -87.6500523 });

  useEffect(() => {
    if (markers && markers.length) {
      setCenter({
        lat: markers[0].lat || 41.850033,
        lng: markers[0].lng || -87.6500523,
      });
    }
  }, [markers]);

  const onMarkerDrag = (e, onMarkerDragAction) => {
    if (onMarkerDragAction) {
      onMarkerDragAction(`${e.latLng.lat()},${e.latLng.lng()}`);
    }
    console.log(`${e.latLng.lat()},${e.latLng.lng()}`);
  };

  return <RenderedMap {...props} onMarkerDrag={onMarkerDrag} center={center} />;
}

const RenderedMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={5} defaultCenter={props.center}>
      {props.isMarkerShown &&
        props.markers &&
        props.markers.map((marker) => (
          <Marker
            draggable={marker.dragable}
            onDragEnd={(e) => props.onMarkerDrag(e, marker.onMarkerDrag)}
            position={{
              lat: marker.lat || 41.850033,
              lng: marker.lng || -87.6500523,
            }}
          />
        ))}
    </GoogleMap>
  ))
);
