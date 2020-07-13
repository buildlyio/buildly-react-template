/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import { connect } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  Box,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { getFormattedRow, itemColumns } from "../../Items/ItemsConstants";
import DataTable from "../../../components/Table/Table";
import { editShipment } from "../../../redux/shipment/actions/shipment.actions";
import { routes } from "../../../routes/routesConstants";
import { compareSort } from "../../../utils/utilMethods";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: "center",
    justifyContent: "center",
  },
  alignRight: {
    marginLeft: "auto",
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
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
  },
  submit: {
    borderRadius: "18px",
    fontSize: 11,
  },
}));

function ItemsInfo(props) {
  const {
    itemData,
    itemTypeList,
    shipmentData,
    history,
    redirectTo,
    loading,
    handleNext,
    shipmentFormData,
    dispatch,
    unitsOfMeasure,
  } = props;
  const [itemIds, setItemIds] = useState(
    (shipmentFormData && shipmentFormData.items) || []
  );
  const classes = useStyles();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  let rows = [];
  let columns = itemColumns;
  if (itemData && itemData.length) {
    let selectedRows = [];
    itemData.forEach((element) => {
      if (itemIds.indexOf(element.url) !== -1) {
        selectedRows.push(element);
      }
    });
    rows = getFormattedRow(selectedRows, itemTypeList, unitsOfMeasure);
  }

  const onInputChange = (value) => {
    let itemIdArray = [];
    value.forEach((val) => {
      itemIdArray.push(val.url);
    });
    setItemIds(itemIdArray);
  };

  const submitDisabled = () => {
    if (itemIds.length === 0 || itemData === null) return true;
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const shipmentFormValue = {
      ...{ ...shipmentFormData, items: itemIds },
    };
    dispatch(
      editShipment(
        shipmentFormValue,
        history,
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`
      )
    );
  };

  return (
    <Box mb={5} mt={3}>
      <form noValidate onSubmit={handleSubmit}>
        <Card variant="outlined" className={classes.form}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={
                    (itemData && itemData.sort(compareSort("name"))) || []
                  }
                  getOptionLabel={(option) =>
                    option && `${option.name}:${option.item_uuid}`
                  }
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    onInputChange(newValue);
                  }}
                  defaultValue={rows}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.name}:${option.item_uuid}`}
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Items To Be Associated"
                      placeholder="Select an Items"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box mt={3} mb={5}>
          <Grid container>
            {rows.length > 0 && (
              <Grid item xs={12}>
                <Box mt={5}>
                  <Typography gutterBottom variant="h5">
                    Associated Items
                  </Typography>
                  <DataTable
                    rows={rows || []}
                    columns={columns}
                    // actionsColumns={actionsColumns}
                    hasSearch={false}
                    showTotal={true}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
        <Grid container spacing={3} className={classes.buttonContainer}>
          <Grid item xs={6} sm={2}>
            <div className={classes.loadingWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading || submitDisabled()}
              >
                {`Save`}
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
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleNext}
              className={classes.submit}
            >
              {`Next: Add Custodians`}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(ItemsInfo);
