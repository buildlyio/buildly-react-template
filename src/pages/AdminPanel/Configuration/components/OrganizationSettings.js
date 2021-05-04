import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Grid,
  Checkbox,
  TextField,
  Typography,
  Button,
} from '@material-ui/core';
import Loader from '@components/Loader/Loader';
import {
  updateOrganization,
} from '@redux/authuser/actions/authuser.actions';
import { convertUnitsOfMeasure } from '@utils/utilMethods';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#424242',
    margin: theme.spacing(0.25, 0, 0.25, 0.25),
  },
  checkbox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginLeft: `${theme.spacing(2)}px !important`,
    fontSize: '0.9rem',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: 'relative',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const OrganizationSettings = ({
  dispatch,
  loading,
  organizationData,
}) => {
  const classes = useStyles();
  const [allowImportExport, setAllowImportExport] = useState(
    (organizationData
      && organizationData.allow_import_export) || false,
  );
  const [radius, setRadius] = useState(
    (organizationData && organizationData.radius) || 0,
  );

  useEffect(() => {
    if (organizationData) {
      resetValues();
    }
  }, [organizationData]);

  const resetValues = () => {
    setAllowImportExport(organizationData.allow_import_export);
    setRadius(convertUnitsOfMeasure(
      'km',
      parseFloat(organizationData.radius),
      'miles',
      'distance',
    ));
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
      radius: radius
        ? convertUnitsOfMeasure(
          'miles',
          parseFloat(radius),
          'km',
          'distance',
        )
        : 0,
    };
    dispatch(updateOrganization(data));
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      {loading && <Loader open={loading} />}
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <Grid item xs={12}>
          <div className={classes.checkbox}>
            <Checkbox
              checked={allowImportExport}
              onClick={(e) => setAllowImportExport(e.target.checked)}
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
            id="radius"
            fullWidth
            label="Radius for Geofence (miles)"
            name="radius"
            autoComplete="radius"
            value={radius}
            onChange={(event) => setRadius(event.target.value)}
          />
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
                disabled={loading}
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
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(OrganizationSettings);
