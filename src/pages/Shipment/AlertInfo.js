import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { UserContext } from "@context/User.context";
import { updateCustody } from "@redux/custodian/actions/custodian.actions";
import {
  setShipmentAlerts,
  emailAlerts,
  editShipment,
} from "@redux/shipment/actions/shipment.actions";
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
    width: "100%",
    position: "absolute",
    [theme.breakpoints.up("sm")]: {
      width: "50%",
      left: "55%",
      transform: "translateX(-50%)",
    },
    [theme.breakpoints.up("md")]: {
      left: "55%",
      width: "max-content",
      transform: "translateX(-50%)",
    },
    [theme.breakpoints.down("xs")]: {
      top: "60px",
      width: "50%",
      left: "60%",
      transform: "translateX(-40%)",
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

const AlertInfo = ({
  shipmentData,
  shipmentFlag,
  dispatch,
  shipmentAlerts,
  sensorReportAlerts,
  custodyData,
  custodianData,
}) => {
  const classes = useStyles();
  const [openShipmentAlerts, setOpenShipmentAlerts] = useState([]);
  const [geofenceAlerts, setGeofenceAlerts] = useState({
    show: false,
    data: [],
  });
  const [openGeofenceAlerts, setOpenGeofenceAlerts] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    if (
      shipmentData &&
      shipmentAlerts &&
      shipmentData.length &&
      shipmentAlerts.show
    ) {
      const alerts = [];
      const openAlerts = [];
      const messages = [];
      const viewedShipmentAlerts = localStorage.getItem("shipmentAlerts")
        ? JSON.parse(localStorage.getItem("shipmentAlerts"))
        : [];

      shipmentData &&
        shipmentData.forEach((element, index) => {
          shipmentFlag &&
            shipmentFlag.forEach((flag) => {
              if (
                element.flags.indexOf(flag.url) !== -1 &&
                flag.type !== "None" &&
                (element.status.toLowerCase() === "planned" ||
                  element.status.toLowerCase() === "enroute") &&
                !viewedShipmentAlerts.includes(
                  `${element.shipment_uuid}-${flag.id}`
                )
              ) {
                alerts.push({
                  type: flag.type,
                  name: flag.name,
                  shipment: element.name,
                  url: `${element.shipment_uuid}-${flag.id}`,
                  severity:
                    flag.type.toLowerCase() === "warning" ? "warning" : "error",
                });
                openAlerts.push(index);
                messages.push({
                  shipment_uuid: element.name,
                  alert_message: flag.name,
                  date_time: new Date().toJSON(),
                });
              }
            });
        });
      dispatch(setShipmentAlerts({ show: true, data: alerts }));
      if (user && user.email_alert_flag && messages.length > 0) {
        dispatch(
          emailAlerts({
            user_uuid: user.core_user_uuid,
            messages,
            date_time: new Date().toJSON(),
            subject_line: "Warning / Excursion Alert",
          })
        );
      }
      setOpenShipmentAlerts(openAlerts);
    }
  }, [shipmentData, shipmentFlag]);

  useEffect(() => {
    if (
      shipmentData &&
      shipmentData.length &&
      custodyData &&
      custodyData.length &&
      sensorReportAlerts
    ) {
      let custodyRows = [];
      let alerts = [];
      const openAlerts = [];
      const messages = [];
      let currentCustody = {};
      const updatedCustodies = [];
      const viewedGeoAlerts = localStorage.getItem("geofenceAlerts")
        ? JSON.parse(localStorage.getItem("geofenceAlerts"))
        : [];

      if (
        custodyData &&
        custodyData.length &&
        custodianData &&
        custodianData.length
      ) {
        custodyRows = getFormattedCustodyRows(custodyData, custodianData);
      }
      shipmentData &&
        shipmentData.forEach((element) => {
          sensorReportAlerts &&
            sensorReportAlerts.forEach((sensorReportAlert, index) => {
              if (
                element.partner_shipment_id === sensorReportAlert.shipment_id &&
                (element.status.toLowerCase() === "planned" ||
                  element.status.toLowerCase() === "enroute") &&
                sensorReportAlert.custodian_id &&
                sensorReportAlert.custodian_id.length > 0
              ) {
                const sensorCustodian = sensorReportAlert.custodian_id;
                custodyRows &&
                  custodyRows.forEach((custody) => {
                    if (
                      custody.shipment_id === element.shipment_uuid &&
                      (sensorCustodian.includes(
                        custody.custodian_data.custodian_uuid
                      ) ||
                        sensorCustodian.includes(custody.custody_uuid))
                    ) {
                      if (custody.has_current_custody) {
                        currentCustody = custody;
                        currentCustody.custodian_uuid =
                          custody.custodian_data.custodian_uuid;
                      } else {
                        updatedCustodies.push(custody);
                      }
                    }
                  });
                if (
                  currentCustody !== undefined &&
                  (sensorCustodian.includes(currentCustody.custodian_uuid) ||
                    sensorCustodian.includes(currentCustody.custody_uuid))
                ) {
                  let message = "";
                  switch (sensorReportAlert.shipment_custody_status) {
                    case "present-start-geofence":
                      message = "At start location";
                      break;

                    case "left-start-geofence":
                      message = "Left start location";
                      break;

                    case "arriving-end-geofence":
                      message = "Arriving end location";
                      break;

                    case "present-end-geofence":
                      message = "At end location";
                      break;

                    case "reached-end-geofence":
                      message = "Reached end location";
                      break;

                    case "left-end-geofence":
                      message = "Custody Handoff";
                      break;

                    default:
                      break;
                  }
                  if (
                    !viewedGeoAlerts.includes(sensorReportAlert.id) &&
                    moment().diff(sensorReportAlert.report_date_time, "h") <= 24
                  ) {
                    alerts.push({
                      type: sensorReportAlert.shipment_custody_status,
                      name: `${message} : ${currentCustody.custodian_name} -  Shipment ${element.name}`,
                      shipment: element.name,
                      id: sensorReportAlert.id,
                      date_time: sensorReportAlert.report_date_time,
                    });
                    openAlerts.push(index);
                    messages.push({
                      shipment_uuid: element.name,
                      alert_message: `Shipment ${message} of ${currentCustody.custodian_name}`,
                      date_time: sensorReportAlert.report_date_time,
                    });

                    if (
                      sensorReportAlert.shipment_custody_status ===
                        "left-end-geofence" &&
                      currentCustody.custody_uuid !==
                        sensorReportAlert.current_custody_id
                    ) {
                      updatedCustodies &&
                        updatedCustodies.forEach((custody) => {
                          if (
                            custody.custody_uuid ===
                            sensorReportAlert.current_custody_id
                          ) {
                            // Update custody current one
                            const custodyFormValues = {
                              id: custody.id,
                              has_current_custody: true,
                            };
                            dispatch(updateCustody(custodyFormValues));
                          }
                        });
                      const previousCustody = {
                        id: currentCustody.id,
                        has_current_custody: false,
                      };
                      dispatch(updateCustody(previousCustody));
                    }

                    // if (
                    //   sensorReportAlert.shipment_custody_status
                    //     === 'present-end-geofence'
                    //   || (
                    //     sensorReportAlert.shipment_custody_status
                    //       === 'reached-end-geofence'
                    //     && currentCustody.custody_uuid
                    //       === sensorReportAlert.current_custody_id
                    //   )
                    // ) {
                    //   element.status = 'Completed';
                    //   dispatch(
                    //     editShipment(
                    //       element,
                    //       null,
                    //       null,
                    //       element.organization_uuid,
                    //     ),
                    //   );
                    // }
                  }
                }
              }
            });
        });
      alerts = _.orderBy(alerts, (item) => moment(item.date_time), ["asc"]);
      setGeofenceAlerts({ data: alerts, show: true });
      if (user && user.email_alert_flag && messages.length > 0) {
        dispatch(
          emailAlerts({
            user_uuid: user.core_user_uuid,
            messages,
            date_time: new Date().toJSON(),
            subject_line: "Geofence Alert",
          })
        );
      }
      setOpenGeofenceAlerts(openAlerts);
    }
  }, [shipmentData, sensorReportAlerts]);

  const handleClose = (event, index, type) => {
    event.stopPropagation();
    event.preventDefault();
    if (type === "shipment") {
      const open = shipmentAlerts.data.filter((item, idx) => idx !== index);
      const current = shipmentAlerts.data[index];
      const viewedShipmentAlerts = localStorage.getItem("shipmentAlerts")
        ? JSON.parse(localStorage.getItem("shipmentAlerts"))
        : [];
      viewedShipmentAlerts.push(current.url);
      localStorage.setItem(
        "shipmentAlerts",
        JSON.stringify(viewedShipmentAlerts)
      );
      if (open.length === 0) {
        dispatch(setShipmentAlerts({ show: false, data: open }));
      } else {
        dispatch(setShipmentAlerts({ show: true, data: open }));
      }
      setOpenShipmentAlerts(open);
    } else if (type === "geofence") {
      const open = geofenceAlerts.data.filter((item, idx) => idx !== index);
      const current = geofenceAlerts.data[index];
      const viewedGeoAlerts = localStorage.getItem("geofenceAlerts")
        ? JSON.parse(localStorage.getItem("geofenceAlerts"))
        : [];
      viewedGeoAlerts.push(current.id);
      localStorage.setItem("geofenceAlerts", JSON.stringify(viewedGeoAlerts));
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
        shipmentAlerts.data.map((alert, index) => (
          <Alert
            key={`shipmentAlert${index}:${alert.shipment}`}
            variant="filled"
            severity={alert.severity}
            onClose={(e) => handleClose(e, index, "shipment")}
            classes={{
              message: classes.message,
              root: classes.alert,
            }}
            title={`${alert.name} ${
              alert.type.toLowerCase() === "warning" ? "Warning" : "Violation"
            } Shipment ${alert.shipment}`}
          >
            {`${alert.name} ${
              alert.type.toLowerCase() === "warning" ? "Warning" : "Violation"
            } Shipment ${alert.shipment}`}
          </Alert>
        ))}
      {geofenceAlerts &&
        geofenceAlerts.data.map((alert, index) => (
          <Alert
            key={`sensorReportAlert${index}:${alert.shipment}`}
            variant="filled"
            severity="info"
            onClose={(e) => handleClose(e, index, "geofence")}
            classes={{
              message: classes.message,
              root: classes.alert,
            }}
            title={`${alert.name}`}
          >
            {`${alert.name} | ${moment(alert.date_time).fromNow()}`}
          </Alert>
        ))}
    </div>
  );
};

export default AlertInfo;
