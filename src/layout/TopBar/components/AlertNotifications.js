import React, {
  forwardRef, useEffect, useRef, useState,
} from 'react';
import _ from 'lodash';
import { getUser } from '@context/User.context';
import { useQueryClient } from 'react-query';
import {
  Dialog, DialogContent, DialogTitle, Grid, Slide,
} from '@mui/material';
import { isTablet } from '@utils/mediaQuery';

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const AlertNotifications = ({ setHideAlertBadge, open, setOpen }) => {
  const user = getUser();
  const queryClient = useQueryClient();
  const alertsSocket = useRef(null);
  const [pushGrp, setPushGrp] = useState('');
  const [alerts, setAlerts] = useState([]);

  if (_.size(alerts) > 0) {
    setHideAlertBadge(false);
  } else {
    setHideAlertBadge(false);
  }

  useEffect(() => {
    if (!_.isEmpty(user)) {
      setPushGrp(user.organization.organization_uuid);
    }
  }, [user]);

  useEffect(() => {
    if (pushGrp) {
      connectSocket();
    }

    return () => {
      if (alertsSocket.current) {
        alertsSocket.current.close();
      }
    };
  }, [pushGrp]);

  const reloadData = () => {
    console.log('Reload data');
    queryClient.invalidateQueries({ queryKey: ['shipments'] });
    queryClient.invalidateQueries({ queryKey: ['allGateways'] });
    queryClient.invalidateQueries({ queryKey: ['sensorAlerts'] });
    queryClient.invalidateQueries({ queryKey: ['sensorReports'] });
  };

  const connectSocket = () => {
    console.log(`${window.env.ALERT_SOCKET_URL}${pushGrp}/`);
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
    alertsSocket.current.onclose = (event) => {
      if (event.wasClean) {
        console.log('Alerts socket closed.');
      } else {
        console.log('Alerts socket closed. Trying to reconnect.');
        connectSocket();
      }
    };

    alertsSocket.current.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      const pushAlerts = [...msg.alerts];

      if (msg.command === 'fetch_alerts') {
        console.log('Fetching alerts');
        setAlerts(pushAlerts);
      }
      if (msg.command === 'new_alert') {
        console.log('New alert received');
        setAlerts([...alerts, ...pushAlerts]);
        // invalidate queries to reload data
        reloadData();
      }
      if (msg.command === 'reload_data') {
        // invalidate queries to reload data
        reloadData();
      }
    };
  };

  const closeAlertNotifications = () => {
    setHideAlertBadge(true);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeAlertNotifications}
      fullWidth
      fullScreen={isTablet()}
      aria-labelledby="alert-notifications"
      TransitionComponent={Transition}
      className="alertNotificationsDialog"
    >
      <DialogTitle>
        <Grid>Title</Grid>
      </DialogTitle>

      <DialogContent>
        <Grid>Content</Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AlertNotifications;
