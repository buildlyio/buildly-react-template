import React, { useState } from 'react';
import _ from 'lodash';
import {
  Grid,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { isDesktop } from '@utils/mediaQuery';
import { useAddGatewayTypeMutation } from '@react-query/mutations/sensorGateways/addGatewayTypeMutation';
import { useEditGatewayTypeMutation } from '@react-query/mutations/sensorGateways/editGatewayTypeMutation';
import useAlert from '@hooks/useAlert';
import '../../AdminPanelStyles.css';

const AddGatewayType = ({ history, location }) => {
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};

  const name = useInput((editData && editData.name) || '', {
    required: true,
  });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Tracker Type';
  const formTitle = editPage ? 'Edit Tracker Type' : 'Add Tracker Type';

  const closeFormModal = () => {
    if (name.hasChanged()) {
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

  const { mutate: addGatewayTypeMutation, isLoading: isAddingGatewayType } = useAddGatewayTypeMutation(history, location.state.from, displayAlert);

  const { mutate: editGatewayTypeMutation, isLoading: isEditingGatewayType } = useEditGatewayTypeMutation(history, location.state.from, displayAlert);

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDateTime = new Date();
    let data = {
      ...editData,
      name: name.value,
      edit_date: currentDateTime,
    };
    if (editPage) {
      editGatewayTypeMutation(data);
    } else {
      data = {
        ...data,
        create_date: currentDateTime,
      };
      addGatewayTypeMutation(data);
    }
  };

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
    if (!name.value) {
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
          {(isAddingGatewayType || isEditingGatewayType) && (
            <Loader open={isAddingGatewayType || isEditingGatewayType} />
          )}
          <form
            className="adminPanelFormContainer"
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  className="notranslate"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="name"
                  label={(
                    <Typography className="translate">Tracker Type</Typography>
                  )}
                  name="name"
                  autoComplete="name"
                  error={formError.name && formError.name.error}
                  helperText={
                    formError.name ? formError.name.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', name)}
                  {...name.bind}
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
                    disabled={isAddingGatewayType || isEditingGatewayType || submitDisabled()}
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

export default AddGatewayType;
