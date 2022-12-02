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
  Radio,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import SmartInput from '@components/SmartInput/SmartInput';
import { useInput } from '@hooks/useInput';
import { createFeature, updateFeature } from '@redux/release/actions/release.actions';
import { validators } from '@utils/validators';
import { PRIORITIES } from '../DashboardConstants';

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
  const description = useInput((editData && editData.description) || '');
  const priority = useInput((editData && editData.priority) || '', { required: true });

  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState((editData && editData.tags) || []);

  const statusID = useInput((editData && editData.status) || '');
  const [status, setStatus] = useState('');
  const [colID, setColID] = useState((editData && status?.status_tracking_id) || '');

  const [assignees, setAssignees] = useState(
    (editData && editData.feature_detail && _.map(editData.feature_detail.assigneees, 'username'))
    || [],
  );

  const quest1 = useInput((editData && editData.feature_detail?.collecting_data) || '');
  const quest2 = useInput((editData && editData.feature_detail?.field_desc) || '', { required: true });
  const quest3 = useInput((editData && editData.feature_detail?.displaying_data) || '');
  const quest4 = useInput((editData && editData.feature_detail?.display_desc) || '', { required: true });
  const quest5 = useInput((editData && editData.feature_detail?.business_logic) || '');
  const quest6 = useInput((editData && editData.feature_detail?.enabled) || '');
  const quest7 = useInput((editData && editData.feature_detail?.enabled_desc) || '', { required: true });
  const quest8 = useInput((editData && editData.feature_detail?.search_or_nav) || '');
  const quest9 = useInput((editData && editData.feature_detail?.links) || '');

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
      product_uuid,
      ...featCred?.auth_detail,
      feature_detail: {
        collecting_data: quest1.value,
        field_desc: quest2.value,
        displaying_data: quest3.value,
        display_desc: quest4.value,
        business_logic: quest5.value,
        enabled: quest6.value,
        enabled_desc: quest7.value,
        search_or_nav: quest8.value,
        links: quest9.value,
        assigneees: _.filter(assigneeData, (user) => (
          !!user && _.includes(assignees, user.username)
        )),
      },
    };

    if (editPage) {
      formData.status = statusID.value;
      formData.tags = tags;
      formData.priority = priority.value;
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

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (
      !name.value
      || !description.value
      || !quest1.value
      || (quest1.value === 'yes' && !quest2.value)
      || !quest3.value
      || (quest3.value === 'yes' && !quest4.value)
      || (quest3.value === 'yes' && !quest5.value)
      || !quest6.value
      || (quest6.value === 'yes' && !quest7.value)
      || (quest5.value === 'no' && !quest8.value)
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
    || quest1.hasChanged()
    || quest2.hasChanged()
    || quest3.hasChanged()
    || quest4.hasChanged()
    || quest5.hasChanged()
    || quest6.hasChanged()
    || quest7.hasChanged()
    || quest8.hasChanged()
    || quest9.hasChanged()
    || priority.hasChanged()
    || statusID.hasChanged()
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

              <Grid item xs={12}>
                <SmartInput
                  onEditorValueChange={description.setNewValue}
                  value={description.value}
                  inputLabel="Description"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
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
                    name="quest1"
                    {...quest1.bind}
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

              {quest1.value === 'yes' && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="quest2"
                    label="Describe the fields"
                    name="quest2"
                    autoComplete="quest2"
                    error={formError.quest2 && formError.quest2.error}
                    helperText={
                      formError && formError.quest2
                        ? formError.quest2.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', quest2)}
                    {...quest2.bind}
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
                    name="quest3"
                    {...quest3.bind}
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

              {quest3.value === 'yes' && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="quest4"
                    label="Describe how data will be displayed"
                    name="quest4"
                    autoComplete="quest4"
                    error={formError.quest4 && formError.quest4.error}
                    helperText={
                      formError && formError.quest4
                        ? formError.quest4.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', quest4)}
                    {...quest4.bind}
                    disabled={viewPage}
                  />
                </Grid>
              )}

              {quest3.value === 'yes' && (
                <Grid item xs={12}>
                  <FormControl fullWidth component="fieldset" disabled={viewPage}>
                    <FormLabel component="legend">
                      Is there any particular flow or logic to be followed for the
                      collected or stored data?
                    </FormLabel>
                    <RadioGroup
                      aria-label="business-logic"
                      name="quest5"
                      {...quest5.bind}
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
                    name="quest6"
                    {...quest6.bind}
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

              {quest6.value === 'yes' && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="quest7"
                    label="Describe how decision will be displayed"
                    name="quest7"
                    autoComplete="quest7"
                    error={formError.quest7 && formError.quest7.error}
                    helperText={
                      formError && formError.quest7
                        ? formError.quest7.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'required', quest7)}
                    {...quest7.bind}
                    disabled={viewPage}
                  />
                </Grid>
              )}

              {quest5.value === 'no' && (
                <Grid item xs={12}>
                  <FormControl fullWidth component="fieldset" disabled={viewPage}>
                    <FormLabel component="legend">
                      How does a user find this data?
                    </FormLabel>
                    <RadioGroup
                      aria-label="user-find-data"
                      name="quest8"
                      {...quest8.bind}
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

              {(quest8.value === 'nav' || quest6.value === 'no') && (
                <Grid item xs={12}>
                  <FormControl fullWidth component="fieldset" disabled={viewPage}>
                    <FormLabel component="legend">
                      Where do you want to display links?
                    </FormLabel>
                    <RadioGroup
                      aria-label="links"
                      name="quest9"
                      {...quest9.bind}
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
                  variant="contained"
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
});

export default connect(mapStateToProps)(AddFeatures);
