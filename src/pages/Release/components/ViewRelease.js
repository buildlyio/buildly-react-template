import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { isMobile } from '@utils/mediaQuery';
import { getAllReleases } from '@redux/release/actions/release.actions';
import { routes } from '@routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
    paddingTop: 0,
  },
  container: {
    marginTop: theme.spacing(5),
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: `-${theme.spacing(2)}px`,
  },
  gridSection: {
    marginTop: theme.spacing(5),
  },
  gridContent: {
    marginTop: theme.spacing(1),
  },
  buttons: {
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(5),
    },
    [theme.breakpoints.up('md')]: {
      textAlign: 'right',
    },
  },
  graph: {
    marginTop: theme.spacing(2),
  },
}));

const ViewRelease = ({
  dispatch, history, releaseID, releases,
}) => {
  const classes = useStyles();
  const [release, setRelease] = useState(null);

  useEffect(() => {
    if (!releases || releases.length === 0) {
      dispatch(getAllReleases());
    }
    const rel = _.find(releases, { release_uuid: releaseID });
    if (rel) {
      setRelease(rel);
    }
  }, [releases]);

  return (
    <div className={classes.root}>
      <Grid container spacing={isMobile() ? 0 : 3}>
        <Grid item xs={12} className={classes.backButton}>
          <IconButton
            onClick={(e) => { history.push(routes.RELEASE); }}
          >
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
          <Typography component="div" variant="h4">
            Release
          </Typography>
        </Grid>

        <Grid
          container
          spacing={isMobile() ? 0 : 2}
          className={classes.container}
        >
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              <Typography component="div" variant="h5">
                {release ? release.name : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.gridSection}>
              <Typography component="div" variant="h6">
                Region
              </Typography>
              <Typography
                component="div"
                variant="body1"
                className={classes.gridContent}
              >
                {release ? release.environment : 'Not Available'}
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.gridSection}>
              <Typography component="div" variant="h6">
                Release Description
              </Typography>
              <Typography
                component="div"
                variant="body1"
                className={classes.gridContent}
              >
                {release ? release.description : 'Not Available'}
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.gridSection}>
              <Typography component="div" variant="h6">
                Services
              </Typography>

              {release
              && release.module_uuid
              && release.module_uuid.length > 0
                ? _.map(release.module_uuid, (uuid, idx) => (
                  <Grid
                    key={`module-${idx}:${uuid}`}
                    container
                    className={classes.gridContent}
                  >
                    <Grid item xs={3}>
                      {uuid}
                    </Grid>
                    <Grid item xs={3}>
                      v1.0.0
                    </Grid>
                  </Grid>
                ))
                : 'Not Available'}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container className={classes.buttons}>
              <Grid item xs={6}>
                <Button variant="contained" color="primary">
                  View Timeline
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="primary">
                  View Status
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12} className={classes.graph}>
              <div
                style={{
                  color: 'black',
                  width: '100%',
                  height: '500px',
                  backgroundColor: 'beige',
                }}
              >
                Graph Here
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
  releaseID: ownProps.match.params.releaseID,
});

export default connect(mapStateToProps)(ViewRelease);
