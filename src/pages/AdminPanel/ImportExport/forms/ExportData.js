import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@material-ui/core';
import {
  clearData,
  getExportData,
} from '@redux/importExport/actions/importExport.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    margin: 'auto',
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
}));

const ExportData = ({ dispatch, exportData }) => {
  const classes = useStyles();
  const [exportTable, setExportTable] = useState('');
  const [exportType, setExportType] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(clearData());
    setReady(false);
  }, []);

  useEffect(() => {
    if (exportData && ready) {
      const fileName = `${_.startCase(exportTable)} ${new Date().toLocaleDateString()}.${exportType}` || `export.${exportType}`;
      const blob = new Blob([exportData], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      setReady(false);
    }
  }, [exportData, ready]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(getExportData(exportTable, exportType));
    setReady(true);
  };

  return (
    <form
      className={classes.root}
      noValidate
      onSubmit={handleSubmit}
    >
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
            onChange={(e) => {
              dispatch(clearData());
              setExportTable(e.target.value);
            }}
          >
            <MenuItem value="">--------</MenuItem>
            <MenuItem value="item">Items</MenuItem>
            <MenuItem value="product">Products</MenuItem>
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
            onChange={(e) => {
              dispatch(clearData());
              setExportType(e.target.value);
            }}
          >
            <MenuItem value="">--------</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </TextField>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
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
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.importExportReducer,
});

export default connect(mapStateToProps)(ExportData);
