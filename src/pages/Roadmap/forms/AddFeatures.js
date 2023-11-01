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
  MenuItem,
  Chip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio, Slider, Typography,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import SmartInput from '@components/SmartInput/SmartInput';
import { useInput } from '@hooks/useInput';
import { createFeature, updateFeature } from '@redux/release/actions/release.actions';
import { validators } from '@utils/validators';
import { PRIORITIES } from '../RoadmapConstants';

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
  processSection: {
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const AddFeatures = ({
  location,
  statuses,
  releases,
  dispatch,
  products,
  credentials,
  loading,
  history,
  features,
}) => {
  const classes = useStyles();
  const redirectTo = location.state && location.state.from;
  const editPage = location.state && (location.state.type === 'edit' || location.state.type === 'view');
  const editData = (editPage && location.state.data) || {};
  const product_uuid = location.state && location.state.product_uuid;
  const viewPage = (location.state && location.state.type === 'view') || false;
  // eslint-disable-next-line no-nested-ternary
  const formTitle = viewPage ? 'View Feature' : editPage ? 'Edit Feature' : 'Add Feature';
  const buttonText = editPage ? 'Save' : 'Add Feature';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const [formError, setFormError] = useState({});
  const [assigneeData, setAssigneeData] = useState([]);

  // form fields definition
  const name = useInput((editData && editData.name) || '', { required: true, productFeatures: features });
  const description = useInput((editData && editData.description) || '', { required: true });
  const priority = useInput((editData && editData.priority) || '', { required: true });

  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState((editData && editData.tags) || []);

  const statusID = useInput((editData && editData.status) || '', { required: true });
  const [status, setStatus] = useState({ status: '' });
  const [colID, setColID] = useState({ colID: (editData && status?.status_tracking_id) || '' });

  const releaseUuid = useInput((editData && editData.release_uuid) || '', { required: true });
  const [release, setRelease] = useState(releaseUuid.value);

  const complexityValue = useInput((editData && editData.complexity) || 1, { required: true });
  const [complexity, setComplexity] = useState(complexityValue.value);

  const [assignees, setAssignees] = useState(
    (editData && editData.feature_detail && _.map(editData.feature_detail.assigneees, 'username'))
    || [],
  );

  const collecting_data = useInput((editData && editData.feature_detail?.collecting_data) || '');
  const field_desc = useInput((editData && editData.feature_detail?.field_desc) || '', { required: true });
  const displaying_data = useInput((editData && editData.feature_detail?.displaying_data) || '');
  const display_desc = useInput((editData && editData.feature_detail?.display_desc) || '', { required: true });
  const business_logic = useInput((editData && editData.feature_detail?.business_logic) || '');
  const enabled = useInput((editData && editData.feature_detail?.enabled) || '');
  const enabled_desc = useInput((editData && editData.feature_detail?.enabled_desc) || '', { required: true });
  const search_or_nav = useInput((editData && editData.feature_detail?.search_or_nav) || '');
  const links = useInput((editData && editData.feature_detail?.links) || '');

  const complexityMarkers = [
    {
      value: 1,
      label: 1,
    },
    {
      value: 2,
      label: 2,
    },
    {
      value: 3,
      label: 3,
    },
    {
      value: 4,
      label: 4,
    },
    {
      value: 5,
      label: 5,
    },
  ];

  const valuetext = (value) => value.toString();

  useEffect(() => {
    const prod = _.find(products, { product_uuid });
    const assigneeOptions = _.map(prod?.feature_tool_detail?.user_list, 'username') || [];

    setAssigneeData(assigneeOptions);
    setTagList(prod?.feature_tool_detail?.labels || []);
  }, [products]);

  useEffect(() => {
    if (editData) {
      const sts = _.find(statuses, { status_uuid: editData.status });
      setStatus(sts);
      setColID(sts?.status_tracking_id);
    }
  }, [statuses]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const featCred = _.find(credentials, (cred) => (_.toLower(cred.auth_detail.tool_type) === 'feature'));

    const formData = {
      ...editData,
      edit_date: dateTime,
      name: name.value,
      description: description.value,
      complexity,
      release_uuid: release,
      status: statusID.value,
      priority: priority.value,
      tags,
      product_uuid,
      ...featCred?.auth_detail,
      feature_detail: {
        collecting_data: collecting_data.value,
        field_desc: field_desc.value,
        displaying_data: displaying_data.value,
        display_desc: display_desc.value,
        business_logic: business_logic.value,
        enabled: enabled.value,
        enabled_desc: enabled_desc.value,
        search_or_nav: search_or_nav.value,
        links: links.value,
        assigneees: _.filter(assigneeData, (user) => (
          !!user && _.includes(assignees, user.username)
        )),
      },
    };

    if (editPage) {
      formData.column_id = colID;
      dispatch(updateFeature(formData));
    } else {
      formData.create_date = dateTime;
      dispatch(createFeature(formData));
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

  const sanitizeString = (value) => value.replace(/(<([^>]+)>)/gi, '');

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);

    if (
      !name.value
      || !sanitizeString(description.value).length
      || !statusID.value
      || !priority.value
      || (collecting_data.value === 'yes' && !field_desc.value)
      || (displaying_data.value === 'yes' && !display_desc.value)
      || (displaying_data.value === 'yes' && !business_logic.value)
      || (enabled.value === 'yes' && !enabled_desc.value)
      || (business_logic.value === 'no' && !search_or_nav.value)
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

  const handleClose = () => {
    const dataHasChanged = (
      name.hasChanged()
    || priority.hasChanged()
    || statusID.hasChanged()
    || collecting_data.hasChanged()
    || field_desc.hasChanged()
    || displaying_data.hasChanged()
    || display_desc.hasChanged()
    || business_logic.hasChanged()
    || enabled.hasChanged()
    || enabled_desc.hasChanged()
    || search_or_nav.hasChanged()
    || links.hasChanged()
    || (!editPage && (!_.isEmpty(tags) || !_.isEmpty(assignees)))
    || !!(editPage && editData && !_.isEqual((editData.tags || []), tags))
    || !!(editPage && editData && editData.feature_detail
      && !_.isEqual(_.map(editData.feature_detail.assigneees, 'username'), assignees))
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      history.push(redirectTo);
    }
  };

  return (
    <>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={handleClose}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={(e) => history.push(redirectTo)}
        >
          {loading && <Loader open={loading} />}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              {/* Name */}
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
                  onBlur={(e) => handleBlur(e, 'duplicate', name)}
                  {...name.bind}
                  disabled={viewPage}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <SmartInput
                  onEditorValueChange={description.setNewValue}
                  value={description.value}
                  inputLabel="Description"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>

              {/* Release */}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="release"
                  label="Release"
                  name="release"
                  value={release}
                  autoComplete="release"
                  disabled={viewPage}
                  onChange={(e) => {
                    const selectedRelease = e.target.value;
                    setRelease(selectedRelease);
                    releaseUuid.setNewValue(selectedRelease);
                  }}
                >
                  {_.map(releases, (rl) => (
                    <MenuItem
                      key={`release-${rl.release_uuid}-${rl.name}`}
                      value={rl.release_uuid}
                    >
                      {rl.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Complexity */}
              <Grid item xs={12}>
                <Typography gutterBottom>Complexity</Typography>
                <Slider
                  aria-label="Complexity"
                  defaultValue={complexity}
                  step={1}
                  min={1}
                  max={5}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  marks={complexityMarkers}
                  onChange={(e) => {
                    const complexityObj = e.target.value;
                    setComplexity(complexityObj);
                    complexityValue.setNewValue(complexityObj.value);
                  }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="status"
                  label="Status"
                  name="status"
                  value={status}
                  autoComplete="status"
                  disabled={viewPage}
                  onChange={(e) => {
                    const stat = e.target.value;
                    setStatus(stat);
                    statusID.setNewValue(stat.status_uuid);
                    setColID(stat.status_tracking_id);
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

              {/* Priority */}
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="priority "
                  label="Priority"
                  name="priority"
                  autoComplete="priority"
                  error={
                    formError.priority
                    && formError.priority.error
                  }
                  helperText={
                    formError.priority
                      ? formError.priority.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', priority)}
                  {...priority.bind}
                  disabled={viewPage}
                >
                  {_.map(PRIORITIES, (prty, idx) => (
                    <MenuItem
                      key={`priority-${idx}`}
                      value={prty}
                    >
                      {prty}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {/* Tags */}
            {!_.isEmpty(tagList) && (
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
                  disabled={viewPage}
                />
              </Grid>
            )}

            {/* Assignees */}
            {!_.isEmpty(assigneeData) && (
              <Grid item xs={12} md={8}>
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
                  disabled={viewPage}
                />
              </Grid>
            )}

            <Grid container spacing={isDesktop ? 2 : 0} className={classes.processSection}>
              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset" disabled={viewPage}>
                  <FormLabel component="legend">
                    Are we collecting any data from the user?
                  </FormLabel>
                  <RadioGroup
                    aria-label="collecting-data"
                    name="collecting_data"
                    {...collecting_data.bind}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio color="info" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio color="info" />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {collecting_data.value === 'yes' && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="field_desc"
                    label="Describe the fields"
                    name="field_desc"
                    autoComplete="field_desc"
                    error={formError.field_desc && formError.field_desc.error}
                    helperText={
                      formError && formError.field_desc
                        ? formError.field_desc.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', field_desc)}
                    {...field_desc.bind}
                    disabled={viewPage}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset" disabled={viewPage}>
                  <FormLabel component="legend">
                    Is the collected or stored data to be displayed to the user?
                  </FormLabel>
                  <RadioGroup
                    aria-label="displaying-data"
                    name="displaying_data"
                    {...displaying_data.bind}
                  >
                    <FormControlLabel
                      value="yes"
                      label="Yes"
                      control={<Radio color="info" />}
                    />
                    <FormControlLabel
                      value="no"
                      label="No"
                      control={<Radio color="info" />}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {displaying_data.value === 'yes' && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="display_desc"
                    label="Describe how data will be displayed"
                    name="display_desc"
                    autoComplete="display_desc"
                    error={formError.display_desc && formError.display_desc.error}
                    helperText={
                      formError && formError.display_desc
                        ? formError.display_desc.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', display_desc)}
                    {...display_desc.bind}
                    disabled={viewPage}
                  />
                </Grid>
              )}

              {displaying_data.value === 'yes' && (
                <Grid item xs={12}>
                  <FormControl fullWidth component="fieldset" disabled={viewPage}>
                    <FormLabel component="legend">
                      Is there any particular flow or logic to be followed for the
                      collected or stored data?
                    </FormLabel>
                    <RadioGroup
                      aria-label="business-logic"
                      name="business_logic"
                      {...business_logic.bind}
                    >
                      <FormControlLabel
                        value="yes"
                        label="Yes"
                        control={<Radio color="info" />}
                      />
                      <FormControlLabel
                        value="no"
                        label="No"
                        control={<Radio color="info" />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset" disabled={viewPage}>
                  <FormLabel component="legend">
                    Are we making any important decisions that need to be notified or displayed?
                  </FormLabel>
                  <RadioGroup
                    aria-label="making-decision"
                    name="enabled"
                    {...enabled.bind}
                  >
                    <FormControlLabel
                      value="yes"
                      label="Yes"
                      control={<Radio color="info" />}
                    />
                    <FormControlLabel
                      value="no"
                      label="No"
                      control={<Radio color="info" />}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {enabled.value === 'yes' && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="enabled_desc"
                    label="Describe how decision will be displayed"
                    name="enabled_desc"
                    autoComplete="enabled_desc"
                    error={formError.enabled_desc && formError.enabled_desc.error}
                    helperText={
                      formError && formError.enabled_desc
                        ? formError.enabled_desc.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', enabled_desc)}
                    {...enabled_desc.bind}
                    disabled={viewPage}
                  />
                </Grid>
              )}

              {business_logic.value === 'no' && (
                <Grid item xs={12}>
                  <FormControl fullWidth component="fieldset" disabled={viewPage}>
                    <FormLabel component="legend">
                      How does a user find this data?
                    </FormLabel>
                    <RadioGroup
                      aria-label="user-find-data"
                      name="search_or_nav"
                      {...search_or_nav.bind}
                    >
                      <FormControlLabel
                        value="search"
                        label="Search"
                        control={<Radio color="info" />}
                      />
                      <FormControlLabel
                        value="nav"
                        label="Nav"
                        control={<Radio color="info" />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}

              {(search_or_nav.value === 'nav' || enabled.value === 'no') && (
                <Grid item xs={12}>
                  <FormControl fullWidth component="fieldset" disabled={viewPage}>
                    <FormLabel component="legend">
                      Where do you want to display links?
                    </FormLabel>
                    <RadioGroup
                      aria-label="links"
                      name="links"
                      {...links.bind}
                    >
                      <FormControlLabel
                        value="top"
                        label="Top"
                        control={<Radio color="info" />}
                      />
                      <FormControlLabel
                        value="secondary"
                        label="Secondary"
                        control={<Radio color="info" />}
                      />
                      <FormControlLabel
                        value="tertiary"
                        label="Tertiary"
                        control={<Radio color="info" />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Grid container spacing={3} className={classes.buttonContainer}>
              <Grid item xs={12} sm={4}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleClose}
                  className={classes.submit}
                >
                  Cancel
                </Button>
              </Grid>

              {!viewPage && (
                <Grid item xs={12} sm={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submit}
                    disabled={submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                </Grid>
              )}
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
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
  features: state.releaseReducer.features,
  releases: state.releaseReducer.releases,
});

export default connect(mapStateToProps)(AddFeatures);
