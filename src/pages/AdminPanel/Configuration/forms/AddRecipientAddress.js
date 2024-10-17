import React, { useState } from 'react';
import _ from 'lodash';
import { Grid, Button, TextField } from '@mui/material';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import { useAddRecipientAddressMutation } from '@react-query/mutations/recipientaddress/addRecipientAddressMutation';
import { useEditRecipientAddressMutation } from '@react-query/mutations/recipientaddress/editRecipientAddressMutation';
import { validators } from '@utils/validators';
import { isDesktop } from '@utils/mediaQuery';
import '../../AdminPanelStyles.css';

const AddRecipientAddress = ({ history, location }) => {
  const { organization_uuid } = getUser().organization;
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  const editPage = location.state && location.state.type === 'edit';
  const editData = (editPage && location.state.data) || {};

  const name = useInput((editData && editData.name) || '', { required: true });
  const address = useInput((editData && editData.address) || '', { required: true });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Recipient Address';
  const formTitle = editPage ? 'Edit Recipient Address' : 'Add Recipient Address';

  const closeFormModal = () => {
    if (name.hasChanged() || address.hasChanged()) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(location.state.from);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  const { mutate: addRecipientAddressMutation, isLoading: isAddingRecipientAddress } = useAddRecipientAddressMutation(history, location.state.from, displayAlert);

  const { mutate: editRecipientAddressMutation, isLoading: isEditingRecipientAddress } = useEditRecipientAddressMutation(history, location.state.from, displayAlert);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      ...editData,
      name: name.value,
      address: address.value,
      organization_uuid,
    };
    if (editPage) {
      editRecipientAddressMutation(data);
    } else {
      addRecipientAddressMutation(data);
    }
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!name.value || !address.value) {
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

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title={formTitle}
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {(isAddingRecipientAddress || isEditingRecipientAddress) && (
            <Loader open={isAddingRecipientAddress || isEditingRecipientAddress} />
          )}
          <form
            className="adminPanelFormContainer"
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="recipient-name"
                  label="Recipient Name"
                  name="recipient-name"
                  autoComplete="recipient-name"
                  error={formError.name && formError.name.error}
                  helperText={
                    formError.name ? formError.name.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', name)}
                  {...name.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="recipient-address"
                  label="Recipient Address"
                  name="recipient-address"
                  autoComplete="recipient-address"
                  error={formError.address && formError.address.error}
                  helperText={
                    formError.address ? formError.address.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', address)}
                  {...address.bind}
                />
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={5.15} md={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="adminPanelSubmit"
                    disabled={isAddingRecipientAddress || isEditingRecipientAddress || submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={5.15} md={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={discardFormData}
                    className="adminPanelSubmit"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormModal>
      )}
    </div>
  );
};

export default AddRecipientAddress;
