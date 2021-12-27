import React, { useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { useTheme, useMediaQuery, Grid, Typography, Box, TextField, Button } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { useInput } from "@hooks/useInput";
import { validators } from "@utils/validators";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    color: "#fff",
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.secondary.contrastText,
    },
    "& .MuiOutlinedInput-root:hover > .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(255, 255, 255, 0.23)",
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.secondary.contrastText,
    },
    "& .MuiSelect-icon": {
      color: theme.palette.secondary.contrastText,
    },
    "& .MuiInputBase-input": {
      color: theme.palette.secondary.contrastText,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
    "&.MuiButton-contained.Mui-disabled": {
      color: "hsl(0deg 0% 100% / 70%);",
    },
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
    color: theme.palette.primary.contrastText,
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
    justifyContent: "center",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: "relative",
  },
  inputWithTooltip: {
    display: "flex",
    alignItems: "center",
  },
}));

const UsersInfo = (props) => {
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
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  // const editPage = location.state && location.state.type === 'edit';
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};

  const product_use = useInput((editData && editData.product_use) || "", {
    required: true,
  });

  const product_use_when = useInput(
    (editData && editData.product_use_when) || "",
    {
      required: true,
    }
  );

  const product_use_situation = useInput(
    (editData && editData.product_use_situation) || "",
    {
      required: true,
    }
  );

  const product_imp_func = useInput(
    (editData && editData.product_imp_func) || "",
    {
      required: true,
    }
  );

  const product_delivery_risk = useInput(
    (editData && editData.product_delivery_risk) || "",
    {
      required: true,
    }
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
          message: "",
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

    if (
      (product_use.value &&
        product_use_when.value &&
        product_use_situation.value &&
        product_imp_func.value &&
        product_delivery_risk.value) === ""
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
                id="product-use"
                label="What is the product used for"
                name="product-use"
                autoComplete="product-use"
                disabled={viewOnly}
                {...product_use.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={6}
                id="product-use-when"
                label="When is it used"
                name="product-use-when"
                autoComplete="product-use-when"
                disabled={viewOnly}
                {...product_use_when.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={6}
                id="product-situation"
                label="What situations is it used in?"
                name="product-situation"
                autoComplete="product-situation"
                disabled={viewOnly}
                {...product_use_situation.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={6}
                id="product-imp-func"
                label="What will be the most important functionality"
                name="product-imp-func"
                autoComplete="product-imp-func"
                disabled={viewOnly}
                {...product_imp_func.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={6}
                id="product-delivery-risk"
                label="What’s the biggest risk to product delivery?"
                name="product-delivery-risk"
                autoComplete="product-delivery-risk"
                disabled={viewOnly}
                {...product_delivery_risk.bind}
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
                // disabled={projectFormData === null}
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
