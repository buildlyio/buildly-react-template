import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Typography,
  Box,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  Button,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useInput } from '@hooks/useInput';
import { saveProductFormData } from '@redux/product/actions/product.actions';
import { BUSSINESS_SEGMENTS, PRIMARY_USERS, SPECIFIC_PROBLEMS } from '../ProductFormConstants';

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
}));

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

// eslint-disable-next-line import/no-mutable-exports
export let checkIfApplicationMarketEdited;

const ApplicationMarket = ({
  productFormData,
  handleNext,
  handleBack,
  dispatch,
  editData,
}) => {
  const classes = useStyles();

  const applicationType = useInput((editData
    && editData.product_info
    && editData.product_info.application_type)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.application_type)
    || 'desktop',
  { required: true });
  const [specificProblem, setSpecificProblem] = useState((editData
    && editData.product_info
    && editData.product_info.specific_problem)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.specific_problem)
    || {
      value: false,
      problem: '',
    });
  const primaryUsers = useInput((editData
    && editData.product_info
    && editData.product_info.primary_users)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.primary_users)
    || '',
  { required: true });
  // const secondaryUsers = useInput(
  //   (productFormData
  //     && productFormData.product_info
  //     && productFormData.product_info.secondary_users)
  //   || '',
  //   { required: true },
  // );
  const [bussinessSegment, setBussinessSegment] = useState((editData
    && editData.product_info
    && editData.product_info.bussiness_segment)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.bussiness_segment)
    || []);

  const submitDisabled = () => {
    if (!applicationType.value
      || !primaryUsers.value
      || bussinessSegment.length <= 0
    ) {
      return true;
    }
    return false;
  };

  checkIfApplicationMarketEdited = () => (
    applicationType.hasChanged()
    || (productFormData
      && productFormData.product_info
      && productFormData.product_info.specific_problem
      && !_.isEqual(specificProblem,
        productFormData.product_info.specific_problem))
    || primaryUsers.hasChanged()
    // || secondaryUsers.hasChanged()
    || (productFormData
      && productFormData.product_info
      && productFormData.product_info.bussiness_segment
      && !_.isEqual(bussinessSegment,
        productFormData.product_info.bussiness_segment))
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
        application_type: applicationType.value,
        specific_problem: specificProblem,
        primary_users: primaryUsers.value,
        // secondary_users: secondaryUsers.value,
        bussiness_segment: bussinessSegment,
      },
      edit_date: new Date(),
    };
    dispatch(saveProductFormData(formData));
    handleNext();
  };

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom component="div">
                Type of Application
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RadioGroup
                row
                aria-label="Application"
                name="Application-radio-buttons-group"
                {...applicationType.bind}
              >
                <FormControlLabel
                  value="mobile"
                  control={<StyledRadio />}
                  label="Mobile"
                />
                <FormControlLabel
                  value="desktop"
                  control={<StyledRadio />}
                  label="Desktop"
                />
                <FormControlLabel
                  value="both"
                  control={<StyledRadio />}
                  label="Both"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom component="div">
                Is there a specific problem you are trying to solve
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" required>
                <Typography variant="caption" gutterBottom component="div">
                  If Yes, for what type of user?
                </Typography>
                <RadioGroup
                  row
                  aria-label="specific-problem"
                  name="specific-problem-radio-buttons-group"
                  value={specificProblem.value}
                  onChange={(e) => {
                    setSpecificProblem((prevSpecificProblem) => ({
                      ...prevSpecificProblem,
                      value: e.target.value === 'true',
                    }));
                  }}
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
            <Grid item xs={12} sm={6}>
              {specificProblem.value && (
                <FormControl fullWidth>
                  <InputLabel id="type-of-user-label">Type of User</InputLabel>
                  <Select
                    labelId="type-of-user-label"
                    id="type-of-user"
                    label="Type of User"
                    value={specificProblem.problem}
                    onChange={(e) => {
                      setSpecificProblem((prevSpecificProblem) => ({
                        ...prevSpecificProblem,
                        problem: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value="" />
                    {_.map(SPECIFIC_PROBLEMS, (prob, idx) => (
                      <MenuItem key={`prob-${idx}`} value={prob}>
                        {prob}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="primary-user-label">Primary User</InputLabel>
                <Select
                  labelId="primary-user-label"
                  id="primary-user"
                  label="Type of User"
                  {...primaryUsers.bind}
                >
                  <MenuItem value="" />
                  {_.map(PRIMARY_USERS, (user, idx) => (
                    <MenuItem key={`user-${idx}`} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="primary-user-label">Secondary User</InputLabel>
                <Select
                  labelId="primary-user-label"
                  id="primary-user"
                  label="Type of User"
                  {...secondaryUsers.bind}
                >
                  <MenuItem value="" />
                  {_.map(PRIMARY_USERS, (user, idx) => (
                    <MenuItem key={`user-${idx}`} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="bussiness-segment-label">
                  Bussiness Segment
                </InputLabel>
                <Select
                  labelId="bussiness-segment-label"
                  id="bussiness-segment"
                  value={bussinessSegment}
                  label="Type of User"
                  multiple
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;
                    setBussinessSegment(
                      // On autofill we get a stringified value.
                      typeof value === 'string' ? value.split(',') : value,
                    );
                  }}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="" />
                  {_.map(BUSSINESS_SEGMENTS, (segment, idx) => (
                    <MenuItem key={`segment-${idx}`} value={segment}>
                      <Checkbox
                        checked={_.indexOf(bussinessSegment, segment) > -1}
                      />
                      <ListItemText primary={segment} />
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
                disabled={submitDisabled()}
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

export default connect(mapStateToProps)(ApplicationMarket);
