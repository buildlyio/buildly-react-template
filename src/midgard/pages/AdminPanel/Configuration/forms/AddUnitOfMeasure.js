import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "midgard/components/Modal/Modal";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import { useInput } from "midgard/hooks/useInput";
import { validators } from "midgard/utils/validators";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from '@material-ui/core/MenuItem';
import {
  addUnitsOfMeasure,
  editUnitsOfMeasure,
} from "midgard/redux/items/actions/items.actions";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
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
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
  checkbox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  label: {
    marginLeft: `${theme.spacing(2)}px !important`,
    fontSize: "0.9rem",
  },
}));

const AddUnitOfMeasure = ({ history, location, loading, dispatch }) => {
  const classes = useStyles();
  const [openModal, toggleModal] = useState(true);

  const editPage = location.state && location.state.type === "edit";
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};
  const name = useInput((editData && editData.name) || "", {
    required: true,
  });
  const unitClass = useInput((editData && editData.supported_class) || "", {
    required: true,
  });
  const [isDefault, setIsDefault] = useState((editData && editData.is_default_for_class) || false);
  const [formError, setFormError] = useState({});
  
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const buttonText = editPage ? "Save" : "Add Unit of Measure";
  const formTitle = editPage ? "Edit Unit of Measure" : "Add Unit of Measure";

  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDateTime = new Date();
    let data = {
      ...editData,
      name: name.value,
      supported_class: unitClass.value,
      is_default_for_class: isDefault,
      edit_date: currentDateTime,
    };
    if (editPage) {
      dispatch(editUnitsOfMeasure(data));
    } else {
      data = {
        ...data, 
        create_date: currentDateTime,
      };
      dispatch(addUnitsOfMeasure(data));
    }
    closeModal();
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    let validateObj = validators(validation, input);
    let prevState = { ...formError };
    if (validateObj && validateObj.error)
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    else
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: "",
        },
      });
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(formError);
    let errorExists = false;
    if (!name.value || !unitClass.value) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  return (
    <div>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth={"md"}
        >
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="name"
                  label="Unit of Measure"
                  name="name"
                  autoComplete="name"
                  error={formError.name && formError.name.error}
                  helperText={
                    formError.name ? formError.name.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", name)}
                  {...name.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="unitClass"
                  label="Unit Class"
                  select
                  error={formError.unitClass && formError.unitClass.error}
                  helperText={
                    formError.unitClass ? formError.unitClass.message : ""
                  }
                  onBlur={(e) => handleBlur(e, "required", unitClass)}
                  {...unitClass.bind}
                >
                  <MenuItem value={""}>--------</MenuItem>
                  <MenuItem value={"Capacity and Volume"}>
                    Capacity and Volume
                  </MenuItem>
                  <MenuItem value={"Distance and Length"}>
                    Distance and Length
                  </MenuItem>
                  <MenuItem value={"Mass and Weight"}>
                    Mass and Weight
                  </MenuItem>
                  <MenuItem value={"Temperature"}>
                    Temperature
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.checkbox}>
                  <Checkbox
                    checked={isDefault}
                    onClick={e => setIsDefault(e.target.checked)}
                  />
                  <Typography className={classes.label}>
                    Is this default for Unit Class?
                  </Typography>
                </div>
              </Grid>
              <Grid container spacing={2} justify="center">
                <Grid item xs={6} sm={4}>
                  <div className={classes.loadingWrapper}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={loading || submitDisabled()}
                    >
                      {buttonText}
                    </Button>
                    {loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => closeModal()}
                    className={classes.submit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Modal>
      )}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(AddUnitOfMeasure);