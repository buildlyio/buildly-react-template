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
  MenuItem,
} from "@material-ui/core";
import { MapComponent } from "../../../components/MapComponent/MapComponent";
import { routes } from "../../../routes/routesConstants";
import { MAP_API_URL } from "../../../utils/utilMethods";
import { useInput } from "../../../hooks/useInput";
import { SHIPMENT_STATUS } from "../../../utils/mock";

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
  cardItems: {
    marginTop: theme.spacing(4),
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
  },
  alignRight: {
    marginLeft: "auto",
  },
}));

function ShipmentInfo(props) {
  const { handleNext, shipmentFormData, history, custodianData } = props;
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const shipment_id = useInput("");
  const lading_bill = useInput("");
  const load_no = useInput("");
  const shipment_status = useInput("");
  const route_desc = useInput("");
  const route_dist = useInput("");
  return (
    <React.Fragment>
      <div>
        {!isDesktop && (
          <Box mb={2}>
            <Typography variant="h4">Shipment Details(1/5)</Typography>
          </Box>
        )}
        <form className={classes.form} noValidate>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      disabled
                      fullWidth
                      id="shipment_id"
                      label="Shipment Id"
                      name="shipment_id"
                      autoComplete="shipment_id"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="lading_bill"
                      label="Bill of Lading"
                      name="lading_bill"
                      autoComplete="lading_bill"
                      {...lading_bill.bind}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      multiline
                      rows={4}
                      id="route_desc"
                      label="Route Description"
                      name="route_desc"
                      autoComplete="route_desc"
                      {...route_desc.bind}
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
                      fullWidth
                      id="shipment_status"
                      name="shipment_status"
                      select
                      label="Shipment Status"
                      {...shipment_status.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {SHIPMENT_STATUS &&
                        SHIPMENT_STATUS.map((item, index) => (
                          <MenuItem key={`${item}`} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <MapComponent
                      isMarkerShown
                      googleMapURL={MAP_API_URL}
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
                          secondary={shipmentFormData.originInfo.company_name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary={shipmentFormData.originInfo.address}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="ETA Data/Time"
                          secondary={shipmentFormData.originInfo.eta}
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.submit}
                    >
                      Edit Origin Info
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  color="secondary"
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
                          primary="Shipping Company"
                          secondary={shipmentFormData.shipperInfo.company_name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary={shipmentFormData.shipperInfo.address}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Mode Type"
                          secondary={shipmentFormData.shipperInfo.mode_type}
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.submit}
                    >
                      Edit Shipper Info
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  className={classes.submit}
                  onClick={() =>
                    history.push(`${routes.SHIPMENT}/add/shipper`, {
                      from: `${routes.SHIPMENT}/add`,
                      shipmentFormData,
                    })
                  }
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
                          primary="Destination Company"
                          secondary={
                            shipmentFormData.destinationInfo.company_name
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary={shipmentFormData.destinationInfo.address}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="ETA Data/Time"
                          secondary={shipmentFormData.destinationInfo.eta}
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.submit}
                    >
                      Edit Destination Info
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  color="secondary"
                  className={classes.submit}
                  onClick={() =>
                    history.push(`${routes.SHIPMENT}/add/destination`, {
                      from: `${routes.SHIPMENT}/add`,
                      shipmentFormData,
                    })
                  }
                >
                  Add Destination Info
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(ShipmentInfo);
