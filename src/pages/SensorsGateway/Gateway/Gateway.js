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
  getGateways,
  getGatewayType,
  deleteGateway,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getGatewayOptions,
} from '@redux/options/actions/options.actions';
import { routes } from '@routes/routesConstants';
import { gatewayColumns, getFormattedRow } from '../Constants';
import AddGateway from '../forms/AddGateway';

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

const Gateway = ({
  dispatch,
  history,
  gatewayData,
  loading,
  gatewayTypeList,
  redirectTo,
  gatewayOptions,
  shipmentData,
}) => {
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteGatewayId, setDeleteGatewayId] = useState('');
  const [rows, setRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.SENSORS_GATEWAY}/gateway/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateways`
    : `${routes.SENSORS_GATEWAY}/gateway/edit`;

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    selectableRows: 'none',
    selectToolbarPlacement: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: 'GatewayData.csv',
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
    if (gatewayData === null) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (gatewayOptions === null) {
      dispatch(getGatewayOptions());
    }
  }, []);

  useEffect(() => {
    if (
      gatewayData
      && gatewayData.length
      && gatewayTypeList
      && gatewayTypeList.length
    ) {
      setRows(getFormattedRow(gatewayData, gatewayTypeList, shipmentData));
    }
  }, [gatewayData, gatewayTypeList, shipmentData]);

  const editGatewayAction = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.SENSORS_GATEWAY,
      data: item,
    });
  };

  const deleteGatewayAction = (item) => {
    setDeleteGatewayId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteGateway(deleteGatewayId, organization));
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
            onClick={() => editGatewayAction(rows[dataIndex])}
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
            onClick={() => deleteGatewayAction(rows[dataIndex])}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    },
    ...gatewayColumns,
  ];

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <div>
        {/* <Box mb={3} mt={2}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => history.push(addPath, {
              from: redirectTo || routes.SENSORS_GATEWAY,
            })}
          >
            <AddIcon />
            {' '}
            Add Gateway
          </Button>
        </Box> */}
        {!redirectTo && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            Gateway
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
        <Route path={`${addPath}`} component={AddGateway} />
        <Route path={`${editPath}/:id`} component={AddGateway} />
      </div>

      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title="Are your sure you want to Delete this Gateway?"
        submitText="Delete"
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
  ...state.shipmentReducer,
  loading: (
    state.sensorsGatewayReducer.loading
    || state.optionsReducer.loading
    || state.shipmentReducer.loading
  ),
});

export default connect(mapStateToProps)(Gateway);
