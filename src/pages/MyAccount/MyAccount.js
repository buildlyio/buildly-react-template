import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Button,
  Avatar,
} from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import profile from '@assets/profile.png';
import Loader from '@components/Loader/Loader';
import Modal from '@components/Modal/Modal';
import { routes } from '@routes/routesConstants';
import EditProfileInfo from './forms/EditProfileInfo';

const useStyles = makeStyles((theme) => ({
  pageHeading: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(5),
  },
  iconRight: {
    textAlign: 'right',
  },
  large: {
    width: '50px',
    height: '50px',
    margin: 'auto',
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
  },
  backButton: {
    margin: theme.spacing(3, 0),
  },
}));

/**
 * Outputs the profile page for the user.
 */
const MyAccount = ({
  history,
  contactInfo,
  data,
  organizationData,
  loading,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(false);

  let user;
  if (data && data.data) {
    user = data.data;
  }

  return (
    <Box mt={3} textAlign="center">
      {loading && <Loader open={loading} />}
      <Typography className={classes.pageHeading} variant="h5">
        Accounts and Settings
      </Typography>
      <Grid container spacing={4} justify="center">
        <Grid item md={contactInfo ? 6 : 8} xs={12}>
          <Typography variant="h6">Account Info</Typography>
          <Card variant="outlined">
            <CardContent>
              <div className={classes.iconRight}>
                <IconButton
                  edge="end"
                  color="secondary"
                  aria-label="edit"
                  onClick={() => setFormModal(true)}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <Avatar
                    alt="Remy Sharp"
                    src={profile}
                    className={classes.large}
                  />
                  <Typography variant="h6">
                    {user && user.username}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} sm={8}>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">
                          First Name:
                        </Typography>
                        <Typography variant="body1">
                          {user && user.first_name}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">
                          Last Name:
                        </Typography>
                        <Typography variant="body1">
                          {user && user.last_name}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">
                          Customer ID:
                        </Typography>
                        <Typography variant="body1">
                          {user && user.core_user_uuid}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    {organizationData && (
                      <Grid item xs={12}>
                        <div className={classes.infoSection}>
                          <Typography variant="body2">
                            Company:
                          </Typography>
                          <Typography variant="body1">
                            {organizationData.name}
                          </Typography>
                        </div>
                        <Divider />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">
                          Email:
                        </Typography>
                        <Typography variant="body1">
                          {user && user.email}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">
                          Shipment Email Alerts:
                        </Typography>
                        <Typography variant="body1">
                          {user && user.email_alert_flag
                            ? 'Yes'
                            : 'No'}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {contactInfo && (
          <Grid item md={6} xs={12}>
            <Card variant="outlined">Contact info</Card>
          </Grid>
        )}
      </Grid>
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={() => history.push(routes.SHIPMENT)}
        className={classes.backButton}
      >
        Back To Shipment Page
      </Button>
      {openFormModal && (
        <EditProfileInfo
          editData={user}
          openFormModal={openFormModal}
          setFormModal={setFormModal}
          organizationData={organizationData}
        />
      )}
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(MyAccount);
