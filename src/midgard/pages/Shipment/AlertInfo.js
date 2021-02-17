import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { UserContext } from "midgard/context/User.context";
import { setAlerts, emailAlerts } from "../../redux/shipment/actions/shipment.actions";
import { checkForAdmin, checkForGlobalAdmin } from "midgard/utils/utilMethods";

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
  let { shipmentData, shipmentFlag, dispatch, shipmentAlerts } = props;
  const [openAlerts, setOpenAlerts] = useState([]);
  // const [alertsToShow, setAlertsToShow] = useState([]);
  const user = useContext(UserContext);
  const isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);

  useEffect(() => {
    if (
      shipmentData &&
      shipmentData.length &&
      shipmentAlerts &&
      shipmentAlerts.show
    ) {
      let alerts = [];
      let openAlerts = [];
      let messages = [];
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
                messages.push({
                  shipment_uuid: element.shipment_uuid,
                  alert_message: flag.name,
                });
              }
            });
        });
      dispatch(setAlerts({ show: true, data: alerts }));
      if (isAdmin && messages.length > 0) {
        dispatch(emailAlerts({
          user_uuid: user.core_user_uuid,
          messages: messages,
          date_time: new Date().toJSON(),
        }))
      }
      // setAlertsToShow(alerts);
      setOpenAlerts(openAlerts);
    }
  }, [shipmentData, shipmentFlag]);

  const classes = useStyles();
  const handleClose = (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    let open = shipmentAlerts.data.filter((item, idx) => idx !== index);
    if (open.length === 0) {
      dispatch(setAlerts({ show: false, data: open }));
    } else {
      dispatch(setAlerts({ show: true, data: open }));
    }
    // setAlertsToShow(open);
    setOpenAlerts(open);
  };
  return (
    <div className={classes.root}>
      {shipmentAlerts &&
        shipmentAlerts.data.map((alert, index) => {
          return (
            <Alert
              key={`shipmentAlert${index}:${alert.shipment}`}
              variant="filled"
              severity={alert.severity}
              onClose={(e) => handleClose(e, index)}
              classes={{ message: classes.message, root: classes.alert }}
              title={`${alert.name} ${
                alert.type.toLowerCase() === "warning" ? "Warning" : "Violation"
              } Shipment#${alert.shipment}`}
            >
              {`${alert.name} ${
                alert.type.toLowerCase() === "warning" ? "Warning" : "Violation"
              } Shipment#${alert.shipment}`}
            </Alert>
          );
        })}
    </div>
  );
}

export default AlertInfo;
