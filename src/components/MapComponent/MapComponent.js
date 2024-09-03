import React, { useState, useEffect } from 'react';
import Geocode from 'react-geocode';
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
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import _ from 'lodash';
import { Grid, useTheme } from '@mui/material';
import {
  AccessTime as ClockIcon,
  BatteryFull as BatteryFullIcon,
  Battery80 as Battery80Icon,
  Battery50 as Battery50Icon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  MARKER_DATA,
  getIcon,
} from '@utils/constants';

export const MapComponent = (props) => {
  const {
    markers, setSelectedMarker, geofence, unitOfMeasure, allMarkers, zoom, screenshotMapCenter, noInitialInfo,
  } = props;
  const [center, setCenter] = useState({
    lat: 47.606209,
    lng: -122.332069,
  });
  const [mapZoom, setMapZoom] = useState(zoom);
  const [showInfoIndex, setShowInfoIndex] = useState({});
  const [polygon, setPolygon] = useState({});

  useEffect(() => {
    if (screenshotMapCenter) {
      const meanCenter = { lat: _.mean(_.map(markers, 'lat')), lng: _.mean(_.map(markers, 'lng')) };
      setMapCenter(meanCenter);
    } else {
      setMapCenter('');
    }
  }, [unitOfMeasure]);

  useEffect(() => {
    if (!_.isEmpty(markers) && markers[0] && markers[0].lat && markers[0].lng) {
      setCenter({
        lat: markers[0].lat,
        lng: markers[0].lng,
      });
      setMapZoom(zoom);
      if (!noInitialInfo) {
        setShowInfoIndex(markers[0]);
      }
      if (setSelectedMarker) {
        setSelectedMarker(markers[0]);
      }
    }
    if (_.isEmpty(markers)) {
      if (!_.isEmpty(allMarkers)) {
        const allMarkerItems = [].concat(...allMarkers);
        const countries = allMarkerItems.map((item) => item && item.country);
        const uniqueCountries = [...new Set(countries)];
        if (uniqueCountries.length === 1) {
          setMapCenter(uniqueCountries[0]);
          setMapZoom(4);
        } else {
          setMapCenter('Algeria');
          setMapZoom(2.5);
        }
      } else {
        setMapCenter('');
        setMapZoom(4);
      }
    }
  }, [markers, allMarkers]);

  useEffect(() => {
    if (geofence && !_.isEmpty(geofence.coordinates)) {
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

  const setMapCenter = (mapCenter) => {
    let address = mapCenter;
    if (_.isEmpty(address)) {
      address = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country'))
        && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country')).unit_of_measure;
    }

    if (address) {
      Geocode.setApiKey(window.env.GEO_CODE_API);
      Geocode.setLanguage('en');
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          setCenter({ lat, lng });
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      );
    }
  };

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

  const groupMarkersByLocation = (Markers) => {
    const grouped = !_.isEmpty(Markers) && _.groupBy(Markers, (marker) => !_.isEmpty(marker) && `${marker.lat},${marker.lng}`);
    return _.mapValues(grouped, (group) => {
      const uniqueShipmentNames = new Set(group.map((item) => !_.isEmpty(item) && item.shipment.name));
      return uniqueShipmentNames.size;
    });
  };

  const overlapCounts = groupMarkersByLocation(_.flatten(allMarkers));

  return (
    <RenderedMap
      {...props}
      theme={useTheme()}
      onMarkerDrag={onMarkerDrag}
      center={center}
      mapZoom={mapZoom}
      polygon={polygon}
      showInfoIndex={showInfoIndex}
      onMarkerSelect={onMarkerSelect}
      unitOfMeasure={unitOfMeasure}
      overlapCounts={overlapCounts}
    />
  );
};

const RenderedMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap zoom={props.mapZoom} center={props.center}>
      {!props.isMarkerShown && props.allMarkers && !_.isEmpty(props.allMarkers)
        && _.map(props.allMarkers, (shipMarkers, idx) => (
          <MarkerClusterer
            key={idx}
            averageCenter
            enableRetinaIcons
            zoomOnClick={false}
            gridSize={60}
            onClick={(e) => {
              props.clusterClick(!_.isEmpty(shipMarkers) && _.first(shipMarkers).shipment, true);
            }}
            styles={[
              {
                url: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m2.png',
                height: 53,
                width: 53,
                anchor: [0, 0],
                textSize: 12,
                textColor: '#FFF',
              },
              {
                url: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m2.png',
                height: 56,
                width: 56,
                anchor: [0, 0],
                textSize: 12,
                textColor: '#FFF',
              },
              {
                url: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m2.png',
                height: 66,
                width: 66,
                anchor: [0, 0],
                textSize: 12,
                textColor: '#FFF',
              },
              {
                url: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m2.png',
                height: 78,
                width: 78,
                anchor: [0, 0],
                textSize: 12,
                textColor: '#FFF',
              },
              {
                url: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m2.png',
                height: 90,
                width: 90,
                anchor: [0, 0],
                textSize: 12,
                textColor: '#FFF',
              },
            ]}
            calculator={(markers) => {
              const locationKey = `${markers[0].position.lat()},${markers[0].position.lng()}`;
              return {
                text: props.overlapCounts[locationKey] ? props.overlapCounts[locationKey].toString() : '0',
                index: 1,
                title: !_.isEmpty(shipMarkers) ? _.first(shipMarkers).shipment.name : '',
              };
            }}
          >
            {_.map(shipMarkers, (marker, inx) => (
              <Marker visible={false} key={`${marker.lat}-${marker.lng}-${inx}`} position={{ lat: marker.lat, lng: marker.lng }} />
            ))}
          </MarkerClusterer>
        ))}
      {props.isMarkerShown && props.markers && _.map(
        props.markers,
        (mark, index) => (mark.label ? (
          <Marker
            key={index}
            position={{ lat: mark.lat, lng: mark.lng }}
            zIndex={_.isEqual(mark.color, 'green') && 1000}
            icon={{
              path:
                'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: `${mark.color}`,
              fillOpacity: 1,
              strokeColor: props.theme.palette.background.dark,
              scale: 1.4,
              anchor: { x: 12, y: 24 },
            }}
            onClick={() => props.onMarkerSelect(mark)}
          >
            {_.isEqual(props.showInfoIndex, mark) && (
              <InfoWindow onCloseClick={() => props.onMarkerSelect(null)}>
                {_.isEqual(mark.label, 'Clustered')
                  ? (
                    <Grid
                      container
                      spacing={1}
                      style={{
                        height: props.theme.spacing(13),
                        width: props.theme.spacing(38),
                        color: props.theme.palette.background.dark,
                        fontSize: props.theme.spacing(1.25),
                      }}
                      alignItems="center"
                    >
                      {_.map(MARKER_DATA(props.unitOfMeasure), (item, idx) => (
                        <Grid
                          item
                          xs={6}
                          key={`${item.id}-${idx}`}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          {_.find(mark.allAlerts, { id: item.id })
                            ? getIcon(_.find(mark.allAlerts, { id: item.id }))
                            : getIcon({ id: item.id, color: 'inherit' })}
                          {!_.isEqual(mark[item.id], null) && !_.isEqual(mark[item.id], undefined) ? (
                            <div
                              style={{
                                marginLeft: props.theme.spacing(0.5),
                                color: _.find(mark.allAlerts, { id: item.id })
                                  ? _.find(mark.allAlerts, { id: item.id }).color
                                  : 'inherit',
                              }}
                            >
                              {` ${_.toString(_.round(_.toNumber(mark[item.id]), 2))} ${item.unit}`}
                            </div>
                          ) : null}
                        </Grid>
                      ))}
                      <Grid item xs={12} style={{ borderTop: `1px solid ${props.theme.palette.background.light}`, marginTop: props.theme.spacing(1.5) }}>
                        <Grid container spacing={1}>
                          <Grid item xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon />
                            <div style={{ marginLeft: props.theme.spacing(0.5) }}>{mark.date}</div>
                          </Grid>
                          <Grid item xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                            <ClockIcon />
                            <div style={{ marginLeft: props.theme.spacing(0.5) }}>{mark.time}</div>
                          </Grid>
                          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                            {mark.battery && _.gte(_.toNumber(mark.battery), 90) && (
                              <BatteryFullIcon htmlColor={props.theme.palette.success.main} />
                            )}
                            {mark.battery && _.lt(_.toNumber(mark.battery), 90) && _.gte(_.toNumber(mark.battery), 60) && (
                              <Battery80Icon htmlColor={props.theme.palette.warning.main} />
                            )}
                            {mark.battery && _.lt(_.toNumber(mark.battery), 60) && (
                              <Battery50Icon htmlColor={props.theme.palette.error.main} />
                            )}
                            {!mark.battery && (
                              <BatteryFullIcon />
                            )}
                            <div>{!_.isEqual(mark.battery, null) && !_.isEqual(mark.battery, undefined) ? `${mark.battery}%` : ''}</div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <div style={{ color: props.theme.palette.background.default }}>
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
      {props.isMarkerShown && !_.isEmpty(props.markers) && props.showPath && (
        <Polyline
          path={_.map(props.markers, (marker) => ({
            lat: marker.lat,
            lng: marker.lng,
          }))}
          geodesic
          options={{
            strokeColor: props.theme.palette.background.dark,
            strokeOpacity: 0.75,
            strokeWeight: 1,
          }}
        />
      )}
      {props.isMarkerShown && props.markers && !_.isEmpty(props.polygon) && _.map(
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
                strokeColor: props.theme.palette.error.main,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: props.theme.palette.error.main,
                fillOpacity: 0.35,
              }}
            />
            <InfoWindow>
              <div style={{ color: props.theme.palette.background.dark }}>
                {`Geofence of ${mark.radius} ${_.toLower(
                  _.find(props.unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance'))
                    ? _.find(props.unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance')).unit_of_measure
                    : '',
                )}`}
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
              <div style={{ color: props.theme.palette.background.dark }}>
                Configure radius for geofence
              </div>
            </InfoWindow>
          </Marker>
        )),
      )}
      {!_.isEmpty(props.polygon) && (
        <Polygon
          path={props.polygon}
          editable={false}
          options={{
            strokeColor: props.theme.palette.background.dark,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: props.theme.palette.background.dark,
            fillOpacity: 0.35,
            polygonKey: 1,
          }}
        />
      )}
    </GoogleMap>
  )),
);

export default MapComponent;
