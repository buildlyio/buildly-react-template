import React from "react";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid, Box, Typography } from "@material-ui/core";
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

function ViewDetailsWrapper(props) {
  const { handleBack, children, title, maxSteps, activeStep } = props;
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  return (
    <React.Fragment>
      {!isDesktop && activeStep !== 0 && (
        <Box mb={5}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h4">{`${title} ${
                activeStep + 1
              }/${maxSteps}`}</Typography>
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
      {children}
    </React.Fragment>
  );
}

export default ViewDetailsWrapper;
