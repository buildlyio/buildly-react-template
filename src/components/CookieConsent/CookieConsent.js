import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Typography,
  Button,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { getUser } from '../../context/User.context';
import { useUpdateGDPRDateTimeMutation } from '../../react-query/mutations/authUser/updateGDPRDateTimeMutation';
import useAlert from '@hooks/useAlert';
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

  const { mutate: updateGDPRDateTimeMutation, isLoading: isUpdatingGDPRDateTime } = useUpdateGDPRDateTimeMutation(displayAlert);

  const handleSubmit = () => {
    const data = {
      id: user.id,
      last_gdpr_shown: moment().tz(user.user_timezone).toISOString(),
    };
    updateGDPRDateTimeMutation(data);
  };

  return (
    <>
      {visible ? (
        <Grid container className="cookieConsentContainer">
          {isUpdatingGDPRDateTime && <Loader open={isUpdatingGDPRDateTime} />}
          <Grid item xs={12}>
            <Typography variant="h6">Our use of cookies</Typography>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
          >
            Accept
          </Button>
        </Grid>
      ) : null}
    </>
  );
};

export default CookieConsent;
