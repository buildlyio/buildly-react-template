import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { saveProductFormData } from '@redux/product/actions/product.actions';

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
export let checkIfUseInfoEdited;

const UseInfo = ({
  productFormData,
  handleBack,
  dispatch,
  editData,
  loading,
  handleNext,
}) => {
  const classes = useStyles();

  const productUse = useInput(
    (editData
      && editData.product_info
      && editData.product_info.use)
    || (productFormData
      && productFormData.product_info
      && productFormData.product_info.use)
    || '',
    { required: true },
  );

  const useWhen = useInput((editData
    && editData.product_info
    && editData.product_info.use_when)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.use_when)
    || '',
  { required: true });

  const useSituation = useInput((editData
    && editData.product_info
    && editData.product_info.use_situation)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.use_situation)
    || '',
  { required: true });

  const impFunction = useInput((editData
    && editData.product_info
    && editData.product_info.imp_function)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.imp_function)
    || '',
  { required: true });

  const deliveryRisk = useInput((editData
    && editData.product_info
    && editData.product_info.delivery_risk)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.delivery_risk)
    || '',
  { required: true });

  const toolReq = useInput((editData
    && editData.product_info
    && editData.product_info.tool_req)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.tool_req)
    || 'no',
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
    if ((_.isEmpty(productFormData?.third_party_tool)
    && !productUse.value)
      || (_.isEmpty(productFormData?.third_party_tool)
      && !useWhen.value)
      || (_.isEmpty(productFormData?.third_party_tool)
      && !useSituation.value)
      || (_.isEmpty(productFormData?.third_party_tool)
      && !impFunction.value)
      || (_.isEmpty(productFormData?.third_party_tool)
      && !deliveryRisk.value)
      || (!_.isEmpty(productFormData?.third_party_tool)
      && !toolReq.value)) {
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

  checkIfUseInfoEdited = () => (
    productUse.hasChanged()
    || useWhen.hasChanged()
    || useSituation.hasChanged()
    || impFunction.hasChanged()
    || deliveryRisk.hasChanged()
    || toolReq.hasChanged()
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
        use: productUse.value,
        use_when: useWhen.value,
        use_situation: useSituation.value,
        imp_function: impFunction.value,
        delivery_risk: deliveryRisk.value,
        tool_req: toolReq.value,
      },
      edit_date: new Date(),
    };

    dispatch(saveProductFormData(formData));
    handleNext();
  };

  return (
    <div>
      {loading && <Loader open={loading} />}
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          {(!_.isEmpty(productFormData?.third_party_tool)
            ? (
              <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                  Do you already have requirements in your connected project planning tool?
                </Typography>

                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    aria-label="tool-req"
                    name="tool-req-radio-buttons-group"
                    {...toolReq.bind}
                    value={_.lowerCase(toolReq.value)}
                  >
                    <FormControlLabel
                      checked={toolReq.value === 'yes'}
                      value="yes"
                      control={<Radio color="info" />}
                      label="Yes, we do"
                    />
                    <FormControlLabel
                      checked={toolReq.value === 'no'}
                      value="no"
                      control={<Radio color="info" />}
                      label="No, we don't"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )
            : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    id="productUse"
                    label="What is the product used for"
                    name="productUse"
                    autoComplete="productUse"
                    onBlur={(e) => handleBlur(e, 'required', productUse)}
                    {...productUse.bind}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    id="useWhen"
                    label="When is it used"
                    name="useWhen"
                    autoComplete="useWhen"
                    onBlur={(e) => handleBlur(e, 'required', useWhen)}
                    {...useWhen.bind}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    id="useSituation"
                    label="What situations is it used in?"
                    name="useSituation"
                    autoComplete="useSituation"
                    onBlur={(e) => handleBlur(e, 'required', useSituation)}
                    {...useSituation.bind}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    id="impFunction"
                    label="What will be the most important functionality"
                    name="impFunction"
                    autoComplete="impFunction"
                    onBlur={(e) => handleBlur(e, 'required', impFunction)}
                    {...impFunction.bind}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={6}
                    id="deliveryRisk"
                    label="What’s the biggest risk to product delivery?"
                    name="deliveryRisk"
                    autoComplete="deliveryRisk"
                    onBlur={(e) => handleBlur(e, 'required', deliveryRisk)}
                    {...deliveryRisk.bind}
                  />
                </Grid>
              </Grid>
            )
        )}
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

export default connect(mapStateToProps)(UseInfo);
