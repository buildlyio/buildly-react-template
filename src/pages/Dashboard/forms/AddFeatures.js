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
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import {
  getAllStatuses,
  createFeature,
  updateFeature,
  saveFeatureFormData,
} from '@redux/decision/actions/decision.actions';
import { getAllCredentials } from '@redux/product/actions/product.actions';
import { validators } from '@utils/validators';
import { PRIORITIES, TAGS } from './formConstants';

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
  dispatch,
  products,
  credentials,
  productFeatures,
  handleNext,
  featureFormData,
}) => {
  const classes = useStyles();
  const [product, setProduct] = useState('');

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && (location.state.type === 'edit' || location.state.type === 'view');
  const editData = (
    location.state
    && (location.state.type === 'edit' || location.state.type === 'view')
    && location.state.data
  ) || {};
  const product_uuid = location.state && location.state.product_uuid;
  const viewPage = (location.state && location.state.viewOnly) || false;

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
  const status = useInput((editData && editData.status) || (featureFormData && featureFormData.status) || '', {
    required: true,
  });
  const [tags, setTags] = useState((editData && editData.tags)
  || (featureFormData && featureFormData.tags) || []);
  const [boardList, setBoardList] = useState([]);
  const [colID, setColID] = useState((featureFormData && featureFormData.column_id) || (editData && editData.feature_detail?.column_id) || '');

  const totalEstimate = useInput((editData && editData.total_estimate) || (featureFormData && featureFormData.total_estimate) || '');
  const version = useInput((editData && editData.version) || (featureFormData && featureFormData.version) || '');
  const [formError, setFormError] = useState({});
  const prdt = _.find(products, { product_uuid });
  const listB = _.flatMap(_.map(
    prdt?.feature_tool_detail?.organisation_list,
    'board_list',
  ));
  const boardData = _.find(listB, { column_list: [{ column_id: colID }] });
  const [boardID, setBoardID] = useState((editData && boardData) || '');
  const [colList, setColList] = useState((editData && boardData?.column_list) || []);

  let formTitle;
  if (editPage) {
    formTitle = viewPage ? 'View Feature' : 'Edit Feature';
  } else {
    formTitle = 'Add Feature';
  }

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!statuses || _.isEmpty(statuses)) {
      dispatch(getAllStatuses());
    }
    if (!credentials || _.isEmpty(credentials)) {
      dispatch(getAllCredentials());
    }
  }, []);

  useEffect(() => {
    const prd = _.find(products, { product_uuid });
    if (prd && prd.feature_tool_detail
      && prd.feature_tool_detail.organisation_list
      && !_.isEmpty(prd.feature_tool_detail.organisation_list)
    ) {
      setBoardList(_.flatMap(_.map(
        prd.feature_tool_detail.organisation_list,
        'board_list',
      )));
    }
    setProduct(prd);
  }, [products]);

  checkIfAddFeaturesEdited = () => (
    name.hasChanged()
      || description.hasChanged()
      || priority.hasChanged()
      || status.hasChanged()
      || (!_.isEmpty(editData) && !_.isEqual(tags, editData.tags))
      || (_.isEmpty(editData) && !_.isEmpty(tags))
      || totalEstimate.hasChanged()
      || version.hasChanged()
      || (!editPage && product
        && product.feature_tool_detail
        && !_.isEmpty(colList)
        && colID !== '')
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
      status: status.value,
      tags,
      product_uuid,
      priority: priority.value,
      total_estimate: totalEstimate.value,
      version: version.value,
      column_id: colID,
      ...featCred?.auth_detail,
    };

    if (editPage) {
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
    if (!name.value
      || !description.value
      || !status.value
      || !priority.value
      || (!editPage && product
        && product.feature_tool_detail
        && !colID)
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
              disabled={viewPage}
            >
              {_.map(statuses, (sts) => (
                <MenuItem
                  key={`status-${sts.status_uuid}-${sts.name}`}
                  value={sts.status_uuid}
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
        {!_.isEmpty(boardList) && (
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            select
            id="boardID"
            label="Tool Board"
            name="boardID"
            value={boardID}
            autoComplete="boardID"
            onChange={(e) => {
              const board = e.target.value;
              setBoardID(board);
              setColList(board.column_list);
            }}
            disabled={viewPage}
          >
            {_.map(boardList, (board) => (
              <MenuItem
                key={`board-${board.board_id}-${board.board_name}`}
                value={board}
              >
                {board.board_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        )}
        {!_.isEmpty(colList) && (
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            select
            id="colID"
            label="Tool Column"
            name="colID"
            autoComplete="colID"
            value={colID}
            onChange={(e) => setColID(e.target.value)}
            disabled={viewPage}
          >
            {_.map(colList, (col) => (
              <MenuItem
                key={`column-${col.column_id}-${col.column_name}`}
                value={col.column_id}
              >
                {col.column_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        )}
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
  statuses: state.decisionReducer.statuses,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
  featureFormData: state.decisionReducer.featureFormData,
});

export default connect(mapStateToProps)(AddFeatures);
