/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Chip,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import {
  createStatus,
} from '@redux/release/actions/release.actions';
import { STATUSTYPES } from './formConstants';

const useStyles = makeStyles((theme) => ({
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
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const StatusBoard = ({
  dispatch,
  history,
  location,
}) => {
  const classes = useStyles();
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};
  const product_uuid = location.state && location.state.product_uuid;
  const redirectTo = location.state && location.state.from;

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [formError, setFormError] = useState({});

  const closeFormModal = () => {
    const dataHasChanged = (
      (!_.isEmpty(editData) && !_.isEqual(status, editData.status))
      || (_.isEmpty(editData) && !_.isEmpty(status))
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

  // Handle statuses list
  const onStatusChange = (value) => {
    switch (true) {
      case (value.length > status.length):
        setStatus([...status, _.last(value)]);
        break;

      case (value.length < status.length):
        setStatus(value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let statusData = _.map(status, (col) => ({
      product_uuid,
      name: col,
      description: col,
      status_tracking_id: null,
    }));

    statusData = [
      ...statusData,
      {
        product_uuid,
        name: 'No Status',
        description: 'No Status',
        status_tracking_id: null,
      },
    ];

    dispatch(createStatus(statusData));
    history.push(redirectTo);
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (
      !status
    ) {
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
    <>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title="Configure Project Board"
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions
                  id="status"
                  options={STATUSTYPES}
                  freeSolo
                  value={status}
                  onChange={(e, newValue) => onStatusChange(newValue)}
                  renderTags={(value, getStatusProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={option}
                        {...getStatusProps({ index })}
                      />
                    ))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select the list of Columns"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={isDesktop ? 3 : 0} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={submitDisabled()}
                >
                  Configure Board
                </Button>
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
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(StatusBoard);
