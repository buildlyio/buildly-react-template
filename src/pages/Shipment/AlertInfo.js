import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
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
      width: '60%',
      left: '55%',
      transform: 'translateX(-50%)',
    },
    [theme.breakpoints.down('xs')]: {
      top: '16px',
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
  custodyData,
  custodianData,
  sensorAlerts,
}) => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (
      shipmentData
      && sensorAlerts
      && shipmentData.length > 0
      && sensorAlerts.length > 0
    ) {
      let alertsArray = [];
      let custodyRows = [];
      const viewedAlerts = localStorage.getItem('viewedAlerts')
        ? JSON.parse(localStorage.getItem('viewedAlerts'))
        : [];

      if (
        custodyData
        && custodianData
        && custodyData.length > 0
        && custodianData.length > 0
      ) {
        custodyRows = getFormattedCustodyRows(custodyData, custodianData);
      }

      _.forEach(shipmentData, (shipment) => {
        const shipmentAlerts = _.filter(
          sensorAlerts,
          { shipment_id: shipment.partner_shipment_id },
        );
        let flags = [];

        _.forEach(shipment.flags, (shipFlag) => {
          const flag = _.find(shipmentFlag, { url: shipFlag });
          if (flag) {
            const alertType = flag.max_flag
              ? `max-${flag.type}`
              : `min-${flag.type}`;
            flags = [
              ...flags,
              {
                ...flag,
                alertType,
              },
            ];
          }
        });

        _.forEach(shipmentAlerts, (alert) => {
          if (alert.parameter_type === 'location') {
            const currentCustody = _.find(custodyRows, (custody) => (
              custody.shipment_id === shipment.shipment_uuid
              && _.includes(
                alert.current_custody_id,
                custody.custody_uuid,
              )
            ));
            if (
              currentCustody !== undefined
              && !_.includes(viewedAlerts, alert.id)
            ) {
              let message = '';
              switch (alert.alert_type) {
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

              alertsArray = [
                ...alertsArray,
                {
                  name: `${message} : ${
                    currentCustody.custodian_name
                  } | Shipment ${shipment.name}`,
                  severity: 'info',
                  shipment: shipment.name,
                  id: alert.id,
                  date_time: alert.create_date,
                },
              ];
            }
          } else {
            const flag = _.find(flags, (flg) => (
              alert.alert_type === flg.alertType
              && _.includes(
                _.lowerCase(flg.name),
                _.lowerCase(alert.parameter_type),
              )
            ));
            if (
              flag
              && !_.includes(viewedAlerts, alert.id)
            ) {
              const svrity = _.lowerCase(flag.type) === 'warning'
                ? 'warning'
                : 'error';

              alertsArray = [
                ...alertsArray,
                {
                  name: alert.recovered_alert_id
                    ? `Recovered - ${
                      flag.name
                    } | Shipment: ${shipment.name}`
                    : `${flag.name} | Shipment: ${shipment.name}`,
                  severity: alert.recovered_alert_id
                    ? 'success'
                    : svrity,
                  shipment: shipment.name,
                  id: alert.id,
                  date_time: alert.create_date,
                },
              ];
            }
          }
        });
      });

      if (alertsArray && alertsArray.length) {
        setAlerts(alertsArray);
      }
    }
  }, [shipmentData, shipmentFlag, sensorAlerts]);

  const handleClose = (event, index) => {
    event.stopPropagation();
    event.preventDefault();

    const open = _.filter(
      alerts,
      (item, idx) => (idx !== index),
    );
    const current = alerts[index];

    let viewedAlerts = localStorage.getItem('viewedAlerts')
      ? JSON.parse(localStorage.getItem('viewedAlerts'))
      : [];
    viewedAlerts = [...viewedAlerts, current.id];
    localStorage.setItem(
      'viewedAlerts',
      JSON.stringify(viewedAlerts),
    );

    setAlerts(open);
  };

  return (
    <div className={classes.root}>
      {alerts
      && alerts.length > 0
      && _.map(alerts, (alert, index) => (
        <Alert
          key={`sensorAlert${index}:${alert.shipment}`}
          variant="filled"
          severity={alert.severity}
          onClose={(e) => handleClose(e, index)}
          classes={{
            message: classes.message,
            root: classes.alert,
          }}
          title={`${alert.name} | ${
            moment(alert.date_time).fromNow()
          }`}
        >
          {`${alert.name} | ${moment(alert.date_time).fromNow()}`}
        </Alert>
      ))}
    </div>
  );
};

export default AlertInfo;
