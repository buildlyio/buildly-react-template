import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Typography,
  Box,
  Slider,
  FormControl,
  Select,
  MenuItem,
  Button,
  FormLabel,
} from '@mui/material';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { saveProductFormData } from '@redux/product/actions/product.actions';
import {
  DATABASES, DEPLOYMENTS, HOSTING, LANGUAGES, STORAGES,
} from '../ProductFormConstants';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    color: '#fff',
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.secondary.contrastText,
    },
    '& .MuiOutlinedInput-root:hover > .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgb(255, 255, 255, 0.23)',
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.secondary.contrastText,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.secondary.contrastText,
    },
    '& .MuiInputBase-input': {
      color: theme.palette.secondary.contrastText,
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
    color: theme.palette.primary.contrastText,
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
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfBudgetTechnologyEdited;

const BudgetTechnology = ({
  productFormData,
  handleNext,
  handleBack,
  dispatch,
}) => {
  const classes = useStyles();

  const [firstUserDate, handlefirstUserDateChange] = useState(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.first_user_date)
    || new Date().setDate(new Date().getDate() + 90),
  );

  const [approxBudget, setApproxBudget] = useState(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.approx_budget)
    || {
      value: 0,
      category: '10-15k',
    },
  );

  const hosting = useInput(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.hosting)
    || 'Hostinger',
    { required: true },
  );

  const language = useInput(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.language)
    || 'JavaScript',
    { required: true },
  );

  const database = useInput(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.database)
    || 'Postgres',
    { required: true },
  );

  const storage = useInput(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.storage)
    || 'AWS',
    { required: true },
  );

  const deployment = useInput(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.deployment)
    || 'AWS',
    { required: true },
  );

  const [formError, setFormError] = useState({});

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */
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

  checkIfBudgetTechnologyEdited = () => (
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.first_user_date
      && (firstUserDate !== productFormData.product_info.first_user_date))
    || (productFormData
      && productFormData.product_info
      && productFormData.product_info.approx_budget
      && !_.isEqual(approxBudget,
        productFormData.product_info.approx_budget))
    || hosting.hasChanged()
    || language.hasChanged()
    || database.hasChanged()
    || storage.hasChanged()
    || deployment.hasChanged()
  );

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      ...productFormData,
      product_info: {
        ...productFormData.product_info,
        first_user_date: firstUserDate,
        approx_budget: approxBudget,
        hosting: hosting.value,
        language: language.value,
        database: database.value,
        storage: storage.value,
        deployment: deployment.value,
      },
      edit_date: new Date(),
    };
    dispatch(saveProductFormData(formData));
    handleNext();
  };

  const budgetCategory = [
    {
      value: 1,
      label: '10-15k',
    },
    {
      value: 2,
      label: '15-25k',
    },
    {
      value: 3,
      label: '25-35k',
    },
    {
      value: 4,
      label: '35-50k',
    },
    {
      value: 5,
      label: '50-100k',
    },
    {
      value: 6,
      label: '100-150k',
    },
    {
      value: 7,
      label: '150-200k',
    },
    {
      value: 8,
      label: '200-300k',
    },
    {
      value: 9,
      label: '300-500k',
    },
    {
      value: 10,
      label: '500k+',
    },
  ];

  const getBudgetCategory = (newValue) => {
    switch (newValue) {
      case 1:
        return '10-15k';
      case 2:
        return '15-25k';
      case 3:
        return '25-35k';
      case 4:
        return '35-50k';
      case 5:
        return '50-100k';
      case 6:
        return '100-150k';
      case 7:
        return '150-200k';
      case 8:
        return '200-300k';
      case 9:
        return '300-500k';
      case 10:
        return '500k+';
      default:
        return 'error';
    }
  };

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom component="div">
                Do you have an approximate date you would like to have your
                first users onboarded?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerComponent
                label="Date"
                selectedDate={firstUserDate}
                hasTime
                handleDateChange={handlefirstUserDateChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom component="div">
                Do you have an approximate budget yet?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Slider
                value={approxBudget.value}
                onChange={(event, newValue) => {
                  setApproxBudget({
                    value: newValue,
                    category: getBudgetCategory(newValue),
                  });
                }}
                step={1}
                min={1}
                max={10}
                marks={budgetCategory}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom component="div">
                Do you have a preference for hosting, language, database,
                storage or deployment?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                fullWidth
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">
                  Select Hosting
                </FormLabel>
                <Select {...hosting.bind}>
                  {_.map(HOSTING, (host, idx) => (
                    <MenuItem key={`hosting-${idx}`} value={host}>
                      {host}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>

              <FormControl
                variant="outlined"
                fullWidth
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">
                  Select Language
                </FormLabel>
                <Select {...language.bind}>
                  {_.map(LANGUAGES, (lng, idx) => (
                    <MenuItem key={`language-${idx}`} value={lng}>
                      {lng}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                fullWidth
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">
                  Select Database
                </FormLabel>
                <Select {...database.bind}>
                  {_.map(DATABASES, (db, idx) => (
                    <MenuItem key={`database-${idx}`} value={db}>
                      {db}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                fullWidth
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">
                  Select Storage
                </FormLabel>
                <Select {...storage.bind}>
                  {_.map(STORAGES, (strg, idx) => (
                    <MenuItem key={`storage-${idx}`} value={strg}>
                      {strg}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                fullWidth
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">
                  Select Deployment
                </FormLabel>
                <Select {...deployment.bind}>
                  {_.map(DEPLOYMENTS, (deploy, idx) => (
                    <MenuItem key={`deployment-${idx}`} value={deploy}>
                      {deploy}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  productFormData: state.productReducer.productFormData,
});

export default connect(mapStateToProps)(BudgetTechnology);
