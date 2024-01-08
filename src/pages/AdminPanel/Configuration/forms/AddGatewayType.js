import React, { useState } from 'react';
import _ from 'lodash';
import {
  useTheme,
  useMediaQuery,
  Grid,
  Button,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../../../../components/Loader/Loader';
import FormModal from '../../../../components/Modal/FormModal';
import { useInput } from '../../../../hooks/useInput';
import { validators } from '../../../../utils/validators';
import { useAddGatewayTypeMutation } from '../../../../react-query/mutations/sensorGateways/addGatewayTypeMutation';
import { useEditGatewayTypeMutation } from '../../../../react-query/mutations/sensorGateways/editGatewayTypeMutation';
import useAlert from '@hooks/useAlert';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const AddGatewayType = ({
  history,
  location,
}) => {
  const classes = useStyles();
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

  const buttonText = editPage ? 'Save' : 'Add Gateway Type';
  const formTitle = editPage ? 'Edit Gateway Type' : 'Add Gateway Type';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

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

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
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
          titleClass={classes.formTitle}
          maxWidth="md"
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {(isAddingGatewayType || isEditingGatewayType) && (
            <Loader open={isAddingGatewayType || isEditingGatewayType} />
          )}
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="name"
                  label="Gateway Type"
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
                <Grid item xs={6} sm={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isAddingGatewayType || isEditingGatewayType || submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={discardFormData}
                    className={classes.submit}
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
