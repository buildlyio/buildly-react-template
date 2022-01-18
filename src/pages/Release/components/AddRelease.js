import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { ReleaseEnv } from '../ReleaseConstants';

const useStyles = makeStyles((theme) => ({
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  loadingWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const AddRelease = ({
  loading, history, location,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};
  const redirectTo = location.state && location.state.from;

  const buttonText = editPage ? 'Save' : 'Add Release';
  const formTitle = editPage ? 'Edit Release' : 'Add Release';
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const name = useInput(editData.name || '', { required: true });
  const description = useInput(editData.description || '', { required: true });
  const environment = useInput(editData.environment || '', { required: true });
  const [formError, setFormError] = useState({});

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || description.hasChanged()
      || environment.hasChanged()
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(redirectTo);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (editPage) {
      console.log('Edit dispatch here');
    } else {
      console.log('Add dispatch here');
    }
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!name.value || !description.value || !environment.value) {
      return true;
    }
    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  return (
    <div>
      {openFormModal && (
      <FormModal
        open={openFormModal}
        handleClose={closeFormModal}
        title={formTitle}
        titleClass={classes.formTitle}
        maxWidth="md"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container spacing={isDesktop ? 2 : 0}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Release Name"
                name="name"
                autoComplete="name"
                error={
                  formError.name
                  && formError.name.error
                }
                helperText={
                  formError.name
                    ? formError.name.message
                    : ''
                }
                onBlur={(e) => handleBlur(e, 'required', name)}
                {...name.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Release Description"
                name="description"
                autoComplete="description"
                error={
                  formError.description
                  && formError.description.error
                }
                helperText={
                  formError.description
                    ? formError.description.message
                    : ''
                }
                onBlur={(e) => handleBlur(e, 'required', description)}
                {...description.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                required
                id="environment"
                label="Release Environment"
                error={
                  formError.environment
                  && formError.environment.error
                }
                helperText={
                  formError.environment
                    ? formError.environment.message
                    : ''
                }
                onBlur={(e) => handleBlur(e, 'required', environment, 'environment')}
                {...environment.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(ReleaseEnv, (env, idx) => (
                  <MenuItem
                    key={`env${idx}:${env}`}
                    value={_.startCase(env)}
                  >
                    {_.startCase(env)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={isDesktop ? 3 : 0}
            justifyContent="center"
          >
            <Grid item xs={12} sm={4}>
              <div className={classes.loadingWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading || submitDisabled()}
                >
                  {buttonText}
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={discardFormData}
                className={classes.submit}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
});

export default connect(mapStateToProps)(AddRelease);
