import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import { UserContext } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { updateUser } from '@redux/authuser/actions/authuser.actions';
import { createProduct, updateProduct } from '@redux/product/actions/product.actions';
import { EXPECTED_TRAFFIC, PRODUCT_SETUP, PRODUCT_TYPE } from '../ProductFormConstants';

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

// eslint-disable-next-line import/no-mutable-exports
export let checkIfSetupEdited;

const Setup = ({
  dispatch,
  history,
  loading,
  productFormData,
  editData,
  handleBack,
  editPage,
  viewPage,
  product_uuid,
  redirectTo,
}) => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const buttonText = editPage ? 'Save' : 'Create Product';

  const productSetup = useInput(
    (editData
      && editData.product_info
      && editData.product_info.product_setup)
    || (productFormData
      && productFormData.product_info
      && productFormData.product_info.product_setup)
    || '',
    { required: true },
  );

  const integrationNeeded = useInput((editData
    && editData.product_info
    && editData.product_info.integration_needed)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.integration_needed)
    || false,
  { required: true });
  const integrationTypes = useInput((editData
    && editData.product_info
    && editData.product_info.integration_types)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.integration_types)
    || [],
  { required: true });

  const productType = useInput((editData
    && editData.product_info
    && editData.product_info.product_type)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.product_type)
    || '',
  { required: true });

  const expectedTraffic = useInput((editData
    && editData.product_info
    && editData.product_info.expected_traffic)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.expected_traffic)
    || '',
  { required: true });

  const teamNeeded = useInput((editData
    && editData.product_info
    && editData.product_info.team_needed)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.team_needed)
    || false,
  { required: true });
  const productTimezone = useInput((editData
    && editData.product_info
    && editData.product_info.product_timezone)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.product_timezone)
    || '',
  { required: true });
  const teamTimezoneAway = useInput((editData
    && editData.product_info
    && editData.product_info.team_timezone_away)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.team_timezone_away)
    || true,
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

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);

    if (!productSetup.value
      || (integrationNeeded.value && _.isEmpty(integrationTypes.value))
      || !productType.value
      || !expectedTraffic.value
      || (teamNeeded.value && !productTimezone.value)
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

  checkIfSetupEdited = () => (
    productSetup.hasChanged()
    || integrationNeeded.hasChanged()
    || integrationTypes.hasChanged()
    || productType.hasChanged()
    || expectedTraffic.hasChanged()
    || teamNeeded.hasChanged()
    || productTimezone.hasChanged()
    || teamTimezoneAway.hasChanged()
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
        product_setup: productSetup.value,
        integration_needed: integrationNeeded.value,
        integration_types: integrationTypes.value,
        product_type: productType.value,
        expected_traffic: expectedTraffic.value,
        team_needed: teamNeeded.value,
        product_timezone: productTimezone.value,
        team_timezone_away: teamTimezoneAway.value,
      },
      edit_date: new Date(),
    };

    if (user && !user.survey_status) {
      dispatch(updateUser({ id: user.id, survey_status: true }));
    }

    if (editPage) {
      formData.product_uuid = product_uuid;
      dispatch(updateProduct(formData));
      history.push(redirectTo);
    } else {
      dispatch(createProduct(formData, history));
    }
  };

  return (
    <div>
      {loading && <Loader open={loading} />}
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="productSetup"
                label="What type of product or project is this"
                name="productSetup"
                autoComplete="productSetup"
                onBlur={(e) => handleBlur(e, 'required', productSetup)}
                {...productSetup.bind}
              >
                {_.map(PRODUCT_SETUP, (setup, idx) => (
                  <MenuItem key={idx} value={setup.value}>{setup.text}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Will you be integrating with other software?
              </Typography>

              <FormControl component="fieldset" required>
                <RadioGroup
                  row
                  aria-label="integration"
                  name="integration-radio-buttons-group"
                >
                  <FormControlLabel
                    checked={integrationNeeded.value}
                    disabled={viewPage}
                    control={<Radio color="info" onClick={(e) => integrationNeeded.setNewValue(true)} />}
                    label="Yes"
                  />
                  <FormControlLabel
                    checked={!integrationNeeded.value}
                    disabled={viewPage}
                    control={<Radio color="info" onClick={(e) => integrationNeeded.setNewValue(false)} />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* {integrationNeeded.value && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  select
                  id="integrationTypes"
                  label="If Yes what types?"
                  name="integrationTypes"
                  autoComplete="integrationTypes"
                  onBlur={(e) => handleBlur(e, 'required', integrationTypes)}
                  {...integrationTypes.bind}
                />
              </Grid>
            )} */}

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="productType"
                label="What type of product/app it is?"
                name="productType"
                autoComplete="productType"
                onBlur={(e) => handleBlur(e, 'required', productType)}
                {...productType.bind}
              >
                {_.map(PRODUCT_TYPE, (type, idx) => (
                  <MenuItem key={idx} value={type.value}>{type.text}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={9}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="expectedTraffic"
                label="How many users do you expect to accommodate per day, per month?"
                name="expectedTraffic"
                autoComplete="expectedTraffic"
                onBlur={(e) => handleBlur(e, 'required', expectedTraffic)}
                {...expectedTraffic.bind}
              >
                <MenuItem value="">------------------------------</MenuItem>
                {productType.value && _.map(EXPECTED_TRAFFIC[productType.value], (traffic, idx) => (
                  <MenuItem key={idx} value={traffic}>{traffic}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Do you want to hire a team or use your own team (internal developers)?
              </Typography>

              <FormControl component="fieldset" required>
                <RadioGroup
                  row
                  aria-label="team-needed"
                  name="team-needed-radio-buttons-group"
                >
                  <FormControlLabel
                    checked={teamNeeded.value}
                    disabled={viewPage}
                    control={<Radio color="info" onClick={(e) => teamNeeded.setNewValue(true)} />}
                    label="Hire"
                  />
                  <FormControlLabel
                    checked={!teamNeeded.value}
                    disabled={viewPage}
                    control={<Radio color="info" onClick={(e) => teamNeeded.setNewValue(false)} />}
                    label="Own"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {teamNeeded.value && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  select
                  id="productTimezone"
                  label="What timezone are you in?"
                  name="productTimezone"
                  autoComplete="productTimezone"
                  onBlur={(e) => handleBlur(e, 'required', productTimezone)}
                  {...productTimezone.bind}
                >
                  <MenuItem value="IST">---</MenuItem>
                </TextField>
              </Grid>
            )}

            {teamNeeded.value && (
              <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                  Is it ok for that team to be more then 3 timezones away?
                </Typography>

                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    aria-label="team-timezone-away"
                    name="team-timezone-away-radio-buttons-group"
                  >
                    <FormControlLabel
                      checked={teamTimezoneAway.value}
                      disabled={viewPage}
                      control={<Radio color="info" onClick={(e) => teamTimezoneAway.setNewValue(true)} />}
                      label="Yes"
                    />
                    <FormControlLabel
                      checked={!teamTimezoneAway.value}
                      disabled={viewPage}
                      control={<Radio color="info" onClick={(e) => teamTimezoneAway.setNewValue(false)} />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
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
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitDisabled()}
                className={classes.submit}
              >
                {buttonText}
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

export default connect(mapStateToProps)(Setup);
