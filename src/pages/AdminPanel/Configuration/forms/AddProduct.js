import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  Grid,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import Modal from '@components/Modal/Modal';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import {
  addProduct,
  editProduct,
} from '@redux/items/actions/items.actions';
import { UserContext } from '@context/User.context';

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
  loadingWrapper: {
    position: 'relative',
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
  unitsOfMeasure,
}) => {
  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openModal, toggleModal] = useState(true);

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
  const unit = useInput((editData && editData.unit_of_measure) || '', {
    required: true,
  });
  const [formError, setFormError] = useState({});

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const buttonText = editPage ? 'Save' : 'Add Product';
  const formTitle = editPage ? 'Edit Product' : 'Add Product';

  const closeModal = () => {
    toggleModal(false);
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
      value: Number(value.value),
      gross_weight: Number(grossWeight.value),
      unit_of_measure: unit.value,
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
    closeModal();
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
      || !unit.value
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
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth="md"
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
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="unit"
                  label="Unit of Measure"
                  select
                  error={formError.unit && formError.unit.error}
                  helperText={
                    formError.unit ? formError.unit.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', unit)}
                  {...unit.bind}
                >
                  <MenuItem value="">--------</MenuItem>
                  {unitsOfMeasure
                  && _.map(
                    unitsOfMeasure,
                    (unitVal, index) => (
                      <MenuItem
                        key={`unit-${index}`}
                        value={`${unitVal.url}`}
                      >
                        {`${unitVal.name}`}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </Grid>
              <Grid container spacing={2} justify="center">
                <Grid item xs={6} sm={4}>
                  <div className={classes.loadingWrapper}>
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
                    {loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => closeModal()}
                    className={classes.submit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(AddProduct);
