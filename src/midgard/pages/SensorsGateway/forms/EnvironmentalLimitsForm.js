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
import { Card, CardContent, Typography, Paper } from "@material-ui/core";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import RangeSlider from "../../../components/Slider/RangeSlider";
import SearchModal from "../../../components/Modal/SearchModal";
import Gateway from "../Gateway/Gateway";
import Chip from "@material-ui/core/Chip";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { associatedGatewayMock } from "../../../utils/mock";

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
  searchModalOpen,
  setSearchModalOpen,
  associatedGateway,
  setAccociatedGateway,
  min_humid_val,
  max_humid_val,
  low_humid_val,
  high_humid_val,
  minMaxHumidValue,
  setMinMaxHumidValue,
  changeMinHumidVal,
  changeMaxHumidVal,
  changeHighHumidVal,
  changeLowHumidVal,
}) {
  const theme = useTheme();
  const classes = useStyles();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDelete = (chipToDelete) => () => {
    setAccociatedGateway((chips) =>
      chips.filter((chip) => chip.uuid !== chipToDelete.uuid)
    );
  };

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

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sm={6}>
          <Card variant="outlined">
            <Typography variant="body2">Temprature Settings(°F)</Typography>
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
                    id="min_temp_val"
                    label="Min"
                    name="min_temp_val"
                    autoComplete="min_temp_val"
                    value={min_temp_val}
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
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sm={6}>
          <Card variant="outlined">
            <Typography variant="body2">Humidity Settings(%)</Typography>
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
                        label: `0`,
                      },

                      {
                        value: 100,
                        label: `100`,
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => setSearchModalOpen(true)}
            className={parentClasses.submit}
          >
            Associate to Gateway
          </Button>
        </Grid>

        <Grid item xs={12}>
          {associatedGateway.length > 0 && (
            <ul className={classes.root}>
              {associatedGateway.map((data) => {
                return (
                  <li key={data.uuid}>
                    <Chip
                      label={data.uuid}
                      onDelete={handleDelete(data)}
                      className={classes.chip}
                    />
                  </li>
                );
              })}
            </ul>
          )}
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
      {searchModalOpen && (
        <SearchModal
          open={searchModalOpen}
          setOpen={setSearchModalOpen}
          title={"Associate Gateway UUID"}
          submitText={"Save"}
          submitAction={setAccociatedGateway}
          selectedList={associatedGateway}
          listOfItems={associatedGatewayMock}
          searchFieldLabel={"Select Gateway UUID"}
          searchFieldPlaceHolder={"Select the Value"}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(EnvironmentalLimitsForm);
