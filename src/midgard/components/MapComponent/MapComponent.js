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
import { REPORT_TYPES, getIcon } from "../../pages/Reporting/ReportingConstants";

export function MapComponent(props) {
  const { markers, setSelectedMarker } = props;
  const [center, setCenter] = useState({ lat: 47.606209, lng: -122.332069 });
  const [showInfoIndex, setShowInfoIndex] = useState({});

  useEffect(() => {
    if (markers && markers.length && _.last(markers).lat && _.last(markers).lng) {
      setCenter({
        lat: _.last(markers).lat,
        lng: _.last(markers).lng,
      });
      setShowInfoIndex(markers[markers.length - 1]);
      setSelectedMarker(markers[markers.length - 1]);
    }

    if (markers && !markers.length) {
      setCenter({ lat: 47.606209, lng: -122.332069 });
    }
  }, [markers]);

  const onMarkerDrag = (e, onMarkerDragAction) => {
    if (onMarkerDragAction) {
      onMarkerDragAction(`${e.latLng.lat()},${e.latLng.lng()}`);
    }
  };

  const onMarkerSelect = (marker) => {
    setShowInfoIndex(marker);
    setSelectedMarker(marker);
  }

  return (
    <RenderedMap
      {...props}
      onMarkerDrag={onMarkerDrag}
      center={center}
      showInfoIndex={showInfoIndex}
      onMarkerSelect={onMarkerSelect}
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
              label={index+1 + ''}
              onClick={() => props.onMarkerSelect(mark)}
            >
              {props.showInfoIndex === mark && (
                <InfoWindow
                onCloseClick={() => props.onMarkerSelect(null)}
                >
                  <div style={{ color: "black",display: "flex",justifyContent:"flex-wrap",flexWrap:"wrap",flexDirection:"column",height:"80px",width:"200px"}}>
                    {REPORT_TYPES.map((item, idx) => (
                      <div key={`iconItem${idx}${item.id}`} style={{ boxSizing:"border-box",maxWidth:"50%",padding:"0.5em",display:"flex",alignItems:"center"}}>
                        {getIcon(item,'black')} <span> : {mark[item.id]} {item.unit}</span>
                      </div>
                    ))}
                    <div style={{ boxSizing:"border-box",padding:"0.5em",display:"flex",alignItems:"center"}}>
                      {getIcon({id:'time'},'black')} <span> : {mark.timestamp}</span>
                    </div>
                  </div>
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
        props.markers.length > 0 &&
        props.showPath && (
          <Polyline
            path={_.map(
              props.markers,
              (marker) => ({ lat: marker.lat, lng: marker.lng })
            )}
            geodesic={true}
            options={{
              strokeColor: "#424242",
              strokeOpacity: 0.75,
              strokeWeight: 1,
            }}
          />
        )}
    </GoogleMap>
  ))
);
