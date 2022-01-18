import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Box,
  TextField,
  Button,
} from '@mui/material';
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
    '&.MuiButton-contained.Mui-disabled': {
      color: 'hsl(0deg 0% 100% / 70%);',
    },
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
}));

const UsersInfo = (props) => {
  const {
    location,
    handleNext,
    handleBack,
  } = props;
  const classes = useStyles();
  const viewOnly = false;
  // const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state
    && location.state.type === 'edit'
    && location.state.data) || {};

  const productUse = useInput((editData && editData.product_use) || '', {
    required: true,
  });

  const useWhen = useInput(
    (editData && editData.product_use_when) || '',
    { required: true },
  );

  const useSituation = useInput(
    (editData && editData.product_use_situation) || '',
    { required: true },
  );

  const impFunction = useInput(
    (editData && editData.product_imp_func) || '',
    { required: true },
  );

  const deliveryRisk = useInput(
    (editData && editData.product_delivery_risk) || '',
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
    // if (!product_name.value) {
    //   return true;
    // }
    // let errorExists = false;
    // _.forEach(errorKeys, (key) => {
    //   if (formError[key].error) {
    //     errorExists = true;
    //   }
    // });
    // return errorExists;

    if (
      (productUse.value
        && useWhen.value
        && useSituation.value
        && impFunction.value
        && deliveryRisk.value) === ''
    ) {
      return true;
    }
    return false;
  };

  /**
   * Submit The form and add/edit custodian
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
                disabled={viewOnly}
                {...deliveryRisk.bind}
              />
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

export default connect(mapStateToProps)(UsersInfo);
