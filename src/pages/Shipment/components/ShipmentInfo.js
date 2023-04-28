import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DatePickerComponent from '../../../components/DatePicker/DatePicker';
import CustomizedTooltips from '../../../components/ToolTip/ToolTip';
import { UserContext } from '../../../context/User.context';
import { useInput } from '../../../hooks/useInput';
import {
  editShipment,
  addShipment,
  saveShipmentFormData,
} from '../../../redux/shipment/actions/shipment.actions';
import { routes } from '../../../routes/routesConstants';
import {
  SHIPMENT_STATUS,
  TRANSPORT_MODE,
} from '../../../utils/mock';
import { setOptionsData } from '../../../utils/utilMethods';
import { validators } from '../../../utils/validators';
import ShipmentRouteInfo from './ShipmentRouteInfo';
import { editGateway } from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import Loader from '@components/Loader/Loader';
import { getUnitOfMeasure } from '@redux/items/actions/items.actions';

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
    borderRadius: '18px',
    fontSize: 11,
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
    justifyContent: 'center',
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
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfShipmentInfoEdited;

const ShipmentInfo = (props) => {
  const {
    handleNext,
    shipmentFormData,
    history,
    loading,
    dispatch,
    handleCancel,
    location,
    shipmentOptions,
    viewOnly,
    setConfirmModal,
    setConfirmModalFor,
    timezone,
    gatewayData,
    unitOfMeasure,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const editPage = location.state && location.state.type === 'edit';
  const editData = location.state && location.state.data;
  const copyData = (location.state
    && location.state.type === 'copy'
    && location.state.data) || {};

  const shipment_name = useInput(
    (editData && editData.name) || '',
    { required: true },
  );
  const carrier = useInput(
    (editData && editData.bol_order_id) || '',
  );
  // const load_no = useInput('');
  const shipment_status = useInput(
    (editData && editData.status) || _.find(SHIPMENT_STATUS, { label: 'Planned' }).value,
    { required: true },
  );
  const route_desc = useInput(
    (editData && editData.route_description) || '',
  );
  const mode_type = useInput(
    (editData && editData.transport_mode) || _.find(TRANSPORT_MODE, { label: 'Land Road' }).value,
  );
  const route_dist = useInput('');
  const [scheduled_departure, handleDepartureDateChange] = useState(
    (editData && editData.estimated_time_of_departure)
    || new Date(),
  );
  const [scheduled_arrival, handleScheduledDateChange] = useState(
    (editData && editData.estimated_time_of_arrival)
    || new Date(),
  );

  const [formError, setFormError] = useState({});
  const [fieldsMetadata, setFieldsMetaData] = useState({
    shipment_name: '',
    shipment_status: '',
    carrier: '',
    route_desc: '',
    mode_type: '',
    scheduled_departure: '',
    scheduled_arrival: '',
  });

  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (editPage || shipmentFormData === null) {
      dispatch(saveShipmentFormData(editData));
    }
  }, []);

  useEffect(() => {
    const metadata = { ...fieldsMetadata };
    if (shipmentOptions && shipmentOptions.actions) {
      metadata.shipment_name = setOptionsData(
        shipmentOptions.actions.POST,
        'name',
      );
      metadata.shipment_status = setOptionsData(
        shipmentOptions.actions.POST,
        'status',
      );
      metadata.route_desc = setOptionsData(
        shipmentOptions.actions.POST,
        'route_description',
      );
      metadata.carrier = setOptionsData(
        shipmentOptions.actions.POST,
        'carrier',
      );
      metadata.mode_type = setOptionsData(
        shipmentOptions.actions.POST,
        'transport_mode',
      );
      metadata.scheduled_departure = setOptionsData(
        shipmentOptions.actions.POST,
        'estimated_time_of_departure',
      );
      metadata.scheduled_arrival = setOptionsData(
        shipmentOptions.actions.POST,
        'estimated_time_of_arrival',
      );
    }

    setFieldsMetaData(metadata);
  }, [shipmentOptions]);

  useEffect(() => {
    if (!unitOfMeasure) {
      dispatch(getUnitOfMeasure(organization));
    }
  }, []);

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
    if (!shipment_name.value) {
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

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const shipmentFormValue = {
      ...copyData,
      name: shipment_name.value,
      status: shipment_status.value ? shipment_status.value : 'Planned',
      carrier: carrier.value ? [carrier.value] : [],
      route_description: route_desc.value,
      transport_mode: mode_type.value,
      estimated_time_of_arrival: scheduled_arrival,
      estimated_time_of_departure: scheduled_departure,
      ...(editData && { id: editData.id }),
      items: (editData && editData.items) || [],
      gateway_ids: (editData && editData.gateway_ids) || [],
      sensor_report_ids: (
        editData
        && editData.sensor_report_ids
      ) || [],
      wallet_ids: (editData && editData.wallet_ids) || [],
      custodian_ids: (editData && editData.custodian_ids) || [],
      organization_uuid: organization,
      // platform_name,
    };

    if (editPage && editData) {
      if (shipmentFormValue.gateway_ids.length > 0) {
        let gateway_status = null;
        let shipment_ids = [];
        let attachedGateway = null;
        attachedGateway = _.filter(
          gatewayData, (gateway) => gateway.gateway_uuid === shipmentFormValue.gateway_ids[0],
        );
        if (shipmentFormValue.status === 'Completed' || shipmentFormValue.status === 'Cancelled') {
          gateway_status = 'unavailable';
        } else if (shipmentFormValue.status === 'Enroute' && shipmentFormValue.gateway_ids.length > 0) {
          gateway_status = 'assigned';
          shipment_ids = [shipmentFormValue.id];
        }

        if (gateway_status === null) {
          gateway_status = attachedGateway[0].gateway_status;
        }

        const updatedGatewayData = {
          ...attachedGateway[0],
          gateway_status,
          shipment_ids,
        };

        dispatch(
          editShipment(
            shipmentFormValue,
            history,
            `${routes.SHIPMENT}/edit/:${editData.id}`,
            organization,
            updatedGatewayData,
          ),
        );
        dispatch(editGateway(updatedGatewayData));
      } else {
        dispatch(
          editShipment(
            shipmentFormValue,
            history,
            `${routes.SHIPMENT}/edit/:${editData.id}`,
            organization,
            null,
          ),
        );
      }
    } else {
      dispatch(addShipment(shipmentFormValue, history, null, organization));
    }
  };

  checkIfShipmentInfoEdited = () => (
    shipment_name.hasChanged()
    || carrier.hasChanged()
    // || load_no.hasChanged()
    || shipment_status.hasChanged()
    || route_desc.hasChanged()
    || mode_type.hasChanged()
    || route_dist.hasChanged()
  );

  const onNextClick = (event) => {
    if (checkIfShipmentInfoEdited() === true) {
      handleSubmit(event);
    }
    handleNext();
  };

  const onCancelClick = () => {
    if (checkIfShipmentInfoEdited() === true) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      handleCancel();
    }
  };

  return (
    <>
      <div>
        {loading && <Loader open={loading} />}
        {!isDesktop && (
          <Box mb={2}>
            <Typography variant="h4">
              Shipment Details (1/5)
            </Typography>
          </Box>
        )}
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  padding: '8px',
                }}
              >
                <Grid
                  container
                  spacing={isDesktop ? 2 : 0}
                >
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="shipment_name"
                      label="Shipment name"
                      name="shipment_name"
                      autoComplete="shipment_name"
                      disabled={viewOnly}
                      error={
                        formError.shipment_name
                        && formError.shipment_name.error
                      }
                      helperText={
                        formError.shipment_name
                          ? formError.shipment_name.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', shipment_name)}
                      {...shipment_name.bind}
                    />
                    {fieldsMetadata.shipment_name.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          fieldsMetadata.shipment_name.help_text
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
                      fullWidth
                      id="carrier"
                      label="Lading Bill"
                      name="carrier"
                      autoComplete="carrier"
                      disabled={viewOnly}
                      {...carrier.bind}
                    />
                    {fieldsMetadata.carrier.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          fieldsMetadata.carrier.help_text
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
                      fullWidth
                      required
                      id="mode_type"
                      select
                      label="Mode type"
                      disabled={viewOnly}
                      {...mode_type.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {TRANSPORT_MODE
                      && _.map(
                        _.orderBy(TRANSPORT_MODE, ['value'], ['asc']),
                        (item, index) => (
                          <MenuItem
                            key={`transportMode${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                    {fieldsMetadata.mode_type.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          fieldsMetadata.mode_type.help_text
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
                      fullWidth
                      multiline
                      rows={6}
                      id="route_desc"
                      label="Route description"
                      name="route_desc"
                      autoComplete="route_desc"
                      disabled={viewOnly}
                      {...route_desc.bind}
                    />
                    {fieldsMetadata.route_desc.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          fieldsMetadata.route_desc.help_text
                        }
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  padding: '8px',
                }}
              >
                <Grid container spacing={2}>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="shipment_status"
                      name="shipment_status"
                      select
                      label="Shipment status"
                      disabled={viewOnly}
                      {...shipment_status.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {SHIPMENT_STATUS
                      && _.map(
                        _.orderBy(SHIPMENT_STATUS, ['value'], ['asc']),
                        (item, index) => (
                          <MenuItem
                            key={`shipmentStatus${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                    {fieldsMetadata.shipment_status.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          fieldsMetadata.shipment_status.help_text
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <DatePickerComponent
                      label="Scheduled departure"
                      selectedDate={
                        moment(scheduled_departure).tz(timezone)
                      }
                      hasTime
                      handleDateChange={handleDepartureDateChange}
                      disabled={viewOnly}
                      helpText={
                        fieldsMetadata.scheduled_departure
                        && fieldsMetadata.scheduled_departure.help_text
                          ? fieldsMetadata.scheduled_departure.help_text
                          : ''
                      }
                      dateFormat={
                        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                          : ''
                      }
                      timeFormat={
                        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                          : ''
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePickerComponent
                      label="Scheduled arrival"
                      selectedDate={
                        moment(scheduled_arrival).tz(timezone)
                      }
                      hasTime
                      handleDateChange={handleScheduledDateChange}
                      disabled={viewOnly}
                      helpText={
                        fieldsMetadata.scheduled_arrival
                        && fieldsMetadata.scheduled_arrival.help_text
                          ? fieldsMetadata.scheduled_arrival.help_text
                          : ''
                      }
                      dateFormat={
                        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                          : ''
                      }
                      timeFormat={
                        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                          : ''
                      }
                    />
                  </Grid>

                </Grid>
              </Grid>
              {(shipmentFormData || editPage) && (
                <Grid item xs={12}>
                  <ShipmentRouteInfo {...props} />
                </Grid>
              )}
            </Grid>
          </Box>
          <Grid
            container
            spacing={3}
            className={classes.buttonContainer}
          >
            <Grid item xs={6} sm={2}>
              {viewOnly ? (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onCancelClick}
                >
                  Done
                </Button>
              ) : (
                <div className={classes.loadingWrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading || submitDisabled()}
                  >
                    Save
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onNextClick}
                disabled={!editPage}
                className={classes.submit}
              >
                Save & Next: Shipment Key
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.itemsReducer,
  ...state.custodianReducer,
  ...state.optionsReducer,
  ...state.sensorsGatewayReducer,
  loading: (
    state.shipmentReducer.loading
    || state.itemsReducer.loading
    || state.custodianReducer.loading
    || state.optionsReducer.loading
    || state.sensorsGatewayReducer.loading
  ),
});

export default connect(mapStateToProps)(ShipmentInfo);
