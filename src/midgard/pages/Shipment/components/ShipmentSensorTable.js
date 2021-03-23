import React, { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  SHIPMENT_SENSOR_COLUMNS,
  SHIPMENT_SENSOR_REPORT_TOOLTIP,
} from "../ShipmentConstants";
import { convertUnitsOfMeasure } from "midgard/utils/utilMethods";
import CustomizedTooltips from "midgard/components/ToolTip/ToolTip";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  tooltip: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  title: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: "uppercase",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
  },
  leftHeader: {
    '& span': {
      textAlign: "left",
    },
  },
}));

const ShipmentSensorTable = (props) => {
  const classes = useStyles();
  const { aggregateReport, shipmentName, selectedMarker } = props;
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);

  const columns = SHIPMENT_SENSOR_COLUMNS.map(column => ({
    ...column,
    options: {
      ...column.options,
      setCellHeaderProps: () => ({ className: classes.leftHeader, }),
    },
  }));
  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight: "500px",
    tableBodyMaxHeight: "",
    selectableRows: "multiple",
    selectToolbarPlacement: "none",
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: { filename: "AggregateReportData.csv", separator: "," },
    rowsSelected: selected,
    textLabels: {
      body: {
        noMatch: "No data to display",
      },
    },
    customSort: (data, colIndex, order, meta) => {
      if (colIndex === 1) {
        return _.orderBy(data, (item) => {return moment(item.data[colIndex])}, [order]);
      }
      return data.sort((a, b) => {
        return (a.data[colIndex].length < b.data[colIndex].length ? -1: 1 ) * (order === 'desc' ? 1 : -1);
      });
    }
  };

  useEffect(() => {
    if (aggregateReport) {
      const sortedData = _.orderBy(aggregateReport, (item) => {return moment(item.timestamp)}, ['desc']);
      setRows(sortedData);
    }
  }, [aggregateReport]);

  useEffect(() => {
    if (selectedMarker) {
      const selectedIndex = _.map(_.keys(_.pickBy(rows, {lat: selectedMarker.lat,lng:selectedMarker.lng})), Number);
      setSelected(selectedIndex);
    }
    else
      setSelected([]);
  }, [selectedMarker]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.tooltip}>
          <Typography
            className={classes.title}
            variant="h5"
          >
            {shipmentName &&
              `Sensor Report - Shipment: ${shipmentName}`}
            <CustomizedTooltips toolTipText={SHIPMENT_SENSOR_REPORT_TOOLTIP} />
          </Typography>
        </div>
        <MUIDataTable
          data={rows}
          columns={columns}
          options={options}
        />
      </Grid>
    </Grid>
  )
}

export default ShipmentSensorTable;
