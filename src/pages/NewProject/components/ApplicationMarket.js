import React, { useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  useTheme,
  makeStyles,
  useMediaQuery,
  Grid,
  Typography,
  Box,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  Button,
} from "@material-ui/core";
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

    "&.MuiButton-contained.Mui-disabled": {
      color: "hsl(0deg 0% 100% / 70%);",
    },
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

const ApplicationMarket = (props) => {
  const {
    history,
    loading,
    dispatch,
    location,
    handleNext,
    handleBack,
    handleCancel,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const viewOnly = false;
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  // const editPage = location.state && location.state.type === 'edit';
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};

  const application_type = useInput(
    (editData && editData.application_type) || "desktop",
    {
      required: true,
    }
  );

  const [specific_problem, setSpecific_problem] = useState({
    value: false,
    problem: "",
  });

  const primary_users = useInput((editData && editData.primary_users) || "", {
    required: true,
  });

  const [bussiness_segment, setBussiness_segment] = useState([]);

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

  const onBackClick = (event) => {
    // if (checkIfShipmentInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleBack();
  };

  const onNextClick = (event) => {
    // if (checkIfShipmentInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleNext();
  };

  const submitDisabled = () => {
    // const errorKeys = Object.keys(formError);
    // if (!project_name.value) {
    //   return true;
    // }
    // let errorExists = false;
    // _.forEach(errorKeys, (key) => {
    //   if (formError[key].error) {
    //     errorExists = true;
    //   }
    // });
    // return errorExists;

    if (primary_users.value === "" || bussiness_segment.length <= 0) {
      return true;
    }
    return false;
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <FormControl component="fieldset" required>
                <Typography variant="h5" gutterBottom component="div">
                  Type of Application
                </Typography>
                <RadioGroup
                  row
                  aria-label="Application"
                  name="Application-radio-buttons-group"
                  {...application_type.bind}
                >
                  <FormControlLabel
                    value="mobile"
                    control={<Radio />}
                    label="Mobile"
                  />
                  <FormControlLabel
                    value="desktop"
                    control={<Radio />}
                    label="Desktop"
                  />
                  <FormControlLabel
                    value="both"
                    control={<Radio />}
                    label="Both"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" required>
                <Typography variant="h5" gutterBottom component="div">
                  Is there a specific problem you are trying to solve
                </Typography>
                <Typography variant="caption" gutterBottom component="div">
                  If Yes, for what type of user?
                </Typography>
                <RadioGroup
                  row
                  aria-label="specific-problem"
                  name="specific-problem-radio-buttons-group"
                  value={specific_problem.value}
                  onChange={(e) => {
                    setSpecific_problem((prevSpecific_problem) => {
                      return {
                        ...prevSpecific_problem,
                        value: e.target.value === "true",
                      };
                    });
                  }}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {specific_problem.value && (
                <FormControl fullWidth>
                  <InputLabel id="type-of-user-label">Type of User</InputLabel>
                  <Select
                    labelId="type-of-user-label"
                    id="type-of-user"
                    label="Type of User"
                    value={specific_problem.problem}
                    onChange={(e) => {
                      setSpecific_problem((prevSpecific_problem) => {
                        return {
                          ...prevSpecific_problem,
                          problem: e.target.value,
                        };
                      });
                    }}
                  >
                    <MenuItem value={"small business user"}>
                      Small Business User
                    </MenuItem>
                    <MenuItem value={"enterprise user (big companies)"}>
                      Enterprise User (Big Companies)
                    </MenuItem>
                    <MenuItem value={"government user"}>
                      Government User
                    </MenuItem>
                    <MenuItem value={"consumer"}>Consumer</MenuItem>
                    <MenuItem value={"developer"}>Developer</MenuItem>
                    <MenuItem value={"others"}>Other</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" gutterBottom component="div">
                Who are your Primary Users?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="primary-user-label">Primary User</InputLabel>
                <Select
                  labelId="primary-user-label"
                  id="primary-user"
                  label="Type of User"
                  {...primary_users.bind}
                >
                  <MenuItem value={"customer1"}>Customer 1</MenuItem>
                  <MenuItem value={"customer2"}>
                    Customer 2 (Power User)
                  </MenuItem>
                  <MenuItem value={"Government User"}>
                    Administrator ( All powerfull, helpfull, etc. )
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" gutterBottom component="div">
                Is there a business segment you are trying to address?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="bussiness-segment-label">
                  Bussiness Segment
                </InputLabel>
                <Select
                  labelId="bussiness-segment-label"
                  id="bussiness-segment"
                  value={bussiness_segment}
                  label="Type of User"
                  multiple
                  onChange={(e) => {
                    setBussiness_segment(e.target.value);
                  }}
                >
                  <MenuItem value={"Advertisement/Marketing"}>
                    Advertisement/Marketing
                  </MenuItem>
                  <MenuItem value={"Finance/Banking"}>Finance/Banking</MenuItem>
                  <MenuItem value={"HR/People"}>HR/People</MenuItem>
                  <MenuItem value={"IT/Tech/Developers"}>
                    IT/Tech/Developers
                  </MenuItem>
                  <MenuItem value={"Education - Science"}>
                    Education - Science
                  </MenuItem>
                  <MenuItem value={"Education - Teachers"}>
                    Education - Teachers
                  </MenuItem>
                  <MenuItem value={"Education - Students"}>
                    Education - Students
                  </MenuItem>
                  <MenuItem value={"Government/Politics"}>
                    Government/Politics
                  </MenuItem>
                  <MenuItem value={"Public/Non-Profit"}>
                    Public/Non-Profit
                  </MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
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
            <Grid item xs={12} sm={4}>
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onNextClick}
                disabled={submitDisabled()}
                className={classes.submit}
              >
                Save & Next
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(ApplicationMarket);
