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

const StyledRadio = (props) => <Radio color="info" {...props} />;

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
    || primaryUsers.hasChanged()
    || secondaryUsers.hasChanged()
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
        specific_problem_desc: specificProblemDesc.value,
        primary_users: primaryUsers.value,
        secondary_users: secondaryUsers.value,
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

            <Grid container>
              <Grid item xs={12} sm={12}>
                <Typography variant="h6" gutterBottom component="div">
                  What is your primary business segment?
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

            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom component="div">
                  Who are your users?
                </Typography>
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
