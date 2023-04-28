import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Card, CardContent } from '@mui/material';
import MapComponent from '../../../components/MapComponent/MapComponent';
import {
  getFormattedCustodyRows,
} from '../ShipmentConstants';

const ShipmentRouteInfo = ({
  custodianData,
  custodyData,
  shipmentFormData,
}) => {
  const [routes, setRoutes] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});

  useEffect(() => {
    if (
      custodyData
      && custodyData.length
      && custodianData
      && custodianData.length
      && shipmentFormData
    ) {
      // eslint-disable-next-line max-len
      const filteredCustodyData = _.filter(
        custodyData,
        { shipment_id: shipmentFormData.shipment_uuid },
      );
      const customizedRows = getFormattedCustodyRows(
        filteredCustodyData,
        custodianData,
      );
      let routesInfo = [];
      _.forEach(customizedRows, (row) => {
        if (row.start_of_custody_location && row.custodian_data) {
          routesInfo = [
            ...routesInfo,
            {
              lat: row.start_of_custody_location
              && parseFloat(row.start_of_custody_location.split(',')[0]),
              lng: row.start_of_custody_location
              && parseFloat(row.start_of_custody_location.split(',')[1]),
              label: `${row.custodian_data.name}(Start Location)`,
            },
          ];
        }
        if (row.end_of_custody_location && row.custodian_data) {
          routesInfo = [
            ...routesInfo,
            {
              lat: row.end_of_custody_location
              && parseFloat(row.end_of_custody_location.split(',')[0]),
              lng: row.end_of_custody_location
              && parseFloat(row.end_of_custody_location.split(',')[1]),
              label: `${row.custodian_data.name}(End Location)`,
            },
          ];
        }
      });
      setRoutes(routesInfo);
    }
  }, [custodianData, custodyData, shipmentFormData]);

  return (
    <>
      {routes.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <MapComponent
              isMarkerShown
              showPath
              googleMapURL={window.env.MAP_API_URL}
              zoom={8}
              setSelectedMarker={setSelectedMarker}
              loadingElement={
                <div style={{ height: '100%' }} />
              }
              containerElement={
                <div style={{ height: '400px' }} />
              }
              mapElement={
                <div style={{ height: '100%' }} />
              }
              markers={routes}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ShipmentRouteInfo;
