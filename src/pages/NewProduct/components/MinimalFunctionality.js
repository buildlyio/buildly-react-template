import React, { useState } from 'react';
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
import { validators } from '@utils/validators';
import { routes } from '@routes/routesConstants';

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

const exampleList = [
  'Example 1:  A general user will need to be able to see a list of products to buy and a shopping cart to put them in and the ability to pay for and have those items shipped.',
  "Example 2: An administrative user should be able to approve every user's access and level, as well as fix any problem for a general user that does not require direct access to the code or data.",
  'Example 3: A power user should be able to download a report of the previous quarters activity in the application with no more than 3 clicks.',
];

const MinimalFunctionality = (props) => {
  const {
    location, handleBack,
  } = props;
  const classes = useStyles();
  // const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data)
    || {};

  const minimalFunc = useInput(
    (editData && editData.minimal_functionality) || '',
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

  const submitDisabled = () => {
    if (!minimalFunc.value) {
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
              <Typography variant="h5" component="div">
                What is the minimal amount of functionality you need to launch
                this product
              </Typography>
              <Typography variant="caption" component="div">
                (Try to limit to no more than 5 major pieces of Functionality
                and assume registration and login are taken care of)
              </Typography>
              <List>
                {exampleList.map((listItem, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={listItem} />
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
                onClick={handleSubmit}
                disabled={submitDisabled()}
                className={classes.submit}
              >
                Submit
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

export default connect(mapStateToProps)(MinimalFunctionality);
