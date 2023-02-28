import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import addNotification from 'react-push-notification';
import _ from 'lodash';
import moment from 'moment-timezone';
import { AppContext } from '@context/App.context';
import { showAlert } from '@redux/alert/actions/alert.actions';
import { getShipmentDetails } from '@redux/shipment/actions/shipment.actions';

const PushNotification = ({ dispatch, loaded, user }) => {
  const [alerts, setAlerts] = useState([]);
  const [pushGrp, setPushGrp] = useState('');
  const [pushGeo, setPushGeo] = useState(false);
  const [pushEnv, setPushEnv] = useState(false);
  const alertsSocket = useRef(null);
  const appTitle = useContext(AppContext).title;

  useEffect(() => {
    if (!_.isEmpty(user) && loaded) {
      setPushGrp(user.organization.organization_uuid);
      setPushGeo(user.push_preferences.geofence || false);
      setPushEnv(user.push_preferences.environmental || false);
    }
  }, [loaded, user]);

  useEffect(() => {
    if (pushGrp && (pushGeo || pushEnv)) {
      connectSocket();
    }

    return () => {
      if (alertsSocket.current) {
        alertsSocket.current.close();
      }
    };
  }, [pushGrp, pushGeo, pushEnv]);

  useEffect(() => {
    if (alerts.length > 0) {
      const alert = _.first(alerts);

      addNotification({
        native: true,
        duration: window.env.hide_notification,
        title: appTitle,
        subtitle: '',
        message: `${alert.alert_message} | ${moment(alert.create_date).fromNow()}`,
        onClick: (event) => {
          closeNotification(alert.id);
        },
      });
      dispatch(showAlert({
        type: alert.severity,
        open: true,
        message: `${alert.alert_message} | ${moment(alert.create_date).fromNow()}`,
        id: alert.id,
        onClose: closeNotification,
      }));
    }
  }, [alerts]);

  const connectSocket = () => {
    alertsSocket.current = new WebSocket(
      `${window.env.ALERT_SOCKET_URL}${pushGrp}/`,
    );

    alertsSocket.current.onopen = () => {
      const fetch_payload = { command: 'fetch_alerts', organization_uuid: pushGrp, hours_range: 24 };
      alertsSocket.current.send(JSON.stringify(fetch_payload));
    };
    alertsSocket.current.onerror = (error) => {
      console.error(error);
    };
    alertsSocket.current.onclose = () => {
      console.log('Alerts socket closed. Trying to reconnect.');
      connectSocket();
    };

    alertsSocket.current.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      let pushAlerts;

      switch (true) {
        case (pushGeo && pushEnv):
          pushAlerts = [...msg.alerts];
          break;

        case pushGeo:
          pushAlerts = _.filter(
            [...msg.alerts],
            { severity: 'info' },
          );
          break;

        case pushEnv:
          pushAlerts = _.filter(
            [...msg.alerts],
            (alert) => _.includes(
              ['error', 'warning', 'success'],
              alert.severity,
            ),
          );
          break;

        default:
          pushAlerts = [];
          break;
      }

      if (msg.command === 'fetch_alerts') {
        const viewed = getViewedNotifications();
        const filteredAlerts = _.filter(
          pushAlerts,
          (alert) => !_.includes(viewed, alert.id),
        );
        setAlerts(filteredAlerts);
      }
      if (msg.command === 'new_alert') {
        setAlerts([...alerts, ...pushAlerts]);
      }
      if (msg.command === 'reload_data') {
        console.log('Reloading data');
        dispatch(getShipmentDetails(
          user.organization.organization_uuid,
          'Planned,Enroute',
          null,
          true,
          true,
          'get',
        ));
      }
    };
  };

  const getViewedNotifications = () => (
    localStorage.getItem('viewedNotifications')
      ? JSON.parse(localStorage.getItem('viewedNotifications'))
      : []
  );

  const closeNotification = (id) => {
    const openAlerts = _.filter(alerts, (alert) => alert.id !== id);
    setAlerts(openAlerts);
    const viewed = getViewedNotifications();
    localStorage.setItem(
      'viewedNotifications',
      JSON.stringify([...viewed, id]),
    );
  };

  return <></>;
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  user: (state.authReducer.data && state.authReducer.data.data) || state.authReducer.data,
});

export default connect(mapStateToProps)(PushNotification);
