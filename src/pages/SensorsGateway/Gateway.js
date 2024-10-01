/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  useTheme,
  Button,
  Box,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { gatewayColumns, getGatewayFormattedRow } from '@utils/constants';
import AddGateway from './forms/AddGateway';
import { useQuery } from 'react-query';
import { getGatewayQuery } from '@react-query/queries/sensorGateways/getGatewayQuery';
import { getGatewayTypeQuery } from '@react-query/queries/sensorGateways/getGatewayTypeQuery';
import { getCustodianTypeQuery } from '@react-query/queries/custodians/getCustodianTypeQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getContactQuery } from '@react-query/queries/custodians/getContactQuery';
import { getShipmentsQuery } from '@react-query/queries/shipments/getShipmentsQuery';
import { getCountriesQuery } from '@react-query/queries/shipments/getCountriesQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import Loader from '@components/Loader/Loader';
import AddShipper from './forms/AddShipper';

const Gateway = ({ history, redirectTo }) => {
  const user = getUser();
  const organization = user.organization.organization_uuid;
  const theme = useTheme();

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const [rows, setRows] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [showAddShipper, setShowAddShipper] = useState(false);

  const { data: gatewayData, isLoading: isLoadingGateways } = useQuery(
    ['gateways', organization],
    () => getGatewayQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: gatewayTypesData, isLoading: isLoadingGatewayTypes } = useQuery(
    ['gatewayTypes'],
    () => getGatewayTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodianTypesData, isLoading: isLoadingCustodianTypes } = useQuery(
    ['custodianTypes'],
    () => getCustodianTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: contactInfo, isLoading: isLoadingContact } = useQuery(
    ['contact', organization],
    () => getContactQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: shipmentData, isLoading: isLoadingShipments } = useQuery(
    ['shipments', organization],
    () => getShipmentsQuery(organization, 'Planned,En route,Arrived', displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const addPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.TRACKERS}/gateway/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.TRACKERS}/gateway/edit`;

  useEffect(() => {
    if (!_.isEmpty(gatewayData) && !_.isEmpty(gatewayTypesData)) {
      setRows(
        getGatewayFormattedRow(
          gatewayData,
          gatewayTypesData,
          shipmentData,
          custodianData,
        ),
      );
    }
  }, [gatewayData, gatewayTypesData, shipmentData, custodianData]);

  useEffect(() => {
    if (!_.isEmpty(rows)) {
      let uniqueShippers = [...new Set(rows.map((item) => item.custodian).flat())];
      if (_.includes(uniqueShippers, '-')) {
        uniqueShippers = uniqueShippers.filter((shipper) => shipper !== '-').concat('-');
      }
      setShippers(uniqueShippers);
    }
  }, [rows]);

  const editGatewayAction = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.TRACKERS,
      data: item,
      gatewayTypesData,
      unitData,
      custodianData,
      contactInfo,
    });
  };

  const onAddButtonClick = () => {
    history.push(addPath, {
      from: redirectTo || routes.TRACKERS,
      gatewayTypesData,
      unitData,
      custodianData,
      contactInfo,
    });
  };

  return (
    <div>
      {(isLoadingGateways
        || isLoadingGatewayTypes
        || isLoadingCustodianTypes
        || isLoadingCustodians
        || isLoadingContact
        || isLoadingShipments
        || isLoadingCountries
        || isLoadingUnits
        || isLoadingOrgs)
        && (
          <Loader open={isLoadingGateways
            || isLoadingGatewayTypes
            || isLoadingCustodianTypes
            || isLoadingCustodians
            || isLoadingContact
            || isLoadingShipments
            || isLoadingCountries
            || isLoadingUnits
            || isLoadingOrgs}
          />
        )}
      <Grid container spacing={1} mt={5} ml={0.4}>
        <Typography variant="h4">Trackers</Typography>
        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ marginLeft: '20px' }}
          onClick={() => setShowAddShipper(true)}
        >
          + Add Shipper
        </Button>
      </Grid>
      <AddShipper
        open={showAddShipper}
        setOpen={setShowAddShipper}
        unitData={unitData}
        countriesData={countriesData}
        orgData={orgData}
        custodianTypesData={custodianTypesData}
      />
      <Grid container mt={2} pb={4}>
        <Grid item xs={12} sm={8} lg={9}>
          {!_.isEmpty(shippers) && shippers.map((custodianName, index) => (
            <Accordion key={index} className="gatewayAccordion">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={_.isEqual(custodianName, '-') ? 'unassigned-content' : `${custodianName}-content`}
                id={_.isEqual(custodianName, '-') ? 'unassigned-header' : `${custodianName}-header`}
              >
                <Typography className="gatewayAccordingHeading">
                  {_.isEqual(custodianName, '-') ? 'UNASSIGNED TRACKERS' : custodianName.toUpperCase()}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataTableWrapper
                  hideAddButton
                  filename={_.isEqual(custodianName, '-') ? 'Unassigned Trackers' : `${custodianName} Trackers`}
                  rows={rows.filter((row) => row.custodian.toString() === custodianName) || []}
                  columns={gatewayColumns(
                    data,
                    _.find(
                      unitData,
                      (unit) => _.toLower(unit.unit_of_measure_for) === 'date',
                    )
                      ? _.find(
                        unitData,
                        (unit) => _.toLower(unit.unit_of_measure_for) === 'date',
                      ).unit_of_measure
                      : '',
                    theme,
                  )}
                  addButtonHeading="Add Tracker"
                  onAddButtonClick={onAddButtonClick}
                  editAction={editGatewayAction}
                />
                <Route path={`${addPath}`} component={AddGateway} />
                <Route path={`${editPath}/:id`} component={AddGateway} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
        <Grid item xs={12} sm={3.5} lg={2.7} className="gatewayInventoryContainer">
          {!_.isEmpty(shippers) && shippers.map((custodianName, index) => {
            const trackers = rows.filter((row) => row.custodian.toString() === custodianName);
            const {
              availableCount,
              assignedCount,
              inTransitCount,
              unavailableCount,
            } = trackers.reduce(
              (acc, tracker) => {
                if (tracker.gateway_status === 'available') {
                  acc.availableCount++;
                } else if (tracker.gateway_status === 'assigned') {
                  acc.assignedCount++;
                } else if (tracker.gateway_status === 'in-transit') {
                  acc.inTransitCount++;
                } else if (tracker.gateway_status === 'unavailable') {
                  acc.unavailableCount++;
                }
                return acc;
              },
              {
                availableCount: 0,
                assignedCount: 0,
                inTransitCount: 0,
                unavailableCount: 0,
              },
            );

            return (
              <>
                {!_.isEqual(custodianName, '-')
                  ? (
                    <Box className="inventoryContainer">
                      <Typography className="inventoryTitle">{custodianName.toUpperCase()}</Typography>
                      <Box className="inventoryAvailableContainer">
                        <div className="inventoryAvailableCountContainer">
                          <Typography className="inventoryAvailableCount">{availableCount}</Typography>
                        </div>
                        <Typography className="inventoryAvailableText">Available</Typography>
                      </Box>
                      <Box className="inventoryAssignedContainer">
                        <div className="inventoryAssignedCountContainer">
                          <Typography>{assignedCount}</Typography>
                        </div>
                        <Typography className="inventoryAssignedText">Assigned</Typography>
                      </Box>
                      <Box className="inventoryInTransitContainer">
                        <div className="inventoryInTransitCountContainer">
                          <Typography>{inTransitCount}</Typography>
                        </div>
                        <Typography className="inventoryInTransitText">In Transit</Typography>
                      </Box>
                      <Box className="inventoryUnavailableContainer">
                        <div className="inventoryUnavailableCountContainer">
                          <Typography>{unavailableCount}</Typography>
                        </div>
                        <Typography className="inventoryUnavailableText">Unavailable</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box className="inventoryContainer">
                      <Typography>UNASSIGNED</Typography>
                      <Typography className="inventoryUnassignedText">{_.size(trackers)}</Typography>
                    </Box>
                  )}
              </>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
};

export default Gateway;
