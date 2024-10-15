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
import GatewayActions from './components/GatewayActions';
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
import { useSyncGatewayMutation } from '@react-query/mutations/sensorGateways/syncGatewayMutation';
import { useEditGatewayMutation } from '@react-query/mutations/sensorGateways/editGatewayMutation';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import { useStore } from '@zustand/timezone/timezoneStore';
import Loader from '@components/Loader/Loader';
import AddShipper from './forms/AddShipper';
import { GATEWAY_ACTIONS } from '@utils/mock';
import { checkForAdmin, checkForGlobalAdmin } from '@utils/utilMethods';

const Gateway = ({ history, redirectTo }) => {
  const user = getUser();
  const isSuperAdmin = checkForGlobalAdmin(user);
  const isAdmin = checkForAdmin(user);
  const organization = user.organization.organization_uuid;
  const theme = useTheme();

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const [rows, setRows] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState({});

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

  const { mutate: syncGatewayMutation, isLoading: isSyncingGateway } = useSyncGatewayMutation(organization, displayAlert);

  const { mutate: editGatewayMutation, isLoading: isEditingGateway } = useEditGatewayMutation(organization, null, null, displayAlert);

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
    } else {
      setRows([]);
    }
  }, [gatewayData, gatewayTypesData, shipmentData, custodianData]);

  useEffect(() => {
    if (!_.isEmpty(rows)) {
      let uniqueShippers = [...new Set(rows.map((item) => item.custodian).flat())];
      if (_.includes(uniqueShippers, '-')) {
        uniqueShippers = uniqueShippers.filter((shipper) => shipper !== '-').concat('-');
      }
      setShippers(uniqueShippers);
    } else {
      setShippers([]);
    }
  }, [rows]);

  useEffect(() => {
    if (!isEditingGateway) {
      setSelectedRows([]);
      setSelectedIndices({});
    }
  }, [isEditingGateway]);

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

  const handleSelectedTrackers = (allRows, custodianName) => {
    const selectIndices = selectedIndices;
    const selectRows = selectedRows;
    const prevSelectedRows = _.filter(selectedRows, (row) => row.custodian.toString() !== custodianName);
    const filteredRows = _.filter(rows, (row) => row.custodian.toString() === custodianName);
    const selectedFilteredRows = allRows.map((item) => filteredRows[item.dataIndex]);
    selectIndices[custodianName] = allRows.map((item) => item.dataIndex);
    setSelectedRows([...prevSelectedRows, ...selectedFilteredRows]);
    setSelectedIndices(selectIndices);
  };

  const handleSyncGateways = (event) => {
    event.preventDefault();
    const gatewaySyncValue = {
      organization_uuid: organization,
      platform_type: 'Tive',
    };
    syncGatewayMutation(gatewaySyncValue);
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
        || isLoadingOrgs
        || isSyncingGateway)
        && (
          <Loader open={isLoadingGateways
            || isLoadingGatewayTypes
            || isLoadingCustodianTypes
            || isLoadingCustodians
            || isLoadingContact
            || isLoadingShipments
            || isLoadingCountries
            || isLoadingUnits
            || isLoadingOrgs
            || isSyncingGateway}
          />
        )}
      <Grid container spacing={1} mt={5} ml={0.4}>
        <Grid item xs={12} sm={6} className="gatewayHeaderContainer">
          <Typography variant="h4">Trackers</Typography>
          {(isSuperAdmin || isAdmin) && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              style={{ marginLeft: '20px' }}
              onClick={() => setShowAddShipper(true)}
            >
              + Add Shipper
            </Button>
          )}
        </Grid>

        {isSuperAdmin && (
          <GatewayActions
            handleSyncGateways={handleSyncGateways}
            selectedRows={selectedRows}
            custodianData={custodianData}
            contactInfo={contactInfo}
            editGatewayMutation={editGatewayMutation}
            isEditingGateway={isEditingGateway}
          />
        )}
      </Grid>

      <AddShipper
        open={showAddShipper}
        setOpen={setShowAddShipper}
        unitData={unitData}
        countriesData={countriesData}
        orgData={orgData}
        custodianTypesData={custodianTypesData}
      />

      <Grid container mt={3} pb={4}>
        {_.isEmpty(shippers) && (
          <Typography className="gatewayEmptyText">No data to display</Typography>
        )}

        {!_.isEmpty(shippers) && (
          <Grid item xs={12} sm={8} lg={9}>
            {shippers.map((custodianName, index) => (
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
                    selectable={{
                      rows: isSuperAdmin ? 'multiple' : 'none',
                      rowsHeader: !!isSuperAdmin,
                    }}
                    onRowSelectionChange={(rowsSelectedData, allRows, rowsSelected) => {
                      if (isSuperAdmin) {
                        handleSelectedTrackers(allRows, custodianName);
                      }
                    }}
                    selected={selectedIndices[custodianName]}
                    editAction={editGatewayAction}
                  />
                  <Route path={`${editPath}/:id`} component={AddGateway} />
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        )}

        {!_.isEmpty(shippers) && (
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
                <div key={index}>
                  {!_.isEqual(custodianName, '-')
                    ? (
                      <Box className="inventoryContainer">
                        <Typography className="inventoryTitle">{custodianName.toUpperCase()}</Typography>
                        {availableCount > 0 && (
                          <Box className="inventorySubContainer inventoryAvailable">
                            <div className="inventoryCountContainer">
                              <Typography>{availableCount}</Typography>
                            </div>
                            <Typography className="inventoryText">Available</Typography>
                          </Box>
                        )}
                        {assignedCount > 0 && (
                          <Box className="inventorySubContainer inventoryAssigned">
                            <div className="inventoryCountContainer">
                              <Typography>{assignedCount}</Typography>
                            </div>
                            <Typography className="inventoryText">Assigned</Typography>
                          </Box>
                        )}
                        {inTransitCount > 0 && (
                          <Box className="inventorySubContainer inventoryInTransit">
                            <div className="inventoryCountContainer">
                              <Typography>{inTransitCount}</Typography>
                            </div>
                            <Typography className="inventoryText">In Transit</Typography>
                          </Box>
                        )}
                        {unavailableCount > 0 && (
                          <Box className="inventorySubContainer inventoryUnavailable">
                            <div className="inventoryCountContainer">
                              <Typography>{unavailableCount}</Typography>
                            </div>
                            <Typography className="inventoryText">Unavailable</Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box className="inventoryContainer">
                        <Typography>UNASSIGNED</Typography>
                        <Typography className="inventoryUnassignedText">{_.size(trackers)}</Typography>
                      </Box>
                    )}
                </div>
              );
            })}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Gateway;
