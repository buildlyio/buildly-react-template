import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  Button,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { environment } from '@environments/environment';
import ConfirmModal from '@components/Modal/ConfirmModal';
import Loader from '@components/Loader/Loader';
import DataTable from '@components/Table/Table';
import { UserContext } from '@context/User.context';
import { httpService } from '@modules/http/http.service';
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
} from '@redux/custodian/actions/custodian.actions';
import { routes } from '@routes/routesConstants';
import {
  custodianColumns,
  getFormattedRow,
  getUniqueContactInfo,
} from './CustodianConstants';
import AddCustodians from './forms/AddCustodians';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
}));

const Custodian = ({
  dispatch,
  history,
  custodianData,
  loading,
  contactInfo,
  searchedData,
  noSearch,
  redirectTo,
  custodyData,
  custodianOptions,
  contactOptions,
}) => {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [deleteContactObjId, setDeleteContactObjId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const classes = useStyles();
  const organization = useContext(UserContext).organization.organization_uuid;

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
          'options',
          `${environment.API_URL}custodian/custodian/`,
          true,
        )
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: GET_CUSTODIAN_OPTIONS_SUCCESS, data });
        })
        .catch((error) => {
          dispatch({ type: GET_CUSTODIAN_OPTIONS_FAILURE, error });
        });
    }
    if (contactOptions === null) {
      httpService
        .makeOptionsRequest(
          'options',
          `${environment.API_URL}custodian/contact/`,
          true,
        )
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: GET_CONTACT_OPTIONS_SUCCESS, data });
        })
        .catch((error) => {
          dispatch({ type: GET_CONTACT_OPTIONS_FAILURE, error });
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
    const contactObj = getUniqueContactInfo(item, contactInfo);
    history.push(`${editCustodianPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.CUSTODIANS,
      data: item,
      contactData: contactObj,
    });
  };

  const deletItem = (item) => {
    const contactObj = getUniqueContactInfo(item, contactInfo);
    setDeleteItemId(item.id);
    setDeleteContactObjId(contactObj.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteCustodian(
      deleteItemId,
      deleteContactObjId,
      organization,
    ));
    setConfirmModal(false);
  };

  const searchTable = (e) => {
    const searchFields = ['name', 'location'];
    setSearchValue(e.target.value);
    dispatch(searchCustodian(e.target.value, rows, searchFields));
  };

  const actionsColumns = [
    {
      id: 'edit',
      type: 'edit',
      action: editItem,
      label: 'Edit',
    },
    {
      id: 'delete',
      type: 'delete',
      action: deletItem,
      label: 'Delete',
    },
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
            onClick={() => history.push(addCustodianPath, {
              from: redirectTo || routes.CUSTODIANS,
            })}
          >
            <AddIcon />
            {' '}
            Add Custodian
          </Button>
        </Box>
        {!redirectTo && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            Custodians
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              rows={filteredRows}
              columns={custodianColumns}
              actionsColumns={actionsColumns}
              hasSearch={!noSearch}
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
        title="Are you sure you want to delete this item?"
        submitText="Delete"
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
});
export default connect(mapStateToProps)(Custodian);
