import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { UserContext } from '@context/User.context';
import { updateCustody } from '@redux/custodian/actions/custodian.actions';
import {
  setShipmentAlerts,
  emailAlerts,
} from '@redux/shipment/actions/shipment.actions';
import { getFormattedCustodyRows } from './ShipmentConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position: 'relative',
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
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
      shipmentData
      && shipmentAlerts
      && shipmentData.length
      && shipmentAlerts.show
    ) {
      let alerts = [];
      let openAlerts = [];
      let messages = [];
      const viewedShipmentAlerts = localStorage.getItem('shipmentAlerts')
        ? JSON.parse(localStorage.getItem('shipmentAlerts'))
        : [];

      if (shipmentFlag && shipmentFlag.length) {
        _.forEach(shipmentData, (shipment, index) => {
          _.forEach(shipmentFlag, (flag) => {
            if (
              _.indexOf(shipment.flags, flag.url) !== -1
              && flag.type !== 'None'
              && (
                _.lowerCase(shipment.status) === 'planned'
                || _.lowerCase(shipment.status) === 'enroute'
              ) && !_.includes(
                viewedShipmentAlerts,
                `${shipment.shipment_uuid}-${flag.id}`,
              )
            ) {
              alerts = [
                ...alerts,
                {
                  type: flag.type,
                  name: flag.name,
                  shipment: shipment.name,
                  url: `${shipment.shipment_uuid}-${flag.id}`,
                  severity: _.lowerCase(flag.type) === 'warning'
                    ? 'warning'
                    : 'error',
                },
              ];
              openAlerts = [...openAlerts, index];
              messages = [
                ...messages,
                {
                  shipment_uuid: shipment.name,
                  alert_message: flag.name,
                  date_time: new Date().toJSON(),
                },
              ];
            }
          });
        });
      }

      if (alerts.length) {
        dispatch(setShipmentAlerts({
          show: true,
          data: alerts,
        }));
      }

      if (
        user
        && user.email_alert_flag
        && messages.length
      ) {
        dispatch(
          emailAlerts({
            user_uuid: user.core_user_uuid,
            messages,
            date_time: new Date().toJSON(),
            subject_line: 'Warning / Excursion Alert',
          }),
        );
      }

      if (openAlerts.length) {
        setOpenShipmentAlerts(openAlerts);
      }
    }
  }, [shipmentData, shipmentFlag]);

  useEffect(() => {
    if (
      shipmentData
      && custodyData
      && sensorReportAlerts
      && shipmentData.length
      && custodyData.length
    ) {
      let custodyRows = [];
      let alerts = [];
      let openAlerts = [];
      let messages = [];
      let currentCustody = {};
      let updatedCustodies = [];
      const viewedGeoAlerts = localStorage.getItem('geofenceAlerts')
        ? JSON.parse(localStorage.getItem('geofenceAlerts'))
        : [];

      if (custodianData && custodianData.length) {
        custodyRows = getFormattedCustodyRows(custodyData, custodianData);
      }

      _.forEach(shipmentData, (shipment) => {
        _.forEach(sensorReportAlerts, (alert, index) => {
          if (
            shipment.partner_shipment_id === alert.shipment_id
            && (
              _.lowerCase(shipment.status) === 'planned'
              || _.lowerCase(shipment.status) === 'enroute'
            ) && alert.custodian_id
            && alert.custodian_id.length
          ) {
            const sensorCustodian = alert.custodian_id;
            if (custodyRows && custodyRows.length) {
              _.forEach(custodyRows, (custody) => {
                if (
                  custody.shipment_id === shipment.shipment_uuid
                  && (
                    _.includes(
                      sensorCustodian,
                      custody.custodian_data.custodian_uuid,
                    )
                    || _.includes(
                      sensorCustodian,
                      custody.custody_uuid,
                    )
                  )
                ) {
                  if (custody.has_current_custody) {
                    currentCustody = custody;
                    currentCustody.custodian_uuid = custody.custodian_data.custodian_uuid;
                  } else {
                    updatedCustodies = [...updatedCustodies, custody];
                  }
                }
              });
            }

            if (
              currentCustody !== undefined
              && (
                _.includes(
                  sensorCustodian,
                  currentCustody.custodian_uuid,
                )
                || _.includes(
                  sensorCustodian,
                  currentCustody.custody_uuid,
                )
              )
            ) {
              let message = '';
              switch (alert.shipment_custody_status) {
                case 'present-start-geofence':
                  message = 'At start location';
                  break;

                case 'left-start-geofence':
                  message = 'Left start location';
                  break;

                case 'arriving-end-geofence':
                  message = 'Arriving end location';
                  break;

                case 'present-end-geofence':
                  message = 'At end location';
                  break;

                case 'reached-end-geofence':
                  message = 'Reached end location';
                  break;

                case 'left-end-geofence':
                  message = 'Custody Handoff';
                  break;

                default:
                  break;
              }

              if (
                !_.includes(viewedGeoAlerts, alert.id)
                && moment().diff(alert.report_date_time, 'h') <= 24
              ) {
                alerts = [
                  ...alerts,
                  {
                    type: alert.shipment_custody_status,
                    name: `${message} : ${currentCustody.custodian_name} -  Shipment ${shipment.name}`,
                    shipment: shipment.name,
                    id: alert.id,
                    date_time: alert.report_date_time,
                  },
                ];
                openAlerts = [...openAlerts, index];
                messages = [
                  ...messages,
                  {
                    shipment_uuid: shipment.name,
                    alert_message: `Shipment ${message} of ${currentCustody.custodian_name}`,
                    date_time: alert.report_date_time,
                  },
                ];

                if (
                  alert.shipment_custody_status === 'left-end-geofence'
                  && currentCustody.custody_uuid !== alert.current_custody_id
                ) {
                  if (
                    updatedCustodies
                    && updatedCustodies.length
                  ) {
                    _.forEach(updatedCustodies, (custody) => {
                      if (custody.custody_uuid === alert.current_custody_id) {
                        // Update custody current one
                        const custodyFormValues = {
                          id: custody.id,
                          has_current_custody: true,
                        };
                        dispatch(updateCustody(custodyFormValues));
                      }
                    });
                  }

                  const previousCustody = {
                    id: currentCustody.id,
                    has_current_custody: false,
                  };
                  dispatch(updateCustody(previousCustody));
                }
              }
            }
          }
        });
      });

      alerts = _.orderBy(
        alerts,
        (item) => moment(item.date_time),
        ['asc'],
      );

      if (alerts && alerts.length) {
        setGeofenceAlerts({
          data: alerts,
          show: true,
        });
      }

      if (
        user
        && user.email_alert_flag
        && messages.length
      ) {
        dispatch(
          emailAlerts({
            user_uuid: user.core_user_uuid,
            messages,
            date_time: new Date().toJSON(),
            subject_line: 'Geofence Alert',
          }),
        );
      }

      if (openAlerts && openAlerts.length) {
        setOpenGeofenceAlerts(openAlerts);
      }
    }
  }, [shipmentData, sensorReportAlerts]);

  const handleClose = (event, index, type) => {
    event.stopPropagation();
    event.preventDefault();
    if (type === 'shipment') {
      const open = _.filter(
        shipmentAlerts.data,
        (item, idx) => (idx !== index),
      );
      const current = shipmentAlerts.data[index];

      let viewedShipmentAlerts = localStorage.getItem('shipmentAlerts')
        ? JSON.parse(localStorage.getItem('shipmentAlerts'))
        : [];
      viewedShipmentAlerts = [...viewedShipmentAlerts, current.url];
      localStorage.setItem(
        'shipmentAlerts',
        JSON.stringify(viewedShipmentAlerts),
      );

      if (open.length === 0) {
        dispatch(setShipmentAlerts({
          show: false,
          data: open,
        }));
      } else {
        dispatch(setShipmentAlerts({
          show: true,
          data: open,
        }));
      }
      setOpenShipmentAlerts(open);
    } else if (type === 'geofence') {
      const open = _.filter(
        geofenceAlerts.data,
        (item, idx) => (idx !== index),
      );
      const current = geofenceAlerts.data[index];

      let viewedGeoAlerts = localStorage.getItem('geofenceAlerts')
        ? JSON.parse(localStorage.getItem('geofenceAlerts'))
        : [];
      viewedGeoAlerts = [...viewedGeoAlerts, current.id];
      localStorage.setItem('geofenceAlerts', JSON.stringify(viewedGeoAlerts));

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
      {shipmentAlerts
      && shipmentAlerts.length
      && _.map(shipmentAlerts.data, (alert, index) => (
        <Alert
          key={`shipmentAlert${index}:${alert.shipment}`}
          variant="filled"
          severity={alert.severity}
          onClose={(e) => handleClose(e, index, 'shipment')}
          classes={{
            message: classes.message,
            root: classes.alert,
          }}
          title={`${alert.name} ${
            _.lowerCase(alert.type) === 'warning'
              ? 'Warning'
              : 'Violation'
          } Shipment ${alert.shipment}`}
        >
          {`${alert.name} ${
            _.lowerCase(alert.type) === 'warning'
              ? 'Warning'
              : 'Violation'
          } Shipment ${alert.shipment}`}
        </Alert>
      ))}

      {geofenceAlerts
      && geofenceAlerts.length
      && _.map(geofenceAlerts.data, (alert, index) => (
        <Alert
          key={`sensorReportAlert${index}:${alert.shipment}`}
          variant="filled"
          severity="info"
          onClose={(e) => handleClose(e, index, 'geofence')}
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
