import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import {
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Button,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import { routes } from "../../routes/routesConstants";
import profile from "assets/profile.png";
import Modal from "../../components/Modal/Modal";
import EditProfileInfo from "./forms/EditProfileInfo";
import { getOrganization } from "../../redux/authuser/actions/authuser.actions";

const useStyles = makeStyles((theme) => ({
  pageHeading: {
    fontWeight: "bold",
    marginBottom: theme.spacing(5),
  },
  tileView: {
    display: "flex",
  },
  rowView: {
    display: "flex",
    flexDirection: "column",
  },
  switchViewSection: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  tileHeading: {
    flex: 1,
    padding: "8px",
  },
  iconRight: {
    textAlign: "right",
  },
  large: {
    width: "50px",
    height: "50px",
    margin: "auto",
  },
  infoSection: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: theme.spacing(2),
  },
  backButton: {
    margin: theme.spacing(3, 0),
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

/**
 * Outputs the profile page for the user.
 */
function MyAccount({
  dispatch,
  history,
  location,
  contactInfo,
  data,
  organizationData,
}) {
  let classes = useStyles();
  const [openModal, setModal] = useState(false);

  let user;

  if (data && data.data) {
    user = data.data;
  }

  useEffect(() => {
    if (user && user.organization && user.organization.organization_uuid)
      dispatch(getOrganization(user.organization.organization_uuid));
  }, [user]);

  console.log("organizationData", organizationData);

  return (
    <Box mt={3} textAlign={"center"}>
      <Typography className={classes.pageHeading} variant={"h5"}>
        Accounts and Settings
      </Typography>
      <Grid container spacing={4} justify={"center"}>
        <Grid item md={contactInfo ? 6 : 8} xs={12}>
          <Typography variant={"h6"}>Account Info</Typography>
          <Card variant={"outlined"}>
            <CardContent>
              <div className={classes.iconRight}>
                <IconButton
                  edge="end"
                  color="secondary"
                  aria-label="edit"
                  onClick={() => setModal(true)}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <Grid container spacing={3} justify={"center"}>
                <Grid item xs={12}>
                  <Avatar
                    alt="Remy Sharp"
                    src={profile}
                    className={classes.large}
                  />
                  <Typography variant="h6">{user && user.username}</Typography>
                </Grid>
                <Grid item xs={12} md={6} sm={8}>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">First Name:</Typography>
                        <Typography variant="body1">
                          {user && user.first_name}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">Last Name:</Typography>
                        <Typography variant="body1">
                          {user && user.last_name}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">Customer Id:</Typography>
                        <Typography variant="body1">
                          {user && user.id}
                        </Typography>
                      </div>
                      <Divider />
                    </Grid>
                    {organizationData && (
                      <Grid item xs={12}>
                        <div className={classes.infoSection}>
                          <Typography variant="body2">Company:</Typography>
                          <Typography variant="body1">
                            {user && user.organization.name}
                          </Typography>
                        </div>
                        <Divider />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <div className={classes.infoSection}>
                        <Typography variant="body2">Email:</Typography>
                        <Typography variant="body1">
                          {user && user.email}
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
            <Card variant={"outlined"}>Contact info</Card>
          </Grid>
        )}
      </Grid>
      <Button
        type="button"
        // fullWidth
        variant="contained"
        color="primary"
        onClick={() => history.push(routes.DASHBOARD)}
        className={classes.backButton}
      >
        Back To Dashboard
      </Button>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={(closeModal) => setModal(!openModal)}
          title={"Edit Profile Info"}
          titleClass={classes.formTitle}
          maxWidth={"sm"}
        >
          <EditProfileInfo
            editData={user}
            setModal={setModal}
            organizationData={organizationData}
          />
        </Modal>
      )}
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});
export default connect(mapStateToProps)(MyAccount);
