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
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
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
  editData,
}) => {
  const classes = useStyles();
  const viewOnly = false;
  // const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data)
    || {};

  const [firstUserDate, handlefirstUserDateChange] = useState((editData
    && editData.product_info
    && editData.product_info.first_user_date)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.first_user_date)
    || new Date().setDate(new Date().getDate() + 90));

  const [approxBudget, setApproxBudget] = useState((editData
    && editData.product_info
    && editData.product_info.approx_budget)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.approx_budget)
    || {
      value: 0,
      category: '10-15k',
    });

  const hosting = useInput((editData
    && editData.product_info
    && editData.product_info.hosting)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.hosting)
    || 'No Preference',
  { required: true });

  const language = useInput((editData
    && editData.product_info
    && editData.product_info.language)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.language)
    || 'No Preference',
  { required: true });

  const database = useInput((editData
    && editData.product_info
    && editData.product_info.database)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.database)
    || 'No Preference',
  { required: true });

  const storage = useInput((editData
    && editData.product_info
    && editData.product_info.storage)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.storage)
    || 'No Preference',
  { required: true });

  const deployment = useInput((editData
    && editData.product_info
    && editData.product_info.deployment)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.deployment)
    || 'No Preference',
  { required: true });

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

  const onBackClick = (event) => {
    // if (checkIfProductInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleBack();
  };

  const onNextClick = (event) => {
    // if (checkIfProductInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleNext();
  };

  checkIfBudgetTechnologyEdited = () => (
    hosting.hasChanged()
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
                disabled={viewOnly}
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
                  <MenuItem value="Hostinger">Hostinger</MenuItem>
                  <MenuItem value="Bluehost">Bluehost</MenuItem>
                  <MenuItem value="Dreamhost">Dreamhost</MenuItem>
                  <MenuItem value="Hostgator">Hostgator</MenuItem>
                  <MenuItem value="GreenGeeks">GreenGeeks</MenuItem>
                  <MenuItem value="SiteGround">SiteGround</MenuItem>
                  <MenuItem value="A2 Hosting">A2 Hosting</MenuItem>
                  <MenuItem value="InMotion">InMotion</MenuItem>
                  <MenuItem value="WPEngine">WPEngine</MenuItem>
                  <MenuItem value="Nexcess">Nexcess</MenuItem>
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
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="C/CPP">C/CPP</MenuItem>
                  <MenuItem value="PHP">PHP</MenuItem>
                  <MenuItem value="Swift">Swift</MenuItem>
                  <MenuItem value="C#">C#</MenuItem>
                  <MenuItem value="Ruby">Ruby</MenuItem>
                  <MenuItem value="Objective – C">Objective – C</MenuItem>
                  <MenuItem value="SQL">SQL</MenuItem>
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
                  <MenuItem value="Postgres">Postgres</MenuItem>
                  <MenuItem value="MySQL">MySQL</MenuItem>
                  <MenuItem value="Mongo">MongoDB</MenuItem>
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
                  <MenuItem value="AWS">AWS</MenuItem>
                  <MenuItem value="GCP">GCP</MenuItem>
                  <MenuItem value="Digital Ocean">Digital Ocean</MenuItem>
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
                  <MenuItem value="AWS">AWS</MenuItem>
                  <MenuItem value="GCP">GCP</MenuItem>
                  <MenuItem value="Digital Ocean">Digital Ocean</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.buttonContainer}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onBackClick}
                className={classes.submit}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onNextClick}
                className={classes.submit}
              >
                Save & Next
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
});

export default connect(mapStateToProps)(BudgetTechnology);
