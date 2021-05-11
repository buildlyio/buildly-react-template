import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  Grid,
  Button,
  TextField,
  Typography,
  Checkbox,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import {
  addUnitsOfMeasure,
  editUnitsOfMeasure,
} from '@redux/items/actions/items.actions';

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
  checkbox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginLeft: `${theme.spacing(2)}px !important`,
    fontSize: '0.9rem',
  },
}));

const AddUnitOfMeasure = ({
  history,
  location,
  loading,
  dispatch,
}) => {
  const classes = useStyles();
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
  const unitClass = useInput(
    (editData && editData.supported_class) || '',
    { required: true },
  );
  const [isDefault, setIsDefault] = useState(
    (editData && editData.is_default_for_class) || false,
  );
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Unit of Measure';
  const formTitle = editPage ? 'Edit Unit of Measure' : 'Add Unit of Measure';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || unitClass.hasChanged()
      || (isDefault !== (
        editData.is_default_for_class || false
      ))
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
      supported_class: unitClass.value,
      is_default_for_class: isDefault,
      edit_date: currentDateTime,
    };
    if (editPage) {
      dispatch(editUnitsOfMeasure(data));
    } else {
      data = {
        ...data,
        create_date: currentDateTime,
      };
      dispatch(addUnitsOfMeasure(data));
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
    if (!name.value || !unitClass.value) {
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
                  label="Unit of Measure"
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
                  id="unitClass"
                  label="Unit Class"
                  select
                  error={
                    formError.unitClass
                    && formError.unitClass.error
                  }
                  helperText={
                    formError.unitClass
                      ? formError.unitClass.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', unitClass)}
                  {...unitClass.bind}
                >
                  <MenuItem value="">--------</MenuItem>
                  <MenuItem value="Capacity and Volume">
                    Capacity and Volume
                  </MenuItem>
                  <MenuItem value="Distance and Length">
                    Distance and Length
                  </MenuItem>
                  <MenuItem value="Mass and Weight">
                    Mass and Weight
                  </MenuItem>
                  <MenuItem value="Temperature">
                    Temperature
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.checkbox}>
                  <Checkbox
                    checked={isDefault}
                    onClick={(e) => setIsDefault(e.target.checked)}
                  />
                  <Typography className={classes.label}>
                    Is this default for Unit Class?
                  </Typography>
                </div>
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

export default connect(mapStateToProps)(AddUnitOfMeasure);
