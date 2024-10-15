/* eslint-disable no-else-return */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Grid, Button } from '@mui/material';
import useAlert from '@hooks/useAlert';
import { useQuery } from 'react-query';
import { getUser } from '@context/User.context';
import { newGatewayColumns } from '@utils/constants';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import OrganizationSelector from '@components/OrganizationSelector/OrganizationSelector';
import { getGatewayQuery } from '@react-query/queries/sensorGateways/getGatewayQuery';
import { useFetchNewGatewayMutation } from 'react-query/mutations/sensorGateways/fetchNewGatewayMutation';
import { useEditGatewayMutation } from '@react-query/mutations/sensorGateways/editGatewayMutation';
import '../../AdminPanelStyles.css';

const Devices = ({ isNewDevices }) => {
  const user = getUser();
  const org = user.organization.name;
  const org_uuid = user.organization.organization_uuid;

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);
  const [organization, setOrganization] = useState(user.organization.name);
  const [buttonClick, setButtonClick] = useState(false);

  const { displayAlert } = useAlert();

  const { data: gatewayData, isLoading: isLoadingGateways } = useQuery(
    ['gateways', organization],
    () => getGatewayQuery(null, displayAlert),
    { refetchOnWindowFocus: false, enabled: buttonClick },
  );

  const { data: newGetewayData, mutate: fetchNewGatewayMutation, isLoading: isFetchingNewGateway } = useFetchNewGatewayMutation(displayAlert);

  const { mutate: editGatewayMutation, isLoading: isEditingGateway } = useEditGatewayMutation(org_uuid, null, null, displayAlert);

  const fetchGateways = () => {
    if (isNewDevices) {
      const newGatewayData = {
        platform_type: 'Tive',
      };
      fetchNewGatewayMutation(newGatewayData);
    } else {
      setButtonClick(true);
    }
  };

  useEffect(() => {
    if (isNewDevices) {
      if (!_.isEmpty(newGetewayData) && !_.isEmpty(newGetewayData.new_trackers)) {
        setRows(newGetewayData.new_trackers);
      }
    } else {
      setRows(gatewayData);
    }
  }, [newGetewayData, gatewayData]);

  const handleSelectedTrackers = (allRows) => {
    const selectedFilteredRows = allRows.map((item) => {
      if (!_.isEmpty(newGetewayData) && !_.isEmpty(newGetewayData.new_trackers)) {
        return newGetewayData.new_trackers[item.dataIndex];
      } else if (!_.isEmpty(gatewayData)) {
        return gatewayData[item.dataIndex];
      } else {
        return null;
      }
    });
    setSelectedRows(selectedFilteredRows);
    setSelectedRowsIndex(allRows.map((item) => item.dataIndex));
  };

  const handleOrganizationChange = (e) => {
    const organization_name = e.target ? e.target.value : e;
    setOrganization(!_.isEmpty(organization_name) ? organization_name : org);
  };

  const handleSubmit = () => {
    const updatedRows = selectedRows.map((row) => ({
      ...row,
      organization_uuid: org_uuid,
    }));
    editGatewayMutation(updatedRows);
    const filteredRows = rows.filter((row) => !selectedRows.some((selected) => selected.id === row.id));
    setRows(filteredRows);
    setButtonClick(false);
    setSelectedRows([]);
    setSelectedRowsIndex([]);
    setOrganization(user.organization.name);
  };

  return (
    <div>
      {(isFetchingNewGateway || isEditingGateway || isLoadingGateways) && <Loader open={isFetchingNewGateway || isEditingGateway || isLoadingGateways} />}
      <Grid container>
        <Grid item xs={6} sm={3}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="adminTrackersButton"
            onClick={fetchGateways}
            disabled={isFetchingNewGateway || isEditingGateway || isLoadingGateways}
          >
            {isNewDevices ? 'Upload New Devices' : 'Upload Reused Devices'}
          </Button>
        </Grid>
      </Grid>
      {!_.isEmpty(rows) && (
        <Grid container>
          <Grid item xs={12} sm={8} mt={-6}>
            <DataTableWrapper
              hideAddButton
              noOptionsIcon
              rows={rows || []}
              columns={newGatewayColumns()}
              selectable={{
                rows: 'multiple',
                rowsHeader: true,
              }}
              selected={selectedRowsIndex}
              onRowSelectionChange={(rowsSelectedData, allRows, rowsSelected) => {
                handleSelectedTrackers(allRows);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} mt={1}>
            <OrganizationSelector
              handleOrganizationChange={handleOrganizationChange}
              selectedOrg={organization}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              style={{ marginLeft: '20px', marginTop: '8px' }}
              disabled={isFetchingNewGateway || isEditingGateway || isLoadingGateways || _.isEmpty(selectedRows) || _.isEmpty(organization)}
              onClick={handleSubmit}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Devices;
