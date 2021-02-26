import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Loader from "midgard/components/Loader/Loader";
import {
  updateOrganization
} from "midgard/redux/authuser/actions/authuser.actions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
}));

const OrganizationSettings = ({ dispatch, loading, organizationData }) => {
  const classes = useStyles();

  const [allow, setAllow] = useState(
    (organizationData && organizationData.allow_import_export) || false
  );

  useEffect(() => {
    if (organizationData) {
      setAllow(organizationData.allow_import_export);
    };
  }, [organizationData]);

  const handleAllowed = (event) => {
    const data = { 
      ...organizationData,
      allow_import_export: event.target.checked,
      edit_date: new Date(),
    };
    dispatch(updateOrganization(data));
    setAllow(event.target.checked);
  };

  return (
    <Grid container spacing={2}>
      {loading && <Loader open={loading} />}
      <Grid item xs={12}>
        <div className={classes.checkbox}>
          <Checkbox
            checked={allow}
            onClick={handleAllowed}
          />
          <Typography className={classes.label}>
            Allow Import Export for this Organization?
          </Typography>
        </div>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(OrganizationSettings);
