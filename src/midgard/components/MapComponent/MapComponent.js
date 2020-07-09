import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
const {
  MarkerWithLabel,
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");

const labelSize = { width: 150 };
const labelPadding = 8;

export function MapComponent(props) {
  const { markers } = props;
  const [center, setCenter] = useState({ lat: 41.850033, lng: -87.6500523 });

  useEffect(() => {
    if (markers && markers.length && markers[0].lat && markers[0].lng) {
      setCenter({
        lat: markers[0].lat,
        lng: markers[0].lng,
      });
    }
  }, [markers]);

  const onMarkerDrag = (e, onMarkerDragAction) => {
    if (onMarkerDragAction) {
      onMarkerDragAction(`${e.latLng.lat()},${e.latLng.lng()}`);
    }
  };

  return <RenderedMap {...props} onMarkerDrag={onMarkerDrag} center={center} />;
}

const RenderedMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={5} defaultCenter={props.center}>
      {props.isMarkerShown &&
        props.markers &&
        props.markers.map((mark, indx) =>
          mark.label ? (
            <MarkerWithLabel
              key={`${mark.lat},${mark.lng}`}
              position={{ lat: mark.lat, lng: mark.lng }}
              labelAnchor={new google.maps.Point(0, 0)}
              icon={mark.icon}
              labelStyle={{
                backgroundColor: "	#FFFF99",
                fontSize: "11px",
                padding: labelPadding + "px",
                width: labelSize.width + "px",
                borderRadius: "4px",
              }}
            >
              <span>{mark.label}</span>
            </MarkerWithLabel>
          ) : (
            <Marker
              draggable={mark.draggable}
              key={mark.lat && mark.lng ? `${mark.lat},${mark.lng}` : `${indx}`}
              position={
                mark.lat && mark.lng
                  ? { lat: mark.lat, lng: mark.lng }
                  : props.center
              }
              onDragEnd={(e) => props.onMarkerDrag(e, mark.onMarkerDrag)}
            />
          )
        )}
    </GoogleMap>
  ))
);
