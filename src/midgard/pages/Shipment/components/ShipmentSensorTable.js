import React, { useEffect, useState } from "react";
import _ from "lodash";
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
  const { sensorReport, shipmentUuid, shipmentName } = props;
  const [rows, setRows] = useState([]);

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
    selectableRows: "none",
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: { filename: "SensorReportData.csv", separator: "," },
    textLabels: {
      body: {
        noMatch: "No data to display",
      },
    },
  };

  useEffect(() => {
    if (sensorReport) {
      const data = sensorReport.map(report => {
        const alert_status = report.excursion_flag ? "Excursion" : report.warning_flag ? "Warning" : "Normal";
        const temperature = convertUnitsOfMeasure('celsius', report.report_temp, 'fahrenheit', 'temperature');
        const locObj = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));

        return ({ 
          shipment_id: shipmentUuid,
          alert_status,
          timestamp: report.edit_date,
          latitude: locObj.latitude,
          longitude: locObj.longitude,
          humidity: report.report_humidity,
          temperature,
        })
      });
      const sortedData = _.orderBy(data, ['timestamp'], ['desc']);
      setRows(sortedData);
    }
  }, [sensorReport]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.tooltip}>
          <Typography
            className={classes.title}
            variant="h5"
          >
            {shipmentName && 
            `Sensor Report for Shipment: ${shipmentName}`}
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
