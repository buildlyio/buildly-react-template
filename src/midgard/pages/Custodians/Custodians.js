import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { environment } from "environment";
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
  getCustody,
  GET_CUSTODIAN_OPTIONS_SUCCESS,
  GET_CUSTODIAN_OPTIONS_FAILURE,
  GET_CONTACT_OPTIONS_SUCCESS,
  GET_CONTACT_OPTIONS_FAILURE,
} from "../../redux/custodian/actions/custodian.actions";
import {
  custodianColumns,
  getFormattedRow,
  getUniqueContactInfo,
} from "./CustodianConstants";
import { httpService } from "../../modules/http/http.service";

/**
 *
 * The current organization
 */
let organization = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")).organization.organization_uuid : '';


const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
    marginBottom: "0.5em",
  },
}));

function Custodian({
  dispatch,
  history,
  location,
  custodianData,
  loading,
  loaded,
  error,
  contactInfo,
  searchedData,
  noSearch,
  redirectTo,
  custodyData,
  custodianOptions,
  contactOptions,
}) {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteContactObjId, setDeleteContactObjId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const classes = useStyles();

  const addCustodianPath = redirectTo
    ? `${redirectTo}/custodian`
    : `${routes.CUSTODIANS}/add`;

  const editCustodianPath = redirectTo
    ? `${redirectTo}/custodian`
    : `${routes.CUSTODIANS}/edit`;

  useEffect(() => {
    if (custodianData === null) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (custodianOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}custodian/custodian/?organization_uuid=${organization}`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_CUSTODIAN_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_CUSTODIAN_OPTIONS_FAILURE, error: err });
        });
    }
    if (contactOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          `${environment.API_URL}custodian/contact/?organization_uuid=${organization}`,
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_CONTACT_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_CONTACT_OPTIONS_FAILURE, error: err });
        });
    }
  }, []);

  useEffect(() => {
    if (custodianData && custodianData.length && contactInfo) {
      setRows(getFormattedRow(custodianData, contactInfo));
      setFilteredRows(getFormattedRow(custodianData, contactInfo));
    }
  }, [custodianData, contactInfo, custodyData]);

  useEffect(() => {
    if (searchedData) {
      setFilteredRows(searchedData);
    }
  }, [searchedData]);

  const editItem = (item) => {
    let contactObj = getUniqueContactInfo(item, contactInfo);
    history.push(`${editCustodianPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.CUSTODIANS,
      data: item,
      contactData: contactObj,
    });
  };
  const deletItem = (item) => {
    let contactObj = getUniqueContactInfo(item, contactInfo);
    setDeleteItemId(item.id);
    setDeleteContactObjId(contactObj.id);
    setConfirmModal(true);
  };
  const handleConfirmModal = () => {
    dispatch(deleteCustodian(deleteItemId, deleteContactObjId, organization));
    setConfirmModal(false);
  };
  const searchTable = (e) => {
    let searchFields = ["name", "location"];
    setSearchValue(e.target.value);
    dispatch(searchCustodian(e.target.value, rows, searchFields));
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
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <div className={classes.container}>
        <Box mb={3} mt={2}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() =>
              history.push(addCustodianPath, {
                from: redirectTo || routes.CUSTODIANS,
              })
            }
          >
            <AddIcon /> Add Custodian
          </Button>
        </Box>
        {!redirectTo && (
          <Typography className={classes.dashboardHeading} variant={"h4"}>
            Custodians
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              rows={filteredRows}
              columns={custodianColumns}
              actionsColumns={actionsColumns}
              hasSearch={noSearch ? false : true}
              searchAction={searchTable}
              searchValue={searchValue} // To show the search field in table
            />
          </Grid>
        </Grid>
        <Route path={addCustodianPath} component={AddCustodians} />
        <Route path={`${editCustodianPath}/:id`} component={AddCustodians} />
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
