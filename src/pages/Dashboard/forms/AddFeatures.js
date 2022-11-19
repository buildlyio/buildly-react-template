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
} from '@mui/material';
import { useInput } from '@hooks/useInput';
import { saveFeatureFormData } from '@redux/release/actions/release.actions';
import { validators } from '@utils/validators';
import { PRIORITIES, TAGS } from './formConstants';
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
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfAddFeaturesEdited;

const AddFeatures = ({
  location,
  statuses,
  dispatch,
  products,
  credentials,
  productFeatures,
  handleNext,
  featureFormData,
}) => {
  const classes = useStyles();
  const editPage = location.state && (location.state.type === 'edit' || location.state.type === 'view');
  const editData = (editPage && location.state.data) || {};
  const product_uuid = location.state && location.state.product_uuid;
  const viewPage = (location.state && location.state.type === 'view') || false;

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [formError, setFormError] = useState({});
  const [product, setProduct] = useState('');
  const [assigneeData, setAssigneeData] = useState([]);

  // form fields definition
  const [description, setDescription] = useState(
    (editData && editData.description) || (featureFormData && featureFormData.description) || ''
  );

  const name = useInput(
    (editData && editData.name) || (featureFormData && featureFormData.name) || '',
    {
      required: true,
      productFeatures,
    },
  );

  const priority = useInput(
    (editData && editData.priority) || (featureFormData && featureFormData.priority) || '',
    { required: true },
  );

  const [tags, setTags] = useState((editData && editData.tags)
    || (featureFormData && featureFormData.tags) || []);

  const [statusID, setStatusID] = useState((editData && editData.status) || (featureFormData && featureFormData.status) || '');
  const currentStatData = _.find(statuses, { status_uuid: statusID });
  const [status, setStatus] = useState('');
  const [colID, setColID] = useState((editData && currentStatData?.status_tracking_id) || '');

  const [assignees, setAssignees] = useState(
    (editData && editData.feature_detail && editData.feature_detail.assigneees
      && !_.isEmpty(editData.feature_detail.assigneees) && _.map(editData.feature_detail.assigneees, 'username'))
    || (featureFormData && featureFormData.assigneees && !_.isEmpty(featureFormData.assigneees)
      && _.map(featureFormData.assigneees, 'username'))
    || [],
  );

  useEffect(() => {
    const temp_product = _.find(products, { product_uuid });
    setProduct(temp_product);
  }, [products]);

  useEffect(() => {
    const assigneeOptions = (product && product.feature_tool_detail
      && product.feature_tool_detail.user_list
      && _.map(product.feature_tool_detail.user_list, 'username')) || [];

    if (editData) {
      setStatus(_.find(statuses, { status_uuid: editData.status }));
    }

    setAssigneeData(assigneeOptions);
  }, [product]);

  checkIfAddFeaturesEdited = () => (
    name.hasChanged()
    || (
      (editPage && description !== featureFormData?.description)
      || (!editPage && description)
    )
    || (editPage && priority.hasChanged())
    || (editPage && _.isEmpty(currentStatData) && !_.isEmpty(status))
    || (editPage && !_.isEmpty(editData) && !_.isEqual(tags, editData.tags))
    || (editPage && _.isEmpty(editData) && !_.isEmpty(tags))
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const featCred = _.find(
      credentials,
      {
        product_uuid,
        auth_detail: { tool_type: 'Feature' }
      },
    );

    const formData = {
      ...editData,
      edit_date: dateTime,
      name: name.value,
      description,
      product_uuid,
      ...featCred?.auth_detail,
      assignees: product && product.feature_tool_detail && product.feature_tool_detail.user_list
        && _.filter(product.feature_tool_detail.user_list, (user) => (
          user && _.includes(assignees, user.username)
        )),
    };

    if (editPage) {
      formData.status = statusID;
      formData.tags = tags;
      formData.priority = priority.value;
      formData.column_id = colID;
      dispatch(saveFeatureFormData(formData));
    } else {
      formData.create_date = dateTime;
      dispatch(saveFeatureFormData(formData));
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
    if (
      !name.value
      || !description
      || (editPage && !statusID)
      // || (editPage && !priority.value)
      || !assignees
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
            <SmartInput
              onEditorValueChange={setDescription}
              value={description}
              inputLabel="Description"
            />
          </Grid>
        </Grid>

        {editPage && (
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
        )}

        {editPage && (
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
              disabled={viewPage}
            />
          </Grid>
        )}

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
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  statuses: state.releaseReducer.statuses,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
  featureFormData: state.releaseReducer.featureFormData,
});

export default connect(mapStateToProps)(AddFeatures);
