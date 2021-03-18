import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  makeStyles,
  Backdrop,
  Grid,
  Button,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UserContext } from '@context/User.context';
import Modal from '@components/Modal/Modal';
import { useInput } from '@hooks/useInput';
import { loadOrgNames } from '@redux/authuser/actions/authuser.actions';
import { validators } from '@utils/validators';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  submit: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    minHeight: '5rem',
    margin: '0.25rem 0',
  },
}));

const MissingData = ({ dispatch, loading, history, orgNames }) => {
  const classes = useStyles();
  const user = useContext(UserContext);

  const email = useInput('', { required: true });
  const [orgName, setOrgName] = useState('');
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (!orgNames) {
      dispatch(loadOrgNames());
    }
  }, [orgNames]);

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submit clicked');
    console.log(email.value, orgName);
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input) => {
    let validateObj = validators(validation, input);
    let prevState = { ...formError };
    if (validateObj && validateObj.error)
      setFormError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    else
      setFormError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(formError);
    let errorExists = false;
    if ((!user.email && !email.value) || !orgName) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={true}>
        <Modal
          open={true}
          title={'Missing Info'}
          titleClass={classes.modalTitle}
          maxWidth={'sm'}
        >
          <form noValidate onSubmit={handleSubmit}>
            <Grid container>
              {!user.email && (
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email'
                    name='email'
                    autoComplete='email'
                    type='email'
                    error={formError.email && formError.email.error}
                    helperText={formError.email ? formError.email.message : ''}
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e, 'email', email)}
                    {...email.bind}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  disableClearable
                  id='organization_name'
                  name='organization_name'
                  options={orgNames || []}
                  onChange={(e, newValue) => {
                    setOrgName(newValue || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      label='Organisation Name'
                      className={classes.textField}
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container justify='center'>
              <Grid item>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                  disabled={loading || submitDisabled()}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        </Modal>
      </Backdrop>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(MissingData);
