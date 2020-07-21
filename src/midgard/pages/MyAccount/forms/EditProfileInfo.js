import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import { useInput } from "../../../hooks/useInput";
import {
  addCustodians,
  getCustodianType,
  editCustodian,
} from "../../../redux/custodian/actions/custodian.actions";
import Loader from "../../../components/Loader/Loader";
import { dispatch } from "../../../redux/store";
import {
  ADDRESS_TYPE,
  STATE_CHOICES,
  COUNTRY_CHOICES,
} from "../../../utils/mock";
import { user } from "../../../context/User.context";
import { updateUser } from "../../../redux/authuser/actions/authuser.actions";
import { setOptionsData } from "../../../utils/utilMethods";
import CustomizedTooltips from "../../../components/ToolTip/ToolTip";
import { InputAdornment } from "@material-ui/core";

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

function EditProfileInfo({
  dispatch,
  loading,
  history,
  loaded,
  error,
  location,
  editData,
  setModal,
  organizationData,
  userOptions,
  orgOptions,
}) {
  const classes = useStyles();
  const first_name = useInput((editData && editData.first_name) || "", {
    required: true,
  });
  const last_name = useInput((editData && editData.last_name) || "");
  const organisation_name = useInput(
    (organizationData && organizationData.name) || ""
  );
  const email = useInput((editData && editData.email) || "");
  const password = useInput("", { required: true });
  const [formError, setFormError] = useState({});
  const [fieldsMetadata, setFieldsMetaData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    organisation_name: "",
  });

  useEffect(() => {
    let metadata = { ...fieldsMetadata };
    if (userOptions && userOptions.actions) {
      metadata["first_name"] = setOptionsData(
        userOptions.actions.POST,
        "first_name"
      );
      metadata["last_name"] = setOptionsData(
        userOptions.actions.POST,
        "last_name"
      );
      metadata["email"] = setOptionsData(userOptions.actions.POST, "email");
    }
    if (orgOptions && orgOptions.actions) {
      metadata["organisation_name"] = setOptionsData(
        orgOptions.actions.POST,
        "name"
      );
    }
    setFieldsMetaData(metadata);
  }, [userOptions, orgOptions]);

  // if (loade) {
  //   setModal(false);
  // }

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const editUserFormValue = {
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      username: editData.username,
      title: "",
      // password: password.value,
      ...(organizationData && { organization_name: organisation_name.value }),
      id: editData.id,
      ...(organizationData && {
        organization_uuid: organizationData.organization_uuid,
      }),
    };
    dispatch(updateUser(editUserFormValue));
    setModal(false);
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
    if (!first_name.value) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="first_name"
              error={formError.first_name && formError.first_name.error}
              helperText={
                formError.first_name ? formError.first_name.message : ""
              }
              onBlur={(e) => handleBlur(e, "required", first_name)}
              {...first_name.bind}
              InputProps={
                fieldsMetadata["first_name"].help_text && {
                  endAdornment: (
                    <InputAdornment position="end">
                      {fieldsMetadata["first_name"].help_text && (
                        <CustomizedTooltips
                          toolTipText={fieldsMetadata["first_name"].help_text}
                        />
                      )}
                    </InputAdornment>
                  ),
                }
              }
            />
          </Grid>
          <Grid item item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="last_name"
              {...last_name.bind}
              InputProps={
                fieldsMetadata["last_name"].help_text && {
                  endAdornment: (
                    <InputAdornment position="end">
                      {fieldsMetadata["last_name"].help_text && (
                        <CustomizedTooltips
                          toolTipText={fieldsMetadata["last_name"].help_text}
                        />
                      )}
                    </InputAdornment>
                  ),
                }
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid item item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              error={formError.email && formError.email.error}
              helperText={formError.email ? formError.email.message : ""}
              onBlur={(e) => handleBlur(e, "email", email)}
              {...email.bind}
              InputProps={
                fieldsMetadata["email"].help_text && {
                  endAdornment: (
                    <InputAdornment position="end">
                      {fieldsMetadata["email"].help_text && (
                        <CustomizedTooltips
                          toolTipText={fieldsMetadata["email"].help_text}
                        />
                      )}
                    </InputAdornment>
                  ),
                }
              }
            />
          </Grid>
          {organizationData && (
            <Grid item item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="organisation_name"
                label="Organization Name"
                name="organization_name"
                autoComplete="organisation_name"
                error={
                  formError.organisation_name &&
                  formError.organisation_name.error
                }
                helperText={
                  formError.organisation_name
                    ? formError.organisation_name.message
                    : ""
                }
                // onBlur={(e) => handleBlur(e, "required", organisation_name)}
                {...organisation_name.bind}
                InputProps={
                  fieldsMetadata["organisation_name"].help_text && {
                    endAdornment: (
                      <InputAdornment position="end">
                        {fieldsMetadata["organisation_name"].help_text && (
                          <CustomizedTooltips
                            toolTipText={
                              fieldsMetadata["organisation_name"].help_text
                            }
                          />
                        )}
                      </InputAdornment>
                    ),
                  }
                }
              />
            </Grid>
          )}
        </Grid>
        <Grid container spacing={isDesktop ? 3 : 0} justify="center">
          <Grid item xs={12} sm={4}>
            <div className={classes.loadingWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading || submitDisabled()}
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setModal(false)}
              className={classes.submit}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(EditProfileInfo);
