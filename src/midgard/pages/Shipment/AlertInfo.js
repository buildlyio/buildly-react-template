import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { UserContext } from "midgard/context/User.context";
import { setShipmentAlerts, emailAlerts } from "../../redux/shipment/actions/shipment.actions";
import { getFormattedCustodyRows } from "./ShipmentConstants";

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
    width: '100%',
    position: 'absolute',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      left: '55%',
      transform: 'translateX(-50%)',
    },
    [theme.breakpoints.up('md')]: {
      left: '55%',
      width: 'max-content',
      transform: 'translateX(-50%)',
    },
    [theme.breakpoints.down('xs')]: {
      top: '60px',
      width: '50%',
      left: '60%',
      transform: 'translateX(-40%)',
    },
    top: 0,
    margin: 0,
    borderRadius: '24px',
  },
  message: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

function AlertInfo(props) {
  let { shipmentData, shipmentFlag, dispatch, shipmentAlerts, sensorReportAlerts, custodyData, custodianData } = props;
  const [openShipmentAlerts, setOpenShipmentAlerts] = useState([]);
  const [geofenceAlerts, setGeofenceAlerts] = useState({show: false, data : []});
  const [openGeofenceAlerts, setOpenGeofenceAlerts] = useState([]);
  const user = useContext(UserContext);

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
                  date_time: new Date().toJSON(),
                });
              }
            });
        });
      dispatch(setShipmentAlerts({ show: true, data: alerts }));
      if (user && user.email_alert_flag && messages.length > 0) {
        dispatch(emailAlerts({
          user_uuid: user.core_user_uuid,
          messages: messages,
          date_time: new Date().toJSON(),
          subject_line: 'Warning / Excursion Alert'
        }))
      }
      setOpenShipmentAlerts(openAlerts);
    }
  }, [shipmentData, shipmentFlag]);

  useEffect(() => {
    if (shipmentData &&
      shipmentData.length &&
      custodyData &&
      custodyData.length &&
      sensorReportAlerts) {
      let custodyRows = [];
      let alerts = [];
      let openAlerts = [];
      let messages = [];
      let currentCustody = [];
      if (
        custodyData &&
        custodyData.length &&
        custodianData &&
        custodianData.length
      ) {
        custodyRows = getFormattedCustodyRows(custodyData, custodianData);
      }
      shipmentData && shipmentData.forEach((element) => {
        sensorReportAlerts && sensorReportAlerts.forEach((sensorReportAlert,index) => {
          if (element.partner_shipment_id === sensorReportAlert.shipment_id && sensorReportAlert.custodian_id){
            custodyRows && custodyRows.forEach((custody) => {
              if (custody.shipment_id === element.shipment_uuid && custody.custodian_data.custodian_uuid === sensorReportAlert.custodian_id[0]) {
                currentCustody = custody
                return
              }
            })
            let message = ''
            switch(sensorReportAlert.shipment_custody_status) {
              case 'left':
                message = 'Has left start location'
                break
              case 'arriving':
                message = 'Is arriving end location'
                break
              case 'reached':
                message = 'Has reached end location'
                break
            }
            alerts.push({
              type: sensorReportAlert.shipment_custody_status,
              name: `${message} : Shipment #${element.shipment_uuid} Custody : ${currentCustody.custodian_name}`,
              shipment: element.shipment_uuid,
              custody_at: sensorReportAlert.present_start_geofence ? "start" : "end",
            });
            openAlerts.push(index);
            messages.push({
              shipment_uuid: element.shipment_uuid,
              alert_message: `Shipment ${message} of ${currentCustody.custodian_name}`,
              date_time: sensorReportAlert.report_date_time,
            })
          }
        })
      });
      setGeofenceAlerts({data: alerts, show: true});
      if (user && user.email_alert_flag && messages.length > 0) {
        dispatch(emailAlerts({
          user_uuid: user.core_user_uuid,
          messages: messages,
          date_time: new Date().toJSON(),
          subject_line: 'Geofence Alert'
        }))
      }
      setOpenGeofenceAlerts(openAlerts);
  }
  }, [shipmentData, sensorReportAlerts]);

  const classes = useStyles();
  const handleClose = (event, index, type) => {
    event.stopPropagation();
    event.preventDefault();
    if (type === 'shipment') {
      let open = shipmentAlerts.data.filter((item, idx) => idx !== index);
      if (open.length === 0) {
        dispatch(setShipmentAlerts({ show: false, data: open }));
      } else {
        dispatch(setShipmentAlerts({ show: true, data: open }));
      }
      setOpenShipmentAlerts(open);
    }
    else if (type === 'geofence') {
      let open = geofenceAlerts.data.filter((item, idx) => idx !== index);
      if (open.length === 0) {
        setGeofenceAlerts({ show: false, data: open });
      } else {
        setGeofenceAlerts({ show: true, data: open });
      }
      setOpenGeofenceAlerts(open);
    }
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
              onClose={(e) => handleClose(e, index,"shipment")}
              classes={{ message: classes.message, root: classes.alert }}
              title={`${alert.name} ${alert.type.toLowerCase() === "warning" ? "Warning" : "Violation"
                } Shipment#${alert.shipment}`}
            >
              {`${alert.name} ${alert.type.toLowerCase() === "warning" ? "Warning" : "Violation"
                } Shipment#${alert.shipment}`}
            </Alert>
          );
        })}
      {geofenceAlerts && geofenceAlerts.data.map((alert, index) => {
        return (
          <Alert
            key={`sensorReportAlert${index}:${alert.shipment}`}
            variant="filled"
            severity="info"
            onClose={(e) => handleClose(e, index, "geofence")}
            classes={{ message: classes.message, root: classes.alert }}
            title={`${alert.name}`}
          >
            {`${alert.name}`}
          </Alert>
        );
      })}
    </div>
  );
}

export default AlertInfo;
