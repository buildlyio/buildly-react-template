import React, { useContext, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './EditUserProfile.css';

import { UserContext } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import {
  Avatar,
  Button, Grid, MenuItem, TextField, Typography,
} from '@mui/material';
import { isMobile } from '@utils/mediaQuery';
import { validators } from '@utils/validators';
import {
  Person,
} from '@mui/icons-material';
import { updateUser } from '@redux/authuser/actions/authuser.actions';

const EditUserProfile = ({ dispatch }) => {
  // Initialize variables
  const user = useContext(UserContext);
  console.log('user : ', user);
  const [disableSubmitBtn, setBtnDisabled] = useState(true);

  const first_name = useInput(user && user.first_name, { required: true });
  const last_name = useInput(user && user.last_name);
  const email = useInput(user && user.email, { required: true });
  const username = useInput(user && user.username, { required: true });
  const userType = useInput(user && user.user_type, { required: true });
  const [formError, setFormError] = useState({});

  /**
   * Handle input field blur event, validate form
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */
  const handleBlur = (e, validation, input) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
    }

    // Update submit btn toggle status
    setBtnDisabled(toggleSubmitBtn());
    console.log('disableSubmitBtn : ', disableSubmitBtn);
  };

  // checkIfUseInfoEdited = () => (
  //     productUse.hasChanged()
  //     || useWhen.hasChanged()
  //     || useSituation.hasChanged()
  //     || impFunction.hasChanged()
  //     || deliveryRisk.hasChanged()
  //     || toolReq.hasChanged()
  // );

  /**
   * Enable/disable submit button
   * @returns {boolean}
   */
  const toggleSubmitBtn = () => {
    const errorKeys = Object.keys(formError);
    let errorExists = false;
    if (
      !first_name.value
        || !username.value
        || !email.value
        || !userType.value
    ) return true;
    console.log('errorKeys : ', errorKeys);
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  /**
   * Update the user profile
   * @param {Event} event the default submit event
   */
  const saveUserProfile = (event) => {
    event.preventDefault();
    const userProfileValues = {
      id: user.id,
      first_name: first_name.value,
      last_name: last_name.value,
      username: username.value,
      email: email.value,
      user_type: userType.value,
    };

    dispatch(updateUser(userProfileValues));
  };

  return (
    <>
      <div className="row border rounded">
        <div className="col-4 m-auto">
          <div className="d-flex flex-column align-items-center">
            <Avatar sx={{ width: 96, height: 96 }}>
              <Person color="secondary" sx={{ fontSize: 72 }} />
            </Avatar>
            <Typography>
              {user.first_name}
              {' '}
              {user.last_name}
            </Typography>
            <Typography>
              Organization:
              {' '}
              {user.organization.name}
            </Typography>
          </div>
        </div>
        <div className="col-8 border-start">
          <form className="form" noValidate onSubmit={saveUserProfile}>
            <Grid container spacing={isMobile() ? 0 : 3}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="first_name"
                  error={formError.first_name && formError.first_name.error}
                  helperText={
                      formError.first_name ? formError.first_name.message : ''
                    }
                  className="textField"
                  onBlur={(e) => handleBlur(e, 'required', first_name)}
                  {...first_name.bind}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="last_name"
                  error={formError.last_name && formError.last_name.error}
                  helperText={
                      formError.last_name ? formError.last_name.message : ''
                    }
                  className="textField"
                  onBlur={(e) => handleBlur(e)}
                  {...last_name.bind}
                />
              </Grid>
            </Grid>

            <Grid container spacing={isMobile() ? 0 : 3}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  error={formError.username && formError.username.error}
                  helperText={
                      formError.username ? formError.username.message : ''
                    }
                  className="textField"
                  onBlur={(e) => handleBlur(e, 'required', username)}
                  {...username.bind}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  error={formError.email && formError.email.error}
                  helperText={
                      formError.email ? formError.email.message : ''
                    }
                  className="textField"
                  onBlur={(e) => handleBlur(e, 'email', email)}
                  {...email.bind}
                />
              </Grid>
            </Grid>

            <Grid container spacing={isMobile() ? 0 : 3}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="userType"
                  name="userType"
                  label="User Type"
                  autoComplete="userType"
                  error={formError.userType && formError.userType.error}
                  helperText={
                      formError.userType ? formError.userType.message : ''
                    }
                  className="textField"
                  onBlur={(e) => handleBlur(e, 'required', userType)}
                  {...userType.bind}
                >
                  <MenuItem value="">----------</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Product Team">Product Team</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <div className="loadingWrapper">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="submit"
                disabled={disableSubmitBtn}
              >
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default EditUserProfile;
