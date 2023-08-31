import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../../../context/User.context';
import {
  getOrgTypes,
  deleteOrgType,
} from '../../../../redux/authuser/actions/authuser.actions';
import { getUnitOfMeasure } from '../../../../redux/items/actions/items.actions';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../../../../utils/constants';
import AddOrganizationType from '../forms/AddOrganizationType';

const OrganizationType = ({
  dispatch,
  loading,
  orgTypes,
  redirectTo,
  history,
  timezone,
  unitOfMeasure,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addPath = redirectTo
    ? `${redirectTo}/org-type`
    : `${routes.CONFIGURATION}/org-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/org-type`
    : `${routes.CONFIGURATION}/org-type/edit`;

  useEffect(() => {
    if (_.isEmpty(unitOfMeasure)) {
      dispatch(getUnitOfMeasure(organization));
    }
    if (_.isEmpty(orgTypes)) {
      dispatch(getOrgTypes());
    }
  }, []);

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
    dispatch(deleteOrgType(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={orgTypes || []}
      columns={getColumns(
        timezone,
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="OrganizationType"
      addButtonHeading="Organization Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Organization Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddOrganizationType} />
      <Route path={`${editPath}/:id`} component={AddOrganizationType} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.optionsReducer,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(OrganizationType);
