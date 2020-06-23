import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { validators } from "../../../utils/validators";
import Modal from "../../../components/Modal/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import { useInput } from "../../../hooks/useInput";
import Loader from "../../../components/Loader/Loader";
import { Card, CardContent } from "@material-ui/core";
import { editItem, addItem } from "../../../redux/items/actions/items.actions";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
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
    // margin: theme.spacing(1),
    position: "relative",
  },
  cardItems: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

function AddItems({
  dispatch,
  loading,
  history,
  loaded,
  error,
  location,
  itemTypeList,
}) {
  const editPage = location.state && location.state.type === "edit";
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();
  const item_desc = useInput(editData.item_desc || "");
  const item_name = useInput(editData.name || "");
  const units = useInput(editData.units || "");
  const item_type = useInput(editData.item_type || "", {
    required: true,
  });
  const gtin = useInput("");
  const ean = useInput("");
  const upc = useInput("");
  const paper_tag_no = useInput("");
  const batch_id = useInput("");
  const bin_id = useInput("");
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? "save" : "add item";
  const formTitle = editPage ? "Edit Item" : "Add Item";
  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const itemFormValue = {
      item_type: item_type.value,
      name: item_name.value,
      ...(editPage && editData && { id: editData.id }),
    };
    if (editPage) {
      dispatch(editItem(itemFormValue, history));
    } else {
      dispatch(addItem(itemFormValue, history));
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
    if (!item_type.value) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

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
                  id="item_name"
                  label="Item Name"
                  name="item_name"
                  autoComplete="item_name"
                  {...item_name.bind}
                />
              </Grid>
              <Grid item item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  id="item_desc"
                  label="Item Description"
                  name="item_desc"
                  autoComplete="item_desc"
                  {...item_desc.bind}
                />
              </Grid>
            </Grid>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item item xs={12} md={6} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="units"
                  label="Number of Units"
                  {...units.bind}
                ></TextField>
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="item_type"
                  select
                  label="Item Type"
                  error={formError.item_type && formError.item_type.error}
                  helperText={
                    formError.item_type ? formError.item_type.message : ""
                  }
                  onBlur={(e) =>
                    handleBlur(e, "required", item_type, "item_type")
                  }
                  {...item_type.bind}
                >
                  <MenuItem value={""}>Select</MenuItem>
                  {itemTypeList &&
                    itemTypeList.map((item, index) => (
                      <MenuItem key={`${item.id}${item.name}`} value={item.url}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.cardItems}>
              <CardContent>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="gtin"
                      label="GTIN"
                      name="gtin"
                      autoComplete="gtin"
                      {...gtin.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="upc"
                      label="UPC"
                      name="upc"
                      autoComplete="upc"
                      {...upc.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="ean"
                      label="EAN"
                      name="ean"
                      autoComplete="ean"
                      {...ean.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="paper_tag_no"
                      label="Paper Tag Number"
                      name="paper_tag_no"
                      autoComplete="paper_tag_no"
                      {...paper_tag_no.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="batch_id"
                      label="Batch/Run ID"
                      name="batch_id"
                      autoComplete="batch_id"
                      {...batch_id.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="bin_id"
                      label="BIN ID"
                      name="bin_id"
                      autoComplete="bin_id"
                      {...bin_id.bind}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={isDesktop ? 3 : 0} justify="center">
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
          </form>
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(AddItems);
