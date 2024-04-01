/* eslint-disable no-console */
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import addNotification from 'react-push-notification';
import { getUser } from '@context/User.context';
import { AppContext } from '@context/App.context';
import { useQueryClient } from 'react-query';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Typography,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { isTablet } from '@utils/mediaQuery';
import { routes } from '@routes/routesConstants';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getAlertNotificationsColumns } from '@utils/constants';
import { oauthService } from '@modules/oauth/oauth.service';
import moment from 'moment-timezone';

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const AlertNotifications = ({
  setHideAlertBadge, open, setOpen, history, timezone, unitOfMeasure,
}) => {
  const theme = useTheme();
  const user = getUser();
  const queryClient = useQueryClient();
  const alertsSocket = useRef(null);
  const [pushGrp, setPushGrp] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const appTitle = useContext(AppContext).title;

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

  useEffect(() => {
    const notViewed = _.filter(notifications, { viewed: false });
    const oldNotifications = getViewedNotifications();
    let alerts = [];
    _.forEach(notViewed, (value) => {
      alerts = [...alerts, ..._.filter(value.alerts, (a) => !_.includes(oldNotifications, a.id))];
    });

    if (_.size(notViewed) > 0) {
      setHideAlertBadge(false);
      _.forEach(alerts, (value) => {
        addNotification({
          native: true,
          duration: window.env.hide_notification,
          title: appTitle,
          subtitle: '',
          message: `${value.alert_message} | ${moment(value.create_date).fromNow()}`,
          onClick: (event) => {
            setOpen(true);
            const viewedNoti = getViewedNotifications();
            localStorage.setItem(
              'viewedNotifications',
              JSON.stringify(_.uniq([...viewedNoti, value.id])),
            );
          },
        });
      });
    } else {
      setHideAlertBadge(true);
    }

    alertSocketOnMessage();
  }, [notifications]);

  const reloadData = () => {
    if (oauthService.hasValidAccessToken()) {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['allGateways'] });
      queryClient.invalidateQueries({ queryKey: ['sensorAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['sensorReports'] });
      setRedirectToLogin(false);
    } else {
      oauthService.logout();
      setRedirectToLogin(true);
    }
  };

  // eslint-disable-next-line consistent-return
  const customizer = (objValue, srcValue) => {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  };

  const connectSocket = () => {
    alertsSocket.current = new WebSocket(
      `${window.env.ALERT_SOCKET_URL}${pushGrp}/`,
    );

    alertsSocket.current.onopen = () => {
      const fetch_payload = { command: 'fetch_alerts', organization_uuid: pushGrp };
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

    alertSocketOnMessage();
  };

  const alertSocketOnMessage = () => {
    if (alertsSocket.current) {
      alertsSocket.current.onmessage = (message) => {
        const msg = JSON.parse(message.data);
        const viewedNotifications = getViewedNotifications();

        let alerts = [];
        _.forEach(msg.alerts, (a) => {
          const parameterType = _.toLower(_.split(a.alert_message, ' of ')[0]);
          const parameterValue = _.split(_.split(a.alert_message, ' of ')[1], ' at ')[0];
          let alertObj = { id: parameterType, color: 'green', title: `${_.capitalize(parameterType)} Excursion Recovered` };
          if (_.isEqual(a.severity, 'error')) {
            alertObj = { ...alertObj, color: theme.palette.error.main, title: `Maximum ${_.capitalize(parameterType)} Excursion` };
          }
          if (_.isEqual(a.severity, 'info')) {
            alertObj = { ...alertObj, color: theme.palette.info.main, title: `Minimum ${_.capitalize(parameterType)} Excursion` };
          }
          alerts = [...alerts, { ...a, alertObj, parameterValue }];
        });

        const shipments = _.uniqBy(_.map(alerts, (a) => ({ id: a.shipment_id, name: a.shipment_name })), 'id');

        let formattedAlerts = [];
        _.forEach(shipments, (ship) => {
          const newAlerts = _.orderBy(_.filter(alerts, { shipment_id: ship.id }), ['alert_time', 'id'], ['desc', 'asc']);
          let isViewed = true;
          _.forEach(newAlerts, (a) => {
            isViewed = isViewed && _.includes(viewedNotifications, a.id);
          });

          formattedAlerts = [
            ...formattedAlerts,
            {
              shipment_id: ship.id,
              shipment_name: ship.name,
              alerts: newAlerts,
              viewed: isViewed,
            },
          ];
        });

        if (msg.command === 'fetch_alerts') {
          setNotifications(formattedAlerts);
        }
        if (msg.command === 'new_alert') {
          let finalNotifications = notifications;
          _.forEach(formattedAlerts, (fa) => {
            const alertIndex = _.findIndex(finalNotifications, (fn) => _.isEqual(fa.shipment_id, fn.shipment_id));
            const newNotification = _.mergeWith(finalNotifications[alertIndex], fa, customizer);
            finalNotifications = [..._.slice(finalNotifications, 0, alertIndex), newNotification, ..._.slice(finalNotifications, alertIndex + 1)];
          });
          setNotifications(finalNotifications);

          // invalidate queries to reload data
          reloadData();
        }
        if (msg.command === 'reload_data') {
          // invalidate queries to reload data
          reloadData();
        }
      };
    }
  };

  const closeAlertNotifications = () => {
    setHideAlertBadge(true);
    setOpen(false);
  };

  const getViewedNotifications = () => (
    localStorage.getItem('viewedNotifications')
      ? _.sortBy(JSON.parse(localStorage.getItem('viewedNotifications')))
      : []
  );

  const handleAlertCountClick = (index) => {
    const notiAlerts = [..._.slice(notifications, 0, index), { ...notifications[index], viewed: true }, ..._.slice(notifications, index + 1)];
    setHideAlertBadge(true);
    setNotifications(notiAlerts);
    const viewed = getViewedNotifications();
    localStorage.setItem(
      'viewedNotifications',
      JSON.stringify(_.uniq([...viewed, ..._.map(notiAlerts[index].alerts, 'id')])),
    );
  };

  return (
    <>
      {redirectToLogin && <Redirect to="/login" />}
      <Dialog
        open={open}
        onClose={closeAlertNotifications}
        fullWidth
        fullScreen={isTablet()}
        aria-labelledby="alert-notifications"
        TransitionComponent={Transition}
        className="alertNotificationsDialog"
      >
        <DialogTitle className="alertNotificationsDialogTitle">
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography variant="h6" flex={1}>Shipment Notifications</Typography>
            <IconButton className="alertNotificationsCloseIcon" onClick={closeAlertNotifications}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogContent>
          {_.isEmpty(notifications) && (
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="subtitle1">There are no new alerts for any active shipments</Typography>
            </Grid>
          )}
          {!_.isEmpty(notifications) && (
            <Grid container spacing={2} mt={2}>
              {_.map(notifications, (noti, index) => (
                <React.Fragment key={noti.shipment_id}>
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary
                        aria-controls={`${noti.shipment_id}-content`}
                        id={`${noti.shipment_id}-header`}
                        expandIcon={(
                          <Button
                            type="button"
                            color="error"
                            variant="contained"
                            className="alertNotificationsCount"
                            onClick={(e) => handleAlertCountClick(index)}
                          >
                            {_.size(noti.alerts)}
                          </Button>
                        )}
                        className="alertNotificationsSummary"
                        onClick={(e) => handleAlertCountClick(index)}
                      >
                        <div className={!noti.viewed ? 'alertNotificationsSummaryBadge' : ''} />
                        <Typography
                          variant="subtitle1"
                          className="alertNotificationsShipmentName"
                          onClick={(e) => {
                            history.push(`${routes.REPORTING}/?shipment=${noti.shipment_id}`);
                            closeAlertNotifications();
                          }}
                        >
                          {noti.shipment_name}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <DataTableWrapper
                          noSpace
                          hideAddButton
                          noOptionsIcon
                          rows={noti.alerts}
                          columns={getAlertNotificationsColumns(
                            timezone,
                            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                              ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                              : '',
                            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                              ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                              : '',
                          )}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlertNotifications;
