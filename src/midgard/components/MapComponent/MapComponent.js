import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
const {
  MarkerWithLabel,
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");

const labelSize = { width: 150 };
const labelPadding = 8;

export function MapComponent(props) {
  const { markers, zoom } = props;
  const [center, setCenter] = useState({ lat: 47.606209, lng: -122.332069 });
  const [activeMarker, setActiveMarker] = useState(null);
  // const [toggleInfo, setToggleInfo] = useState(false);

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

  const handleToggleOpen = (markerId) => {
    setActiveMarker(markerId);
  }

  const handleToggleClose = () => {
    setActiveMarker(null);
  }

  return <RenderedMap {...props} onMarkerDrag={onMarkerDrag} center={center} handleToggleOpen={handleToggleOpen}
  handleToggleClose={handleToggleClose}/>;
}

const RenderedMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
      {props.isMarkerShown &&
        props.markers &&
        props.markers.map((mark, index) =>
          mark.label ? (
            // <MarkerWithLabel
            //   key={index}
            //   position={{ lat: mark.lat, lng: mark.lng }}
            //   labelAnchor={new google.maps.Point(0, 0)}
            //   icon={{
            //     path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            //     fillColor: `${mark.color}`,
            //     fillOpacity: 1,
            //     strokeColor: "white",
            //     scale: 1.4,
            //     anchor: { x: 12, y: 24 },
            //   }}
            //   labelStyle={{
            //     color: '#000',
            //     backgroundColor: "#FFFF99",
            //     fontSize: "11px",
            //     padding: labelPadding + "px",
            //     width: labelSize.width + "px",
            //     borderRadius: "4px",
            //   }}
            // >
            //   <span>{mark.label}</span>
            // </MarkerWithLabel>
            <Marker
            key={index}
            position={{ lat: mark.lat, lng: mark.lng }}
            label={`Index: ${index.toString()} - ${props.activeMarker}`}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: `${mark.color}`,
              fillOpacity: 1,
              strokeColor: "white",
              scale: 1.4,
              anchor: { x: 12, y: 24 },
            }}
            onClick={props.handleToggleOpen(index)}
            >
              {props.activeMarker === index && (
                <InfoWindow onCloseClick={props.handleToggleClose}>
                  <span>{mark.label}</span>
                </InfoWindow>
              )}
          </Marker>
          ) : (
            <Marker
              draggable={mark.draggable}
              key={mark.lat && mark.lng ? `marker${index}:${mark.lat},${mark.lng}` : `marker${index}`}
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
