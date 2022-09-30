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
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useInput } from '@hooks/useInput';
import {
  getAllStatuses,
  createFeature,
  updateFeature,
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
  choice: {
    marginTop: '0.75rem',
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
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
  radioButton: {
    margin: theme.spacing(2, 2),
  },
  radioLeft: {
    marginLeft: theme.spacing(2),
  },
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfDescribeProcessEdited;

const DescribeProcess = ({
  history,
  location,
  statuses,
  dispatch,
  credentials,
  handleBack,
  featureFormData,
}) => {
  const classes = useStyles();

  const redirectTo = location.state && location.state.from;
  const editPage = location.state && (location.state.type === 'edit' || location.state.type === 'view');
  const [formError, setFormError] = useState({});
  const editData = (
    location.state
    && (location.state.type === 'edit' || location.state.type === 'view')
    && location.state.data
  ) || {};
  const viewPage = (location.state && location.state.viewOnly) || false;

  const [quest1, setQuest1] = useState((editData
    && editData.feature_detail?.collecting_data) || []);
  const quest2 = useInput((editData && editData.feature_detail?.field_desc) || '', {
    required: true,
  });
  const [quest3, setQuest3] = useState((editData
    && editData.feature_detail?.displaying_data) || []);
  const quest4 = useInput((editData && editData.feature_detail?.display_desc) || '', {
    required: true,
  });
  const [quest5, setQuest5] = useState((editData && editData.feature_detail?.business_logic) || []);
  const [quest6, setQuest6] = useState((editData && editData.feature_detail?.enabled) || []);
  const quest7 = useInput((editData && editData.feature_detail?.enabled_desc) || '', {
    required: true,
  });
  const [quest8, setQuest8] = useState((editData && editData.feature_detail?.search_or_nav) || []);
  const [quest9, setQuest9] = useState((editData && editData.feature_detail?.links) || []);

  const buttonText = editPage ? 'Save' : 'Add Feature';
  const formTitle = editPage ? 'Edit Feature' : 'Add Feature';

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

  checkIfDescribeProcessEdited = () => (
    (editData
        && editData.feature_detail
        && editData.feature_detail.collecting_data
        && !_.isEqual(quest1,
          editData.feature_detail.collecting_data))
      || quest2.hasChanged()
      || (editData
        && editData.feature_detail
        && editData.feature_detail.displaying_data
        && !_.isEqual(quest3,
          editData.feature_detail.displaying_data))
      || quest4.hasChanged()
      || (editData
        && editData.feature_detail
        && editData.feature_detail.business_logic
        && !_.isEqual(quest5,
          editData.feature_detail.business_logic))
      || (editData
          && editData.feature_detail
          && editData.feature_detail.enabled
          && !_.isEqual(quest6,
            editData.feature_detail.enabled))
      || quest7.hasChanged()
      || (editData
            && editData.feature_detail
            && editData.feature_detail.search_or_nav
            && !_.isEqual(quest8,
              editData.feature_detail.search_or_nav))
      || (editData
            && editData.feature_detail
            && editData.feature_detail.links
            && !_.isEqual(quest9,
              editData.feature_detail.links))
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const featureDetails = {
      ...featureFormData,
    };
    featureDetails.feature_detail = {
      collecting_data: quest1,
      field_desc: quest2.value,
      displaying_data: quest3,
      display_desc: quest4.value,
      business_logic: quest5,
      enabled: quest6,
      enabled_desc: quest7.value,
      search_or_nav: quest8,
      links: quest9,
      assigneees: featureFormData?.assignees,
    };
    if (editPage) {
      dispatch(updateFeature(featureDetails));
    } else {
      dispatch(createFeature(featureDetails));
    }
    dispatch(saveFeatureFormData(null));
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
    if (!quest1
    || (quest1 === 'yes' && !quest2.value)
    || !quest3
    || (quest3 === 'yes' && !quest4.value)
    || (quest3 === 'yes' && !quest5)
    || !quest6
    || (quest6 === 'yes' && !quest7.value)
    || (quest5 === 'no' && !quest8)
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
          <FormControl
            className={classes.choice}
            fullWidth
            component="fieldset"
            disabled={viewPage || editPage}
          >
            <FormLabel component="legend">
              Are we collecting any data from the user?
            </FormLabel>
            <RadioGroup
              aria-label="collecting-data"
              name="quest1"
              value={quest1}
              onChange={(e) => setQuest1(e.target.value)}
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
          {quest1 === 'yes' && (
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
            className={classes.textField}
            onBlur={(e) => handleBlur(e, 'required', quest2)}
            {...quest2.bind}
            disabled={viewPage || editPage}
          />
          )}
          <FormControl
            className={classes.choice}
            fullWidth
            component="fieldset"
            disabled={viewPage || editPage}
          >
            <FormLabel component="legend">
              Is the collected or stored data to be displayed to the user?
            </FormLabel>
            <RadioGroup
              aria-label="displaying-data"
              name="quest3"
              value={quest3}
              onChange={(e) => setQuest3(e.target.value)}
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
          {quest3 === 'yes' && (
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
            className={classes.textField}
            onBlur={(e) => handleBlur(e, 'required', quest4)}
            {...quest4.bind}
            disabled={viewPage || editPage}
          />
          )}
          {quest3 === 'yes' && (
          <FormControl
            className={classes.choice}
            fullWidth
            component="fieldset"
            disabled={viewPage || editPage}
          >
            <FormLabel component="legend">
              Is there any particular flow or logic to be followed for the collected or stored data?
            </FormLabel>
            <RadioGroup
              aria-label="business-logic"
              name="quest5"
              value={quest5}
              onChange={(e) => setQuest5(e.target.value)}
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
          )}
          <FormControl
            className={classes.choice}
            fullWidth
            component="fieldset"
            disabled={viewPage || editPage}
          >
            <FormLabel component="legend">
              Are we making any important decisions that need to be notified or displayed?
            </FormLabel>
            <RadioGroup
              aria-label="making-decision"
              name="quest6"
              value={quest6}
              onChange={(e) => setQuest6(e.target.value)}
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
          {quest6 === 'yes' && (
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
            className={classes.textField}
            onBlur={(e) => handleBlur(e, 'required', quest7)}
            {...quest7.bind}
            disabled={viewPage || editPage}
          />
          )}
          {quest5 === 'no' && (
          <FormControl
            className={classes.choice}
            fullWidth
            component="fieldset"
            disabled={viewPage || editPage}
          >
            <FormLabel component="legend">
              How does a user find this data?
            </FormLabel>
            <RadioGroup
              aria-label="user-find-data"
              name="quest8"
              value={quest8}
              onChange={(e) => setQuest8(e.target.value)}
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
          )}
          {(quest8 === 'nav' || quest6 === 'no') && (
          <FormControl
            className={classes.choice}
            fullWidth
            component="fieldset"
            disabled={viewPage || editPage}
          >
            <FormLabel component="legend">
              Where do you want to display links?
            </FormLabel>
            <RadioGroup
              aria-label="links"
              name="quest9"
              value={quest9}
              onChange={(e) => setQuest9(e.target.value)}
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
          )}
        </Grid>
        <Grid container spacing={3} className={classes.buttonContainer}>
          <Grid item xs={12} sm={4}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBack}
              className={classes.submit}
            >
              Back
            </Button>
          </Grid>
          { !viewPage && (
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
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  statuses: state.decisionReducer.statuses,
  credentials: state.productReducer.credentials,
  featureFormData: state.decisionReducer.featureFormData,
});

export default connect(mapStateToProps)(DescribeProcess);
