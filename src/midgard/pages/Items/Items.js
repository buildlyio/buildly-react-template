import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DataTable from "../../components/Table/Table";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { routes } from "../../routes/routesConstants";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import Loader from "../../components/Loader/Loader";
import AddItems from "./forms/AddItems";
import { itemColumns } from "./ItemsConstants";
import {
  getItems,
  deleteItem,
  searchItem,
  getItemType,
} from "../../redux/items/actions/items.actions";

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
  addButton: {
    backgroundColor: "#000",
  },
}));

function Items({
  dispatch,
  history,
  location,
  data,
  loading,
  loaded,
  error,
  searchedData,
}) {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const classes = useStyles();

  let rows = [];
  if (searchedData && searchedData.length) {
    rows = searchedData;
  } else if (data && data.length) {
    rows = data;
  }

  useEffect(() => {
    dispatch(getItems());
    dispatch(getItemType());
  }, []);

  const editItem = (item) => {
    history.push(`${routes.ITEMS}/edit/:${item.id}`, {
      type: "edit",
      from: routes.ITEMS,
      data: item,
    });
  };
  const deletItem = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    dispatch(deleteItem(deleteItemId));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    setSearchValue(e.target.value);
    dispatch(searchItem(e.target.value, rows));
  };
  const actionsColumns = [
    {
      id: "edit",
      type: "edit",
      action: editItem,
      label: "Edit",
    },
    { id: "delete", type: "delete", action: deletItem, label: "Delete" },
  ];
  return (
    <Box mt={2}>
      {loading && <Loader open={loading} />}
      <div className={classes.container}>
        <Box mb={3}>
          <Button
            type="button"
            // fullWidth
            variant="contained"
            color="primary"
            className={classes.addButton}
            onClick={() =>
              history.push(`${routes.ITEMS}/add`, {
                from: routes.ITEMS,
              })
            }
          >
            <AddIcon /> Add Items
          </Button>
        </Box>
        <Typography className={classes.dashboardHeading} variant={"h4"}>
          Items
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              rows={rows || []}
              columns={itemColumns}
              actionsColumns={actionsColumns}
              hasSearch={true}
              searchAction={searchTable}
              searchValue={searchValue} // To show the search field in table
            />
          </Grid>
        </Grid>
        <Route path={`${routes.ITEMS}/add`} component={AddItems} />
        <Route path={`${routes.ITEMS}/edit/:id`} component={AddItems} />
      </div>

      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={"Are you sure you want to delete this item?"}
        submitText={"Delete"}
      />
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});
export default connect(mapStateToProps)(Items);
