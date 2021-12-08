import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  useTheme,
  makeStyles,
  useMediaQuery,
  Grid,
  Typography,
  Box,
  Slider,
  FormControl,
  Select,
  MenuItem,
  Button,
  FormLabel,
} from '@material-ui/core';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';

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
  loadingWrapper: {
    position: 'relative',
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export let checkIfBudgetTechnologyEdited;

const BudgetTechnology = (props) => {
  const {
    history,
    loading,
    dispatch,
    location,
    handleNext,
    handleBack,
    handleCancel,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const viewOnly = false;
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  // const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data)
    || {};

  const [firstUserDate, handlefirstUserDateChange] = useState(
    (editData && editData.first_user_ate) || new Date(),
  );

  const [approx_budget, setApprox_budget] = useState({
    value: 0,
    category: '10-15k',
  });

  const project_hosting = useInput(
    (editData && editData.project_hosting) || 'Hostinger',
    {
      required: true,
    },
  );
  const project_language = useInput(
    (editData && editData.project_language) || 'JavaScript',
    {
      required: true,
    },
  );
  const project_database = useInput(
    (editData && editData.project_database) || 'Postgres',
    {
      required: true,
    },
  );
  const project_storage = useInput(
    (editData && editData.project_storage) || 'AWS',
    {
      required: true,
    },
  );
  const project_deployment = useInput(
    (editData && editData.project_deployment) || 'AWS',
    {
      required: true,
    },
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

  const submitDisabled = () => {
    // const errorKeys = Object.keys(formError);
    // if (!project_name.value) {
    //   return true;
    // }
    // let errorExists = false;
    // _.forEach(errorKeys, (key) => {
    //   if (formError[key].error) {
    //     errorExists = true;
    //   }
    // });
    // return errorExists;
  };

  checkIfBudgetTechnologyEdited = () => project_hosting.hasChanged()
    || project_language.hasChanged()
    || project_database.hasChanged()
    || project_storage.hasChanged()
    || project_deployment.hasChanged();

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

  function getBudgetCategory(newValue) {
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
  }

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
                // moment(scheduled_start).tz(timezone)
                //   .format('MMMM DD, YYYY HH:mm:ss')
                // }
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
                value={approx_budget.value}
                onChange={(event, newValue) => {
                  setApprox_budget({
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
                <Select {...project_hosting.bind}>
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
                <Select {...project_language.bind}>
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
                <Select {...project_database.bind}>
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
                <Select {...project_storage.bind}>
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
                <Select {...project_deployment.bind}>
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
