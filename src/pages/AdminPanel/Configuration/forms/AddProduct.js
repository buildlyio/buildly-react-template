import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  useTheme,
  useMediaQuery,
  Grid,
  Button,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormModal from '../../../../components/Modal/FormModal';
import { UserContext } from '../../../../context/User.context';
import { useInput } from '../../../../hooks/useInput';
import {
  addProduct,
  editProduct,
} from '../../../../redux/items/actions/items.actions';
import { validators } from '../../../../utils/validators';

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

const AddProduct = ({
  history,
  location,
  loading,
  dispatch,
}) => {
  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};

  const name = useInput((editData && editData.name) || '', {
    required: true,
  });
  const description = useInput((editData && editData.description) || '', {
    required: true,
  });
  const value = useInput((editData && editData.value) || 0, {
    required: true,
  });
  const grossWeight = useInput((editData && editData.gross_weight) || 0, {
    required: true,
  });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Product';
  const formTitle = editPage ? 'Edit Product' : 'Add Product';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || description.hasChanged()
      || value.hasChanged()
      || grossWeight.hasChanged()
    );

    if (dataHasChanged) {
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
      description: description.value,
      value: value.value,
      gross_weight: grossWeight.value,
      organization_uuid: organization,
      edit_date: currentDateTime,
    };
    if (editPage) {
      dispatch(editProduct(data));
    } else {
      data = {
        ...data,
        create_date: currentDateTime,
      };
      dispatch(addProduct(data));
    }
    setFormModal(false);
    if (location && location.state) {
      history.push(location.state.from);
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
    if (
      !name.value
      || !description.value
      || !value.value
      || !grossWeight.value
    ) {
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
                  label="Name"
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
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                  error={
                    formError.description
                    && formError.description.error
                  }
                  helperText={
                    formError.description
                      ? formError.description.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', description)}
                  {...description.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  type="number"
                  id="value"
                  label="Value"
                  name="name"
                  autoComplete="value"
                  error={formError.value && formError.value.error}
                  helperText={
                    formError.value ? formError.value.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', value)}
                  {...value.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  type="number"
                  id="grossWeight"
                  label="Gross Weight"
                  name="grossWeight"
                  autoComplete="grossWeight"
                  error={
                    formError.grossWeight
                    && formError.grossWeight.error
                  }
                  helperText={
                    formError.grossWeight
                      ? formError.grossWeight.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', grossWeight)}
                  {...grossWeight.bind}
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
                    disabled={loading || submitDisabled()}
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(AddProduct);
