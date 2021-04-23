import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  makeStyles,
  Button,
  TextField,
  CircularProgress,
  Grid,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import Modal from '@components/Modal/Modal';
import { useInput } from '@hooks/useInput';
import { routes } from '@routes/routesConstants';
import { validators } from '@utils/validators';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
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
  logo: {
    width: '100%',
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
  addressContainer: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const AddShipperInfo = ({
  loading,
  history,
  location,
  modeTypeList,
}) => {
  const editPage = location.state && location.state.type === 'edit';
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();
  const shipper_name = useInput('', { required: true });
  const mode_type = useInput('');
  const route_desc = useInput('');
  const [scheduled_departure, handleDateChange] = useState(moment());
  const [formError, setFormError] = useState({});

  const buttonText = 'Next: Add Destination';
  const formTitle = 'Add Shipper Info (2/3)';
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    } else {
      history.push(`${routes.SHIPMENT}/add`);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
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
    if (!shipper_name.value) {
      return true;
    }
    let errorExists = false;
    errorKeys.forEach((key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  const onNextClick = (e) => {
    history.push(`${routes.SHIPMENT}/add/destination`, {
      from: `${routes.SHIPMENT}/add/shipper`,
    });
  };

  const handleBack = () => {
    if (location && location.state) {
      history.push(location.state.from);
    }
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
                  required
                  fullWidth
                  id="shipper_name"
                  label="Shipper Name"
                  name="shipper_name"
                  autoComplete="shipper_name"
                  error={
                    formError.shipper_name
                    && formError.shipper_name.error
                  }
                  helperText={
                    formError.shipper_name
                      ? formError.shipper_name.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', shipper_name)}
                  {...shipper_name.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="mode_type"
                  select
                  label="Mode Type"
                  error={
                    formError.mode_type
                    && formError.mode_type.error
                  }
                  helperText={
                    formError.mode_type
                      ? formError.mode_type.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', mode_type, 'mode_type')}
                  {...mode_type.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {modeTypeList
                  && modeTypeList.map((item, index) => (
                    <MenuItem
                      key={`modeType${index}:${item.id}`}
                      value={item.url}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label="Scheduled Departure"
                  selectedDate={scheduled_departure}
                  handleDateChange={handleDateChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  id="route_desc"
                  label="Route Description"
                  name="route_desc"
                  autoComplete="route_desc"
                  {...route_desc.bind}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={isDesktop ? 3 : 0}
              justify="center"
            >
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => handleBack()}
                  className={classes.submit}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.loadingWrapper}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => onNextClick()}
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
            </Grid>
          </form>
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(AddShipperInfo);
