import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../../../../utils/constants';
import AddCustodianType from '../forms/AddCustodianType';
import { useQuery } from 'react-query';
import { getCustodianTypeQuery } from '../../../../react-query/queries/custodians/getCustodianTypeQuery';
import { getUnitQuery } from '../../../../react-query/queries/items/getUnitQuery';
import { useDeleteCustodianTypeMutation } from '../../../../react-query/mutations/custodians/deleteCustodianTypeMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '../../../../zustand/timezone/timezoneStore';

const CustodianType = ({ redirectTo, history }) => {
  const organization = getUser().organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/custodian-type`
    : `${routes.CONFIGURATION}/custodian-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/custodian-type`
    : `${routes.CONFIGURATION}/custodian-type/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const { data: custodianTypesData, isLoading: isLoadingCustodianTypes } = useQuery(
    ['custodianTypes'],
    () => getCustodianTypeQuery(displayAlert),
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

  const { mutate: deleteCustodianTypeMutation, isLoading: isDeletingCustodianType } = useDeleteCustodianTypeMutation(displayAlert);

  const handleDeleteModal = () => {
    deleteCustodianTypeMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingUnits || isLoadingCustodianTypes || isDeletingCustodianType}
      rows={custodianTypesData || []}
      columns={getColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="CustodianType"
      addButtonHeading="Custodian Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Custodian Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddCustodianType} />
      <Route path={`${editPath}/:id`} component={AddCustodianType} />
    </DataTableWrapper>
  );
};

export default CustodianType;
