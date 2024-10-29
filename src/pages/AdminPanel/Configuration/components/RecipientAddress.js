import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import { useQuery } from 'react-query';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getRecipientAddressQuery } from '@react-query/queries/recipientaddress/getRecipientAddressQuery';
import { useDeleteRecipientAddressMutation } from '@react-query/mutations/recipientaddress/deleteRecipientAddressMutation';
import { routes } from '@routes/routesConstants';
import { getFormattedRecipientAddresses, getRecipientAddressColumns } from '@utils/constants';
import { useStore } from '@zustand/timezone/timezoneStore';
import AddRecipientAddress from '../forms/AddRecipientAddress';

const RecipientAddress = ({ redirectTo, history }) => {
  const organization = getUser().organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [rows, setRows] = useState([]);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const addPath = redirectTo
    ? `${redirectTo}/recipient-address`
    : `${routes.CONFIGURATION}/recipient-address/add`;

  const editPath = redirectTo
    ? `${redirectTo}/recipient-address`
    : `${routes.CONFIGURATION}/recipient-address/edit`;

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: recipientAddressData, isLoading: isLoadingRecipientAddresses } = useQuery(
    ['recipientAddresses', organization],
    () => getRecipientAddressQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    setRows(getFormattedRecipientAddresses(recipientAddressData));
  }, [recipientAddressData]);

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

  const { mutate: deleteRecipientAddressMutation, isLoading: isDeletingRecipientAddress } = useDeleteRecipientAddressMutation(displayAlert);

  const handleDeleteModal = () => {
    deleteRecipientAddressMutation(deleteId);
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={isLoadingRecipientAddresses || isDeletingRecipientAddress || isLoadingUnits}
      rows={rows}
      columns={getRecipientAddressColumns(
        data,
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="RecipientAddress"
      addButtonHeading="Add Address"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Recipient Address?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddRecipientAddress} />
      <Route path={`${editPath}/:id`} component={AddRecipientAddress} />
    </DataTableWrapper>
  );
};

export default RecipientAddress;
