import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useInput } from "midgard/hooks/useInput";
import { validators } from "midgard/utils/validators";
import {
  importItems,
  importProducts,
} from "midgard/redux/items/actions/items.actions";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "90%",
    margin: "auto",
    marginTop: theme.spacing(1),
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
}));

const AddFromFile = ({ loading, dispatch }) => {
  const classes = useStyles();
  const uploadType = useInput("", { required: true });
  const [uploadFile, setUploadFile] = useState(null);
  const [formError, setFormError] = useState({});

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    var formData = new FormData();
    formData.append("file", uploadFile, uploadFile.name);
    
    if (uploadType.value === "item") {
      dispatch(importItems(formData));
    } else {
      dispatch(importProducts(formData));
    }
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
    if (!uploadType.value || !uploadFile) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="uploadType"
            label="Upload Type"
            select
            error={formError.uploadType && formError.uploadType.error}
            helperText={
              formError.uploadType ? formError.uploadType.message : ""
            }
            onBlur={(e) => handleBlur(e, "required", uploadType)}
            {...uploadType.bind}
          >
            <MenuItem value={""}>--------</MenuItem>
            <MenuItem value={"item"}>Items</MenuItem>
            <MenuItem value={"product"}>Products</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="uploadFile"
            label="Upload File"
            type="file"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setUploadFile(e.target.files[0])}
          />
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
                Upload
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(AddFromFile);
