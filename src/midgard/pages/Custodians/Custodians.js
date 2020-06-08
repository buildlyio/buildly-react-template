import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DataTable from "../../components/Table/Table";
import { numberWithCommas } from "../../utils/utilMethods";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddCustodians from "./forms/AddCustodians";
import { routes } from "../../routes/routesConstants";
import { RECALL_DATA, CUSTODIAN_DATA } from "../../utils/mock";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import Loader from "../../components/Loader/Loader";
import {
  searchCustodian,
  getCustodians,
} from "../../redux/custodian/actions/custodian.actions";

const custodianColumns = [
  { id: "id", label: "CUstodian ID", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  {
    id: "location",
    label: "Location",
    minWidth: 180,
  },
  {
    id: "gln",
    label: "GLN",
    minWidth: 170,
  },
  {
    id: "currentShipments",
    label: "Current Shipments",
    minWidth: 150,
  },
];

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
  },
  tileView: {
    display: "flex",
  },
  rowView: {
    display: "flex",
    flexDirection: "column",
  },
  switchViewSection: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  tileHeading: {
    flex: 1,
    padding: "8px",
  },
  addButton: {
    backgroundColor: "#000",
  },
}));

function Custodian({
  dispatch,
  history,
  location,
  data,
  loading,
  loaded,
  error,
}) {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const classes = useStyles();

  useEffect(() => {
    dispatch(getCustodians());
  }, []);

  const editItem = (item) => {
    history.push(`${routes.CUSTODIANS}/edit/:${item.id}`, {
      type: "edit",
      from: routes.CUSTODIANS,
    });
  };
  const deletItem = (item) => {
    setDeleteItem(item);
    setConfirmModal(true);
  };
  const handleConfirmModal = (item) => {
    console.log("handle");
  };
  const searchTable = (e) => {
    setSearchValue(e.target.value);
    dispatch(searchCustodian(e.target.value, CUSTODIAN_DATA));
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
  let rows = data || CUSTODIAN_DATA;
  return (
    <Box mt={3}>
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
              history.push(`${routes.CUSTODIANS}/add`, {
                from: routes.CUSTODIANS,
              })
            }
          >
            <AddIcon /> Add Custodian
          </Button>
        </Box>
        <Typography className={classes.dashboardHeading} variant={"h4"}>
          Custodians
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              rows={rows || []}
              columns={custodianColumns}
              actionsColumns={actionsColumns}
              hasSearch={true}
              searchAction={searchTable}
              searchValue={searchValue} // To show the search field in table
            />
          </Grid>
        </Grid>
        <Route path={`${routes.CUSTODIANS}/add`} component={AddCustodians} />
        <Route
          path={`${routes.CUSTODIANS}/edit/:id`}
          component={AddCustodians}
        />
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
  ...state.custodianReducer,
});
export default connect(mapStateToProps)(Custodian);
