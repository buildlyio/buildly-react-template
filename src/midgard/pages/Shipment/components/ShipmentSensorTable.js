import React, { useEffect, useState } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { SHIPMENT_SENSOR_COLUMNS } from "../ShipmentConstants";
import DataTable from "midgard/components/Table/Table";
import { convertUnitsOfMeasure } from "midgard/utils/utilMethods";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}));

const ShipmentSensorTable = (props) => {
  const classes = useStyles();
  const { sensorReport } = props;
  const [reducedData, setReducedData] = useState([]);

  useEffect(() => {
    if (sensorReport) {
      const data = sensorReport.map(report => {
        const alert_status = report.excursion_flag ? "Excursion" : report.warning_flag ? "Warning" : "Normal";
        const temp = convertUnitsOfMeasure('celsius', report.report_temp, 'fahrenheit', 'temperature');
        const locObj = JSON.parse(report.report_location[0].replaceAll(`'`, `"`));

        return ({ 
          shipment_id: Number(report.shipment_id[0]),
          alert_status,
          timestamp: report.edit_date,
          location: locObj,
          humidity: report.report_humidity,
          temp,
        })
      });
      const sortedData = _.orderBy(data, ['timestamp'], ['desc']);
      setReducedData(sortedData);
    }
  }, [sensorReport]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12}>
        <DataTable
          rows={reducedData}
          columns={SHIPMENT_SENSOR_COLUMNS}
        />
      </Grid>
    </Grid>
  )
}

export default ShipmentSensorTable;
