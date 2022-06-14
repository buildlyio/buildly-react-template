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
  getAllFeatures,
  getAllStatuses,
  createIssue,
  updateIssue,
} from '@redux/decision/actions/decision.actions';
import { getAllCredentials } from '@redux/product/actions/product.actions';
import { validators } from '@utils/validators';
import { ISSUETYPES, TAGS } from './formConstants';
import { routes } from '@routes/routesConstants';

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
  const currentStatData = _.find(currentStat, { status_uuid: statusID });
  const [status, setStatus] = useState((editData && currentStatData) || '');
  const [colID, setColID] = useState((editData && currentStatData?.status_tracking_id) || '');

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && location.state.type === 'edit';
  const convertPage = location.state && location.state.type === 'convert';

  const name = useInput(
    (convertData && convertData.name)
    || (editData && editData.name) || '',
    { required: true },
  );
  const description = useInput(
    (convertData && convertData.description)
    || (editData && editData.description) || '',
    { required: true },
  );
  const feature = useInput(
    (convertData && convertData.feature_uuid)
    || (editData && editData.feature_uuid) || '',
    { required: true },
  );
  const type = useInput((editData && editData.issue_type) || '', {
    required: true,
  });
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
  const [formError, setFormError] = useState({});

  const buttonText = convertPage
    ? 'Convert to Issue'
    : editPage ? 'Save' : 'Add Issue';
  const formTitle = convertPage
    ? 'Convert to Issue'
    : editPage ? 'Edit Issue' : 'Add Issue';

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
  }, [product]);

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || description.hasChanged()
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
      dispatch(updateIssue(formData));
    } else {
      formData.create_date = dateTime;
      formData.issue_detail = {};
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
      || !feature.value
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
                  {_.map(productFeatures, (feat) => (
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
                  {_.map(prodStatus, (sts) => (
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
  statuses: state.decisionReducer.statuses,
  features: state.decisionReducer.features,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(AddIssues);
