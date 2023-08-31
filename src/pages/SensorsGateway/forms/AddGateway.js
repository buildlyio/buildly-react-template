import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  useTheme,
  Button,
  TextField,
  Grid,
  MenuItem,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DatePickerComponent from '../../../components/DatePicker/DatePicker';
import Loader from '../../../components/Loader/Loader';
import MapComponent from '../../../components/MapComponent/MapComponent';
import FormModal from '../../../components/Modal/FormModal';
import CustomizedTooltips from '../../../components/ToolTip/ToolTip';
import { UserContext } from '../../../context/User.context';
import { useInput } from '../../../hooks/useInput';
import { getUnitOfMeasure } from '../../../redux/items/actions/items.actions';
import {
  addGateway,
  editGateway,
} from '../../../redux/sensorsGateway/actions/sensorsGateway.actions';
import { validators } from '../../../utils/validators';
import { getCustodianFormattedRow, GATEWAY_STATUS } from '../../../utils/constants';

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

const AddGateway = ({
  dispatch,
  loading,
  history,
  location,
  gatewayTypeList,
  gatewayOptions,
  timezone,
  viewOnly,
  custodianData,
  contactInfo,
  unitOfMeasure,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};

  const gateway_name = useInput(editData.name || '', {
    required: true,
  });
  const gateway_type = useInput(editData.gateway_type || '', {
    required: true,
  });
  const [activation_date, handleDateChange] = useState(
    editData.activation_date || moment(),
  );
  const sim_card_id = useInput(editData.sim_card_id || '');
  const battery_level = useInput(
    editData.last_known_battery_level || '',
  );
  const [custodianList, setCustodianList] = useState([]);
  const [custodian_uuid, setcustodian_uuid] = useState(
    (editData && editData.custodian_uuid) || '',
  );
  const mac_address = useInput(editData.mac_address || '');
  const [last_known_location, setLastLocation] = useState(
    (editData
    && editData.last_known_location
    && editData.last_known_location[0])
    || '',
  );
  const gateway_status = useInput(editData.gateway_status || '', {
    required: true,
  });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Gateway';
  const formTitle = editPage ? 'Edit Gateway' : 'Add Gateway';

  const [gatewayMetaData, setGatewayMetaData] = useState({});
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (_.isEmpty(unitOfMeasure)) {
      dispatch(getUnitOfMeasure(organization));
    }
  }, []);

  useEffect(() => {
    if (gatewayOptions && gatewayOptions.actions) {
      setGatewayMetaData(gatewayOptions.actions.POST);
    }
  }, [gatewayOptions]);

  useEffect(() => {
    if (!_.isEmpty(custodianData) && contactInfo) {
      setCustodianList(getCustodianFormattedRow(
        custodianData,
        contactInfo,
      ));
    }
  }, [custodianData, contactInfo]);

  const closeFormModal = () => {
    const dataHasChanged = (
      gateway_name.hasChanged()
      || gateway_type.hasChanged()
      || sim_card_id.hasChanged()
      || battery_level.hasChanged()
      || mac_address.hasChanged()
      || gateway_status.hasChanged()
      || (moment(activation_date).format('l') !== (moment(editData.activation_date || moment()).format('l')))
      || (last_known_location !== ((editData.last_known_location && editData.last_known_location[0]) || 'null, null'))
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(redirectTo);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const gatewayFormValues = {
      name: gateway_name.value,
      sensors: '',
      sim_card_id: sim_card_id.value,
      gateway_type: gateway_type.value,
      shipment_ids: [],
      activation_date,
      last_known_battery_level: battery_level.value,
      ...(editPage && editData && { id: editData.id }),
      mac_address: mac_address.value,
      custodian_uuid: custodian_uuid || null,
      last_known_location: [
        last_known_location === '' ? 'null, null' : last_known_location,
      ],
      gateway_status: gateway_status.value,
      organization_uuid: organization,
    };
    if (editPage) {
      dispatch(editGateway(gatewayFormValues, history, redirectTo));
    } else {
      dispatch(addGateway(gatewayFormValues, history, redirectTo));
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
    if (!gateway_type.value || !gateway_name.value) {
      return true;
    }
    if (!_.isEmpty(editData.shipment_ids)) {
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

  const onInputChange = (e) => {
    const { value } = e.target;
    if (value) {
      setcustodian_uuid(value);
      if (custodianList.length > 0) {
        let selectedCustodian = '';
        _.forEach(custodianList, (list) => {
          if (list.uuid === value) {
            selectedCustodian = list;
          }
        });
      }
    } else {
      setcustodian_uuid(value);
    }
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

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
          {loading && <Loader open={loading} />}
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
                  id="gateway_name"
                  required
                  label="Gateway Name"
                  name="gateway_name"
                  autoComplete="gateway_name"
                  error={
                    formError.gateway_name
                    && formError.gateway_name.error
                  }
                  helperText={
                    formError.gateway_name
                      ? formError.gateway_name.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', gateway_name)}
                  {...gateway_name.bind}
                />
                {gatewayMetaData.name
                && gatewayMetaData.name.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      gatewayMetaData.name.help_text
                    }
                  />
                )}
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.cardItems}>
              <CardContent>
                <Typography
                  className={classes.dashboardHeading}
                  variant="body1"
                >
                  Gateway Info
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
                      id="gateway_type"
                      select
                      label="Gateway Type"
                      error={
                        formError.gateway_type
                        && formError.gateway_type.error
                      }
                      helperText={
                        formError.gateway_type
                          ? formError.gateway_type.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', gateway_type, 'gateway_type')}
                      {...gateway_type.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {gatewayTypeList
                        && _.map(
                          gatewayTypeList,
                          (item, index) => (
                            <MenuItem
                              key={`gatewayType${index}:${item.id}`}
                              value={item.url}
                            >
                              {item.name}
                            </MenuItem>
                          ),
                        )}
                    </TextField>
                    {gatewayMetaData.gateway_type
                    && gatewayMetaData.gateway_type.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          gatewayMetaData.gateway_type.help_text
                        }
                      />
                    )}
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
                      required
                      id="gateway_status"
                      select
                      label="Gateway Status"
                      error={
                        formError.gateway_status
                        && formError.gateway_status.error
                      }
                      helperText={
                        formError.gateway_status
                          ? formError.gateway_status.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(
                        e,
                        'required',
                        gateway_status,
                        'gateway_status',
                      )}
                      {...gateway_status.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {GATEWAY_STATUS
                        && _.map(
                          GATEWAY_STATUS,
                          (item, index) => (
                            <MenuItem
                              key={`gatewayStatus${index}:${item.value}`}
                              value={item.value}
                            >
                              {item.name}
                            </MenuItem>
                          ),
                        )}
                    </TextField>
                    {gatewayMetaData.gateway_status
                    && gatewayMetaData.gateway_status.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          gatewayMetaData.gateway_status.help_text
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
                      }
                      handleDateChange={handleDateChange}
                      helpText={
                        gatewayMetaData.activation_date
                        && gatewayMetaData.activation_date.help_text
                          ? gatewayMetaData.activation_date.help_text
                          : ''
                      }
                      dateFormat={
                        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
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
                      id="sim_card_id"
                      label="IMEI"
                      name="sim_card_id"
                      autoComplete="sim_card_id"
                      {...sim_card_id.bind}
                    />
                    {gatewayMetaData.sim_card_id
                    && gatewayMetaData.sim_card_id.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          gatewayMetaData.sim_card_id.help_text
                        }
                      />
                    )}
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
                      id="battery_level"
                      label="Battery(%)"
                      name="battery_level"
                      autoComplete="battery_level"
                      {...battery_level.bind}
                    />
                    {gatewayMetaData.last_known_battery_level
                    && gatewayMetaData.last_known_battery_level.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          gatewayMetaData.last_known_battery_level.help_text
                        }
                      />
                    )}
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
                    {gatewayMetaData.mac_address
                    && gatewayMetaData.mac_address.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          gatewayMetaData.mac_address.help_text
                        }
                      />
                    )}
                  </Grid>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      id="custodian_uuid"
                      select
                      fullWidth
                      label="Custodian"
                      disabled={viewOnly}
                      error={
                    formError.custodian_uuid
                    && formError.custodian_uuid.error
                  }
                      helperText={
                    formError.custodian_uuid
                      ? formError.custodian_uuid.message
                      : ''
                  }
                      onBlur={(e) => handleBlur(e, 'required', custodian_uuid, 'custodian_uuid')}
                      value={custodian_uuid}
                      onChange={onInputChange}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {custodianList
                    && _.map(
                      _.orderBy(custodianList, ['name'], ['asc']),
                      (item, index) => (
                        <MenuItem
                          key={`custodian${index}:${item.id}`}
                          value={item.custodian_uuid}
                        >
                          {item.name}
                        </MenuItem>
                      ),
                    )}
                    </TextField>
                    {gatewayMetaData.custodian_uuid
                && gatewayMetaData.custodian_uuid.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      gatewayMetaData.custodian_uuid.help_text
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
                      {gatewayMetaData.last_known_location
                      && gatewayMetaData.last_known_location.help_text
                      && (
                        <CustomizedTooltips
                          toolTipText={
                            gatewayMetaData.last_known_location.help_text
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
                </Grid>
              </CardContent>
            </Card>

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
          </form>
        </FormModal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.optionsReducer.loading
    || state.custodianReducer.loading
    || state.itemsReducer.loading
  ),
});

export default connect(mapStateToProps)(AddGateway);
