import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import {
  VerifiedUser as ActivateIcon,
  VerifiedUserOutlined as DeactivateIcon,
} from '@mui/icons-material';
import { IconButton, MenuItem, Select } from '@mui/material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { getAllOrganizationQuery } from 'react-query/queries/authUser/getAllOrganizationQuery';
import { useEditCoreuserMutation } from 'react-query/mutations/coreuser/editCoreuserMutation';
import { getCoregroupQuery } from 'react-query/queries/coregroup/getCoregroupQuery';
import { getCoreuserQuery } from 'react-query/queries/coreuser/getCoreuserQuery';
import { getGroupsFormattedRow, getUserFormattedRows, userColumns } from '@utils/constants';
import '../UserManagementStyles.css';

const Users = () => {
  const user = getUser();

  const { displayAlert } = useAlert();
  const [rows, setRows] = useState([]);
  const [groups, setGroups] = useState([]);

  const { data: coreuserData, isLoading: isLoadingCoreuser } = useQuery(
    ['users'],
    () => getCoreuserQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: coregroupData, isLoading: isLoadingCoregroup } = useQuery(
    ['coregroup'],
    () => getCoregroupQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { mutate: editUserMutation, isLoading: isEditingUser } = useEditCoreuserMutation(displayAlert);

  useEffect(() => {
    if (!_.isEmpty(coreuserData)) {
      const formattedUsers = getUserFormattedRows(coreuserData);
      const signedInUser = _.remove(formattedUsers, { id: user.id });

      setRows([...signedInUser, ...formattedUsers]);
    }
  }, [coreuserData]);

  useEffect(() => {
    if (!_.isEmpty(coregroupData) && !_.isEmpty(organizations)) {
      setGroups(getGroupsFormattedRow(coregroupData, organizations));
    }
  }, [coregroupData, organizations]);

  const activateDeactivateUser = (coreuser) => {
    const editData = { id: coreuser.id, is_active: !coreuser.is_active };
    editUserMutation(editData);
  };

  const updatePermissions = (e, coreuser) => {
    const editData = { id: coreuser.id, core_groups: [e.target.value] };
    editUserMutation(editData);
  };

  return (
    <div>
      <DataTableWrapper
        hideAddButton
        centerLabel
        filename="Users"
        tableHeader="Users"
        loading={isLoadingCoreuser || isLoadingCoregroup || isLoadingOrganizations || isEditingUser}
        rows={rows || []}
        columns={[
          ...userColumns(),
          {
            name: 'Permissions',
            options: {
              sort: true,
              sortThirdClickReset: true,
              filter: true,
              setCellHeaderProps: () => ({ style: { textAlign: 'center' } }),
              customBodyRenderLite: (dataIndex) => {
                const coreuser = rows[dataIndex];
                return (
                  <Select
                    fullWidth
                    id="coreuser-permissions"
                    disabled={_.isEqual(user.id, coreuser.id) || !coreuser.is_active}
                    value={coreuser.core_groups[0].id}
                    onChange={(e) => updatePermissions(e, coreuser)}
                  >
                    {_.map(groups, (cg) => (
                      <MenuItem key={`coregorup-${cg.id}`} value={cg.id}>
                        {cg.display_permission_name}
                      </MenuItem>
                    ))}
                  </Select>
                );
              },
            },
          },
          {
            name: 'Activate/Deactivate User',
            options: {
              filter: false,
              sort: false,
              empty: true,
              setCellHeaderProps: () => ({ style: { textAlign: 'center' } }),
              customBodyRenderLite: (dataIndex) => {
                const coreuser = rows[dataIndex];
                return (
                  <div className="usersIconDiv">
                    <IconButton
                      disabled={_.isEqual(user.id, coreuser.id)}
                      className="usersIconButton"
                      onClick={(e) => activateDeactivateUser(coreuser)}
                    >
                      {coreuser.is_active ? <ActivateIcon titleAccess="Deactivate" /> : <DeactivateIcon titleAccess="Activate" />}
                    </IconButton>
                  </div>
                );
              },
            },
          },
        ]}
        extraOptions={{
          setRowProps: (row, dataIndex, rowIndex) => {
            const coreuser = rows[dataIndex];
            const style = { backgroundColor: '#BEBEBA' };
            return !coreuser.is_active || _.isEqual(user.id, coreuser.id) ? { style } : {};
          },
        }}
      />
    </div>
  );
};

export default Users;
