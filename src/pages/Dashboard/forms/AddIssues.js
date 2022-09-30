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
import {
  getAllFeatures,
  getAllStatuses,
  createIssue,
  updateIssue,
} from '@redux/decision/actions/decision.actions';
import { getAllCredentials } from '@redux/product/actions/product.actions';
import { validators } from '@utils/validators';
import { ISSUETYPES, TAGS } from './formConstants';
import { routes } from '@routes/routesConstants';
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
  credentials,
  products,
  boards,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [productFeatures, setProductFeatures] = useState([]);
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};
  const convertData = (
    location.state
    && location.state.type === 'convert'
    && location.state.data
  ) || {};
  const product_uuid = location.state && location.state.product_uuid;
  const prdt = _.find(products, { product_uuid });
  const [product, setProduct] = useState('');
  const [prodStatus, setProdStatus] = useState('');
  const [repo, setRepo] = useState((editData && editData.repository) || '');
  const repoData = _.map(prdt?.issue_tool_detail?.repository_list);
  const [repoList, setRepoList] = useState((editData && repoData) || []);
  const [statusID, setStatusID] = useState((editData && editData.status) || '');
  const currentStat = _.filter(statuses, { product_uuid });
  const currentStatData = _.find(currentStat, { status_uuid: editData.status });
  const [status, setStatus] = useState('');
  const [colID, setColID] = useState((editData && currentStatData?.status_tracking_id) || '');

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && location.state.type === 'edit';
  const convertPage = location.state && location.state.type === 'convert';

  const name = useInput(editData.name || '', {
    required: true,
  });
  const description = useInput(editData.description || '', {
    required: true,
  });
  const type = useInput(editData.type || '', {
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

  const editAssigneeData = [];
  for (let i = 0; i < editData?.issue_detail?.assignees?.length; i += 1) {
    editAssigneeData.push(editData.issue_detail.assignees[i].username);
  }
  const [assignees, setAssignees] = useState((editData && editAssigneeData) || []);
  const assigneeData = [];
  for (let i = 0; i < product?.feature_tool_detail?.user_list?.length; i += 1) {
    assigneeData.push(product.feature_tool_detail.user_list[i].username);
  }
  const assigneesList = [...new Set(product?.issue_tool_detail?.user_list
    ?.filter((element) => assignees?.includes(element?.username)))];

  const buttonText = editPage ? 'Save' : 'Add Issue';
  const formTitle = editPage ? 'Edit Issue' : 'Add Issue';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!features || _.isEmpty(features)) {
      dispatch(getAllFeatures());
    }
    dispatch(getAllStatuses());
    if (!credentials || _.isEmpty(credentials)) {
      dispatch(getAllCredentials());
    }
  }, []);

  useEffect(() => {
    setProductFeatures(_.filter(features, { product_uuid }));
  }, [features]);

  useEffect(() => {
    const prd = _.find(products, { product_uuid });

    if (prd && prd.issue_tool_detail
      && !_.isEmpty(prd.issue_tool_detail)
    ) {
      setRepoList(_.map(prd.issue_tool_detail.repository_list));
    }
    setProduct(prd);
  }, [products]);

  useEffect(() => {
    const sta = _.filter(statuses, { product_uuid });
    setProdStatus(sta);
    if (editData) {
      setStatus(_.find(sta, { status_uuid: editData.status }));
    }
  }, [product]);

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || description.hasChanged()
      || type.hasChanged()
      || (!_.isEmpty(editData) && !_.isEqual(startDate, editData.start_date))
      || (!_.isEmpty(editData) && !_.isEqual(endDate, editData.end_date))
      || (_.isEmpty(currentStatData) && !_.isEmpty(status))
      || (!_.isEmpty(convertData) && !_.isEqual(tags, convertData.tags))
      || (!_.isEmpty(editData) && !_.isEqual(tags, editData.tags))
      || (_.isEmpty(editData) && !_.isEmpty(tags))
      || estimate.hasChanged()
      || complexity.hasChanged()
      || (product
        && product.issue_tool_detail
        && !_.isEmpty(repoList)
        && repo !== '')
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(_.includes(location.state.from, 'kanban')
          ? `${routes.DASHBOARD}/kanban`
          : `${routes.DASHBOARD}/list`);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(_.includes(location.state.from, 'kanban')
        ? `${routes.DASHBOARD}/kanban`
        : `${routes.DASHBOARD}/list`);
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

  const issueCred = _.find(
    credentials,
    { product_uuid, auth_detail: { tool_type: 'Issue' } },
  );
  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const formData = {
      ...editData,
      edit_date: dateTime,
      name: name.value,
      description: description.value,
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
      ...issueCred?.auth_detail,
    };
    if (editPage) {
      editData.issue_detail.assignees = assigneesList;
      dispatch(updateIssue(formData));
    } else {
      formData.issue_detail = {
        assignees: assigneesList,
      };
      formData.create_date = dateTime;
      dispatch(createIssue(formData));
    }
    history.push(_.includes(location.state.from, 'kanban')
      ? `${routes.DASHBOARD}/kanban`
      : `${routes.DASHBOARD}/list`);
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
      || !statusID
      || (product
        && product.issue_tool_detail
        && !_.isEmpty(repoList)
        && !repo)
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
<<<<<<< HEAD
=======
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
>>>>>>> master
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
<<<<<<< HEAD
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
=======
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
                  {_.map(prodStatus, (sts) => (
                    <MenuItem
                      key={`status-${sts.status_uuid}-${sts.name}`}
                      value={sts}
                    >
                      {sts.name}
                    </MenuItem>
                  ))}
>>>>>>> master
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
  statuses: state.decisionReducer.statuses,
  features: state.decisionReducer.features,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(AddIssues);
