import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
} from '@material-ui/core';
import RangeSlider from '@components/Slider/RangeSlider';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { UserContext } from '@context/User.context';
import { editShipment } from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  slider: {
    margin: 'auto',
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
  boxHeading: {
    margin: theme.spacing(2, 0),
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center',
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfEnvironmentLimitsEdited;

const EnvironmentalLimitsInfo = ({
  shipmentFormData,
  history,
  loading,
  dispatch,
  handleCancel,
  shipmentOptions,
  viewOnly,
  setConfirmModal,
  setConfirmModalFor,
}) => {
  const classes = useStyles();
  const [min_temp_val, changeMinTempVal] = useState(
    (shipmentFormData && shipmentFormData.min_excursion_temp) || 0,
  );
  const [max_temp_val, changeMaxTempVal] = useState(
    (shipmentFormData && shipmentFormData.max_excursion_temp) || 100,
  );
  const [minMaxTempValue, setMinMaxTempValue] = useState(
    shipmentFormData && [
      shipmentFormData.min_excursion_temp || 0,
      shipmentFormData.min_warning_temp || 35,
      shipmentFormData.max_warning_temp || 75,
      shipmentFormData.max_excursion_temp || 100,
    ],
  );
  const [low_temp_val, changeLowTempVal] = useState(
    (shipmentFormData && shipmentFormData.min_warning_temp) || 35,
  );
  const [high_temp_val, changeHighTempVal] = useState(
    (shipmentFormData && shipmentFormData.max_warning_temp) || 75,
  );

  const [min_humid_val, changeMinHumidVal] = useState(
    (shipmentFormData && shipmentFormData.min_excursion_humidity) || 0,
  );
  const [max_humid_val, changeMaxHumidVal] = useState(
    (shipmentFormData && shipmentFormData.max_excursion_humidity) || 100,
  );
  const [minMaxHumidValue, setMinMaxHumidValue] = useState(
    shipmentFormData && [
      shipmentFormData.min_excursion_humidity || 0,
      shipmentFormData.min_warning_humidity || 35,
      shipmentFormData.max_warning_humidity || 75,
      shipmentFormData.max_excursion_humidity || 100,
    ],
  );
  const [low_humid_val, changeLowHumidVal] = useState(
    (shipmentFormData && shipmentFormData.min_warning_humidity) || 35,
  );
  const [high_humid_val, changeHighHumidVal] = useState(
    (shipmentFormData && shipmentFormData.max_warning_humidity) || 75,
  );

  const [shipmentMetaData, setShipmentMetaData] = useState({});
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentOptions && shipmentOptions.actions) {
      setShipmentMetaData(shipmentOptions.actions.POST);
    }
  }, [shipmentOptions]);

  const handleTempMinMaxChange = (e, value) => {
    setMinMaxTempValue(value);
    changeMinTempVal(value[0]);
    changeMaxTempVal(value[3]);
    changeHighTempVal(value[2]);
    changeLowTempVal(value[1]);
  };

  const handleHumidMinMaxChange = (e, value) => {
    setMinMaxHumidValue(value);
    changeMinHumidVal(value[0]);
    changeMaxHumidVal(value[3]);
    changeHighHumidVal(value[2]);
    changeLowHumidVal(value[1]);
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const shipmentFormValue = {
      ...{
        ...shipmentFormData,
        max_warning_temp: high_temp_val,
        min_warning_temp: low_temp_val,
        max_excursion_temp: max_temp_val,
        min_excursion_temp: min_temp_val,
        max_warning_humidity: high_humid_val,
        min_warning_humidity: low_humid_val,
        max_excursion_humidity: max_humid_val,
        min_excursion_humidity: min_humid_val,
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
  };

  const shipmentFormMinMaxHumid = [
    shipmentFormData.min_excursion_humidity || 0,
    shipmentFormData.min_warning_humidity || 35,
    shipmentFormData.max_warning_humidity || 75,
    shipmentFormData.max_excursion_humidity || 100,
  ];

  const shipmentFormMinMaxTemp = [
    shipmentFormData.min_excursion_temp || 0,
    shipmentFormData.min_warning_temp || 35,
    shipmentFormData.max_warning_temp || 75,
    shipmentFormData.max_excursion_temp || 100,
  ];

  checkIfEnvironmentLimitsEdited = () => !(
    minMaxTempValue.length === shipmentFormMinMaxTemp.length
    && _.every(
      shipmentFormMinMaxTemp,
      (item) => _.indexOf(minMaxTempValue, item) > -1,
    )) || !(
    minMaxHumidValue.length === shipmentFormMinMaxHumid.length
    && _.every(
      shipmentFormMinMaxHumid,
      (item) => _.indexOf(minMaxHumidValue, item) > -1,
    ));

  const onCancelClick = () => {
    if (checkIfEnvironmentLimitsEdited() === true) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      handleCancel();
    }
  };

  const handleSliderUpdate = (event, type) => {
    const newValue = event.target.value || 0;
    const temp = minMaxTempValue;
    const humidity = minMaxHumidValue;

    switch (type) {
      case 'max_temp_val':
        changeMaxTempVal(newValue);
        temp[3] = parseFloat(newValue);
        setMinMaxTempValue(temp);
        break;

      case 'high_temp_val':
        changeHighTempVal(newValue);
        temp[2] = parseFloat(newValue);
        setMinMaxTempValue(temp);
        break;

      case 'low_temp_val':
        changeLowTempVal(newValue);
        temp[1] = parseFloat(newValue);
        setMinMaxTempValue(temp);
        break;

      case 'min_temp_val':
        changeMinTempVal(newValue);
        temp[0] = parseFloat(newValue);
        setMinMaxTempValue(temp);
        break;

      case 'max_humid_val':
        changeMaxHumidVal(newValue);
        humidity[3] = parseFloat(newValue);
        setMinMaxHumidValue(humidity);
        break;

      case 'high_humid_val':
        changeHighHumidVal(newValue);
        humidity[2] = parseFloat(newValue);
        setMinMaxHumidValue(humidity);
        break;

      case 'low_humid_val':
        changeLowHumidVal(newValue);
        humidity[1] = parseFloat(newValue);
        setMinMaxHumidValue(humidity);
        break;

      case 'min_humid_val':
        changeMinHumidVal(newValue);
        humidity[0] = parseFloat(newValue);
        setMinMaxHumidValue(humidity);
        break;

      default:
        break;
    }
  };

  return (
    <form
      className={classes.form}
      noValidate
      onSubmit={handleSubmit}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sm={6}>
          <Card variant="outlined">
            <Typography
              className={classes.boxHeading}
              variant="body2"
            >
              Temperature settings
            </Typography>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="max_temp_val"
                      label="Max"
                      name="max_temp_val"
                      autoComplete="max_temp_val"
                      value={max_temp_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'max_temp_val');
                      }}
                    />
                    {shipmentMetaData.max_excursion_temp
                    && shipmentMetaData.max_excursion_temp.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.max_excursion_temp.help_text
                        }
                      />
                    )}
                  </div>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="high_temp_val"
                      label="Warning high"
                      name="high_temp_val"
                      autoComplete="high_temp_val"
                      value={high_temp_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'high_temp_val');
                      }}
                    />
                    {shipmentMetaData.max_warning_temp
                    && shipmentMetaData.max_warning_temp.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.max_warning_temp.help_text
                        }
                      />
                    )}
                  </div>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="low_temp_val"
                      label="Warning low"
                      name="low_temp_val"
                      autoComplete="low_temp_val"
                      value={low_temp_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'low_temp_val');
                      }}
                    />
                    {shipmentMetaData.min_warning_temp
                    && shipmentMetaData.min_warning_temp.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.min_warning_temp.help_text
                        }
                      />
                    )}
                  </div>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="min_temp_val"
                      label="Min"
                      name="min_temp_val"
                      autoComplete="min_temp_val"
                      value={min_temp_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'min_temp_val');
                      }}
                    />
                    {shipmentMetaData.min_excursion_temp
                    && shipmentMetaData.min_excursion_temp.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.min_excursion_temp.help_text
                        }
                      />
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  className={classes.slider}
                >
                  <RangeSlider
                    value={minMaxTempValue}
                    disabled={viewOnly}
                    orientation="vertical"
                    handleSliderChange={handleTempMinMaxChange}
                    rangeText=""
                    step={0.1}
                    max={minMaxTempValue[3]}
                    min={minMaxTempValue[0]}
                    marks={[
                      {
                        value: 0,
                        label: '0°',
                      },
                      {
                        value: 100,
                        label: '100°',
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sm={6}>
          <Card variant="outlined">
            <Typography
              className={classes.boxHeading}
              variant="body2"
            >
              Humidity settings (%)
            </Typography>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="max_humid_val"
                      label="Max"
                      name="max_humid_val"
                      autoComplete="max_humid_val"
                      value={max_humid_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'max_humid_val');
                      }}
                    />
                    {shipmentMetaData.max_excursion_humidity
                    && shipmentMetaData.max_excursion_humidity.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.max_excursion_humidity.help_text
                        }
                      />
                    )}
                  </div>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="high_humid_val"
                      label="Warning high"
                      name="high_humid_val"
                      autoComplete="high_humid_val"
                      value={high_humid_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'high_humid_val');
                      }}
                    />
                    {shipmentMetaData.max_warning_humidity
                    && shipmentMetaData.max_warning_humidity.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.max_warning_humidity.help_text
                        }
                      />
                    )}
                  </div>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="low_humid_val"
                      label="Warning low"
                      name="low_humid_val"
                      autoComplete="low_humid_val"
                      value={low_humid_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'low_humid_val');
                      }}
                    />
                    {shipmentMetaData.min_warning_humidity
                    && shipmentMetaData.min_warning_humidity.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.min_warning_humidity.help_text
                        }
                      />
                    )}
                  </div>
                  <div className={classes.inputWithTooltip}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="min_humid_val"
                      label="Min"
                      name="min_humid_val"
                      autoComplete="min_humid_val"
                      value={min_humid_val}
                      disabled={viewOnly}
                      onChange={(e) => {
                        handleSliderUpdate(e, 'min_humid_val');
                      }}
                    />
                    {shipmentMetaData.min_excursion_humidity
                    && shipmentMetaData.min_excursion_humidity.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          shipmentMetaData.min_excursion_humidity.help_text
                        }
                      />
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  className={classes.slider}
                >
                  <RangeSlider
                    value={minMaxHumidValue}
                    disabled={viewOnly}
                    orientation="vertical"
                    handleSliderChange={handleHumidMinMaxChange}
                    rangeText=""
                    step={0.1}
                    max={minMaxHumidValue[3]}
                    min={minMaxHumidValue[0]}
                    marks={[
                      {
                        value: 0,
                        label: '0%',
                      },
                      {
                        value: 100,
                        label: '100%',
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        justify="center"
        className={classes.buttonContainer}
      >
        <Grid item xs={6} sm={4}>
          {!viewOnly && (
            <div className={classes.loadingWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={viewOnly || loading}
                className={classes.submit}
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
        <Grid item xs={6} sm={4}>
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
        </Grid>
      </Grid>
    </form>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.shipmentReducer,
  ...state.optionsReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.shipmentReducer.loading
    || state.optionsReducer.loading
  ),
});

export default connect(mapStateToProps)(EnvironmentalLimitsInfo);
