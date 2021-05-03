import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import ConfirmModal from '@components/Modal/ConfirmModal';
import Loader from '@components/Loader/Loader';
import { UserContext } from '@context/User.context';
import {
  getCustodians,
  getCustodianType,
  deleteCustodian,
  getContact,
  getCustody,
} from '@redux/custodian/actions/custodian.actions';
import {
  getCustodianOptions,
  getContactOptions,
} from '@redux/options/actions/options.actions';
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
  iconButton: {
    padding: theme.spacing(1.5, 0),
  },
  dataTableBody: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#4F4D4D',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#383636',
    },
    '&:hover': {
      backgroundColor: '#000 !important',
    },
  },
  dataTable: {
    '& .MuiPaper-root': {
      backgroundColor: '#383636',
    },
    '& tr > th': {
      backgroundColor: '#383636',
    },
  },
}));

const Custodian = ({
  dispatch,
  history,
  custodianData,
  loading,
  contactInfo,
  redirectTo,
  custodyData,
  custodianOptions,
  contactOptions,
}) => {
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [deleteContactObjId, setDeleteContactObjId] = useState('');
  const [rows, setRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addCustodianPath = redirectTo
    ? `${redirectTo}/custodian`
    : `${routes.CUSTODIANS}/add`;

  const editCustodianPath = redirectTo
    ? `${redirectTo}/custodian`
    : `${routes.CUSTODIANS}/edit`;

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    selectableRows: 'none',
    selectToolbarPlacement: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: 'CustodianData.csv',
      separator: ',',
    },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => ({
      className: classes.dataTableBody,
    }),
  };

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
      dispatch(getCustodianOptions());
    }
    if (contactOptions === null) {
      dispatch(getContactOptions());
    }
  }, []);

  useEffect(() => {
    if (custodianData && custodianData.length && contactInfo) {
      setRows(getFormattedRow(custodianData, contactInfo));
    }
  }, [custodianData, contactInfo, custodyData]);

  const editItem = (item) => {
    const contactObj = getUniqueContactInfo(item, contactInfo);
    history.push(`${editCustodianPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.CUSTODIANS,
      data: item,
      contactData: contactObj,
    });
  };

  const deleteItem = (item) => {
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

  const columns = [
    {
      name: 'Edit',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => (
          <IconButton
            className={classes.iconButton}
            onClick={() => editItem(rows[dataIndex])}
          >
            <EditIcon />
          </IconButton>
        ),
      },
    },
    {
      name: 'Delete',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => (
          <IconButton
            onClick={() => deleteItem(rows[dataIndex])}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    },
    ...custodianColumns,
  ];

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <div>
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
        <Grid
          className={classes.dataTable}
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <MUIDataTable
              data={rows}
              columns={columns}
              options={options}
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
  ...state.optionsReducer,
  loading: state.custodianReducer.loading || state.optionsReducer.loading,
});

export default connect(mapStateToProps)(Custodian);
