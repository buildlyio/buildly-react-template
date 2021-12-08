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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  TextField,
  Button,
} from "@material-ui/core";
import { useInput } from "@hooks/useInput";
import { validators } from "@utils/validators";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

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

export let checkIfTeamUserEdited;

const TeamUser = (props) => {
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

  const team_size = useInput((editData && editData.team_size) || "5 - 10", {
    required: true,
  });

  const [role_count, setRole_count] = useState([
    { role: "CTO (Budget Approval?)", count: 0 },
    { role: "COO (Budget Approval?)", count: 0 },
    { role: "UI/UX", count: 0 },
    { role: "Lead Developer", count: 0 },
    { role: "Project Manager", count: 0 },
    { role: "Product Manager (Budget Approval?)", count: 0 },
    { role: "Others", count: 0 },
  ]);

  const existing_requirements = useInput(
    (editData && editData.existing_requirements) || "",
    {
      required: true,
    }
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

    let countNum = 0;
    role_count.forEach((role_CountObject) => {
      if (role_CountObject.count === 0) {
        countNum += 1;
      }
    });
    if (countNum === role_count.length) {
      return true;
    }
    return false;
  };

  checkIfTeamUserEdited = () => team_size.hasChanged();

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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" gutterBottom component="div">
                What is the size of your current team and backgrounds/roles?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="current-team-size"
                  name="current-team-size-radio-group"
                  {...team_size.bind}
                >
                  <FormControlLabel
                    value="1 - 5"
                    control={<StyledRadio />}
                    label="1 - 5"
                  />
                  <FormControlLabel
                    value="5 - 10"
                    control={<StyledRadio />}
                    label="5 - 10"
                  />
                  <FormControlLabel
                    value="10 - 20 or more"
                    control={<StyledRadio />}
                    label="10 - 20 or more"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Roles</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {role_count.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.role}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => {
                              if (role_count[index].count > 0) {
                                setRole_count((prevRole_count) => {
                                  prevRole_count[index].count -= 1;
                                  return [...prevRole_count];
                                });
                              }
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell style={{ width: "10%" }}>
                          <TextField
                            onChange={(e) => {
                              setRole_count((prevRole_count) => {
                                prevRole_count[index].count += parseInt(
                                  e.target.value
                                );
                                return [...prevRole_count];
                              });
                            }}
                            value={row.count}
                            type={"number"}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="left">
                          <IconButton
                            onClick={() => {
                              setRole_count((prevRole_count) => {
                                prevRole_count[index].count += 1;
                                return [...prevRole_count];
                              });
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom component="div">
                Do you have any existing requirements documents, mockups,
                designs etc.?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={6}
                // id="description"
                label="existing requirements"
                // name="description"
                // autoComplete="description"
                {...existing_requirements.bind}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.buttonContainer}>
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

export default connect(mapStateToProps)(TeamUser);
