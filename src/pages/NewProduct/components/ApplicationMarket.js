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
  TextField,
  ListItemText,
} from '@mui/material';
import { useInput } from '@hooks/useInput';
import { saveProductFormData } from '@redux/product/actions/product.actions';
import { BUSSINESS_SEGMENTS, PRIMARY_USERS } from '../ProductFormConstants';
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

const StyledRadio = (props) => <Radio color="info" {...props} />;

// eslint-disable-next-line import/no-mutable-exports
export let checkIfApplicationMarketEdited;

<<<<<<< HEAD
const ApplicationMarket = (props) => {
  const {
    location,
    handleNext,
    handleBack,
  } = props;
=======
const ApplicationMarket = ({
  productFormData,
  handleNext,
  handleBack,
  dispatch,
  editData,
}) => {
>>>>>>> master
  const classes = useStyles();
  // const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data)
    || {};

<<<<<<< HEAD
  const applicationType = useInput(
    (editData && editData.application_type) || 'desktop',
    { required: true },
  );
  const [specificProblem, setSpecificProblem] = useState({
    value: false,
    problem: '',
  });
  const primaryUsers = useInput((editData && editData.primary_users) || '', {
    required: true,
  });
  const [bussinessSegment, setBussinessSegment] = useState([]);
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
=======
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
  const specificProblemDesc = useInput((editData
        && editData.product_info
        && editData.product_info.specific_problem_desc)
      || (productFormData
          && productFormData.product_info
          && productFormData.product_info.specific_problem_desc)
        || '', { required: true });

  const primaryUsers = useInput((editData
    && editData.product_info
    && editData.product_info.primary_users)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.primary_users)
    || '',
  { required: true });
  const secondaryUsers = useInput((editData
    && editData.product_info
    && editData.product_info.secondary_users)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.secondary_users)
    || '',
  { required: true });
  const [bussinessSegment, setBussinessSegment] = useState((editData
    && editData.product_info
    && editData.product_info.bussiness_segment)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.bussiness_segment)
    || []);
>>>>>>> master

  const submitDisabled = () => {
    if (primaryUsers.value === '' || bussinessSegment.length <= 0) {
      return true;
    }
    return false;
  };

  checkIfApplicationMarketEdited = () => (
<<<<<<< HEAD
    applicationType.hasChanged() || primaryUsers.hasChanged()
=======
    applicationType.hasChanged()
    || primaryUsers.hasChanged()
    || secondaryUsers.hasChanged()
    || (productFormData
      && productFormData.product_info
      && productFormData.product_info.bussiness_segment
      && !_.isEqual(bussinessSegment,
        productFormData.product_info.bussiness_segment))
>>>>>>> master
  );

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
<<<<<<< HEAD
=======
    const formData = {
      ...productFormData,
      product_info: {
        ...productFormData.product_info,
        application_type: applicationType.value,
        specific_problem: specificProblem,
        specific_problem_desc: specificProblemDesc.value,
        primary_users: primaryUsers.value,
        secondary_users: secondaryUsers.value,
        bussiness_segment: bussinessSegment,
      },
      edit_date: new Date(),
    };
    dispatch(saveProductFormData(formData));
    handleNext();
>>>>>>> master
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
                Is there a specific problem you are trying to solve?
              </Typography>
              <Grid className={classes.inputWithTooltip} item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={6}
                  id="specificProblemDesc"
                  label="Problem description"
                  name="specificProblemDesc"
                  autoComplete="specificProblemDesc"
                  {...specificProblemDesc.bind}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" required>
                <Typography variant="caption" gutterBottom component="div">
                  If Yes, for what type of user?
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="bussiness-segment-label">
                    Business Segment
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
<<<<<<< HEAD
                    <MenuItem value="small business user">
                      Small Business User
                    </MenuItem>
                    <MenuItem value="enterprise user (big companies)">
                      Enterprise User (Big Companies)
                    </MenuItem>
                    <MenuItem value="government user">
                      Government User
                    </MenuItem>
                    <MenuItem value="consumer">Consumer</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
                    <MenuItem value="others">Other</MenuItem>
=======
                    <MenuItem value="" />
                    {_.map(BUSSINESS_SEGMENTS, (segment, idx) => (
                      <MenuItem key={`segment-${idx}`} value={segment}>
                        <Checkbox
                          checked={_.indexOf(bussinessSegment, segment) > -1}
                        />
                        <ListItemText primary={segment} />
                      </MenuItem>
                    ))}
>>>>>>> master
                  </Select>
                </FormControl>
              </Grid>
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
                  <MenuItem value="customer1">Customer 1</MenuItem>
                  <MenuItem value="customer2">
                    Customer 2 (Power User)
                  </MenuItem>
                  <MenuItem value="Government User">
                    Administrator ( All powerfull, helpfull, etc. )
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
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
                  onChange={(e) => {
                    setBussinessSegment(e.target.value);
                  }}
                >
                  <MenuItem value="Advertisement/Marketing">
                    Advertisement/Marketing
                  </MenuItem>
                  <MenuItem value="Finance/Banking">Finance/Banking</MenuItem>
                  <MenuItem value="HR/People">HR/People</MenuItem>
                  <MenuItem value="IT/Tech/Developers">
                    IT/Tech/Developers
                  </MenuItem>
                  <MenuItem value="Education - Science">
                    Education - Science
                  </MenuItem>
                  <MenuItem value="Education - Teachers">
                    Education - Teachers
                  </MenuItem>
                  <MenuItem value="Education - Students">
                    Education - Students
                  </MenuItem>
                  <MenuItem value="Government/Politics">
                    Government/Politics
                  </MenuItem>
                  <MenuItem value="Public/Non-Profit">
                    Public/Non-Profit
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
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
                // disabled={productFormData === null}
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
                disabled={submitDisabled()}
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

export default connect(mapStateToProps)(ApplicationMarket);
