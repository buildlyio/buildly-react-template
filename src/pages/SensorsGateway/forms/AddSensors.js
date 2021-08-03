import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  makeStyles,
  useTheme,
  TextField,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@material-ui/core';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import { MapComponent } from '@components/MapComponent/MapComponent';
import FormModal from '@components/Modal/FormModal';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { UserContext } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import {
  editSensor,
  addSensor,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import { routes } from '@routes/routesConstants';
import { validators } from '@utils/validators';
import SearchModal from '../Sensors/SearchModal';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
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
  cardItems: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const AddSensor = ({
  dispatch,
  loading,
  history,
  location,
  sensorTypeList,
  gatewayData,
  sensorOptions,
  timezone,
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

  const sensor_name = useInput((editData && editData.name) || '', {
    required: true,
  });
  const sensor_type = useInput(
    (editData && editData.sensor_type) || '',
    { required: true },
  );
  const [activation_date, handleDateChange] = useState(
    (editData && editData.activation_date) || moment(),
  );
  const mac_address = useInput('');
  const [last_known_location, setLastLocation] = useState(
    (editData
    && editData.last_known_location
    && editData.last_known_location[0])
    || '',
  );
  const sensor_placed = useInput('');
  const [formError, setFormError] = useState({});

  const [associatedGateway, setAccociatedGateway] = useState(null);
  const [gateway, setGateway] = useState(
    (editData && editData.gateway) || '',
  );
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const buttonText = editPage ? 'Save' : 'Add Sensor';
  const formTitle = editPage ? 'Edit Sensor' : 'Add Sensor';

  const [sensorMetaData, setSensorMetaData] = useState({});
  const organization = useContext(UserContext).organization.organization_uuid;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (sensorOptions && sensorOptions.actions) {
      setSensorMetaData(sensorOptions.actions.POST);
    }
  }, [sensorOptions]);

  useEffect(() => {
    if (
      gatewayData
      && gatewayData.length
      && editData.gateway
      && associatedGateway === null
    ) {
      _.forEach(gatewayData, (gtwy) => {
        if (gtwy.url === editData.gateway) {
          setAccociatedGateway(gtwy);
        }
      });
    }
  }, [gatewayData, gateway]);

  const closeFormModal = () => {
    const dataHasChanged = (
      sensor_name.hasChanged()
      || sensor_type.hasChanged()
      || mac_address.hasChanged()
      || (moment(activation_date).format('l') !== (moment(editData.activation_date || moment()).format('l')))
      || (last_known_location !== ((editData.last_known_location && editData.last_known_location[0]) || 'null, null'))
      || (gateway !== (editData.gateway || ''))
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

  const setGatewayUrl = (list) => {
    setAccociatedGateway(list);
    setGateway(list.url);
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const sensorFormValues = {
      name: sensor_name.value,
      mac_address: mac_address.value,
      sensor_type: sensor_type.value,
      estimated_eol: '',
      activation_date,
      last_known_location: [last_known_location],
      gateway,
      associated_sensors_ids: [],
      associated_shipment_item_ids: [],
      ...(editPage && editData && { id: editData.id }),
      organization_uuid: organization,
    };
    if (editPage) {
      dispatch(
        editSensor(sensorFormValues, history, `${routes.SENSORS_GATEWAY}`),
      );
    } else {
      dispatch(
        addSensor(sensorFormValues, history, `${routes.SENSORS_GATEWAY}`),
      );
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
      !sensor_type.value
      || !sensor_name.value
      || !gateway
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

  const handleDelete = (chipToDelete) => () => {
    setAccociatedGateway(null);
    setGateway('');
  };

  const setLastKnownLocation = (value) => {
    setLastLocation(value);
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
              <Grid className={classes.inputWithTooltip} item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="sensor_name"
                  label="Sensor Name"
                  name="sensor_name"
                  autoComplete="sensor_name"
                  error={
                    formError.sensor_name
                    && formError.sensor_name.error
                  }
                  helperText={
                    formError.sensor_name
                      ? formError.sensor_name.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', sensor_name)}
                  {...sensor_name.bind}
                />
                {sensorMetaData.name
                && sensorMetaData.name.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      sensorMetaData.name.help_text
                    }
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <div className={classes.inputWithTooltip}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="last_known_location"
                    label="Last Known Location"
                    name="last_known_location"
                    autoComplete="last_known_location"
                    value={last_known_location}
                  />
                  {sensorMetaData.last_known_location
                  && sensorMetaData.last_known_location.help_text
                  && (
                    <CustomizedTooltips
                      toolTipText={
                        sensorMetaData.last_known_location.help_text
                      }
                    />
                  )}
                </div>
                <MapComponent
                  isMarkerShown
                  googleMapURL={window.env.MAP_API_URL}
                  zoom={8}
                  loadingElement={
                    <div style={{ height: '100%' }} />
                  }
                  containerElement={
                    <div style={{ height: '200px' }} />
                  }
                  mapElement={
                    <div style={{ height: '100%' }} />
                  }
                  markers={[
                    {
                      lat: last_known_location
                      && parseFloat(
                        last_known_location.split(',')[0],
                      ),
                      lng: last_known_location
                      && parseFloat(
                        last_known_location.split(',')[1],
                      ),
                      onMarkerDrag: setLastKnownLocation,
                      draggable: true,
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  disabled
                  margin="normal"
                  fullWidth
                  id="sensor_placed"
                  label="Sensor Placed"
                  name="sensor_placed"
                  autoComplete="sensor_placed"
                  {...sensor_placed.bind}
                />
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.cardItems}>
              <CardContent>
                <Typography
                  className={classes.dashboardHeading}
                  variant="body1"
                >
                  Sensor Info
                </Typography>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                    sm={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="sensor_type"
                      select
                      label="Sensor Type"
                      error={
                        formError.sensor_type
                        && formError.sensor_type.error
                      }
                      helperText={
                        formError.sensor_type
                          ? formError.sensor_type.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', sensor_type, 'sensor_type')}
                      {...sensor_type.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {sensorTypeList
                        && _.map(
                          sensorTypeList,
                          (item, index) => (
                            <MenuItem
                              key={`sensorType${index}:${item.id}`}
                              value={item.url}
                            >
                              {item.name}
                            </MenuItem>
                          ),
                        )}
                    </TextField>
                    {sensorMetaData.sensor_type
                    && sensorMetaData.sensor_type.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          sensorMetaData.sensor_type.help_text
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <DatePickerComponent
                      label="Activated"
                      selectedDate={
                        moment(activation_date)
                          .tz(timezone)
                          .formzt('l')
                      }
                      handleDateChange={handleDateChange}
                      helpText={
                        sensorMetaData.activation_date
                        && sensorMetaData.activation_date.help_text
                          ? sensorMetaData.activation_date.help_text
                          : ''
                      }
                    />
                  </Grid>

                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                    sm={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="mac_address"
                      label="Mac Address"
                      name="mac_address"
                      autoComplete="mac_address"
                      {...mac_address.bind}
                    />
                    {sensorMetaData.mac_address
                    && sensorMetaData.mac_address.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          sensorMetaData.mac_address.help_text
                        }
                      />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid item xs={6} sm={4}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => setSearchModalOpen(true)}
                className={classes.submit}
              >
                Associate to Gateway
              </Button>
            </Grid>
            <Grid item xs={12}>
              {associatedGateway && gateway && (
                <Chip
                  label={`${associatedGateway.name}:${associatedGateway.gateway_uuid}`}
                  onDelete={handleDelete(associatedGateway)}
                  className={classes.chip}
                />
              )}
            </Grid>
            <Grid container spacing={2} justifyContent="center">
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
            </Grid>
          </form>
          {searchModalOpen && (
            <SearchModal
              open={searchModalOpen}
              setOpen={setSearchModalOpen}
              title="Associate Gateway UUID"
              submitText="Save"
              submitAction={setGatewayUrl}
              selectedList={
                gateway && associatedGateway
                  ? associatedGateway
                  : null
              }
              listOfItems={gatewayData}
              helpText={
                sensorMetaData.gateway
                && sensorMetaData.gateway.help_text
                  ? sensorMetaData.gateway.help_text
                  : ''
              }
              searchFieldLabel="Select Gateway UUID"
              searchFieldPlaceHolder="Select the Value"
            />
          )}
        </FormModal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.optionsReducer.loading
  ),
});

export default connect(mapStateToProps)(AddSensor);
