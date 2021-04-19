import React, { useState, useEffect } from "react";
import { http } from "midgard-core";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles , useTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import { Grid, Box, Typography, Card, CardContent } from "@material-ui/core";

import {
  MAP_API_URL,
  MAP_API_KEY,
  GEO_CODE_API,
} from "../../../utils/utilMethods";
import {
  getFormattedCustodianRow,
  getFormattedCustodyRows,
} from "../ShipmentConstants";
import { httpService } from "../../../modules/http/http.service";
import { MapComponent } from "../../../components/MapComponent/MapComponent";

const useStyles = makeStyles((theme) => ({
  roote: {},
}));

const labelSize = { width: 150 };
const labelPadding = 8;

export default function ShipmentRouteInfo(props) {
  const {
    custodianData,
    custodyData,
    contactInfo,
    editData,
    shipmentFormData,
  } = props;
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});

  useEffect(() => {
    if (
      custodyData &&
      custodyData.length &&
      custodianData &&
      custodianData.length &&
      shipmentFormData
    ) {
      let filteredCustodyData = custodyData.filter((data) => {
        return data.shipment_id === shipmentFormData.shipment_uuid;
      });
      let customizedRows = getFormattedCustodyRows(
        filteredCustodyData,
        custodianData
      );
      let routesInfo = [];
      customizedRows.forEach((row) => {
        if (row.start_of_custody_location) {
          routesInfo.push({
            lat:
              row.start_of_custody_location &&
              parseFloat(row.start_of_custody_location.split(",")[0]),
            lng:
              row.start_of_custody_location &&
              parseFloat(row.start_of_custody_location.split(",")[1]),
            label: `${row.custodian_data.name}(Start Location)`,
          });
        }
        if (row.end_of_custody_location) {
          routesInfo.push({
            lat:
              row.end_of_custody_location &&
              parseFloat(row.end_of_custody_location.split(",")[0]),
            lng:
              row.end_of_custody_location &&
              parseFloat(row.end_of_custody_location.split(",")[1]),
            label: `${row.custodian_data.name}(End Location)`,
          });
        }
      });
      setRoutes(routesInfo);
      setRows(customizedRows);
    }
    return function cleanup() {
      setRoutes([]);
    };
  }, [custodianData, custodyData, shipmentFormData]);

  return (
    <React.Fragment>
      {routes.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <MapComponent
              isMarkerShown
              showPath={true}
              googleMapURL={MAP_API_URL}
              zoom={8}
              setSelectedMarker={setSelectedMarker}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              markers={routes}
            />
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
}
