import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import addNotification from 'react-push-notification';
import _ from 'lodash';
import moment from 'moment-timezone';
import { AppContext } from './context/App.context';
import { oauthService } from './modules/oauth/oauth.service';
import { showAlert } from './redux/alert/actions/alert.actions';

const PushNotification = ({ dispatch, loaded }) => {
  const [alerts, setAlerts] = useState([]);
  const [pushGrp, setPushGrp] = useState('');
  const [pushGeo, setPushGeo] = useState(false);
  const [pushEnv, setPushEnv] = useState(false);
  const alertsSocket = useRef(null);
  const appTitle = useContext(AppContext).title;

  useEffect(() => {
    const loggedIn = oauthService.hasValidAccessToken();
    if (!loggedIn || (loggedIn && loaded)) {
      const { alertGrp, geoPref, envPref } = oauthService.getPushSettings();
      setPushGrp(alertGrp);
      setPushGeo(geoPref);
      setPushEnv(envPref);
    }
  }, [loaded]);

  useEffect(() => {
    if (pushGrp && (pushGeo || pushEnv)) {
      alertsSocket.current = new WebSocket(
        `${window.env.ALERT_SOCKET_URL}${pushGrp}/`,
      );
      alertsSocket.current.onopen = () => {
        alertsSocket.current.send(JSON.stringify({
          command: 'fetch_alerts',
          organization_uuid: pushGrp,
          hours_range: 24,
        }));
      };
      alertsSocket.current.onerror = (error) => {
        console.error(error);
      };
      alertsSocket.current.onclose = () => {
        console.log('Alerts Socket Closed');
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
      };
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
      setTimeout(() => {
        const viewed = getViewedNotifications();
        if (!_.includes(viewed, alert.id)) {
          closeNotification(alert.id);
        }
      }, window.env.hide_notification);

      const openAlerts = _.slice(alerts, 1);
      setAlerts(openAlerts);
    }
  }, [alerts]);

  const getViewedNotifications = () => (
    localStorage.getItem('viewedNotifications')
      ? JSON.parse(localStorage.getItem('viewedNotifications'))
      : []
  );

  const closeNotification = (id) => {
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
});

export default connect(mapStateToProps)(PushNotification);
