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
  MenuItem,
  Autocomplete,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import DatePickerComponent from '@components/DatePicker/DatePicker';

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

const AddIssues = ({
  dispatch,
  history,
  location,
  types,
  statuses,
  issues,
  features,
  repos,
  devs,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};
  const productID = location.state && location.state.productID;

  const name = useInput(editData.name || '', {
    required: true,
  });
  const description = useInput(editData.description || '', {
    required: true,
  });
  const type = useInput(editData.type || '', {
    required: true,
  });
  const repo = useInput(editData.repo || '', {
    required: true,
  });
  const issueStatus = useInput(editData && editData.status, {
    required: true,
  });
  const statusId = useInput(editData && editData.statusId, {
    required: true,
  });
  const feature = useInput(editData.feature || '', {
    required: true,
  });
  const tag = useInput(editData.tag || '', {
    required: true,
  });

  const assignedTo = useInput(editData.assignedTo || '');
  const [formError, setFormError] = useState({});

  const [startDate, handleStartDateChange] = useState(
    (editData && editData.start_date) || new Date(),
  );
  const [endDate, handleEndDateChange] = useState(
    (editData && editData.end_date) || new Date(),
  );


  const buttonText = editPage ? 'Save' : 'Add Issue';
  const formTitle = editPage ? 'Edit Issue' : 'Add Issue';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || description.hasChanged()
      || type.hasChanged()
      || repo.hasChanged()
      || (editPage && issueStatus.hasChanged())
      || (editPage && assignedTo.hasChanged())
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
    const issueFormValue = {
      productID,
      id,
      name: name.value,
      description: description.value,
      type: type.value,
      repo: repo.value,
      status: editPage ? issueStatus.value : 'created',
      assignedTo: editPage ? assignedTo.value : '',
    };

    if (editPage) {
      console.log('Dispatch edit issue action here');
    } else {
      console.log('Dispatch add issue action here');
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
    if (
      !name.value
      || !description.value
      || !type.value
      || !repo.value
      || (editPage && !issueStatus.value)
      || (editPage && !assignedTo.value)
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

  useEffect(() => {
    if (!features || _.isEmpty(features)) {
      dispatch(getAllFeatures());
    }
    if (!issues || _.isEmpty(issues)) {
      dispatch(getAllIssues());
    }
    if (!statuses || _.isEmpty(statuses)) {
      dispatch(getAllStatuses());
    }
  }, []);

  return (
    <>
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
              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="type"
                  label="Issue Type"
                  name="type"
                  autoComplete="type"
                  error={
                    formError.type
                    && formError.type.error
                  }
                  helperText={
                    formError.type
                      ? formError.type.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', type)}
                  {...type.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {_.map(types, (tp) => (
                    <MenuItem
                      key={`type-${tp.id}`}
                      value={tp.value}
                    >
                      {tp.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="repo"
                  label="Link to Repo"
                  name="repo"
                  autoComplete="repo"
                  error={
                    formError.repo
                    && formError.repo.error
                  }
                  helperText={
                    formError.repo
                      ? formError.repo.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', repo)}
                  {...repo.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {_.map(
                    _.filter(repos, { productID }),
                    (rp) => (
                      <MenuItem
                        key={`type-${rp.productID}-${rp.id}`}
                        value={rp.name}
                      >
                        {rp.name}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </Grid> */}
              {editPage && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="issueStatus"
                    label="Issue Status"
                    name="issueStatus"
                    autoComplete="issueStatus"
                    error={
                      formError.issueStatus
                      && formError.issueStatus.error
                    }
                    helperText={
                      formError.issueStatus
                        ? formError.issueStatus.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', issueStatus)}
                    {...issueStatus.bind}
                  >
                    {_.map(status, (st) => (
                      <MenuItem
                        key={`type-${st.id}`}
                        value={st.value}
                      >
                        {st.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              {editPage && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="assignedTo"
                    label="Assigned To"
                    name="assignedTo"
                    autoComplete="assignedTo"
                    error={
                      formError.assignedTo
                      && formError.assignedTo.error
                    }
                    helperText={
                      formError.assignedTo
                        ? formError.assignedTo.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', assignedTo)}
                    {...assignedTo.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {_.map(
                      _.filter(devs, { productID }),
                      (dev) => (
                        <MenuItem
                          key={`type-${dev.productID}-${dev.id}`}
                          value={dev.value}
                        >
                          {dev.name}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={[]}
                  freeSolo
                  value={autoCompleteValue}
                  onChange={(e, newval, reason) => {
                    setAutoCompleteValue(newval);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="tag"
                      label="Tags"
                      name="tag"
                      onKeyDown={(e) => {
                        if (e.keyCode == 13 && e.target.value) {
                          setAutoCompleteValue(autoCompleteValue.concat(e.target.value));
                        }
                      }}
                      error={
                        formError.tag
                        && formError.tag.error
                      }
                      helperText={
                        formError.tag
                          ? formError.tag.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', tag)}
                      {...tag.bind}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="statusId"
                  label="Status"
                  name="statusId"
                  autoComplete="statusId"
                  error={
                    formError.statusId
                    && formError.statusId.error
                  }
                  helperText={
                    formError.statusId
                      ? formError.statusId.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', statusId)}
                  {...statusId.bind}
                >
                  {_.map(statuses, (status) => (
                    <MenuItem
                      key={status.status_uuid}
                      value={status.name}
                    >
                      {status.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="feature "
                  label="Feature"
                  name="feature"
                  autoComplete="feature"
                  error={
                    formError.feature
                    && formError.feature.error
                  }
                  helperText={
                    formError.feature
                      ? formError.feature.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', feature)}
                  {...feature.bind}
                >
                  {_.map(features, (feature) => (
                    <MenuItem
                      key={feature.feature_uuid}
                      value={feature.name}
                    >
                      {feature.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"

                fullWidth
                id="estimate"
                label="Estimate"
                name="estimate"
                autoComplete="estimate"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="complexity"
                label="Complexity"
                name="complexity"
                autoComplete="complexity"

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="issueTracker"
                label="Issue Tracker"
                name="issueTracker"
                autoComplete="issueTracker"

              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePickerComponent
                  label="Start Date"
                  selectedDate={startDate}
                  hasTime
                  handleDateChange={handleStartDateChange}
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerComponent
                  label="End Date"
                  selectedDate={endDate}
                  hasTime
                  handleDateChange={handleEndDateChange}
                  disabled={false}
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
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.decisionReducer,
});

export default connect(mapStateToProps)(AddIssues);
