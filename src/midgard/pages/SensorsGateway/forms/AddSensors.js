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
import { Card, CardContent, Typography, Chip } from "@material-ui/core";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import SearchModal from "../Sensors/SearchModal";
import {
  editSensor,
  addSensor,
} from "../../../redux/sensorsGateway/actions/sensorsGateway.actions";
import { routes } from "../../../routes/routesConstants";
import { MapComponent } from "../../../components/MapComponent/MapComponent";
import { MAP_API_URL } from "../../../utils/utilMethods";

const useStyles = makeStyles((theme) => ({
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
  cardItems: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

function AddSensor({
  dispatch,
  loading,
  history,
  loaded,
  error,
  location,
  sensorTypeList,
  gatewayData,
  data,
}) {
  const editPage = location.state && location.state.type === "edit";
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();

  const sensor_name = useInput((editData && editData.name) || "", {
    required: true,
  });
  const sensor_type = useInput((editData && editData.sensor_type) || "", {
    required: true,
  });
  const [activation_date, handleDateChange] = useState(
    (editData && editData.activation_date) || new Date()
  );
  const sim_card_id = useInput("");
  const battery_level = useInput("");
  const mac_address = useInput("");
  const [last_known_location, setLastLocation] = useState(
    (editData &&
      editData.last_known_location &&
      editData.last_known_location[0]) ||
      ""
  );
  const recharge_before = useInput("");
  const [last_report_date_time, handleLastReportDate] = useState(
    moment(new Date())
  );
  const sensor_uuid = useInput("");
  const [formError, setFormError] = useState({});
  const sensor_placed = useInput("");
  const [associatedGateway, setAccociatedGateway] = useState(null);
  const [gateway, setGateway] = useState((editData && editData.gateway) || "");
  const [environmentalModal, toggleEnvironmentalModal] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const buttonText = editPage ? "Save" : "Add Sensor";
  const formTitle = editPage ? "Edit Sensor" : "Add Sensor";

  useEffect(() => {
    if (gatewayData && gatewayData.length && editData.gateway) {
      gatewayData.forEach((gateway) => {
        if (gateway.url === editData.gateway) {
          setAccociatedGateway(gateway);
        }
      });
    }
  }, [gatewayData, gateway]);

  const closeModal = () => {
    toggleModal(false);
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
      estimated_eol: "",
      activation_date: activation_date,
      last_known_location: [last_known_location],
      gateway: gateway,
      // last_report_date_time: last_report_date_time,
      associated_sensors_ids: [],
      associated_shipment_item_ids: [],
      ...(editPage && editData && { id: editData.id }),
    };
    if (editPage) {
      dispatch(
        editSensor(sensorFormValues, history, `${routes.SENSORS_GATEWAY}`)
      );
    } else {
      dispatch(
        addSensor(sensorFormValues, history, `${routes.SENSORS_GATEWAY}`)
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
    if (!sensor_type.value || !sensor_name.value || !gateway) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDelete = (chipToDelete) => () => {
    setAccociatedGateway(null);
    setGateway("");
  };

  const setLastKnownLocation = (value) => {
    setLastLocation(value);
  };

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
                  fullWidth
                  required
                  id="sensor_name"
                  label="Sensor Name"
                  name="sensor_name"
                  autoComplete="sensor_name"
                  error={formError.sensor_name && formError.sensor_name.error}
                  helperText={
                    formError.sensor_name ? formError.sensor_name.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", sensor_name)}
                  {...sensor_name.bind}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="last_known_location"
                  label="Last Known Location"
                  name="last_known_location"
                  autoComplete="last_known_location"
                  value={last_known_location}
                  // onChange={(e) => setLastLocation(e.target.value)}
                />
                <MapComponent
                  isMarkerShown
                  googleMapURL={MAP_API_URL}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `200px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  markers={[
                    {
                      lat:
                        last_known_location &&
                        parseFloat(last_known_location.split(",")[0]),
                      lng:
                        last_known_location &&
                        parseFloat(last_known_location.split(",")[1]),
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
                  variant={"body1"}
                >
                  Sensor Info
                </Typography>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="sensor_type"
                      select
                      label="Sensor Type"
                      error={
                        formError.sensor_type && formError.sensor_type.error
                      }
                      helperText={
                        formError.sensor_type
                          ? formError.sensor_type.message
                          : ""
                      }
                      onBlur={(e) =>
                        handleBlur(e, "required", sensor_type, "sensor_type")
                      }
                      {...sensor_type.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {sensorTypeList &&
                        sensorTypeList.map((item, index) => (
                          <MenuItem
                            key={`${item.id}${item.name}`}
                            value={item.url}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <DatePickerComponent
                      label={"Activated"}
                      selectedDate={activation_date}
                      handleDateChange={handleDateChange}
                    />
                  </Grid>

                  {/* <Grid item xs={12} md={6} sm={6}>
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
                  </Grid> */}
                  {/* <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="recharge_before"
                      label="Recharge Before"
                      name="recharge_before"
                      autoComplete="recharge_before"
                      {...recharge_before.bind}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12} md={6} sm={6}>
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
                  </Grid> */}
                  <Grid item xs={12} md={6} sm={6}>
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
            <Grid container spacing={2} justify="center">
              <Grid item xs={6} sm={4}>
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
              title={"Associate Gateway UUID"}
              submitText={"Save"}
              submitAction={setGatewayUrl}
              selectedList={
                gateway && associatedGateway ? associatedGateway : null
              }
              listOfItems={gatewayData}
              searchFieldLabel={"Select Gateway UUID"}
              searchFieldPlaceHolder={"Select the Value"}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(AddSensor);
