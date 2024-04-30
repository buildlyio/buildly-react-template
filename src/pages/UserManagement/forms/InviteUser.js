import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import {
  Button, Grid, TextField,
} from '@mui/material';
import { isDesktop } from '@utils/mediaQuery';
import { validators } from '@utils/validators';
import useAlert from '@hooks/useAlert';
import '../UserManagementStyles.css';
import { getCoreuserQuery } from '@react-query/queries/coreuser/getCoreuserQuery';
import { useInviteMutation } from '@react-query/mutations/authUser/inviteMutation';

const InviteUser = ({ open, setOpen }) => {
  const { displayAlert } = useAlert();

  const [openConfirmModal, setConfirmModal] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [formError, setFormError] = useState({});

  const { data: coreuserData, isLoading: isLoadingCoreuser } = useQuery(
    ['users'],
    () => getCoreuserQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (coreuserData) {
      const edata = coreuserData.map((item) => item.email);
      setEmailData(edata);
    }
  }, [coreuserData]);

  const discardFormData = () => {
    setUserEmails([]);
    setFormError({});
    setConfirmModal(false);
    setOpen(false);
  };

  const closeFormModal = () => {
    const dataHasChanged = !_.isEmpty(userEmails);
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
    const data = {
      emails: userEmails,
    };
    inviteMutation(data);
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
          || isInviting)
          && (
            <Loader open={isLoadingCoreuser
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
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="addUserSubmit"
                disabled={submitDisabled()}
              >
                Send Invite
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </div>
  );
};

export default InviteUser;
