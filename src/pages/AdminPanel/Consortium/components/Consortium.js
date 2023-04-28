import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import {
  loadAllOrgs,
} from '../../../../redux/authuser/actions/authuser.actions';
import {
  getAllConsortiums,
  deleteConsortium,
} from '../../../../redux/consortium/actions/consortium.actions';
import { routes } from '../../../../routes/routesConstants';
import { getConsortiumColumns } from '../ConsortiumConstant';
import AddConsortium from '../forms/AddConsortium';
import { UserContext } from '@context/User.context';
import { getUnitOfMeasure } from '@redux/items/actions/items.actions';

const Consortium = ({
  dispatch,
  loading,
  allConsortiums,
  history,
  redirectTo,
  timezone,
  allOrgs,
  unitOfMeasure,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addPath = redirectTo || `${routes.CONSORTIUM}/add`;
  const editPath = redirectTo || `${routes.CONSORTIUM}/edit`;

  useEffect(() => {
    if (!allOrgs) {
      dispatch(loadAllOrgs());
    }
    if (!allConsortiums) {
      dispatch(getAllConsortiums());
    }
    if (!unitOfMeasure) {
      dispatch(getUnitOfMeasure(organization));
    }
  }, []);

  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.CONSORTIUM,
    });
  };

  const editData = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.CONSORTIUM,
      data: item,
    });
  };

  const deleteData = (item) => {
    setDeleteId(item.id);
    setDeleteModal(true);
  };

  const handleDeleteModal = () => {
    dispatch(deleteConsortium(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={allConsortiums || []}
      columns={getConsortiumColumns(
        timezone,
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="Consortiums"
      addButtonHeading="Consortium"
      onAddButtonClick={onAddButtonClick}
      editAction={editData}
      deleteAction={deleteData}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Consortium?"
    >
      <Route path={`${addPath}`} component={AddConsortium} />
      <Route path={`${editPath}/:id`} component={AddConsortium} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.consortiumReducer,
  ...state.optionsReducer,
  ...state.authReducer,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(Consortium);
