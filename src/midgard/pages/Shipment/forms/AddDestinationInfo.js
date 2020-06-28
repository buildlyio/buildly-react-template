import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { validators } from "../../../utils/validators";
import Modal from "../../../components/Modal/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useInput } from "../../../hooks/useInput";
import Loader from "../../../components/Loader/Loader";
import { dispatch } from "../../../redux/store";
import { STATE_CHOICES, COUNTRY_CHOICES } from "../../../utils/mock";
import { routes } from "../../../routes/routesConstants";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
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
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
  },
  logo: {
    width: "100%",
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
  addressContainer: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

function AddDestinationInfo({
  dispatch,
  loading,
  history,
  loaded,
  error,
  location,
}) {
  const editPage = location.state && location.state.type === "edit";
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();
  const company = useInput("", {
    required: true,
  });
  const alias = useInput("");
  const custodianType = useInput("", {
    required: true,
  });
  const consortium = useInput("");
  const glnNumber = useInput("");
  const address = useInput("", {
    required: true,
  });
  const city = useInput("");
  const state = useInput("", {
    required: true,
  });
  const country = useInput("", {
    required: true,
  });
  const zip = useInput("");
  const address_1 = useInput("", {
    required: true,
  });
  const address_2 = useInput("");
  const [scheduled_arrival, handleDateChange] = useState(moment());
  const [formError, setFormError] = useState({});

  const buttonText = "Save & Close";
  const formTitle = "Add Destination Info (3/3)";
  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) history.push(location.state.from);
    else history.push(`${routes.SHIPMENT}/add`);
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
    let validateObj = validators(validation, input);
    let prevState = { ...formError };
    if (validateObj && validateObj.error)
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    else
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: "",
        },
      });
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(formError);
    let errorExists = false;
    if (!company.value || !address_1.value || !state.value || !country.value)
      return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const onNextClick = (e) => {
    history.push(`${routes.SHIPMENT}/add`, {
      from: `${routes.SHIPMENT}/add`,
    });
  };

  const handleBack = () => {
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth={"md"}
        >
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="company"
                  label="Destination Company"
                  name="company"
                  autoComplete="company"
                  error={formError.company && formError.company.error}
                  helperText={
                    formError.company ? formError.company.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", company)}
                  {...company.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label={"Scheduled Arrival"}
                  selectedDate={scheduled_arrival}
                  handleDateChange={handleDateChange}
                />
              </Grid>
              <Grid item item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="glnNumber"
                  label="GLN Number"
                  name="glnNumber"
                  autoComplete="glnNumber"
                  {...glnNumber.bind}
                />
              </Grid>
            </Grid>

            <Card variant="outlined" className={classes.addressContainer}>
              <CardContent>
                <Typography variant="h6">Ship To Location</Typography>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="address_1"
                      label="Address Line 1"
                      name="address_1"
                      autoComplete="address_1"
                      error={formError.address_1 && formError.address_1.error}
                      helperText={
                        formError.address_1 ? formError.address_1.message : ""
                      }
                      onBlur={(e) => handleBlur(e, "required", address_1)}
                      {...address_1.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address_2"
                      label="Address Line 2"
                      name="address_2"
                      autoComplete="address_2"
                      {...address_2.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      // required
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      autoComplete="city"
                      error={formError.city && formError.city.error}
                      helperText={formError.city ? formError.city.message : ""}
                      onBlur={(e) => handleBlur(e, "required", city)}
                      {...city.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      // required
                      fullWidth
                      id="zip"
                      label="Zip"
                      name="zip"
                      autoComplete="zip"
                      error={formError.zip && formError.zip.error}
                      helperText={formError.zip ? formError.zip.message : ""}
                      onBlur={(e) => handleBlur(e, "required", zip)}
                      {...zip.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="country"
                      select
                      required
                      label="Country"
                      error={formError.country && formError.country.error}
                      helperText={
                        formError.country ? formError.country.message : ""
                      }
                      onBlur={(e) =>
                        handleBlur(e, "required", country, "country")
                      }
                      {...country.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {COUNTRY_CHOICES.map((value, id) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="state"
                      select
                      required
                      label="State"
                      error={formError.state && formError.state.error}
                      helperText={
                        formError.state ? formError.state.message : ""
                      }
                      onBlur={(e) => handleBlur(e, "required", state, "state")}
                      {...state.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {STATE_CHOICES.map((value, id) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={isDesktop ? 3 : 0} justify="center">
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
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(AddDestinationInfo);
