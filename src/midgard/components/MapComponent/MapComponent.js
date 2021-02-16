import React, { useState, useEffect } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
} from "react-google-maps";
import _ from "lodash";

export function MapComponent(props) {
  const { markers } = props;
  const [center, setCenter] = useState({ lat: 47.606209, lng: -122.332069 });
  const [showInfoIndex, setShowInfoIndex] = useState(null);

  useEffect(() => {
    if (markers && markers.length && _.last(markers).lat && _.last(markers).lng) {
      setCenter({
        lat: _.last(markers).lat,
        lng: _.last(markers).lng,
      });
      setShowInfoIndex(null);
    }

    if(markers && !markers.length) {
      setCenter({ lat: 47.606209, lng: -122.332069 });
    }
  }, [markers]);

  const onMarkerDrag = (e, onMarkerDragAction) => {
    if (onMarkerDragAction) {
      onMarkerDragAction(`${e.latLng.lat()},${e.latLng.lng()}`);
    }
  };

  return (
    <RenderedMap 
      {...props} 
      onMarkerDrag={onMarkerDrag} 
      center={center} 
      showInfoIndex={showInfoIndex} 
      setShowInfoIndex={setShowInfoIndex}
    />
  );
}

const RenderedMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap zoom={props.zoom} center={props.center}>
      {props.isMarkerShown &&
        props.markers &&
        props.markers.map((mark, index) =>
          mark.label ? (
            <Marker
            key={index}
            position={{ lat: mark.lat, lng: mark.lng }}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: `${mark.color}`,
              fillOpacity: 1,
              strokeColor: "white",
              scale: 1.4,
              anchor: { x: 12, y: 24 },
            }}
            onClick={() => props.setShowInfoIndex(index)}
            >
              {props.showInfoIndex === index && (
                <InfoWindow>
                  <span style={{ color: "black" }}>{mark.label}</span>
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
        {props.isMarkerShown && 
        props.markers.length && 
        props.showPath && (
          <Polyline
            path={_.map(
              props.markers, 
              (marker) => ({ lat: marker.lat, lng: marker.lng })
            )}
            geodesic={true}
            options={{
              strokeColor: "#ff2527",
              strokeOpacity: 0.75,
              strokeWeight: 1,
            }}
          />
        )}
    </GoogleMap>
  ))
);
