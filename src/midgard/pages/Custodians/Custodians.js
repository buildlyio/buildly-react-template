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
  getCustodianType,
  deleteCustodian,
  getContact,
} from "../../redux/custodian/actions/custodian.actions";

const custodianColumns = [
  { id: "id", label: "Custodian ID", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  {
    id: "location",
    label: "Location",
    minWidth: 180,
  },
  {
    id: "custodian_glns",
    label: "GLN",
    minWidth: 170,
  },
];

const getUniqueContactInfo = (rowItem, contactInfo) => {
  let obj = "";
  contactInfo.forEach((info) => {
    if (rowItem.contact_data[0] === info.url) {
      obj = info;
    }
  });
  return obj;
};

const getFormattedRow = (data, contactInfo) => {
  let customizedRow = [...data];
  if (data && data.length && contactInfo && contactInfo.length) {
    customizedRow.forEach((rowItem) => {
      let contactInfoItem = getUniqueContactInfo(rowItem, contactInfo);
      rowItem["location"] = `${
        contactInfoItem.address1 && `${contactInfoItem.address1},`
      }
          ${contactInfoItem.address2 && `${contactInfoItem.address2},`}
          ${contactInfoItem.city && `${contactInfoItem.city},`}
          ${contactInfoItem.state && `${contactInfoItem.state},`}
          ${contactInfoItem.country && `${contactInfoItem.country},`}
          ${contactInfoItem.postal_code && `${contactInfoItem.postal_code}`}`;
    });
  }
  return data;
};

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
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
  contactInfo,
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
    rows = getFormattedRow(data, contactInfo);
  }

  useEffect(() => {
    dispatch(getCustodians());
    dispatch(getCustodianType());
    dispatch(getContact());
  }, []);

  const editItem = (item) => {
    let contactObj = getUniqueContactInfo(item, contactInfo);
    history.push(`${routes.CUSTODIANS}/edit/:${item.id}`, {
      type: "edit",
      from: routes.CUSTODIANS,
      data: item,
      contactData: contactObj,
    });
  };
  const deletItem = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    dispatch(deleteCustodian(deleteItemId));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    setSearchValue(e.target.value);
    dispatch(searchCustodian(e.target.value, rows));
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
