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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import DatePickerComponent from "@components/DatePicker/DatePicker";
import { useInput } from "@hooks/useInput";
import { validators } from "@utils/validators";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    color: "#fff",
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
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
}));

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      color="default"
      checkedIcon={
        <span className={`${classes.icon} ${classes.checkedIcon}`} />
      }
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

const ProjectSetup = (props) => {
  const { history, loading, dispatch, location, handleNext, handleCancel } =
    props;
  const classes = useStyles();
  const theme = useTheme();
  const viewOnly = false;
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  // const editPage = location.state && location.state.type === 'edit';
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};
  const project_name = useInput((editData && editData.name) || "", {
    required: true,
  });
  const description = useInput((editData && editData.description) || "");

  const requirements_tool = useInput(
    (editData && editData.requirements_tool) || "start fresh"
  );

  const issues_tool = useInput(
    (editData && editData.issues_tool) || "start fresh"
  );
  // const product_team = useInput((editData && editData.product_team) || "", {
  //   required: true,
  // });
  const [start_date, handleStartDateChange] = useState(
    (editData && editData.estimated_time_of_start) || new Date()
  );
  const [end_date, handleEndDateChange] = useState(
    (editData && editData.estimated_time_of_arrival) || new Date()
  );

  const [buildly_architecture, setBuildly_architecture] = useState(true);

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

  const onNextClick = (event) => {
    // if (checkIfShipmentInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleNext();
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
   * Submit The form and add/edit
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Typography variant="h4" className={classes.formTitle}>
        New Project
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={2}>
            <Grid className={classes.inputWithTooltip} item xs={12} sm={12}>
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
            <Grid item xs={12}>
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
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h5">Requirements</Typography>
              <FormControl component="fieldset" required>
                <RadioGroup
                  row
                  aria-label="requirements"
                  name="requirements-radio-buttons-group"
                  {...requirements_tool.bind}
                >
                  <FormControlLabel
                    value="trello"
                    control={<StyledRadio />}
                    label="Trello"
                  />
                  <FormControlLabel
                    value="atlassians"
                    control={<StyledRadio />}
                    label="Atlassians"
                  />
                  <FormControlLabel
                    value="start fresh"
                    control={<StyledRadio />}
                    label="Start Fresh"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">Issues</Typography>
              <FormControl component="fieldset" required>
                <RadioGroup
                  row
                  aria-label="issues"
                  name="issues-radio-buttons-group"
                  {...issues_tool.bind}
                >
                  <FormControlLabel
                    value="github"
                    control={<StyledRadio />}
                    label="Github"
                  />
                  <FormControlLabel
                    value="jira"
                    control={<StyledRadio />}
                    label="Jira"
                  />
                  <FormControlLabel
                    value="start fresh"
                    control={<StyledRadio />}
                    label="Start Fresh"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Grid container>
          <Grid item>
            <FormControl component="fieldset">
              <Typography variant="h5">
                Do you want to use Buildly for your Architecture?
              </Typography>
              <RadioGroup
                row
                aria-label="buildly for architecture"
                name="row-radio-buttons-group"
                color="default"
                onChange={(e) => {
                  setBuildly_architecture(e.target.value === "true");
                }}
                value={buildly_architecture}
              >
                <FormControlLabel
                  value={true}
                  control={<StyledRadio />}
                  label="Yes"
                />
                <FormControlLabel
                  value={false}
                  control={<StyledRadio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.buttonContainer}>
          {/* <Grid item xs={6} sm={2}>
            {viewOnly ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
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
          </Grid> */}
          {/* <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onBackClick}
              // disabled={projectFormData === null}
              className={classes.submit}
            >
              Back
            </Button>
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onNextClick}
              // disabled={projectFormData === null}
              className={classes.submit}
            >
              Save & Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(ProjectSetup);
