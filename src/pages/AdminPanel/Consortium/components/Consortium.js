import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { getConsortiumColumns } from '@utils/constants';
import AddConsortium from '../forms/AddConsortium';
import { useQuery } from 'react-query';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import { getAllConsortiumQuery } from '@react-query/queries/consortium/getAllConsotiumQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { useDeleteConsortiumMutation } from '@react-query/mutations/consortium/deleteConsortiumMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';

const Consortium = ({ history, redirectTo }) => {
  const user = getUser();
  const organization = user.organization.organization_uuid;

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo || `${routes.CONSORTIUM}/add`;
  const editPath = redirectTo || `${routes.CONSORTIUM}/edit`;

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: consortiumData, isLoading: isLoadingConsortiums } = useQuery(
    ['consortiums'],
    () => getAllConsortiumQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.CONSORTIUM,
      orgData,
    });
  };

  const editData = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.CONSORTIUM,
      data: item,
      orgData,
    });
  };

  const deleteData = (item) => {
    setDeleteId(item.id);
    setDeleteModal(true);
  };

  const { mutate: deleteConsortiumMutation, isLoading: isDeletingConsortium } = useDeleteConsortiumMutation(displayAlert);

  const handleDeleteModal = () => {
    deleteConsortiumMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingOrgs || isLoadingConsortiums || isLoadingUnits || isDeletingConsortium}
      rows={consortiumData || []}
      columns={getConsortiumColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
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

export default Consortium;
