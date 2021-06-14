import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getGatewayType,
  deleteGatewayType,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { routes } from '@routes/routesConstants';
import { getColumns } from '../ConfigurationConstants';
import AddGatewayType from '../forms/AddGatewayType';

const GatewayType = ({
  dispatch,
  loading,
  gatewayTypeList,
  redirectTo,
  history,
  timezone,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/gateway-type`
    : `${routes.CONFIGURATION}/gateway-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/gateway-type`
    : `${routes.CONFIGURATION}/gateway-type/edit`;

  useEffect(() => {
    if (!loading && !gatewayTypeList) {
      dispatch(getGatewayType());
    }
  }, [gatewayTypeList]);

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
    dispatch(deleteGatewayType(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={gatewayTypeList || []}
      columns={getColumns(timezone)}
      filename="GatewayType"
      addButtonHeading="Gateway Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Gateway Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddGatewayType} />
      <Route path={`${editPath}/:id`} component={AddGatewayType} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(GatewayType);
