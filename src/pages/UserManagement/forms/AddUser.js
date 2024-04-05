import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { getUser } from '@context/User.context';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import {
  Button, Grid, MenuItem, TextField,
} from '@mui/material';
import { isDesktop } from '@utils/mediaQuery';
import { validators } from '@utils/validators';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import '../UserManagementStyles.css';
import { getCoreuserQuery } from '@react-query/queries/coreuser/getCoreuserQuery';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import { getCoregroupQuery } from '@react-query/queries/coregroup/getCoregroupQuery';
import { useInviteMutation } from '@react-query/mutations/authUser/inviteMutation';

const AddUser = ({ open, setOpen }) => {
  const { displayAlert } = useAlert();
  const user = getUser();
  const isSuperAdmin = checkForGlobalAdmin(user);
  const { organization_uuid } = user.organization;

  const [openConfirmModal, setConfirmModal] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [formError, setFormError] = useState({});

  const organization_name = useInput('', { required: true });
  const user_role = useInput('', { required: true });

  const { data: coreuserData, isLoading: isLoadingCoreuser } = useQuery(
    ['users'],
    () => getCoreuserQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: orgData, isLoading: isLoadingOrganizations } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: coregroupData, isLoading: isLoadingCoregroup } = useQuery(
    ['coregroup'],
    () => getCoregroupQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (coreuserData) {
      const edata = coreuserData.map((item) => item.email);
      setEmailData(edata);
    }
  }, [coreuserData]);

  useEffect(() => {
    if (isSuperAdmin) {
      if (!_.isEmpty(organization_name.value)) {
        const selectedOrg = _.filter(orgData, (org) => org.name === organization_name.value);
        setRolesData(_.filter(coregroupData, (item) => item.organization === selectedOrg[0].organization_uuid));
      } else {
        setRolesData([]);
      }
    } else {
      setRolesData(_.filter(coregroupData, (item) => item.organization === organization_uuid));
    }
  }, [coregroupData, organization_name.value]);

  const discardFormData = () => {
    setUserEmails([]);
    organization_name.clear();
    user_role.reset();
    setFormError({});
    setConfirmModal(false);
    setOpen(false);
  };

  const closeFormModal = () => {
    const dataHasChanged = !_.isEmpty(userEmails)
      || organization_name.hasChanged()
      || user_role.hasChanged();
    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setOpen(false);
    }
  };

  const handleBlur = (e, validation, input, extras, extraData) => {
    let validateObj;
    if (extras) {
      validateObj = validators(validation, { value: input, required: true, extra: extraData });
    } else {
      validateObj = validators(validation, input);
    }
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const emails = e.target.value.split(',').map((email) => email.trim());
    setUserEmails(emails);
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (isSuperAdmin) {
      if (_.isEmpty(userEmails) || !organization_name.value || !user_role.value) {
        return true;
      }
    } else if (_.isEmpty(userEmails) || !user_role.value) {
      return true;
    }

    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  const { mutate: inviteMutation, isLoading: isInviting } = useInviteMutation(discardFormData, displayAlert);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!_.isEmpty(userEmails)
      || organization_name.hasChanged()
      || user_role.hasChanged()
    ) {
      const data = {
        emails: userEmails,
        org_data: {
          name: organization_name.value || user.organization.name,
        },
        user_role: user_role.value,
      };
      inviteMutation(data);
    }
  };

  return (
    <div>
      <FormModal
        open={open}
        handleClose={closeFormModal}
        title="Add Users"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        {(isLoadingCoreuser
          || isLoadingOrganizations
          || isLoadingCoregroup
          || isInviting)
          && (
            <Loader open={isLoadingCoreuser
              || isLoadingOrganizations
              || isLoadingCoregroup
              || isInviting}
            />
          )}
        <form
          className="addUserFormContainer"
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user_email"
                label="User Emails"
                name="user_email"
                autoComplete="user_email"
                error={formError.user_email && formError.user_email.error}
                helperText={
                  formError.user_email ? formError.user_email.message : ''
                }
                onBlur={(e) => handleBlur(e, 'duplicateEmail', userEmails, true, emailData)}
                onChange={handleInputChange}
                value={userEmails.toString()}
              />
            </Grid>
            {isSuperAdmin && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  select
                  id="organization_name"
                  name="organization_name"
                  label="Organization Name"
                  autoComplete="organization_name"
                  {...organization_name.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {_.map(orgData, (org) => (
                    <MenuItem
                      key={`organization-${org.id}`}
                      value={org.name || ''}
                    >
                      {org.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="user_role"
                name="user_role"
                label="User Role"
                autoComplete="user_role"
                {...user_role.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {!_.isEmpty(rolesData) && _.map(rolesData, (role) => (
                  <MenuItem
                    key={role.id}
                    value={role.name}
                  >
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="addOrganizationSubmit"
                disabled={submitDisabled()}
              >
                Register & Send
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </div>
  );
};

export default AddUser;
