/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import makeStyles from '@mui/styles/makeStyles';
import {
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import { useInput } from '@hooks/useInput';
import {
  createIssue,
  updateIssue,
} from '@redux/release/actions/release.actions';
import { validators } from '@utils/validators';
import { ISSUETYPES } from '../DashboardConstants';
import { routes } from '@routes/routesConstants';
import SmartInput from '@components/SmartInput/SmartInput';

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
  statuses,
  features,
  credentials,
  products,
  loading,
}) => {
  const classes = useStyles();
  const editPage = location.state && location.state.type === 'edit';
  const editData = (editPage && location.state.data) || {};
  const buttonText = editPage ? 'Save' : 'Add Issue';
  const formTitle = editPage ? 'Edit Issue' : 'Add Issue';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const product_uuid = location.state && location.state.product_uuid;

  // form fields definition
  const [description, setDescription] = useState((editData && editData.description) || '');
  const name = useInput((editData && editData.name) || '', { required: true });
  // const feature = useInput((editData && editData.feature_uuid) || '', { required: true });
  const [feature, setFeatureValue] = useState((editData && editData.feature_uuid) || '');
  const type = useInput((editData && editData.issue_type) || '', { required: true });
  const [startDate, handleStartDateChange] = useState(moment(
    (editData && editData.start_date) || moment(),
  ));
  const [endDate, handleEndDateChange] = useState(moment(
    (editData && editData.end_date) || moment(),
  ));
  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState((editData && editData.tags) || []);
  const estimate = useInput((editData && editData.estimate) || '');
  const complexity = useInput((editData && editData.complexity) || 0);
  const [assignees, setAssignees] = useState(
    (editData && editData.issue_detail && _.map(editData.issue_detail.assignees, 'username'))
    || [],
  );
  const [assigneeData, setAssigneeData] = useState([]);
  const [repoList, setRepoList] = useState([]);
  const repo = useInput((editData && editData.repository) || '', { required: true });
  const statusID = useInput((editData && editData.status) || '');
  const [status, setStatus] = useState('');
  const [colID, setColID] = useState((editData && status?.status_tracking_id) || '');
  const [formError, setFormError] = useState({});

  useEffect(() => {
    const prod = _.find(products, { product_uuid });
    const assigneeOptions = _.map(prod?.issue_tool_detail?.user_list, 'username') || [];

    setRepoList(prod?.issue_tool_detail?.repository_list || []);
    setAssigneeData(assigneeOptions);
  }, [products]);

  useEffect(() => {
    if (editData) {
      const sts = _.find(statuses, { status_uuid: editData.status });
      setStatus(sts);
      setColID(sts?.status_tracking_id);
    }
  }, [statuses]);

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || feature.hasChanged()
      || type.hasChanged()
      || statusID.hasChanged()
      || repo.hasChanged()
      || !!((editData && editData.start_date)
        && !_.isEqual(moment(editData.start_date).format('L'), moment(startDate).format('L')))
      || !!((editData && editData.end_date)
        && !_.isEqual(moment(editData.end_date).format('L'), moment(endDate).format('L')))
      || (!editPage && (!_.isEmpty(tags) || !_.isEmpty(assignees)))
      || !!(editPage && editData && !_.isEqual((editData.tags || []), tags))
      || !!(editPage && editData && editData.issue_detail
        && !_.isEqual(_.map(editData.issue_detail.assigneees, 'username'), assignees))
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(_.includes(location.state.from, 'kanban')
          ? routes.DASHBOARD_KANBAN
          : routes.DASHBOARD_TABULAR);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    history.push(_.includes(location?.state?.from, 'kanban')
      ? routes.DASHBOARD_KANBAN
      : routes.DASHBOARD_TABULAR);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const issueCred = _.find(credentials, (cred) => (_.toLower(cred.auth_detail.tool_type) === 'issue'));

    const formData = {
      ...editData,
      edit_date: dateTime,
      name: name.value,
      description,
      feature_uuid: feature,
      issue_type: type.value,
      start_date: startDate,
      end_date: endDate,
      status: statusID.value,
      tags,
      product_uuid,
      estimate: estimate.value,
      complexity: Number(complexity.value),
      repository: repo.value,
      column_id: colID,
      issue_detail: {
        assignees: _.filter(assigneeData, (user) => (
          !!user && _.includes(assignees, user.username)
        )),
      },
      ...issueCred?.auth_detail,
    };

    if (editPage) {
      dispatch(updateIssue(formData));
    } else {
      formData.create_date = dateTime;
      dispatch(createIssue(formData));
    }
    history.push(_.includes(location.state.from, 'kanban')
      ? routes.DASHBOARD_KANBAN
      : routes.DASHBOARD_TABULAR);
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
      || !description
      || !feature
      || !type.value
      || !statusID.value
      || (!_.isEmpty(repoList) && !repo.value)
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
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {loading && <Loader open={loading} />}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
                <SmartInput
                  onEditorValueChange={setDescription}
                  value={description}
                  inputLabel="Description"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  id="feature"
                  name="feature"
                  options={features}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => setFeatureValue(value.feature_uuid)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      label="Feature"
                      error={
                              formError.feature
                              && formError.feature.error
                            }
                      helperText={
                              formError.feature
                                ? formError.feature.message
                                : ''
                            }
                      {...feature.bind}
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
                  {_.map(ISSUETYPES, (tp, idx) => (
                    <MenuItem
                      key={`issue-type-${idx}`}
                      value={tp}
                    >
                      {tp}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {!_.isEmpty(repoList) && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="repo"
                    label="Repository"
                    name="repo"
                    autoComplete="repo"
                    value={repo.value}
                    onChange={(e) => {
                      const repository = e.target.value;
                      repo.setNewValue(repository.name);
                      setTagList(repository.labels || []);
                    }}
                  >
                    {_.map(repoList, (rep) => (
                      <MenuItem
                        key={`rep-${rep.id}-${rep.name}`}
                        value={rep}
                      >
                        {rep.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <DatePickerComponent
                  label="Start Date"
                  selectedDate={startDate}
                  hasTime
                  handleDateChange={handleStartDateChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePickerComponent
                  label="End Date"
                  selectedDate={endDate}
                  hasTime
                  handleDateChange={handleEndDateChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="status"
                  label="Status"
                  name="status"
                  autoComplete="status"
                  value={status}
                  onChange={(e) => {
                    const stat = e.target.value;
                    setStatus(stat);
                    statusID.setNewValue(stat?.status_uuid);
                    setColID(stat?.status_tracking_id);
                  }}
                >
                  {_.map(statuses, (sts) => (
                    <MenuItem
                      key={`status-${sts.status_uuid}-${sts.name}`}
                      value={sts}
                    >
                      {sts.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {!_.isEmpty(repo) && (
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    multiple
                    filterSelectedOptions
                    id="tags"
                    options={tagList}
                    value={tags}
                    onChange={(e, newValue) => setTags(newValue)}
                    renderTags={(value, getTagProps) => (
                      _.map(value, (option, index) => (
                        <Chip
                          variant="default"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags"
                        margin="normal"
                      />
                    )}
                  />
                </Grid>
              )}

              {!_.isEmpty(assigneeData) && (
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions
                  id="assignees"
                  options={assigneeData}
                  value={assignees}
                  onChange={(e, newValue) => setAssignees(newValue)}
                  renderTags={(value, getAssigneeProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={option}
                        {...getAssigneeProps({ index })}
                      />
                    ))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Assignees"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              )}

              {editPage && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    disabled
                    id="estimate"
                    label="Estimate"
                    name="estimate"
                    autoComplete="estimate"
                    helperText={
                      formError.estimate
                        ? formError.estimate.message
                        : ''
                    }
                    {...estimate.bind}
                  />
                </Grid>
              )}

              {editPage && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    disabled
                    type="number"
                    id="complexity"
                    label="Complexity"
                    name="complexity"
                    autoComplete="complexity"
                    helperText={
                      formError.complexity
                        ? formError.complexity.message
                        : ''
                    }
                    {...complexity.bind}
                  />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={isDesktop ? 3 : 0} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={discardFormData}
                  className={classes.submit}
                >
                  Cancel
                </Button>
              </Grid>

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
            </Grid>
          </form>
        </FormModal>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  loading: state.productReducer.loading || state.releaseReducer.loading,
  statuses: state.releaseReducer.statuses,
  features: state.releaseReducer.features,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(AddIssues);
