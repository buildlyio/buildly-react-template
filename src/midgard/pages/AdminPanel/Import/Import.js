import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import AddFromFile from "./forms/AddFromFile";

const useStyles = makeStyles((theme) => ({
  grid: {
    width: "100%",
    backgroundColor: "#393636",
  },
  title: {
    padding: theme.spacing(2),
  },
}));

const Import = () => {
  const classes = useStyles();

  return (
    <Box mt={5} mb={5}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.grid}>
            <Typography className={classes.title} variant="h6">
              Import From File
            </Typography>
            <AddFromFile />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.grid}>
            <Typography className={classes.title} variant="h6">
              Import From API
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Import;
