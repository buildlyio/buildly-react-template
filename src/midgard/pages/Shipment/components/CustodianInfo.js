import React from "react";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid, Box, Typography } from "@material-ui/core";
import Custodians from "../../Custodians/Custodians";
import { routes } from "../../../routes/routesConstants";
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
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
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
  },
  alignRight: {
    marginLeft: "auto",
  },
}));

function CustodianInfo(props) {
  const {
    gatewayData,
    gatewaySearchedData,
    sensorData,
    sensorSearchedData,
    handleBack,
    handleNext,
    history,
    handleSaveAndClose,
  } = props;
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  return (
    <React.Fragment>
      {!isDesktop && (
        <Box mb={5}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h4">Custodians (2/5)</Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                color="primary"
                onClick={handleBack}
                className={classes.submit}
              >
                {"Back"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      <Custodians
        noSearch={true}
        history={history}
        redirectTo={`${routes.SHIPMENT}/add`}
      />
      <Grid container spacing={3} className={classes.buttonContainer}>
        <Grid item xs={6} sm={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSaveAndClose}
            className={classes.submit}
          >
            {`Save & Close`}
          </Button>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => history.push(`${routes.SHIPMENT}`)}
            className={classes.submit}
          >
            {"Cancel"}
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} className={classes.alignRight}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNext}
            className={classes.submit}
          >
            Next: Add Items
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.custodianReducer,
});

export default connect(mapStateToProps)(CustodianInfo);
