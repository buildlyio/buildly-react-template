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
import { MAP_API_URL, MAP_API_KEY } from "../../../utils/utilMethods";
import { getFormattedCustodianRow } from "../ShipmentConstants";

const useStyles = makeStyles((theme) => ({
  roote: {},
}));

const MapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
      {props.isMarkerShown && (
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
      )}
    </GoogleMap>
  ))
);

export default function ShipmentRouteInfo(props) {
  const { custodianData, custodyData, contactInfo, editData } = props;
  const classes = useStyles();
  const [markers, setMarkers] = useState([]);
  const [itemIds, setItemIds] = useState(
    (editData && editData.custodian_ids) || []
  );
  let rows = [];
  if (custodianData && custodianData.length) {
    let selectedRows = [];
    custodianData.forEach((element) => {
      if (itemIds.indexOf(element.custodian_uuid) !== -1) {
        selectedRows.push(element);
      }
    });
    rows = getFormattedCustodianRow(selectedRows, contactInfo, custodyData);
  }

  useEffect(() => {
    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey(MAP_API_KEY);

    // set response language. Defaults to english.
    Geocode.setLanguage("en");
    Geocode.fromAddress("Eiffel Tower").then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);
  return (
    <Card>
      <CardContent>
        <MapComponent
          isMarkerShown
          googleMapURL={MAP_API_URL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `200px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          markers={markers}
        />
      </CardContent>
    </Card>
  );
}
