import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getOrgTypes,
  deleteOrgType,
} from '../../../../redux/authuser/actions/authuser.actions';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../ConfigurationConstants';
import AddOrganizationType from '../forms/AddOrganizationType';

const OrganizationType = ({
  dispatch,
  loading,
  orgTypes,
  redirectTo,
  history,
  timezone,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/org-type`
    : `${routes.CONFIGURATION}/org-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/org-type`
    : `${routes.CONFIGURATION}/org-type/edit`;

  useEffect(() => {
    if (
      !loading
      && (
        !orgTypes
        || (orgTypes && orgTypes.length === 0)
      )
    ) {
      dispatch(getOrgTypes());
    }
  }, [orgTypes]);

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
      columns={getColumns(timezone)}
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
});

export default connect(mapStateToProps)(OrganizationType);
