import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  InputAdornment,
} from "@material-ui/core";
import RangeSlider from "../../../components/Slider/RangeSlider";
import { validators } from "../../../utils/validators";
import { editShipment } from "../../../redux/shipment/actions/shipment.actions";
import { routes } from "../../../routes/routesConstants";
import CustomizedTooltips from "../../../components/ToolTip/ToolTip";

const useStyles = makeStyles((theme) => ({
  slider: {
    margin: "auto",
  },
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
    justifyContent: "center",
  },
  alignRight: {
    marginLeft: "auto",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    // margin: theme.spacing(1),
    position: "relative",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
  },
  submit: {
    borderRadius: "18px",
    fontSize: 11,
  },
  boxHeading: {
    margin: theme.spacing(2, 0),
    fontWeight: "bold",
    fontSize: "14px",
    textAlign: "center",
  },
}));

function EnvironmentalLimitsInfo(props) {
  const {
    handleNext,
    shipmentFormData,
    history,
    loading,
    dispatch,
    redirectTo,
    handleCancel,
    location,
    shipmentOptions,
  } = props;
  const theme = useTheme();
  const classes = useStyles();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [min_temp_val, changeMinTempVal] = useState(
    (shipmentFormData && shipmentFormData.min_excursion_temp) || 0
  );
  const [max_temp_val, changeMaxTempVal] = useState(
    (shipmentFormData && shipmentFormData.max_excursion_temp) || 100
  );
  const [minMaxTempValue, setMinMaxTempValue] = useState(
    shipmentFormData && [
      shipmentFormData.min_excursion_temp || 0,
      shipmentFormData.min_warning_temp || 35,
      shipmentFormData.max_warning_temp || 75,
      shipmentFormData.max_excursion_temp || 100,
    ]
  );
  const [low_temp_val, changeLowTempVal] = useState(
    (shipmentFormData && shipmentFormData.min_warning_temp) || 35
  );
  const [high_temp_val, changeHighTempVal] = useState(
    (shipmentFormData && shipmentFormData.max_warning_temp) || 75
  );

  const [min_humid_val, changeMinHumidVal] = useState(
    (shipmentFormData && shipmentFormData.min_excursion_humidity) || 0
  );
  const [max_humid_val, changeMaxHumidVal] = useState(
    (shipmentFormData && shipmentFormData.max_excursion_humidity) || 100
  );
  const [minMaxHumidValue, setMinMaxHumidValue] = useState(
    shipmentFormData && [
      shipmentFormData.min_excursion_humidity || 0,
      shipmentFormData.min_warning_humidity || 35,
      shipmentFormData.max_warning_humidity || 75,
      shipmentFormData.max_excursion_humidity || 100,
    ]
  );
  const [low_humid_val, changeLowHumidVal] = useState(
    (shipmentFormData && shipmentFormData.min_warning_humidity) || 35
  );
  const [high_humid_val, changeHighHumidVal] = useState(
    (shipmentFormData && shipmentFormData.max_warning_humidity) || 75
  );

  const [shipmentMetaData, setShipmentMetaData] = useState({});

  useEffect(() => {
    console.log("shipmentOptions", shipmentOptions);
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

  const submitDisabled = () => {
    if (!gatewayId || gatewayData === null) return true;
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
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`
      )
    );
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sm={6}>
          <Card variant="outlined">
            <Typography className={classes.boxHeading} variant="body2">
              Temperature Settings
            </Typography>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="max_temp_val"
                    label="Max"
                    name="max_temp_val"
                    autoComplete="max_temp_val"
                    value={max_temp_val}
                    InputProps={
                      shipmentMetaData["max_excursion_temp"] &&
                      shipmentMetaData["max_excursion_temp"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["max_excursion_temp"]
                              .help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["max_excursion_temp"]
                                    .help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="high_temp_val"
                    label="Warning High"
                    name="high_temp_val"
                    autoComplete="high_temp_val"
                    value={high_temp_val}
                    // {...last_known_location.bind}
                    InputProps={
                      shipmentMetaData["max_warning_temp"] &&
                      shipmentMetaData["max_warning_temp"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["max_warning_temp"].help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["max_warning_temp"].help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="low_temp_val"
                    label="Warning Low"
                    name="low_temp_val"
                    autoComplete="low_temp_val"
                    value={low_temp_val}
                    InputProps={
                      shipmentMetaData["min_warning_temp"] &&
                      shipmentMetaData["min_warning_temp"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["min_warning_temp"].help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["min_warning_temp"].help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                    // {...last_known_location.bind}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="min_temp_val"
                    label="Min"
                    name="min_temp_val"
                    autoComplete="min_temp_val"
                    value={min_temp_val}
                    InputProps={
                      shipmentMetaData["min_excursion_temp"] &&
                      shipmentMetaData["min_excursion_temp"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["min_excursion_temp"]
                              .help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["min_excursion_temp"]
                                    .help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                  />
                </Grid>
                <Grid item xs={6} className={classes.slider}>
                  <RangeSlider
                    value={minMaxTempValue}
                    orientation={"vertical"}
                    handleSliderChange={handleTempMinMaxChange}
                    rangeText={""}
                    max={minMaxTempValue[3]}
                    min={minMaxTempValue[0]}
                    marks={[
                      {
                        value: 0,
                        label: `0°`,
                      },

                      {
                        value: 100,
                        label: `100°`,
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
            <Typography className={classes.boxHeading} variant="body2">
              Humidity Settings(%)
            </Typography>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="max_humid_val"
                    label="Max"
                    name="max_humid_val"
                    autoComplete="max_humid_val"
                    value={max_humid_val}
                    InputProps={
                      shipmentMetaData["max_excursion_humidity"] &&
                      shipmentMetaData["max_excursion_humidity"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["max_excursion_humidity"]
                              .help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["max_excursion_humidity"]
                                    .help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="high_humid_val"
                    label="Warning High"
                    name="high_humid_val"
                    autoComplete="high_humid_val"
                    value={high_humid_val}
                    InputProps={
                      shipmentMetaData["max_warning_humidity"] &&
                      shipmentMetaData["max_warning_humidity"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["max_warning_humidity"]
                              .help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["max_warning_humidity"]
                                    .help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                    // {...last_known_location.bind}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="low_humid_val"
                    label="Warning Low"
                    name="low_humid_val"
                    autoComplete="low_humid_val"
                    value={low_humid_val}
                    InputProps={
                      shipmentMetaData["min_warning_humidity"] &&
                      shipmentMetaData["min_warning_humidity"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["min_warning_humidity"]
                              .help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["min_warning_humidity"]
                                    .help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                    // {...last_known_location.bind}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="min_humid_val"
                    label="Min"
                    name="min_humid_val"
                    autoComplete="min_humid_val"
                    value={min_humid_val}
                    InputProps={
                      shipmentMetaData["min_excursion_humidity"] &&
                      shipmentMetaData["min_excursion_humidity"].help_text && {
                        endAdornment: (
                          <InputAdornment position="end">
                            {shipmentMetaData["min_excursion_humidity"]
                              .help_text && (
                              <CustomizedTooltips
                                toolTipText={
                                  shipmentMetaData["min_excursion_humidity"]
                                    .help_text
                                }
                              />
                            )}
                          </InputAdornment>
                        ),
                      }
                    }
                  />
                </Grid>
                <Grid item xs={6} className={classes.slider}>
                  <RangeSlider
                    value={minMaxHumidValue}
                    orientation={"vertical"}
                    handleSliderChange={handleHumidMinMaxChange}
                    rangeText={""}
                    max={minMaxHumidValue[3]}
                    min={minMaxHumidValue[0]}
                    marks={[
                      {
                        value: 0,
                        label: `0%`,
                      },

                      {
                        value: 100,
                        label: `100%`,
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
          <div className={classes.loadingWrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {`Save`}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </Grid>
      </Grid>
    </form>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(EnvironmentalLimitsInfo);
