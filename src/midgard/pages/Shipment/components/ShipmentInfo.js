import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@material-ui/core";
import { MapComponent } from "../../../components/MapComponent/MapComponent";
import { routes } from "../../../routes/routesConstants";

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
    borderRadius: "18px",
    fontSize: 11,
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
  cardItems: {
    marginTop: theme.spacing(4),
  },
}));

function ShipmentInfo(props) {
  const { handleNext, shipmentFormData, history } = props;
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  return (
    <React.Fragment>
      <div>
        <form className={classes.form} noValidate>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="item_name"
                      label="Item Name"
                      name="item_name"
                      autoComplete="item_name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      required
                      fullWidth
                      id="item_name"
                      label="Item Name"
                      name="item_name"
                      autoComplete="item_name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="item_name"
                      label="Item Name"
                      name="item_name"
                      autoComplete="item_name"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="item_name"
                      label="Item Name"
                      name="item_name"
                      autoComplete="item_name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MapComponent
                      isMarkerShown
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOxE87ZNM_xe5X1BH1KYwUo9S4Qs1BV5w&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `200px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={6} md={4}>
              {shipmentFormData && shipmentFormData.originInfo ? (
                <Card variant="outlined" className={classes.cardItems}>
                  <Typography variant="body2">Origin Info</Typography>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Origin Company"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="ETA Data/Time"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Edit Origin Info
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() =>
                    history.push(`${routes.SHIPMENT}/add/origin`, {
                      from: `${routes.SHIPMENT}/add`,
                      shipmentFormData,
                    })
                  }
                >
                  Add Origin Info
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {shipmentFormData && shipmentFormData.shipperInfo ? (
                <Card variant="outlined" className={classes.cardItems}>
                  <Typography variant="body2">Shipper Info</Typography>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Origin Company"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="ETA Data/Time"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Edit Shipper Info
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Add Shipper Info
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {shipmentFormData && shipmentFormData.destinationInfo ? (
                <Card variant="outlined" className={classes.cardItems}>
                  <Typography variant="body2">Destination Info</Typography>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Origin Company"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="ETA Data/Time"
                          secondary="Jan 9, 2014"
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Edit Destination Info
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Add Destination Info
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          // className={classes.button}
        >
          Add Custodian
        </Button>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(ShipmentInfo);
