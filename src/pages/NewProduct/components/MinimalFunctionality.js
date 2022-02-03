import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { useInput } from '@hooks/useInput';
import { saveProductFormData, createProduct } from '@redux/product/actions/product.actions';
import { routes } from '@routes/routesConstants';
import { EXAMPLELIST } from '../ProductFormConstants';

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
export let checkIfMinimalFuncEdited;

const MinimalFunctionality = ({
  productFormData,
  handleBack,
  dispatch,
  history,
}) => {
  const classes = useStyles();

  const minimalFunc = useInput(
    (productFormData
      && productFormData.product_info
      && productFormData.product_info.minimal_functionality)
    || '',
    { required: true },
  );

  checkIfMinimalFuncEdited = () => minimalFunc.hasChanged();

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
        minimal_functionality: minimalFunc.value,
      },
      edit_date: new Date(),
    };
    dispatch(createProduct(formData));
    dispatch(saveProductFormData(null));
    history.push(routes.DASHBOARD);
  };

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" component="div">
                What is the minimal amount of functionality you need to launch
                this product
              </Typography>
              <Typography variant="caption" component="div">
                (Try to limit to no more than 5 major pieces of Functionality
                and assume registration and login are taken care of)
              </Typography>
              <List>
                {_.map(EXAMPLELIST, (exmpl, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={exmpl} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={6}
                {...minimalFunc.bind}
              />
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
                disabled={!minimalFunc.value}
                className={classes.submit}
              >
                Create Product
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

export default connect(mapStateToProps)(MinimalFunctionality);
