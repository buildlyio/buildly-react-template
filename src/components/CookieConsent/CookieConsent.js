import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Typography,
  Button,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Loader from '@components/Loader/Loader';
import { getUser } from '@context/User.context';
import { useUpdateUserMutation } from '@react-query/mutations/authUser/updateUserMutation';
import useAlert from '@hooks/useAlert';
import { routes } from '@routes/routesConstants';
import './CookieConsentStyles.css';

const CookieConsent = () => {
  const history = useHistory();
  const user = getUser();
  const [visible, setVisible] = useState(false);

  const { displayAlert } = useAlert();

  useEffect(() => {
    if (user) {
      if (!_.isEmpty(user.last_gdpr_shown)) {
        const nextGdprShown = moment(user.last_gdpr_shown).add(1, 'year');
        if (moment().unix() > nextGdprShown.unix()) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      } else {
        setVisible(true);
      }
    } else {
      setVisible(true);
    }
  }, [user]);

  const { mutate: updateUserMutation, isLoading: isUpdateUser } = useUpdateUserMutation(history, displayAlert);

  const handleSubmit = () => {
    const data = {
      id: user.id,
      organization_uuid: user.organization.organization_uuid,
      organization_name: user.organization.name,
      last_gdpr_shown: moment().tz(user.user_timezone).toISOString(),
    };
    updateUserMutation(data);
  };

  return (
    <>
      {visible ? (
        <Grid container className="cookieConsentContainer">
          {isUpdateUser && <Loader open={isUpdateUser} />}
          <Grid item xs={12}>
            <Typography variant="h6">We value your privacy</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              We use necessary cookies to make our site work and improve your experience on our website.
              Necessary cookies enable core functionality such as security, network management, and
              accessibility. We may store and/or access information on a device and process personal
              data. Additionally, we may utilize precise geolocation data and identification. You may
              disable these by changing your browser settings, but this may affect how the website
              functions.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              For more information about the cookies we collect, see our
              {' '}
              <Button className="cookieButton" onClick={() => history.push(routes.PRIVACY_POLICY)}>
                Privacy Policy
              </Button>
              .
            </Typography>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
          >
            Accept
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={() => handleSubmit()}
            style={{ marginLeft: 16 }}
          >
            Decline
          </Button>
        </Grid>
      ) : null}
    </>
  );
};

export default CookieConsent;
