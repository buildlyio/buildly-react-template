import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  Button,
  useTheme,
  makeStyles,
  useMediaQuery,
  Grid,
  TextField,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import DatePickerComponent from "@components/DatePicker/DatePicker";
import { useInput } from "@hooks/useInput";
import { validators } from "@utils/validators";
import GithubLogin from "@components/SocialLogin/GithubLogin";
import TrelloLogin from "@components/SocialLogin/TrelloLogin";
import { providers } from "@utils/socialLogin";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.secondary.contrastText,
    },
    "& .MuiOutlinedInput-root:hover > .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(255, 255, 255, 0.23)",
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.secondary.contrastText,
    },
    "& .MuiSelect-icon": {
      color: theme.palette.secondary.contrastText,
    },
    "& .MuiInputBase-input": {
      color: theme.palette.secondary.contrastText,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
    color: theme.palette.primary.contrastText,
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
    justifyContent: "center",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: "relative",
  },
  inputWithTooltip: {
    display: "flex",
    alignItems: "center",
  },
}));

const NewProject = (props) => {
  const { history, loading, dispatch, location, socialLogin } = props;
  const classes = useStyles();
  const theme = useTheme();
  const viewOnly = false;
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const editPage = location.state && location.state.type === "edit";
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};

  const project_name = useInput((editData && editData.name) || "", {
    required: true,
  });
  const description = useInput((editData && editData.description) || "");
  const project_manager = useInput(
    (editData && editData.project_manager) || ""
  );
  const product_team = useInput((editData && editData.product_team) || "", {
    required: true,
  });
  const [start_date, handleStartDateChange] = useState(
    (editData && editData.estimated_time_of_start) || new Date()
  );
  const [end_date, handleEndDateChange] = useState(
    (editData && editData.estimated_time_of_arrival) || new Date()
  );

  const [formError, setFormError] = useState({});

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
          message: "",
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!project_name.value) {
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
  };

  return (
    <>
      <div>
        <Typography variant="h4" className={classes.formTitle}>
          New Project
        </Typography>

        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid className={classes.inputWithTooltip} item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="project_name"
                  label="Project name"
                  name="project_name"
                  autoComplete="project_name"
                  disabled={viewOnly}
                  error={formError.project_name && formError.project_name.error}
                  onBlur={(e) => handleBlur(e, "required", project_name)}
                  {...project_name.bind}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid className={classes.inputWithTooltip} item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      multiline
                      rows={6}
                      id="description"
                      label="Project description"
                      name="description"
                      autoComplete="description"
                      disabled={viewOnly}
                      {...description.bind}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="product_team"
                      select
                      label="Project Team"
                      disabled={viewOnly}
                      {...product_team.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {/* {TRANSPORT_MODE
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
                      )} */}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <DatePickerComponent
                      label="Start Date"
                      selectedDate={start_date}
                      // moment(scheduled_start).tz(timezone)
                      //   .format('MMMM DD, YYYY HH:mm:ss')
                      // }
                      hasTime
                      handleDateChange={handleStartDateChange}
                      disabled={viewOnly}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePickerComponent
                      label="End Date"
                      selectedDate={end_date}
                      // selectedDate={
                      //   moment(scheduled_arrival).tz(timezone)
                      //     .format('MMMM DD, YYYY HH:mm:ss')
                      // }
                      hasTime
                      handleDateChange={handleEndDateChange}
                      disabled={viewOnly}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="project_manager"
                      select
                      label="Project Manager"
                      disabled={viewOnly}
                      {...project_manager.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {/* {TRANSPORT_MODE
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
                      )} */}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Grid item xs={12} className={classes.socialAuth}>
            <GithubLogin
              dispatch={dispatch}
              history={history}
              disabled={loading && socialLogin}
            />
            {loading && socialLogin && socialLogin === providers.github && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Grid>
          <Grid item xs={12} className={classes.socialAuth}>
            <TrelloLogin
              dispatch={dispatch}
              history={history}
              disabled={loading && socialLogin}
            />
            {loading && socialLogin && socialLogin === providers.trello && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Grid>
          <Grid container spacing={3} className={classes.buttonContainer}>
            <Grid item xs={6} sm={2}>
              {viewOnly ? (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  // onClick={onCancelClick}
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
                    // disabled={loading || submitDisabled()}
                  >
                    Save
                  </Button>
                  {/* {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )} */}
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                // onClick={onNextClick}
                // disabled={projectFormData === null}
                className={classes.submit}
              >
                Save & Next: Project Key
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
});

export default connect(mapStateToProps)(NewProject);
