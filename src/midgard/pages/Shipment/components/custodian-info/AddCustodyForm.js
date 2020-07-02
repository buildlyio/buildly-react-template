/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import { connect } from "react-redux";
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
} from "@material-ui/core";

import DatePickerComponent from "../../../../components/DatePicker/DatePicker";
import { addCUstody } from "../../../../redux/custodian/actions/custodian.actions";

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
    itemIds,
    start_of_custody,
    handleStartChange,
    rows,
    handleSubmit,
    setItemIds,
    custodyData,
  } = props;
  const classes = useStyles();
  const [custodianId, setCustodianId] = useState();

  const submitDisabled = () => {
    if (!custodianId) return true;
  };

  const onInputChange = (value) => {
    if (value) {
      setCustodianId(value.custodian_uuid);
      if (itemIds.indexOf(value.custodian_uuid) === -1)
        setItemIds([...itemIds, value.custodian_uuid]);
    } else {
      setCustodianId(value);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const onAddCustodyClick = (event) => {
    event.preventDefault();
    let custodian = [];
    if (rows && rows.length) {
      rows.forEach((element) => {
        if (element.custodian_uuid === custodianId) {
          custodian.push(element.url);
        }
      });
    }
    const custodyFormValues = {
      start_of_custody: start_of_custody,
      custodian: custodian,
    };
    dispatch(addCUstody(custodyFormValues));
  };

  return (
    <Box mb={5} mt={3}>
      <form noValidate onSubmit={handleSubmit}>
        <Card variant="outlined" className={classes.form}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  options={
                    (custodianData &&
                      custodianData.filter((data) => {
                        return itemIds.indexOf(data.custodian_uuid) === -1;
                      })) ||
                    []
                  }
                  getOptionLabel={(option) =>
                    `${option.name}:${option.custodian_uuid}`
                  }
                  // getOptionSelected={(option) =>
                  //   option.custodian_uuid === custodianId
                  // }
                  onChange={(event, newValue) => onInputChange(newValue)}
                  value={
                    (rows &&
                      rows.filter((item) => {
                        return item.custodian_uuid === custodianId;
                      })[0]) ||
                    null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Custodian To Be Associated"
                      placeholder="Select a Custodian"
                    />
                  )}
                />
                {/* <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={custodianData || []}
                  getOptionLabel={(option) =>
                    option && `${option.name}:${option.custodian_uuid}`
                  }
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    onInputChange(newValue);
                  }}
                  defaultValue={rows}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.name}:${option.custodian_uuid}`}
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Custodian To Be Associated"
                      placeholder="Select a Custodian"
                    />
                  )}
                /> */}
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label={"Start of custody"}
                  selectedDate={start_of_custody}
                  hasTime={true}
                  handleDateChange={handleStartChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} justify="center">
              <Grid item xs={6}>
                <div className={classes.loadingWrapper}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => onAddCustodyClick(e)}
                    className={classes.submit}
                    disabled={loading}
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
              </Grid>
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
                {`Associate Custodian`}
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(AddCustodyInfo);
