import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {
  getExportData,
} from "midgard/redux/importExport/actions/importExport.actions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    margin: "auto",
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
  },
}));

const ExportData = ({ dispatch, exportData }) => {
  const classes = useStyles();
  const [exportTable, setExportTable] = useState("");
  const [exportType, setExportType] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false)
  }, []);

  useEffect(() => {
    if (exportData && ready) {
      var fileName = `${_.startCase(exportTable)} ${new Date().toLocaleDateString()}.${exportType}` || `export.${exportType}`;
      var blob = new Blob([exportData], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", fileName);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
      setReady(false)
    }
  }, [exportData, ready]);

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(getExportData(exportTable, exportType))
    setReady(true)
  };

  return (
    <form className={classes.root} noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="exportTable"
            label="Data to export"
            select
            value={exportTable}
            onChange={e => setExportTable(e.target.value)}
          >
            <MenuItem value={""}>--------</MenuItem>
            <MenuItem value={"item"}>Items</MenuItem>
            <MenuItem value={"product"}>Products</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="exportType"
            label="Export As"
            select
            value={exportType}
            onChange={e => setExportType(e.target.value)}
          >
            <MenuItem value={""}>--------</MenuItem>
            <MenuItem value={"csv"}>CSV</MenuItem>
          </TextField>
        </Grid>
        <Grid container spacing={2} justify="center">
          <Grid item xs={6} sm={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={!exportTable || !exportType}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.importExportReducer,
});

export default connect(mapStateToProps)(ExportData);
