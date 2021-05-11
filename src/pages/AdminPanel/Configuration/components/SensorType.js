import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getSensorType,
  deleteSensorType,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { routes } from '@routes/routesConstants';
import { SENSOR_TYPE_COLUMNS } from '../ConfigurationConstants';
import AddSensorType from '../forms/AddSensorType';

const SensorType = ({
  dispatch,
  loading,
  sensorTypeList,
  redirectTo,
  history,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/sensor-type`
    : `${routes.CONFIGURATION}/sensor-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/sensor-type`
    : `${routes.CONFIGURATION}/sensor-type/edit`;

  useEffect(() => {
    if (!loading && !sensorTypeList) {
      dispatch(getSensorType());
    }
  }, [sensorTypeList]);

  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.CONFIGURATION,
    });
  };

  const editType = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.CONFIGURATION,
      data: item,
    });
  };

  const deleteType = (item) => {
    setDeleteId(item.id);
    setDeleteModal(true);
  };

  const handleDeleteModal = () => {
    dispatch(deleteSensorType(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={sensorTypeList || []}
      columns={SENSOR_TYPE_COLUMNS}
      filename="SensorType"
      addButtonHeading="Sensor Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Sensor Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddSensorType} />
      <Route path={`${editPath}/:id`} component={AddSensorType} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(SensorType);
