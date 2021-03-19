import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Loader from "midgard/components/Loader/Loader";
import Button from "@material-ui/core/Button";
import { useInput } from "midgard/hooks/useInput";
import { validators } from "midgard/utils/validators";
import {
  updateOrganization
} from "midgard/redux/authuser/actions/authuser.actions";
import { convertUnitsOfMeasure } from "midgard/utils/utilMethods";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#424242",
    margin: theme.spacing(0.25, 0, 0.25, 0.25),
  },
  checkbox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  label: {
    marginLeft: `${theme.spacing(2)}px !important`,
    fontSize: "0.9rem",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
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
    position: "relative",
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

const OrganizationSettings = ({ dispatch, loading, organizationData }) => {
  const classes = useStyles();

  const [allowImportExport, setAllowImportExport] = useState(
    (organizationData && organizationData.allow_import_export) || false
  );

  const [radius, setRadius] = useState(
    (organizationData && organizationData.radius) || 0
  );
  // const radius = useInput((organizationData && organizationData.radius) || 0, {
  //   required: true,
  // });

  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (organizationData) {
      setAllowImportExport(organizationData.allow_import_export);
      setRadius(convertUnitsOfMeasure('km',parseFloat(organizationData.radius),'miles','distance'));
    }
  }, [organizationData]);

  const resetValues = () => {
    setAllowImportExport(organizationData.allow_import_export);
    setRadius(convertUnitsOfMeasure('km',parseFloat(organizationData.radius),'miles','distance'));
  };

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      ...organizationData,
      edit_date: new Date(),
      allow_import_export: allowImportExport,
      radius: convertUnitsOfMeasure('miles',parseFloat(radius),'km','distance'),
    };
    dispatch(updateOrganization(data));
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
    if (!radius) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      {loading && <Loader open={loading} />}
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Grid item xs={12}>
          <div className={classes.checkbox}>
            <Checkbox
              checked={allowImportExport}
              onClick={e => setAllowImportExport(e.target.checked)}
            />
            <Typography className={classes.label}>
              Allow Import Export for this Organization?
          </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="radius"
            fullWidth
            label="Radius for Geofence (miles)"
            name="radius"
            autoComplete="radius"
            value={radius}
            error={formError.radius && formError.radius.error}
            helperText={
              formError.radius ? formError.radius.message : ""
            }
            onBlur={(e) => handleBlur(e, "required", radius)}
            onChange={event => setRadius(event.target.value)} />
        </Grid>
        <Grid container spacing={2} justify="center">
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
                Save
                    </Button>
            </div>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => resetValues()}
              className={classes.submit}
            >
              Reset
                  </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(OrganizationSettings);
