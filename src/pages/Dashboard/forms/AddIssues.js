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
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import {
  createIssue,
  updateIssue,
} from '@redux/release/actions/release.actions';
import { validators } from '@utils/validators';
import { ISSUETYPES, TAGS } from './formConstants';
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
}) => {
  const classes = useStyles();
  const editPage = location.state && location.state.type === 'edit';
  const convertPage = location.state && location.state.type === 'convert';
  const editData = (editPage && location.state.data) || {};
  const convertData = (convertPage && location.state.data) || {};
  const buttonText = convertPage ? 'Convert to Issue' : editPage ? 'Save' : 'Add Issue';
  const formTitle = convertPage ? 'Convert to Issue' : editPage ? 'Edit Issue' : 'Add Issue';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const product_uuid = location.state && location.state.product_uuid;
  const prdt = _.find(products, { product_uuid });
  const [product, setProduct] = useState('');
  const [repo, setRepo] = useState((editData && editData.repository) || '');
  const repoData = _.map(prdt?.issue_tool_detail?.repository_list);
  const [repoList, setRepoList] = useState((editData && repoData) || []);
  const [statusID, setStatusID] = useState((editData && editData.status) || '');
  const currentStatData = _.find(statuses, { status_uuid: editData.status });
  const [status, setStatus] = useState('');
  const [colID, setColID] = useState((editData && currentStatData?.status_tracking_id) || '');

  // form fields definition
  const [description, setDescription] = useState(
    (convertData && convertData.description) || (editData && editData.description) || ''
  );

  const name = useInput(
    (convertData && convertData.name) || (editData && editData.name) || '',
    { required: true },
  );

  const feature = useInput(
    (convertData && convertData.feature_uuid) || (editData && editData.feature_uuid) || '',
    { required: true },
  );

  const type = useInput((editData && editData.issue_type) || '', { required: true });

  const [startDate, handleStartDateChange] = useState(
    (editData && editData.start_date) || new Date(),
  );

  const [endDate, handleEndDateChange] = useState(
    (editData && editData.end_date) || new Date(),
  );

  const [tags, setTags] = useState(
    (convertData && convertData.tags)
    || (editData && editData.tags)
    || [],
  );

  const estimate = useInput(
    (convertData && convertData.total_estimate)
    || (editData && editData.estimate)
    || '',
  );

  const complexity = useInput((editData && editData.complexity) || 0);

  const [assignees, setAssignees] = useState(
    (editData && editData.issue_detail && editData.issue_detail.assignees
      && !_.isEmpty(editData.issue_detail.assignees)
      && _.map(editData.issue_detail.assignees, 'username'))
    || [],
  );

  const [assigneeData, setAssigneeData] = useState([]);
  const [formError, setFormError] = useState({});

  useEffect(() => {
    const temp_product = _.find(products, { product_uuid });
    if (temp_product && temp_product.issue_tool_detail
      && !_.isEmpty(temp_product.issue_tool_detail)
    ) {
      setRepoList(_.map(temp_product.issue_tool_detail.repository_list));
    }

    setProduct(temp_product);
  }, [products]);

  useEffect(() => {
    const assigneeOptions = (product && product.feature_tool_detail
      && product.feature_tool_detail.user_list
      && !_.isEmpty(product.feature_tool_detail.user_list)
      && _.map(product.feature_tool_detail.user_list, 'username')) || [];

    if (editData) {
      setStatus(_.find(statuses, { status_uuid: editData.status }));
    }

    setAssigneeData(assigneeOptions);
  }, [product]);

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || (
        (editPage && (description !== editData.description))
        || (!editPage && description)
      )
      || feature.hasChanged()
      || type.hasChanged()
      || (!_.isEmpty(editData) && !_.isEqual(startDate, editData.start_date))
      || (!_.isEmpty(editData) && !_.isEqual(endDate, editData.end_date))
      || (_.isEmpty(currentStatData) && !_.isEmpty(status))
      || (!_.isEmpty(convertData) && !_.isEqual(tags, convertData.tags))
      || (!_.isEmpty(editData) && !_.isEqual(tags, editData.tags))
      || (_.isEmpty(editData) && !_.isEmpty(tags))
      || estimate.hasChanged()
      || complexity.hasChanged()
      || (product && product.issue_tool_detail && !_.isEmpty(repoList) && repo !== '')
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
    if (location && location.state) {
      history.push(_.includes(location.state.from, 'kanban')
        ? routes.DASHBOARD_KANBAN
        : routes.DASHBOARD_TABULAR);
    }
  };

  // Handle tags list
  const onTagsChange = (value) => {
    switch (true) {
      case (value.length > tags.length):
        setTags([...tags, _.last(value)]);
        break;

      case (value.length < tags.length):
        setTags(value);
        break;

      default:
        break;
    }
  };

  const onAssigneeChange = (value) => {
    switch (true) {
      case (value.length > assignees.length):
        setAssignees([...assignees, _.last(value)]);
        break;

      case (value.length < assignees.length):
        setAssignees(value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const issueCred = _.find(
      credentials,
      { product_uuid, auth_detail: { tool_type: 'Issue' } },
    );

    const formData = {
      ...editData,
      edit_date: dateTime,
      name: name.value,
      description,
      feature_uuid: feature.value,
      issue_type: type.value,
      start_date: startDate,
      end_date: endDate,
      status: statusID,
      tags,
      product_uuid,
      estimate: estimate.value,
      complexity: Number(complexity.value),
      repository: repo,
      column_id: colID,
      issue_detail: {
        assignees: product && product.issue_tool_detail && product.issue_tool_detail.user_list
          && _.filter(product.issue_tool_detail.user_list, (user) => (
            user && _.includes(assignees, user.username)
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
      || !feature.value
      || !type.value
      || !statusID
      || (product && product.issue_tool_detail && !_.isEmpty(repoList) && !repo)
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
                <SmartInput
                  onEditorValueChange={setDescription}
                  value={description}
                  inputLabel="Description"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="feature"
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
                  <MenuItem value="">------------------------</MenuItem>
                  {_.map(features, (feat) => (
                    <MenuItem
                      key={`feature-${feat.feature_uuid}-${feat.name}`}
                      value={feat.feature_uuid}
                    >
                      {feat.name}
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
                  <MenuItem value="">------------------------</MenuItem>
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
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                  >
                    <MenuItem value="">------------------------</MenuItem>
                    {_.map(repoList, (rep) => (
                      <MenuItem
                        key={`rep-${rep.id}-${rep.name}`}
                        value={rep.name}
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
                    setStatusID(stat.status_uuid);
                    setColID(stat.status_tracking_id);
                  }}
                >
                  <MenuItem value="">------------------------</MenuItem>
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
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions
                  id="tags"
                  options={TAGS}
                  value={tags}
                  onChange={(e, newValue) => onTagsChange(newValue)}
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
              {!_.isEmpty(product?.issue_tool_detail?.user_list) && (
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions
                  id="assignees"
                  options={assigneeData}
                  value={assignees}
                  onChange={(e, newValue) => onAssigneeChange(newValue)}
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
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="estimate"
                  label="Estimate"
                  name="estimate"
                  autoComplete="estimate"
                  error={
                    formError.estimate
                    && formError.estimate.error
                  }
                  helperText={
                    formError.estimate
                      ? formError.estimate.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, '', estimate)}
                  {...estimate.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type="number"
                  id="complexity"
                  label="Complexity"
                  name="complexity"
                  autoComplete="complexity"
                  error={
                    formError.complexity
                    && formError.complexity.error
                  }
                  helperText={
                    formError.complexity
                      ? formError.complexity.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, '', complexity)}
                  {...complexity.bind}
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
  statuses: state.releaseReducer.statuses,
  features: state.releaseReducer.features,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(AddIssues);
