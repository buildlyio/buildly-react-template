import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    position: "relative",
  },
  snackbar: {
    position: "absolute",
    [theme.breakpoints.down("xs")]: {
      top: "-40px",
    },
    top: 0,
    [theme.breakpoints.up("sm")]: {
      width: "50%",
    },
    margin: "0",
  },
  alert: {
    width: "100%",
    position: "absolute",
    [theme.breakpoints.up("sm")]: {
      width: "50%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    [theme.breakpoints.down("xs")]: {
      top: "-40px",
    },
    top: 0,
    margin: 0,
    borderRadius: "24px",
  },
  message: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

function AlertInfo(props) {
  let { shipmentData, shipmentFlag } = props;
  const [openAlerts, setOpenAlerts] = useState([]);
  const [alertsToShow, setAlertsToShow] = useState([]);

  useEffect(() => {
    if (shipmentData && shipmentData.length) {
      let alerts = [];
      let openAlerts = [];
      shipmentData &&
        shipmentData.forEach((element, index) => {
          shipmentFlag &&
            shipmentFlag.forEach((flag) => {
              if (
                element.flags.indexOf(flag.url) !== -1 &&
                flag.type !== "None"
              ) {
                alerts.push({
                  type: flag.type,
                  name: flag.name,
                  shipment: element.shipment_uuid,
                  severity:
                    flag.type.toLowerCase() === "warning" ? "warning" : "error",
                });
                openAlerts.push(index);
              }
            });
        });
      setAlertsToShow(alerts);
      setOpenAlerts(openAlerts);
    }
  }, [shipmentData, shipmentFlag]);

  const classes = useStyles();
  const handleClose = (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    let open = alertsToShow.filter((item, idx) => idx !== index);
    setAlertsToShow(open);
  };
  return (
    <div className={classes.root}>
      {alertsToShow.map((alert, index) => {
        return (
          //   <Snackbar
          //     key={`alert${index}`}
          //     open={openAlerts.indexOf(index) !== -1}
          //     onClose={(e) => handleClose(e, index)}
          //     anchorOrigin={{ vertical: "top", horizontal: "center" }}
          //     className={classes.snackbar}
          //   >
          <Alert
            key={`alert${index}`}
            variant="filled"
            severity={alert.severity}
            onClose={(e) => handleClose(e, index)}
            classes={{ message: classes.message, root: classes.alert }}
            title={`${alert.name} ${alert.type} Shipment#${alert.shipment}`}
          >
            {`${alert.name} ${alert.type} Shipment#${alert.shipment}`}
          </Alert>
          //   </Snackbar>
        );
      })}
      {/* <Alert onClose={handleClose} severity={data.type}>
        {data.message}
      </Alert> */}
    </div>
  );
}

export default AlertInfo;
