import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../../../../utils/constants';
import AddOrganizationType from '../forms/AddOrganizationType';
import { useQuery } from 'react-query';
import { getOrganizationTypeQuery } from '../../../../react-query/queries/authUser/getOrganizationTypeQuery';
import { getUnitQuery } from '../../../../react-query/queries/items/getUnitQuery';
import { useDeleteOrganizationTypeMutation } from '../../../../react-query/mutations/authUser/deleteOrganizationTypeMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '../../../../zustand/timezone/timezoneStore';

const OrganizationType = ({
  redirectTo,
  history,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const organization = getUser().organization.organization_uuid;

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/org-type`
    : `${routes.CONFIGURATION}/org-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/org-type`
    : `${routes.CONFIGURATION}/org-type/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const { data: organizationTypesData, isLoading: isLoadingOrganizationTypes } = useQuery(
    ['organizationTypes'],
    () => getOrganizationTypeQuery(displayAlert),
  );

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

  const { mutate: deleteOrganizationTypeMutation, isLoading: isDeletingOrganizationType } = useDeleteOrganizationTypeMutation(displayAlert);

  const handleDeleteModal = () => {
    deleteOrganizationTypeMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingUnits || isLoadingOrganizationTypes || isDeletingOrganizationType}
      rows={organizationTypesData || []}
      columns={getColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
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

export default OrganizationType;
