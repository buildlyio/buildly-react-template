import React, { useState, useEffect } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
  Polygon,
  Circle,
} from 'react-google-maps';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import _ from 'lodash';
import {
  REPORT_TYPES,
  getIcon,
} from '@pages/Reporting/ReportingConstants';

export const MapComponent = (props) => {
  const { markers, setSelectedMarker, geofence, shipmentFilter } = props;
  const [center, setCenter] = useState({
    lat: 47.606209,
    lng: -122.332069,
  });
  const [showInfoIndex, setShowInfoIndex] = useState({});
  const [polygon, setPolygon] = useState({});

  useEffect(() => {
    if (
      markers
      && markers.length
      && _.last(markers).lat
      && _.last(markers).lng
    ) {
      setCenter({
        lat: _.last(markers).lat,
        lng: _.last(markers).lng,
      });
      setShowInfoIndex(markers[markers.length - 1]);
      if (setSelectedMarker) {
        setSelectedMarker(markers[markers.length - 1]);
      }
    }

    if (markers && !markers.length) {
      setCenter({ lat: 47.606209, lng: -122.332069 });
    }
  }, [markers]);

  useEffect(() => {
    if (geofence && geofence.coordinates.length) {
      const coordinates = geofence.coordinates[0];
      const polygonPoints = [];
      _.forEach(coordinates, (coordinate) => {
        polygonPoints.push({
          lat: coordinate[0],
          lng: coordinate[1],
        });
      });
      setPolygon(polygonPoints);
    }
  }, [geofence]);

  const onMarkerDrag = (e, onMarkerDragAction) => {
    if (onMarkerDragAction) {
      onMarkerDragAction(`${e.latLng.lat()},${e.latLng.lng()}`);
      setPolygon({});
    }
  };

  const onMarkerSelect = (marker) => {
    setShowInfoIndex(marker);
    if (setSelectedMarker) {
      setSelectedMarker(marker);
    }
  };

  return (
    <RenderedMap
      {...props}
      onMarkerDrag={onMarkerDrag}
      center={center}
      polygon={polygon}
      showInfoIndex={showInfoIndex}
      onMarkerSelect={onMarkerSelect}
    />
  );
};

const RenderedMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap zoom={props.zoom} center={props.center}>
      {props.showPath && props.shipmentFilter === 'Active' && (
        <InfoBox
        position={new google.maps.LatLng(props.center.lat, props.center.lng)}
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <div style={{ backgroundColor: `#605e5e`, opacity: 0.75, padding: `8px`, borderRadius: 10}}>
          <div style={{ fontSize: `1rem`, color: `white` }}>
            Please wait for new reports to aggregate
          </div>
        </div>
      </InfoBox>
      )}

      {props.isMarkerShown
      && props.markers
      && _.map(
        props.markers,
        (mark, index) => (mark.label ? (
          <Marker
            key={index}
            position={{ lat: mark.lat, lng: mark.lng }}
            icon={{
              path:
                'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: `${mark.color}`,
              fillOpacity: 1,
              strokeColor: 'white',
              scale: 1.4,
              anchor: { x: 12, y: 24 },
            }}
            label={`${index + 1}`}
            onClick={() => props.onMarkerSelect(mark)}
          >
            {props.showInfoIndex === mark && (
            <InfoWindow
              onCloseClick={() => {
                props.onMarkerSelect(null);
              }}
            >
              {mark.label === 'Clustered' ? (
                <div
                  style={{
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'flex-wrap',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    height: '80px',
                    width: '200px',
                  }}
                >
                  {_.map(REPORT_TYPES, (item, idx) => (
                    <div
                      key={`iconItem${idx}${item.id}`}
                      style={{
                        boxSizing: 'border-box',
                        maxWidth: '55%',
                        padding: '0.5em',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {getIcon(item, 'black')}
                      {' '}
                        &nbsp;
                      {mark[item.id] ? (
                        <span>
                          {`: ${mark[item.id]} ${item.unit}`}
                        </span>
                      ) : (
                        <span> : NA</span>
                      )}
                    </div>
                  ))}
                  <div
                    style={{
                      boxSizing: 'border-box',
                      padding: '0.5em',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {getIcon({ id: 'time' }, 'black')}
                    {' '}
                    <span>
                      {` : ${mark.timestamp}`}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'black' }}>
                  {mark.label}
                </div>
              )}
            </InfoWindow>
            )}
          </Marker>
        ) : (
          <Marker
            draggable={mark.draggable}
            key={
                mark.lat && mark.lng
                  ? `marker${index}:${mark.lat},${mark.lng}`
                  : `marker${index}`
              }
            position={
                mark.lat && mark.lng
                  ? { lat: mark.lat, lng: mark.lng }
                  : props.center
              }
            onDragEnd={(e) => {
              props.onMarkerDrag(e, mark.onMarkerDrag);
            }}
          />
        )),
      )}
      {props.isMarkerShown
      && props.markers.length > 0
      && props.showPath
      && (
        <Polyline
          path={_.map(props.markers, (marker) => ({
            lat: marker.lat,
            lng: marker.lng,
          }))}
          geodesic
          options={{
            strokeColor: '#424242',
            strokeOpacity: 0.75,
            strokeWeight: 1,
          }}
        />
      )}
      {props.isMarkerShown
      && props.markers
      && props.polygon.length > 0
      && _.map(
        props.markers,
        (mark, index) => (mark.radius ? (
          <Marker
            key={
            mark.lat && mark.lng
              ? `marker${index}:${mark.lat},${mark.lng}`
              : `marker${index}`
          }
            position={
            mark.lat && mark.lng
              ? { lat: mark.lat, lng: mark.lng }
              : props.center
          }
          >
            <Circle
              defaultCenter={{
                lat: mark.lat,
                lng: mark.lng,
              }}
              radius={mark.radius * 1000}
              options={{
                strokeColor: '#ff0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#ff0000',
                fillOpacity: 0.35,
              }}
            />
            <InfoWindow>
              <div style={{ color: 'black' }}>
                {`Geofence of ${mark.radius} miles`}
              </div>
            </InfoWindow>
          </Marker>
        ) : (
          <Marker
            key={
            mark.lat && mark.lng
              ? `marker${index}:${mark.lat},${mark.lng}`
              : `marker${index}`
          }
            position={
            mark.lat && mark.lng
              ? { lat: mark.lat, lng: mark.lng }
              : props.center
          }
          >
            <InfoWindow>
              <div style={{ color: 'black' }}>
                Configure radius for geofence
              </div>
            </InfoWindow>
          </Marker>
        )),
      )}
      {props.polygon
      && props.polygon.length > 0
      && (
        <Polygon
          path={props.polygon}
          editable={false}
          options={{
            strokeColor: '#424242',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#424242',
            fillOpacity: 0.35,
            polygonKey: 1,
          }}
        />
      )}
    </GoogleMap>
  )),
);
