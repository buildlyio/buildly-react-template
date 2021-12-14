import React, { useState, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  TextField,
  Box,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
  MenuItem,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from '@material-ui/icons';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { UserContext } from '@context/User.context';
import {
  getFormattedRow,
  getFormattedSensorRow,
  getAvailableGateways,
} from '@pages/SensorsGateway/Constants';
import {
  SENSOR_PLATFORM,
} from '@utils/mock';
import { setOptionsData } from '@utils/utilMethods';
import { editGateway } from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import { editShipment } from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';
import { gatewayColumns, sensorsColumns } from '../ShipmentConstants';

const useStyles = makeStyles((theme) => ({
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
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfSensorGatewayEdited = () => false;

const SensorsGatewayInfo = ({
  gatewayData,
  gatewayTypeList,
  shipmentData,
  history,
  loading,
  handleNext,
  handleCancel,
  shipmentFormData,
  dispatch,
  sensorData,
  sensorTypeList,
  viewOnly,
  setConfirmModal,
  setConfirmModalFor,
  timezone,
  shipmentOptions,
}) => {
  const classes = useStyles();
  const [gatewayIds, setGatewayIds] = useState(
    (shipmentFormData && shipmentFormData.gateway_ids) || [],
  );
  const [platform_name, setPlatformName] = useState(
    (shipmentFormData && shipmentFormData.platform_name) || 'tive',
  );
  const [options, setOptions] = useState([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const organization = useContext(UserContext).organization.organization_uuid;
  const [fieldsMetadata, setFieldsMetaData] = useState({
    platform_name: '',
  });

  let rows = [];
  let sensorsRow = [];

  if (gatewayData && gatewayData.length) {
    let selectedRows = [];
    let selectedSensors = [];
    _.forEach(gatewayData, (element) => {
      if (_.indexOf(gatewayIds, element.gateway_uuid) !== -1) {
        selectedRows = [...selectedRows, element];
        if (sensorData && sensorData.length) {
          _.forEach(sensorData, (sensor) => {
            if (element.url === sensor.gateway) {
              selectedSensors = [...selectedSensors, sensor];
            }
          });
        }
      }
    });
    rows = getFormattedRow(selectedRows, gatewayTypeList, shipmentData);
    sensorsRow = getFormattedSensorRow(selectedSensors, sensorTypeList);
  }

  useEffect(() => {
    const metadata = { ...fieldsMetadata };
    if (shipmentOptions && shipmentOptions.actions) {
      metadata.platform_name = setOptionsData(
        shipmentOptions.actions.POST,
        'platform_name',
      );
    }
    if (
      gatewayData
      && gatewayData.length
      && gatewayTypeList
      && gatewayTypeList.length
      && shipmentData
      && shipmentData.length
    ) {
      const opts = getAvailableGateways(
        gatewayData,
        platform_name
          ?  _.lowerCase(platform_name)
          : 'tive',
        gatewayTypeList,
        shipmentData,
      );
      setOptions(opts);
    }
  }, [gatewayData, platform_name, gatewayTypeList, shipmentData]);

  const onInputChange = (value) => {
    switch (true) {
      case (value.length > gatewayIds.length):
        setGatewayIds([...gatewayIds, _.last(value).gateway_uuid]);
        break;

      case (value.length < gatewayIds.length):
        setGatewayIds(value);
        break;

      default:
        break;
    }
  };

  const submitDisabled = () => !gatewayIds.length || gatewayData === null;

  // eslint-disable-next-line max-len
  checkIfSensorGatewayEdited = () => {
    if (gatewayIds.length) {
      return shipmentFormData.gateway_ids
        ? !!(gatewayIds.length !== shipmentFormData.gateway_ids.length) : true;
    }
    return false;
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const updateGateway = _.find(gatewayData, { gateway_uuid: gatewayIds[0] });
    const shipmentFormValue = {
      ...{
        ...shipmentFormData,
        platform_name,
        gateway_ids: gatewayIds,
        gateway_imei: [updateGateway.imei_number],
      },
    };
    dispatch(
      editShipment(
        shipmentFormValue,
        history,
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`,
        organization,
      ),
    );
    dispatch(editGateway({
      ...updateGateway,
      gateway_status: 'assigned',
      shipment_ids: [shipmentFormData.id],
    }));
  };

  const onNextClick = (event) => {
    if (checkIfSensorGatewayEdited()) {
      handleSubmit(event);
    }
    handleNext();
  };

  const onCancelClick = () => {
    if (checkIfSensorGatewayEdited()) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      handleCancel();
    }
  };

  return (
    <Box mb={5} mt={3}>
      <form noValidate onSubmit={handleSubmit}>
        <Card variant="outlined" className={classes.form}>
          <CardContent>
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
                  id="platform_name"
                  select
                  label="Sensor Platform"
                  disabled={
                        viewOnly
                        || !!(shipmentFormData && shipmentFormData.platform_name)
                      }
                  value={platform_name}
                  onChange={(e) => setPlatformName(e.target.value)}
                  helperText={
                        shipmentFormData && shipmentFormData.platform_name
                          ? 'Once set, platform cannot be edited.'
                          : 'Platform can be set just once.'
                      }
                >
                  <MenuItem value="">Select</MenuItem>
                  {SENSOR_PLATFORM
                      && _.map(
                        _.orderBy(SENSOR_PLATFORM, ['value'], ['asc']),
                        (item, index) => (
                          <MenuItem
                            key={`sensorPlatform${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                </TextField>
                {fieldsMetadata.platform_name.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          fieldsMetadata.platform_name.help_text
                        }
                      />
                    )}
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="combo-box-demo"
                  disabled={
                    viewOnly
                    || (shipmentFormData
                      && shipmentFormData.gateway_ids
                      && shipmentFormData.gateway_ids.length > 0
                    )
                  }
                  options={options}
                  getOptionLabel={(option) => (
                    option
                    && option.name
                  )}
                  getOptionSelected={(option, value) => (
                    option.gateway_uuid === value
                  )}
                  filterSelectedOptions
                  value={gatewayIds}
                  onChange={(event, newValue) => onInputChange(newValue)}
                  renderTags={(value, getTagProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={
                          gatewayData
                            ? _.find(gatewayData, { gateway_uuid: option })?.name
                            : ''
                        }
                        {...getTagProps({ index })}
                      />
                    ))
                  )}
                  renderOption={(option, { selected }) => (
                    <>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      disabled={viewOnly}
                      label="Associate to Gateway"
                      variant="outlined"
                      placeholder="Select a Gateway"
                      helperText={
                        shipmentFormData
                        && shipmentFormData.gateway_ids
                        && shipmentFormData.gateway_ids.length === 0
                          ? '**You can attach gateway/sensor only once per shipment.'
                          : '**In case you want to change the gateway/sensor, please cancel this shipment and create a new one.'
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box mt={3} mb={5}>
          <Grid container>
            {rows.length > 0 && (
              <Grid item xs={12}>
                <Box mt={5}>
                  <Typography gutterBottom variant="h5">
                    Associated Gateways
                  </Typography>
                  <DataTableWrapper
                    loading={loading}
                    rows={rows}
                    columns={gatewayColumns(timezone)}
                    hideAddButton
                    noOptionsIcon
                    noSpace
                  />
                </Box>
              </Grid>
            )}
            {sensorsRow.length > 0 && (
              <Grid item xs={12}>
                <Box mt={5}>
                  <Typography gutterBottom variant="h5">
                    Associated Sensors with Gateway
                  </Typography>
                  <DataTableWrapper
                    loading={loading}
                    rows={sensorsRow}
                    columns={sensorsColumns(timezone)}
                    hideAddButton
                    noOptionsIcon
                    noSpace
                  />
                </Box>
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
              className={classes.submit}
            >
              Save & Next: Environmental Limits
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.shipmentReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.shipmentReducer.loading
  ),
});

export default connect(mapStateToProps)(SensorsGatewayInfo);
