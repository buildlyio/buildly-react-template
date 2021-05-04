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
  getSensors,
  getSensorType,
  deleteSensor,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getSensorOptions,
} from '@redux/options/actions/options.actions';
import { routes } from '@routes/routesConstants';
import { sensorsColumns, getFormattedSensorRow } from '../Constants';
import AddSensors from '../forms/AddSensors';

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

const Sensors = ({
  dispatch,
  history,
  sensorData,
  loading,
  sensorTypeList,
  redirectTo,
  gatewayData,
  sensorOptions,
}) => {
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteSensorId, setDeleteSensorId] = useState('');
  const [rows, setRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addPath = redirectTo
    ? `${redirectTo}/sensors`
    : `${routes.SENSORS_GATEWAY}/sensor/add`;

  const editPath = redirectTo
    ? `${redirectTo}/sensors`
    : `${routes.SENSORS_GATEWAY}/sensor/edit`;

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    selectableRows: 'none',
    selectToolbarPlacement: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: 'SensorData.csv',
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
    if (sensorData === null) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (sensorOptions === null) {
      dispatch(getSensorOptions());
    }
  }, []);

  useEffect(() => {
    if (
      sensorData
      && sensorData.length
      && sensorTypeList
      && sensorTypeList.length
    ) {
      setRows(getFormattedSensorRow(sensorData, sensorTypeList, gatewayData));
    }
  }, [sensorData, sensorTypeList]);

  const editSensor = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.SENSORS_GATEWAY,
      data: item,
    });
  };

  const deleteSensorItem = (item) => {
    setDeleteSensorId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteSensor(deleteSensorId, organization));
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
            onClick={() => editSensor(rows[dataIndex])}
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
            onClick={() => deleteSensorItem(rows[dataIndex])}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    },
    ...sensorsColumns,
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
            Add Sensor
          </Button>
        </Box> */}
        {!redirectTo && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            Sensors
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
        <Route path={`${addPath}`} component={AddSensors} />
        <Route path={`${editPath}/:id`} component={AddSensors} />
      </div>

      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title="Are you sure you want to Delete this Sensor?"
        submitText="Delete"
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
  loading: state.sensorsGatewayReducer.loading || state.optionsReducer.loading,
});

export default connect(mapStateToProps)(Sensors);
