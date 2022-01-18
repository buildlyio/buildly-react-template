import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub, faTrello, faAtlassian, faJira,
} from '@fortawesome/free-brands-svg-icons';
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
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  radioButton: {
    margin: theme.spacing(2, 2),
  },
  radioLeft: {
    marginLeft: theme.spacing(2),
  },
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfProductSetupEdited;

const StyledRadio = (props) => {
  const classes = useStyles();

  return (
    <Radio
      color="primary"
      checkedIcon={
        <span className={`${classes.icon} ${classes.checkedIcon}`} />
      }
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
};

const StyledStart = (props) => (
  <Radio
    sx={{
      opacity: 0,
      '&.Mui-checked': {
        '&, & + .MuiFormControlLabel-label': {
          color: '#137cbd',
        },
      },
    }}
    {...props}
  />
);

const ProductSetup = (props) => {
  const {
    location, handleNext,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const viewOnly = false;
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  // const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data)
    || {};

  const name = useInput((editData && editData.name) || '', {
    required: true,
  });
  const description = useInput((editData && editData.description) || '');

  const featuresTool = useInput(
    (editData && editData.feature_tool_detail) || 'start fresh',
  );

  const issuesTool = useInput(
    (editData && editData.issues_tool_detail) || 'start fresh',
  );

  const [startDate, handleStartDateChange] = useState(
    (editData && editData.start_date) || new Date(),
  );
  const [endDate, handleEndDateChange] = useState(
    (editData && editData.end_date) || new Date(),
  );

  const [useBuildlyArch, setUseBuildlyArch] = useState(true);

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

  const onNextClick = (event) => {
    // if (checkIfProductInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleNext();
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!name.value) {
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

  checkIfProductSetupEdited = () => (
    description.hasChanged()
    || featuresTool.hasChanged()
    || issuesTool.hasChanged()
  );

  /**
   * Submit The form and add/edit
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={2}>
            <Grid className={classes.inputWithTooltip} item xs={12} sm={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="name"
                label="Product name"
                name="name"
                autoComplete="name"
                disabled={viewOnly}
                error={formError.name && formError.name.error}
                onBlur={(e) => handleBlur(e, 'required', name)}
                {...name.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={isDesktop ? 2 : 0}>
                <Grid className={classes.inputWithTooltip} item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    id="description"
                    label="Product description"
                    name="description"
                    autoComplete="description"
                    disabled={viewOnly}
                    {...description.bind}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePickerComponent
                    label="Start Date"
                    selectedDate={startDate}
                    hasTime
                    handleDateChange={handleStartDateChange}
                    disabled={viewOnly}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePickerComponent
                    label="End Date"
                    selectedDate={endDate}
                    hasTime
                    handleDateChange={handleEndDateChange}
                    disabled={viewOnly}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Features</Typography>
              <Box sx={{ border: '1px solid white', borderRadius: '4px' }}>
                <Typography variant="subtitle1" align="center" mt={2}>Connect to supported tool</Typography>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    aria-label="features"
                    name="features-radio-buttons-group"
                    {...featuresTool.bind}
                    className={classes.radioButton}
                  >
                    <FormControlLabel
                      value="trello"
                      control={<StyledStart />}
                      label={(
                        <>
                          <FontAwesomeIcon icon={faTrello} className="fa-4x" />
                          <Typography align="center">Trello</Typography>
                        </>
                      )}
                    />
                    <FormControlLabel
                      value="atlassian"
                      control={<StyledStart />}
                      label={(
                        <>
                          <FontAwesomeIcon icon={faAtlassian} className="fa-4x" />
                          <Typography align="center">Atlassian</Typography>
                        </>
                      )}
                    />
                    <FormControlLabel
                      value="start fresh"
                      className={classes.radioLeft}
                      control={<StyledRadio />}
                      label="Start Fresh"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Issues</Typography>
              <Box sx={{ border: '1px solid white', borderRadius: '4px' }}>
                <Typography variant="subtitle1" align="center" mt={2}>Connect to supported tool</Typography>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    aria-label="issues"
                    name="issues-radio-buttons-group"
                    {...issuesTool.bind}
                    className={classes.radioButton}
                  >
                    <FormControlLabel
                      value="github"
                      control={<StyledStart />}
                      label={(
                        <>
                          <FontAwesomeIcon icon={faGithub} className="fa-4x" />
                          <Typography align="center">Github</Typography>
                        </>
                      )}
                    />
                    <FormControlLabel
                      value="jira"
                      control={<StyledStart />}
                      label={(
                        <>
                          <FontAwesomeIcon icon={faJira} className="fa-4x" />
                          <Typography align="center">Jira</Typography>
                        </>
                      )}
                    />
                    <FormControlLabel
                      value="start fresh"
                      className={classes.radioLeft}
                      control={<StyledRadio />}
                      label="Start Fresh"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container>
          <Grid item>
            <FormControl component="fieldset">
              <Typography variant="h6">
                Do you want to use Buildly for your Architecture?
              </Typography>
              <RadioGroup
                row
                aria-label="buildly for architecture"
                name="row-radio-buttons-group"
                color="success"
                onChange={(e) => {
                  setUseBuildlyArch(e.target.value === 'true');
                }}
                value={useBuildlyArch}
              >
                <FormControlLabel
                  value
                  control={<StyledRadio />}
                  label="Yes"
                />
                <FormControlLabel
                  value={false}
                  control={<StyledRadio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.buttonContainer}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onNextClick}
              // disabled={productFormData === null}
              className={classes.submit}
            >
              Save & Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(ProductSetup);
