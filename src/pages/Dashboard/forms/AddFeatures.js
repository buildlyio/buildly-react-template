import React, { useContext, useState, useEffect } from 'react';
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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useInput } from '@hooks/useInput';
import {
  getAllStatuses,
  saveFeatureFormData,
} from '@redux/decision/actions/decision.actions';
import { getAllCredentials } from '@redux/product/actions/product.actions';
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

// eslint-disable-next-line import/no-mutable-exports
export let checkIfAddFeaturesEdited;

const AddFeatures = ({
  history,
  location,
  statuses,
<<<<<<< HEAD
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);

=======
  dispatch,
  products,
  credentials,
  productFeatures,
  handleNext,
  featureFormData,
}) => {
  const classes = useStyles();
  const [product, setProduct] = useState('');
  const [prodStatus, setProdStatus] = useState('');
>>>>>>> master
  const redirectTo = location.state && location.state.from;
  const editPage = location.state && (location.state.type === 'edit' || location.state.type === 'view');
  const editData = (
    location.state
    && (location.state.type === 'edit' || location.state.type === 'view')
    && location.state.data
  ) || {};
<<<<<<< HEAD
  const productID = location.state && location.state.productID;

  const name = useInput(editData.name || '', {
    required: true,
  });
  const description = useInput(editData.description || '', {
    required: true,
  });
  const priority = useInput(editData.priority || '', {
    required: true,
  });
  const status = useInput(editData.status || '', {
    required: true,
  });
  const tag = useInput(editData.tag || '', {
    required: true,
  });
=======
  const product_uuid = location.state && location.state.product_uuid;
  const viewPage = (location.state && location.state.viewOnly) || false;

  const retainAssigneeData = [];
  for (let i = 0; i < featureFormData?.assignees?.length; i += 1) {
    retainAssigneeData.push(featureFormData.assignees[i].username);
  }

  const name = useInput((editData && editData.name) || (featureFormData && featureFormData.name) || '', {
    required: true,
    productFeatures,
  });
  const description = useInput((editData && editData.description) || (featureFormData && featureFormData.description) || '', {
    required: true,
  });
  const priority = useInput((editData && editData.priority) || (featureFormData && featureFormData.priority) || '', {
    required: true,
  });
  const [tags, setTags] = useState((editData && editData.tags)
  || (featureFormData && featureFormData.tags) || []);

  const [statusID, setStatusID] = useState((editData && editData.status) || (featureFormData && featureFormData.status) || '');
  const currentStat = _.filter(statuses, { product_uuid });
  const currentStatData = _.find(currentStat, { status_uuid: statusID });
  const [status, setStatus] = useState('');
  const [colID, setColID] = useState((editData && currentStatData?.status_tracking_id) || '');

  const editAssigneeData = [];
  for (let i = 0; i < editData?.feature_detail?.assigneees?.length; i += 1) {
    editAssigneeData.push(editData.feature_detail.assigneees[i].username);
  }
  const [assignees, setAssignees] = useState((editData && editAssigneeData)
  || (featureFormData && retainAssigneeData) || []);

  const assigneeData = [];
  for (let i = 0; i < product?.feature_tool_detail?.user_list?.length; i += 1) {
    assigneeData.push(product.feature_tool_detail.user_list[i].username);
  }
  const assigneesList = [...new Set(product?.feature_tool_detail?.user_list
    ?.filter((element) => assignees.includes(element.username)))];

  // const totalEstimate = useInput((editData && editData.total_estimate)
  // || (featureFormData && featureFormData.total_estimate) || '');
  // const version = useInput((editData && editData.version)
  // || (featureFormData && featureFormData.version) || '');
>>>>>>> master
  const [formError, setFormError] = useState({});

  let formTitle;
  if (editPage) {
    formTitle = viewPage ? 'View Feature' : 'Edit Feature';
  } else {
    formTitle = 'Add Feature';
  }

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

<<<<<<< HEAD
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
    const featFormValue = {
      productID,
      id,
      name: name.value,
      description: description.value,
    };

    if (editPage) {
      console.log('Dispatch edit feature action here');
    } else {
      console.log('Dispatch add feature action here');
=======
  useEffect(() => {
    dispatch(getAllStatuses());
    if (!credentials || _.isEmpty(credentials)) {
      dispatch(getAllCredentials());
    }
  }, []);

  useEffect(() => {
    const prd = _.find(products, { product_uuid });
    setProduct(prd);
  }, [products]);

  useEffect(() => {
    const sta = _.filter(statuses, { product_uuid });
    setProdStatus(sta);
    if (editData) {
      setStatus(_.find(sta, { status_uuid: editData.status }));
    }
  }, [product]);

  checkIfAddFeaturesEdited = () => (
    name.hasChanged()
      || description.hasChanged()
      || priority.hasChanged()
      || (_.isEmpty(currentStatData) && !_.isEmpty(status))
      || (!_.isEmpty(editData) && !_.isEqual(tags, editData.tags))
      || (_.isEmpty(editData) && !_.isEmpty(tags))
      // || totalEstimate.hasChanged()
      // || version.hasChanged()
  );

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

  const featCred = _.find(
    credentials,
    { product_uuid, auth_detail: { tool_type: 'Feature' } },
  );
  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const formData = {
      ...editData,
      edit_date: dateTime,
      name: name.value,
      description: description.value,
      status: statusID,
      tags,
      product_uuid,
      priority: priority.value,
      // total_estimate: totalEstimate.value,
      // version: version.value,
      column_id: colID,
      ...featCred?.auth_detail,
      assignees: assigneesList,
    };

    if (editPage) {
      dispatch(saveFeatureFormData(formData));
    } else {
      formData.create_date = dateTime;
      dispatch(saveFeatureFormData(formData));
>>>>>>> master
    }
    handleNext();
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
<<<<<<< HEAD
    if (!name.value || !description.value) {
=======
    if (!name.value
      || !description.value
      || !statusID
      || !priority.value
      || !assignees
    ) {
>>>>>>> master
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
    if (!statuses || _.isEmpty(statuses)) {
      dispatch(getAllStatuses());
    }
  }, []);


  let priorities = [
    {
      "type": "Low",
      "id": 1,
    },
    {
      "type": "Medium",
      "id": 2,
    },
    {
      "type": "High",
      "id": 3,
    },
    {
      "type": "Urgent",
      "id": 4,
    },
  ]

  return (
    <>
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
              onBlur={(e) => handleBlur(e, 'duplicate', name)}
              {...name.bind}
              disabled={viewPage}
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
<<<<<<< HEAD
                  onBlur={(e) => handleBlur(e, 'required', description)}
                  {...description.bind}
                />
              </Grid>
            </Grid>
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
            <Grid container spacing={2}>
              <Grid item xs={8}>
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
                  error={
                    formError.status
                    && formError.status.error
                  }
                  helperText={
                    formError.status
                      ? formError.status.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', status)}
                  {...status.bind}
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
              <Grid item xs={4}>
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
=======
              onBlur={(e) => handleBlur(e, 'required', description)}
              {...description.bind}
              disabled={viewPage}
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
>>>>>>> master
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
<<<<<<< HEAD
                  {_.map(priorities, (priority) => (
                    <MenuItem
                      key={priority.id}
                      value={priority.type}
                    >
                      {priority.type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid item xs={12}>
=======
                  {prty}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
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
>>>>>>> master
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                margin="normal"
<<<<<<< HEAD
                fullWidth
                multiline
                id="featureTracker"
                label="Feature Tracker"
                name="featureTracker"
                autoComplete="featureTracker"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                id="version"
                label="Version"
                name="version"
                autoComplete="version"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                id="totalEstimate"
                label="Total Estimate"
                name="totalEstimate"
                autoComplete="totalEstimate"
              />
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
      )
      }
=======
              />
            )}
            disabled={viewPage}
          />
        </Grid>
        {!_.isEmpty(product?.feature_tool_detail?.user_list) && (
        <Grid item xs={12} md={8}>
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
            disabled={viewPage}
          />
        </Grid>
        )}
        {/* <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="totalEstimate"
            label="Total Estimate"
            name="totalEstimate"
            autoComplete="totalEstimate"
            error={
                  formError.totalEstimate
                  && formError.totalEstimate.error
                }
            helperText={
                  formError.totalEstimate
                    ? formError.totalEstimate.message
                    : ''
                }
            onBlur={(e) => handleBlur(e, 'required', totalEstimate)}
            {...totalEstimate.bind}
            disabled={viewPage}
          />
        </Grid> */}
        {/* <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="version "
            label="Version"
            name="version"
            autoComplete="version"
            error={
                  formError.version
                  && formError.version.error
                }
            helperText={
                  formError.version
                    ? formError.version.message
                    : ''
                }
            onBlur={(e) => handleBlur(e, 'required', version)}
            {...version.bind}
            disabled={viewPage}
          />
        </Grid> */}
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
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
>>>>>>> master
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
<<<<<<< HEAD
  ...state.decisionReducer,
=======
  statuses: state.decisionReducer.statuses,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
  featureFormData: state.decisionReducer.featureFormData,
>>>>>>> master
});

export default connect(mapStateToProps)(AddFeatures);
