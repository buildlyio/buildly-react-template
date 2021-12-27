import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTheme, useMediaQuery, Grid, TextField, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import {
  addRequirement,
  editRequirement,
} from '@redux/dashboard/actions/dashboard.actions';
import { validators } from '@utils/validators';

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

const AddRequirements = ({
  dispatch,
  history,
  location,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};
  const projectID = location.state && location.state.projectID;

  const name = useInput(editData.name || '', {
    required: true,
  });
  const description = useInput(editData.description || '', {
    required: true,
  });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Requirement';
  const formTitle = editPage ? 'Edit Requirement' : 'Add Requirement';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged() || description.hasChanged()
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const id = editPage
      ? editData.id
      : (location.state && location.state.nextId);
    const reqFormValue = {
      projectID,
      id,
      name: name.value,
      description: description.value,
    };

    if (editPage) {
      dispatch(editRequirement(reqFormValue));
    } else {
      dispatch(addRequirement(reqFormValue));
    }
    history.push(redirectTo);
  };

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
    if (!name.value || !description.value) {
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

  return <>
    {openFormModal && (
      <FormModal
        open={openFormModal}
        handleClose={closeFormModal}
        title={formTitle}
        titleClass={classes.formTitle}
        maxWidth="md"
        wantConfirm
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
                label="Title"
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
                multiline
                id="description"
                label="Description"
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
          </Grid>

          <Grid
            container
            spacing={isDesktop ? 3 : 0}
            justifyContent="center"
          >
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={submitDisabled()}
              >
                {buttonText}
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
  </>;
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.dashboardReducer,
});

export default connect(mapStateToProps)(AddRequirements);
