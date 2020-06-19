import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { validators } from "../../../utils/validators";
import Modal from "../../../components/Modal/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import { useInput } from "../../../hooks/useInput";
import Loader from "../../../components/Loader/Loader";
import { Card, CardContent, Typography } from "@material-ui/core";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import RangeSlider from "../../../components/Slider/RangeSlider";

const useStyles = makeStyles((theme) => ({
  slider: {
    margin: "auto",
  },
}));

function EnvironmentalLimitsForm({
  isSubmitDisabled,
  min_temp_val,
  max_temp_val,
  changeMinTempVal,
  changeMaxTempVal,
  closeModal,
  parentClasses,
  loading,
  minMaxTempValue,
  setMinMaxTempValue,
  low_temp_val,
  high_temp_val,
  changeLowTempVal,
  changeHighTempVal,
  highLowTempValue,
  setHighLowTempValue,
}) {
  const theme = useTheme();
  const classes = useStyles();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleTempMinMaxChange = (e, value) => {
    console.log("val", value);
    setMinMaxTempValue(value);
    changeMinTempVal(value[0]);
    changeMaxTempVal(value[3]);
    changeHighTempVal(value[2]);
    changeMinTempVal(value[1]);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item sm={12} md={6} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item sm={6} md={6} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="min_temp_val"
                    label="Min"
                    name="min_temp_val"
                    autoComplete="min_temp_val"
                    value={min_temp_val}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="max_temp_val"
                    label="Max"
                    name="max_temp_val"
                    autoComplete="max_temp_val"
                    value={max_temp_val}
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
                    // {...last_known_location.bind}
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
                  />
                </Grid>
                <Grid item sm={12} md={6} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item sm={12} className={classes.slider}>
                      <RangeSlider
                        value={minMaxTempValue}
                        handleSliderChange={handleTempMinMaxChange}
                        rangeText={""}
                        max={minMaxTempValue[3]}
                        min={minMaxTempValue[0]}
                        marks={[
                          {
                            value: 0,
                            label: `0°F`,
                          },

                          {
                            value: 100,
                            label: `100°F`,
                          },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={6} sm={6}>
          <Card variant="outlined">
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="center">
        <Grid item xs={6} sm={4}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => closeModal(false)}
            className={parentClasses.submit}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sm={4}>
          <div className={parentClasses.loadingWrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={parentClasses.submit}
              disabled={isSubmitDisabled}
            >
              Submit
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                className={parentClasses.buttonProgress}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(EnvironmentalLimitsForm);
