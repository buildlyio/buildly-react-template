import React, { useState, useEffect } from "react";
import Geocode from "react-geocode";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid, Box, Typography, Card, CardContent } from "@material-ui/core";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import {
  MAP_API_URL,
  MAP_API_KEY,
  GEO_CODE_API,
} from "../../../utils/utilMethods";
import { getFormattedCustodianRow } from "../ShipmentConstants";

const useStyles = makeStyles((theme) => ({
  roote: {},
}));

const MapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={3}
      defaultCenter={
        props.markers && props.markers.length && props.markers[0]
          ? { lat: props.markers[0].lat, lng: props.markers[0].lng }
          : { lat: -34.397, lng: 150.644 }
      }
    >
      {props.markers && props.markers.length ? (
        props.markers.map((mark) => (
          <Marker
            key={`${mark.lat},${mark.lng}`}
            position={{ lat: mark.lat, lng: mark.lng }}
          />
        ))
      ) : (
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
      )}
    </GoogleMap>
  ))
);

export default function ShipmentRouteInfo(props) {
  const {
    custodianData,
    custodyData,
    contactInfo,
    editData,
    shipmentFormData,
  } = props;
  const classes = useStyles();
  // const [itemIds, setItemIds] = useState(
  //   (shipmentFormData && shipmentFormData.custodian_ids) || []
  // );
  const [rows, setRows] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    Geocode.setApiKey(GEO_CODE_API);
    Geocode.setLanguage("en");
    if (
      custodianData &&
      custodianData.length &&
      contactInfo &&
      custodyData &&
      custodyData.length &&
      shipmentFormData !== null
    ) {
      let selectedRows = [];
      let itemIds = shipmentFormData.custodian_ids;
      custodianData.forEach((element) => {
        if (itemIds.indexOf(element.custodian_uuid) !== -1) {
          selectedRows.push(element);
        }
      });
      selectedRows = getFormattedCustodianRow(
        selectedRows,
        contactInfo,
        custodyData
      );
      if (selectedRows.length) {
        selectedRows.forEach((row) => {
          let routeObj = {};
          Geocode.fromAddress(row.location).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log(lat, lng);
              routeObj = {
                lat: lat,
                lng: lng,
                shipmentId: row.shipment_uuid,
                name: row.name,
              };
              setRoutes((prevRoutes) => [...prevRoutes, routeObj]);
            },
            (error) => {
              console.error(error);
            }
          );
        });
      }

      setRows(selectedRows);
    }
    return function cleanup() {
      setRoutes([]);
    };
  }, [custodyData, contactInfo, custodyData, shipmentFormData]);

  useEffect(() => {
    if (routes.length > 1) {
      const directionsService = new google.maps.DirectionsService();
      let origin = { lat: routes[0].lat, lng: routes[0].lng };
      let destination = {
        lat: routes[routes.length - 1].lat,
        lng: routes[routes.length - 1].lng,
      };
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (result) {
            console.log("res", result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );

      console.log("routes", origin, destination);
    }
  }, [routes]);

  return (
    <Card>
      <CardContent>
        {routes.length > 0 && (
          <MapComponent
            isMarkerShown
            googleMapURL={MAP_API_URL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            markers={routes}
          />
        )}
      </CardContent>
    </Card>
  );
}
