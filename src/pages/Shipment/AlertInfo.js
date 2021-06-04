import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { UserContext } from '@context/User.context';
import { updateCustody } from '@redux/custodian/actions/custodian.actions';
import {
  editShipment,
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
  geofenceAlerts,
  custodyData,
  custodianData,
  sensorAlerts,
}) => {
  const classes = useStyles();
  const [senAlerts, setSenAlerts] = useState([]);
  const [geoAlerts, setGeoAlerts] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    if (
      shipmentData
      && shipmentFlag
      && sensorAlerts
      && shipmentData.length > 0
      && shipmentFlag.length > 0
      && sensorAlerts.length > 0
    ) {
      let alerts = [];
      const viewedSensorAlerts = localStorage.getItem('sensorAlerts')
        ? JSON.parse(localStorage.getItem('sensorAlerts'))
        : [];

      _.forEach(shipmentData, (shipment) => {
        const shipmentAlerts = _.filter(
          sensorAlerts,
          { shipment_id: shipment.partner_shipment_id },
        );
        _.forEach(shipment.flags, (shipFlag) => {
          const flag = _.find(shipmentFlag, { url: shipFlag });
          if (flag) {
            const alertType = flag.max_flag
              ? `max-${flag.type}`
              : `min-${flag.type}`;
            _.forEach(shipmentAlerts, (shipAlert) => {
              if (
                shipAlert.alert_type === alertType
                && _.includes(
                  _.lowerCase(flag.name),
                  _.lowerCase(shipAlert.parameter_type),
                )
                && !_.includes(viewedSensorAlerts, shipAlert.id)
              ) {
                let severity;
                if (shipAlert.recovered_alert_id) {
                  severity = 'success';
                } else {
                  severity = _.lowerCase(flag.type) === 'warning'
                    ? 'warning'
                    : 'error';
                }

                alerts = [
                  ...alerts,
                  {
                    name: shipAlert.recovered_alert_id
                      ? `Recovered - ${flag.name}`
                      : flag.name,
                    shipment: shipment.name,
                    id: shipAlert.id,
                    severity,
                    date_time: shipAlert.create_date,
                  },
                ];
              }
            });
          }
        });
      });

      if (alerts && alerts.length) {
        setSenAlerts(alerts);
      }
    }
  }, [shipmentData, shipmentFlag, sensorAlerts]);

  useEffect(() => {
    if (
      shipmentData
      && custodyData
      && geofenceAlerts
      && shipmentData.length > 0
      && custodyData.length > 0
      && geofenceAlerts.length > 0
    ) {
      let custodyRows = [];
      let alerts = [];
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
        _.forEach(geofenceAlerts, (alert, index) => {
          if (
            shipment.partner_shipment_id === alert.shipment_id
            && alert.shipment_custody_status === 'left-start-geofence'
          ) {
            const custody = _.find(
              custodyData,
              { custody_uuid: alert.current_custody_id },
            );
            if (
              custody
              && custody.first_custody
              && shipment.shipment_uuid === custody.shipment_id
              && _.lowerCase(shipment.status) === 'planned'
            ) {
              dispatch(editShipment({
                ...shipment,
                status: 'Enroute',
              }));
            }
          }

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
                    name: `${message} : ${currentCustody.custodian_name} -  Shipment ${shipment.name}`,
                    shipment: shipment.name,
                    id: alert.id,
                    date_time: alert.report_date_time,
                  },
                ];
                messages = [
                  ...messages,
                  {
                    type: 'geofence',
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
        setGeoAlerts(alerts);
      }
      if (
        user
        && user.email_alert_flag
        && messages.length > 0
      ) {
        dispatch(
          emailAlerts({
            user_uuid: user.core_user_uuid,
            messages,
            date_time: moment().toJSON(),
            subject_line: 'Geofence Alerts',
          }),
        );
      }
    }
  }, [shipmentData, geofenceAlerts]);

  const handleClose = (event, index, type) => {
    event.stopPropagation();
    event.preventDefault();
    if (type === 'sensor') {
      const open = _.filter(
        senAlerts,
        (item, idx) => (idx !== index),
      );
      const current = senAlerts[index];

      let viewedSensorAlerts = localStorage.getItem('sensorAlerts')
        ? JSON.parse(localStorage.getItem('sensorAlerts'))
        : [];
      viewedSensorAlerts = [...viewedSensorAlerts, current.id];
      localStorage.setItem(
        'sensorAlerts',
        JSON.stringify(viewedSensorAlerts),
      );

      setSenAlerts(open);
    } else if (type === 'geofence') {
      const open = _.filter(
        geoAlerts,
        (item, idx) => (idx !== index),
      );
      const current = geoAlerts[index];

      let viewedGeoAlerts = localStorage.getItem('geofenceAlerts')
        ? JSON.parse(localStorage.getItem('geofenceAlerts'))
        : [];
      viewedGeoAlerts = [...viewedGeoAlerts, current.id];
      localStorage.setItem('geofenceAlerts', JSON.stringify(viewedGeoAlerts));

      setGeoAlerts(open);
    }
  };

  return (
    <div className={classes.root}>
      {senAlerts
      && senAlerts.length > 0
      && _.map(senAlerts, (alert, index) => (
        <Alert
          key={`sensorAlert${index}:${alert.shipment}`}
          variant="filled"
          severity={alert.severity}
          onClose={(e) => handleClose(e, index, 'sensor')}
          classes={{
            message: classes.message,
            root: classes.alert,
          }}
          title={`${alert.name} | Shipment: ${
            alert.shipment
          } | ${moment(alert.date_time).fromNow()}`}
        >
          {`${alert.name} | Shipment: ${
            alert.shipment
          } | ${moment(alert.date_time).fromNow()}`}
        </Alert>
      ))}

      {geoAlerts
      && geoAlerts.length > 0
      && _.map(geoAlerts, (alert, index) => (
        <Alert
          key={`geofenceAlert${index}:${alert.shipment}`}
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
