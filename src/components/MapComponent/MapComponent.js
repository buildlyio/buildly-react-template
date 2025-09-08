/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  GoogleMap, // Main map component from the library to render Google Maps
  Marker, // To place individual markers on the map
  InfoWindow, // For showing detailed popups when a marker is clicked
  Polyline, // Used to draw lines connecting multiple coordinates (e.g., a route)
  Polygon, // Used for drawing closed shapes (e.g., geofences or regions)
  Circle, // To draw a circular region around a point (e.g., circular geofences)
  MarkerClusterer, // Groups close-by markers into a single "cluster" icon
  LoadScriptNext, // Wrapper component that loads the Google Maps JS API
} from '@react-google-maps/api';
import Geocode from 'react-geocode'; // Used to convert human-readable addresses (like "New York") into coordinates (lat/lng)
import _ from 'lodash';
import { Grid, useTheme } from '@mui/material';
// MUI icons for adding visual indicators to the InfoWindows
import {
  AccessTime as ClockIcon,
  BatteryFull as BatteryFullIcon,
  Battery80 as Battery80Icon,
  Battery50 as Battery50Icon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { MARKER_DATA, getIcon } from '@utils/constants';
import './MapComponentStyles.css'; // Custom CSS file
import { getUser } from '@context/User.context'; // Function to retrieve current user info (likely from context)
import { LANGUAGES } from '@utils/mock';
import mapRedMarker from '../../assets/map-red-marker.png';
import { useTranslation } from 'react-i18next'; // For internationalization support

// Required for the Google Maps API to support features like autocomplete
const libraries = ['places'];

export const MapComponent = (props) => {
  // Destructuring props
  const {
    isMarkerShown, // Whether to show individual markers
    showPath, // Whether to draw a path between markers
    screenshotMapCenter, // Whether to auto-center the map for screenshots
    noInitialInfo, // If true, suppress initial info window
    markers, // List of individual markers to show
    zoom, // Initial zoom level
    setSelectedMarker, // Function to update selected marker state externally
    unitOfMeasure, // Unit settings (used for distance, country, etc.)
    allMarkers, // All grouped markers (used in clustering)
    geofence, // Geofence polygon coordinates
    containerStyle, // Map container style
    setSelectedCluster, // Function to update selected cluster externally
    selectedCluster, // Currently selected marker cluster
    mapCountry, // Country code for the map region
    orgData,
  } = props;

  const { t } = useTranslation(); // Translation function for internationalization

  const [center, setCenter] = useState({ lat: 47.606209, lng: -122.332069 }); // Default center (Seattle)
  const [mapZoom, setMapZoom] = useState(zoom); // Dynamic zoom level
  const [showInfoIndex, setShowInfoIndex] = useState({}); // Which marker's InfoWindow is visible
  const [polygon, setPolygon] = useState({}); // Polygon coordinates for geofence

  // Extract country unit from unitOfMeasure
  const country = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country')).unit_of_measure
    : 'United States';

  const theme = useTheme();

  const user = getUser(); // Get current logged-in user object

  /**
   * useEffect to re-center the map if screenshot mode is active.
   */
  useEffect(() => {
    if (screenshotMapCenter) {
      const meanCenter = { lat: _.mean(_.map(markers, 'lat')), lng: _.mean(_.map(markers, 'lng')) };
      setMapCenter(meanCenter);
    } else {
      setMapCenter('');
    }
  }, [unitOfMeasure]);

  /**
   * Handles map centering and marker selection logic when markers or clusters change.
   */
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
      if (!_.isEmpty(selectedCluster)) {
        setCenter({
          lat: selectedCluster.lat,
          lng: selectedCluster.lng,
        });
        setMapZoom(18);
      } else if (!_.isEmpty(allMarkers)) {
        const allMarkerItems = [].concat(...allMarkers);
        const countries = allMarkerItems.map((item) => item && item.country).filter((item) => item !== null);
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

  /**
   * Parses geofence polygon data and stores in `polygon` state.
   */
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

  /**
   * Converts address or unit to latitude and longitude using Geocode API.
   */
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
          console.error(error);
        },
      );
    }
  };

  /**
   * Called when a draggable marker is moved.
   */
  const onMarkerDrag = (e, onMarkerDragAction) => {
    if (onMarkerDragAction) {
      onMarkerDragAction(`${e.latLng.lat()},${e.latLng.lng()}`);
      setPolygon({});
    }
  };

  /**
   * Updates selected marker and opens its InfoWindow.
   */
  const onMarkerSelect = (marker) => {
    setShowInfoIndex(marker);
    if (setSelectedMarker) {
      setSelectedMarker(marker);
    }
  };

  /**
   * Groups markers by location and counts how many overlap.
   */
  const groupMarkersByLocation = (Markers) => {
    const grouped = !_.isEmpty(Markers) && _.groupBy(Markers, (marker) => !_.isEmpty(marker) && `${marker.lat},${marker.lng}`);
    return _.mapValues(grouped, (group) => {
      const uniqueShipmentNames = new Set(group.map((item) => !_.isEmpty(item) && item.shipment.name));
      return uniqueShipmentNames.size;
    });
  };

  const overlapCounts = groupMarkersByLocation(_.flatten(allMarkers));

  return (
    <LoadScriptNext
      key={`map-${mapCountry}`}
      googleMapsApiKey={window.env.MAP_API_KEY}
      libraries={libraries}
      language={_.find(LANGUAGES, { label: user && user.user_language })?.value || 'en'}
      region={(mapCountry === 'MAR' ? 'MA' : mapCountry) || 'USA'}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={mapZoom}
      >
        {/* Render Clustered Markers when `isMarkerShown` is false */}
        {!isMarkerShown && allMarkers && !_.isEmpty(allMarkers)
          && _.map(allMarkers, (shipMarkers, idx) => (
            <MarkerClusterer
              key={idx}
              averageCenter
              zoomOnClick={false}
              enableRetinaIcons
              gridSize={60}
              title={!_.isEmpty(shipMarkers) ? _.first(shipMarkers).shipment.name : ''}
              onClick={(e) => {
                setSelectedCluster(!_.isEmpty(shipMarkers) && _.first(shipMarkers));
                setCenter({
                  lat: !_.isEmpty(shipMarkers) && _.first(shipMarkers).lat,
                  lng: !_.isEmpty(shipMarkers) && _.first(shipMarkers).lng,
                });
                setMapZoom(18);
              }}
              styles={[
                {
                  url: mapRedMarker,
                  height: 18,
                  width: 18,
                  anchor: [0, 0],
                  textSize: 0.001,
                },
                {
                  url: mapRedMarker,
                  height: 23,
                  width: 23,
                  anchor: [0, 0],
                  textSize: 0.001,
                },
                {
                  url: mapRedMarker,
                  height: 28,
                  width: 28,
                  anchor: [0, 0],
                  textSize: 0.001,
                },
                {
                  url: mapRedMarker,
                  height: 33,
                  width: 33,
                  anchor: [0, 0],
                  textSize: 0.001,
                },
                {
                  url: mapRedMarker,
                  height: 38,
                  width: 38,
                  anchor: [0, 0],
                  textSize: 0.001,
                },
              ]}
            >
              {(clusterer) => _.map(shipMarkers, (marker, inx) => (
                <Marker
                  visible={false}
                  key={`${marker.lat}-${marker.lng}-${inx}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  clusterer={clusterer}
                />
              ))}
            </MarkerClusterer>
          ))}
        {/* Render Individual Markers */}
        {isMarkerShown && markers && _.map(markers, (mark, index) => (mark.label ? (
          <Marker
            key={index}
            position={{ lat: mark.lat, lng: mark.lng }}
            zIndex={_.isEqual(mark.color, 'green') && 1000}
            icon={{
              path:
                'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: `${mark.color}`,
              fillOpacity: 1,
              strokeColor: theme.palette.background.dark,
              scale: 1.4,
              anchor: { x: 12, y: 24 },
            }}
            onClick={() => onMarkerSelect(mark)}
          >
            {/* InfoWindow when selected */}
            {_.isEqual(showInfoIndex, mark) && (
              <InfoWindow onCloseClick={() => onMarkerSelect(null)}>
                {/* Detailed info layout for 'Clustered' markers or label */}
                {_.isEqual(mark.label, 'Clustered')
                  ? (
                    <Grid
                      container
                      spacing={1}
                      style={{
                        maxWidth: '310px',
                        color: theme.palette.background.dark,
                        fontSize: '10px',
                        alignItems: 'center',
                      }}
                    >
                      {_.map(MARKER_DATA(unitOfMeasure), (item, idx) => (
                        <Grid
                          item
                          xs={6}
                          key={`${item.id}-${idx}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {_.find(mark.allAlerts, { id: item.id })
                            ? getIcon(_.find(mark.allAlerts, { id: item.id }), t)
                            : getIcon({ id: item.id, color: 'inherit' }, t)}
                          {!_.isEqual(mark[item.id], null) && !_.isEqual(mark[item.id], undefined) ? (
                            <div
                              style={{
                                marginLeft: theme.spacing(0.5),
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
                      {orgData && orgData.enable_tilt && (
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {getIcon({ id: 'tilt', title: 'Tilt' }, t)}
                          <div
                            style={{
                              marginLeft: theme.spacing(0.5),
                              color: _.find(mark.allAlerts, { id: 'tilt' })
                                ? _.find(mark.allAlerts, { id: 'tilt' }).color
                                : 'inherit',
                            }}
                          >
                            {_.isEmpty(mark.tilt) ? ' N/A' : ` ${mark.tilt.roll}° X-axis / ${mark.tilt.pitch}° Y-axis`}
                          </div>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={12}
                        style={{
                          borderTopWidth: '1px',
                          borderTopStyle: 'solid',
                          borderTopColor: theme.palette.background.light,
                          marginTop: '12px',
                        }}
                      >
                        <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon />
                            <div style={{ marginLeft: theme.spacing(0.5) }}>{mark.date}</div>
                          </Grid>
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <ClockIcon />
                            <div style={{ marginLeft: theme.spacing(0.5) }}>{mark.time}</div>
                          </Grid>
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            {mark.battery && _.gte(_.toNumber(mark.battery), 90) && (
                              <BatteryFullIcon htmlColor={theme.palette.success.main} />
                            )}
                            {mark.battery && _.lt(_.toNumber(mark.battery), 90) && _.gte(_.toNumber(mark.battery), 60) && (
                              <Battery80Icon htmlColor={theme.palette.warning.main} />
                            )}
                            {mark.battery && _.lt(_.toNumber(mark.battery), 60) && (
                              <Battery50Icon htmlColor={theme.palette.error.main} />
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
                    <div style={{ color: theme.palette.background.default }}>
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
                : center
            }
            onDragEnd={(e) => {
              onMarkerDrag(e, mark.onMarkerDrag);
            }}
          />
        )))}
        {/* Polyline connecting all markers, if showPath is enabled */}
        {isMarkerShown && markers && !_.isEmpty(markers) && showPath && (
          <Polyline
            path={_.map(markers, (marker) => ({
              lat: marker.lat,
              lng: marker.lng,
            }))}
            geodesic
            options={{
              strokeColor: theme.palette.background.dark,
              strokeOpacity: 0.75,
              strokeWeight: 1,
            }}
          />
        )}
        {/* Radius-based geofencing rendering using Circle */}
        {isMarkerShown && markers && !_.isEmpty(polygon) && _.map(
          markers,
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
                  : center
              }
            >
              <Circle
                defaultCenter={{
                  lat: mark.lat,
                  lng: mark.lng,
                }}
                radius={mark.radius * 1000}
                options={{
                  strokeColor: theme.palette.error.main,
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: theme.palette.error.main,
                  fillOpacity: 0.35,
                }}
              />
              <InfoWindow>
                <div style={{ color: theme.palette.background.dark }}>
                  {t('map.geofence.of', {
                    radius: mark.radius,
                    unit: _.toLower(
                      _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance'))
                        ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance')).unit_of_measure
                        : '',
                    ),
                  })}
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
                  : center
              }
            >
              <InfoWindow>
                <div style={{ color: theme.palette.background.dark }}>
                  {t('map.geofence.configureRadius')}
                </div>
              </InfoWindow>
            </Marker>
          )),
        )}
        {/* Polygon-based geofence */}
        {!_.isEmpty(polygon) && (
          <Polygon
            path={polygon}
            editable={false}
            options={{
              strokeColor: theme.palette.background.dark,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: theme.palette.background.dark,
              fillOpacity: 0.35,
              polygonKey: 1,
            }}
          />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default MapComponent;
