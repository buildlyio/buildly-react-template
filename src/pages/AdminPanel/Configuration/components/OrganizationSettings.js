import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Grid,
  Checkbox,
  TextField,
  Typography,
  Button,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../../../../components/Loader/Loader';
import {
  updateOrganization,
} from '../../../../redux/authuser/actions/authuser.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.common.darkGrey2,
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
  orgTypes,
}) => {
  const classes = useStyles();
  const [allowImportExport, setAllowImportExport] = useState(
    (organizationData
      && organizationData.allow_import_export) || false,
  );
  const [radius, setRadius] = useState(
    (organizationData && organizationData.radius) || 0,
  );
  const [orgType, setOrgType] = useState(
    (organizationData
      && organizationData.organization_type) || '',
  );

  useEffect(() => {
    if (organizationData) {
      resetValues();
    }
  }, [organizationData]);

  const resetValues = () => {
    setAllowImportExport(organizationData.allow_import_export);
    setRadius(organizationData.radius);
    setOrgType(organizationData.organization_type || '');
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
      radius: radius || 0,
      organization_type: orgType,
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
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            select
            id="org-type"
            name="org-type"
            label="Organization Type"
            autoComplete="orgType"
            value={orgType}
            onChange={(e) => setOrgType(e.target.value)}
          >
            <MenuItem value="">Select</MenuItem>
            {_.map(orgTypes, (type) => (
              <MenuItem
                key={`orgType-${type.id}`}
                value={type.id}
              >
                {_.capitalize(type.name)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
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
