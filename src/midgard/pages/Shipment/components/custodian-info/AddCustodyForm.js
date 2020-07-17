/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Geocode from "react-geocode";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  Box,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";

import DatePickerComponent from "../../../../components/DatePicker/DatePicker";
import {
  addCustody,
  editCustody,
} from "../../../../redux/custodian/actions/custodian.actions";
import { useInput } from "../../../../hooks/useInput";
import { validators } from "../../../../utils/validators";
import { MapComponent } from "../../../../components/MapComponent/MapComponent";
import {
  MAP_API_URL,
  GEO_CODE_API,
  compareSort,
} from "../../../../utils/utilMethods";
import { getFormattedRow } from "../../../Custodians/CustodianConstants";
import CustomizedTooltips from "../../../../components/ToolTip/ToolTip";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
  buttonContainer: {
    textAlign: "center",
    justifyContent: "center",
    margin: theme.spacing(3, 0),
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
}));

function AddCustodyInfo(props) {
  const {
    custodianData,
    loading,
    dispatch,
    shipmentFormData,
    contactInfo,
    editItem,
    setOpenModal,
    custodyOptions,
  } = props;
  const classes = useStyles();
  const [custodianId, setCustodianId] = useState(
    (editItem && editItem.custodian_data) || ""
  );
  const [custodianList, setCustodianList] = useState([]);
  const [start_of_custody, handleStartChange] = useState(
    (editItem && editItem.start_of_custody) || new Date()
  );
  const [end_of_custody, handleEndChange] = useState(
    (editItem && editItem.end_of_custody) || new Date()
  );
  const [start_of_custody_location, handleStartLocation] = useState(
    (editItem && editItem.start_of_custody_location) || ""
  );
  const [end_of_custody_location, handleEndLocation] = useState(
    (editItem && editItem.end_of_custody_location) || ""
  );
  const shipment = useInput(
    shipmentFormData && shipmentFormData.shipment_uuid,
    "",
    { required: true }
  );
  const shipment_name = useInput(shipmentFormData && shipmentFormData.name, "");
  const has_current_custody = useInput(
    (editItem && editItem.has_current_custody) || false
  );
  const first_custody = useInput((editItem && editItem.first_custody) || false);
  const last_custody = useInput((editItem && editItem.last_custody) || false);
  const [formError, setFormError] = useState({});

  const [custodyMetaData, setCustodyMetaData] = useState({});

  useEffect(() => {
    console.log("custodyOptions", custodyOptions);
    if (custodyOptions && custodyOptions.actions) {
      setCustodyMetaData(custodyOptions.actions.POST);
    }
  }, [custodyOptions]);

  useEffect(() => {
    if (custodianData && custodianData.length && contactInfo) {
      setCustodianList(getFormattedRow(custodianData, contactInfo));
    }
  }, [custodianData, contactInfo]);

  const submitDisabled = () => {
    if (!custodianId) return true;
  };

  const onInputChange = (e) => {
    let value = e.target.value;
    if (value) {
      setCustodianId(value);
      // if (itemIds.indexOf(value.custodian_uuid) === -1)
      //   setItemIds([...itemIds, value.custodian_uuid]);
      if (custodianList.length > 0) {
        let selectedCustodian = "";
        custodianList.forEach((list) => {
          if (list.custodian_uuid === value.custodian_uuid) {
            selectedCustodian = list;
          }
        });
        Geocode.setApiKey(GEO_CODE_API);
        Geocode.setLanguage("en");
        Geocode.fromAddress(selectedCustodian.location).then(
          (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            setEndLocation(`${lat},${lng}`);
            setStartLocation(`${lat},${lng}`);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    } else {
      setCustodianId(value);
    }
  };

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

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const onAddCustodyClick = (event) => {
    event.preventDefault();
    const custodyFormValues = {
      start_of_custody: start_of_custody,
      end_of_custody: end_of_custody,
      custodian: [custodianId.url],
      start_of_custody_location: start_of_custody_location,
      end_of_custody_location: end_of_custody_location,
      shipment_id: shipment.value,
      has_current_custody: has_current_custody.value,
      first_custody: first_custody.value,
      last_custody: last_custody.value,
      ...(editItem !== null && { id: editItem.id }),
    };
    if (editItem !== null) {
      dispatch(editCustody(custodyFormValues));
    } else {
      dispatch(addCustody(custodyFormValues));
    }
    setOpenModal();
  };

  const setStartLocation = (value) => {
    handleStartLocation(value);
  };

  const setEndLocation = (value) => {
    handleEndLocation(value);
  };

  return (
    <Box mb={5} mt={3}>
      <form noValidate onSubmit={onAddCustodyClick}>
        <Card variant="outlined" className={classes.form}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  disabled
                  id="shipment"
                  label="Shipment ID"
                  name="shipment"
                  autoComplete="shipment"
                  error={formError.shipment && formError.shipment.error}
                  helperText={
                    formError.shipment ? formError.shipment.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", shipment)}
                  {...shipment.bind}
                  InputProps={
                    custodyMetaData["shipment_id"] &&
                    custodyMetaData["shipment_id"].help_text && {
                      endAdornment: (
                        <InputAdornment position="end">
                          {custodyMetaData["shipment_id"].help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["shipment_id"].help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled
                  id="shipment_name"
                  label="Shipment Name"
                  name="shipment_name"
                  autoComplete="shipment_name"
                  {...shipment_name.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="custodianId"
                  select
                  required
                  label="Custodian"
                  error={formError.custodianId && formError.custodianId.error}
                  helperText={
                    formError.custodianId ? formError.custodianId.message : ""
                  }
                  onBlur={(e) =>
                    handleBlur(e, "required", custodianId, "custodianId")
                  }
                  value={custodianId}
                  onChange={onInputChange}
                  InputProps={
                    custodyMetaData["custodian"] &&
                    custodyMetaData["custodian"].help_text && {
                      endAdornment: (
                        <InputAdornment position="start">
                          {custodyMetaData["custodian"].help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["custodian"].help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
                >
                  <MenuItem value={""}>Select</MenuItem>
                  {custodianList &&
                    custodianList
                      .sort(compareSort("name"))
                      .map((item, index) => (
                        <MenuItem key={`${item.id}${item.name}`} value={item}>
                          {`${item.name}:${item.custodian_uuid}`}
                        </MenuItem>
                      ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label={"Start of custody"}
                  selectedDate={start_of_custody}
                  hasTime={true}
                  handleDateChange={handleStartChange}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label={"End of custody"}
                  selectedDate={end_of_custody}
                  hasTime={true}
                  handleDateChange={handleEndChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="start_of_custody_location"
                  label="Start Of Custody Location"
                  name="start_of_custody_location"
                  autoComplete="start_of_custody_location"
                  value={start_of_custody_location}
                  InputProps={
                    custodyMetaData["start_of_custody_location"] &&
                    custodyMetaData["start_of_custody_location"].help_text && {
                      endAdornment: (
                        <InputAdornment position="end">
                          {custodyMetaData["start_of_custody_location"]
                            .help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["start_of_custody_location"]
                                  .help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
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
                        start_of_custody_location &&
                        parseFloat(start_of_custody_location.split(",")[0]),
                      lng:
                        start_of_custody_location &&
                        parseFloat(start_of_custody_location.split(",")[1]),
                      onMarkerDrag: setStartLocation,
                      draggable: true,
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="end_of_custody_location"
                  label="End Of Custody Location"
                  name="end_of_custody_location"
                  autoComplete="end_of_custody_location"
                  value={end_of_custody_location}
                  InputProps={
                    custodyMetaData["end_of_custody_location"] &&
                    custodyMetaData["end_of_custody_location"].help_text && {
                      endAdornment: (
                        <InputAdornment position="end">
                          {custodyMetaData["end_of_custody_location"]
                            .help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["end_of_custody_location"]
                                  .help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
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
                        end_of_custody_location &&
                        parseFloat(end_of_custody_location.split(",")[0]),
                      lng:
                        end_of_custody_location &&
                        parseFloat(end_of_custody_location.split(",")[1]),
                      onMarkerDrag: setEndLocation,
                      draggable: true,
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="has_current_custody"
                  select
                  label="Has Current Custody"
                  {...has_current_custody.bind}
                  InputProps={
                    custodyMetaData["has_current_custody"] &&
                    custodyMetaData["has_current_custody"].help_text && {
                      endAdornment: (
                        <InputAdornment position="start">
                          {custodyMetaData["has_current_custody"].help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["has_current_custody"].help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
                >
                  <MenuItem value={true}>YES</MenuItem>
                  <MenuItem value={false}>NO</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="first_custody"
                  select
                  label="Is First Custody"
                  {...first_custody.bind}
                  InputProps={
                    custodyMetaData["first_custody"] &&
                    custodyMetaData["first_custody"].help_text && {
                      endAdornment: (
                        <InputAdornment position="start">
                          {custodyMetaData["first_custody"].help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["first_custody"].help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
                >
                  <MenuItem value={true}>YES</MenuItem>
                  <MenuItem value={false}>NO</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="last_custody"
                  select
                  label="Is Last Custody"
                  {...last_custody.bind}
                  InputProps={
                    custodyMetaData["last_custody"] &&
                    custodyMetaData["last_custody"].help_text && {
                      endAdornment: (
                        <InputAdornment position="start">
                          {custodyMetaData["last_custody"].help_text && (
                            <CustomizedTooltips
                              toolTipText={
                                custodyMetaData["last_custody"].help_text
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }
                  }
                >
                  <MenuItem value={true}>YES</MenuItem>
                  <MenuItem value={false}>NO</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Grid container spacing={3} justify="center">
              {/* <Grid item xs={6}>
                <div className={classes.loadingWrapper}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => onAddCustodyClick(e)}
                    className={classes.submit}
                    disabled={loading || !custodianId}
                  >
                    {`Add Custody`}
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
        <Grid container spacing={3} className={classes.buttonContainer}>
          <Grid item xs={6}>
            <div className={classes.loadingWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading || submitDisabled()}
              >
                {editItem ? "Save" : `Add Custody`}
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
    </Box>
  );
}

// const mapStateToProps = (state, ownProps) => ({
//   ...ownProps,
//   ...state.custodianReducer,
//   ...state.shipmentReducer,
// });

export default AddCustodyInfo;
