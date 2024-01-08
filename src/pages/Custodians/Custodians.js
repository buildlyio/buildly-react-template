import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../context/User.context';
import { routes } from '../../routes/routesConstants';
import {
  custodianColumns,
  getCustodianFormattedRow,
  getUniqueContactInfo,
} from '../../utils/constants';
import AddCustodians from './forms/AddCustodians';
import { useQuery } from 'react-query';
import { getCustodianQuery } from '../../react-query/queries/custodians/getCustodianQuery';
import { getCustodianTypeQuery } from '../../react-query/queries/custodians/getCustodianTypeQuery';
import { getContactQuery } from '../../react-query/queries/custodians/getContactQuery';
import { getCountriesQuery } from '../../react-query/queries/shipments/getCountriesQuery';
import { getUnitQuery } from '../../react-query/queries/items/getUnitQuery';
import { getAllOrganizationQuery } from '../../react-query/queries/authUser/getAllOrganizationQuery';
import { useDeleteCustodianMutation } from '../../react-query/mutations/custodians/deleteCustodianMutation';
import useAlert from '@hooks/useAlert';

const Custodian = ({ history, redirectTo }) => {
  const user = getUser();
  const organization = user.organization.organization_uuid;

  const { displayAlert } = useAlert();

  const [rows, setRows] = useState([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [deleteContactObjId, setDeleteContactObjId] = useState('');

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert),
  );

  const { data: custodianTypesData, isLoading: isLoadingCustodianTypes } = useQuery(
    ['custodianTypes'],
    () => getCustodianTypeQuery(displayAlert),
  );

  const { data: contactInfo, isLoading: isLoadingContact } = useQuery(
    ['contact', organization],
    () => getContactQuery(organization, displayAlert),
  );

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
  );

  const addCustodianPath = redirectTo
    ? `${redirectTo}/custodian`
    : `${routes.CUSTODIANS}/add`;

  const editCustodianPath = redirectTo
    ? `${redirectTo}/custodian`
    : `${routes.CUSTODIANS}/edit`;

  useEffect(() => {
    if (!_.isEmpty(custodianData) && !_.isEmpty(contactInfo)) {
      setRows(getCustodianFormattedRow(custodianData, contactInfo));
    }
  }, [custodianData, contactInfo]);

  const editItem = (item) => {
    const contactObj = getUniqueContactInfo(item, contactInfo);
    history.push(`${editCustodianPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.CUSTODIANS,
      data: item,
      contactData: contactObj,
      custodianTypesData,
      countriesData,
      unitData,
      orgData,
    });
  };

  const deleteItem = (item) => {
    const contactObj = getUniqueContactInfo(item, contactInfo);
    setDeleteItemId(item.id);
    setDeleteContactObjId(contactObj.id);
    setDeleteModal(true);
  };

  const { mutate: deleteCustodianMutation, isLoading: isDeletingCustodian } = useDeleteCustodianMutation(organization, displayAlert);

  const handleDeleteModal = () => {
    setDeleteModal(false);
    deleteCustodianMutation([deleteItemId, deleteContactObjId]);
  };

  const onAddButtonClick = () => {
    history.push(addCustodianPath, {
      from: redirectTo || routes.CUSTODIANS,
      custodianTypesData,
      countriesData,
      unitData,
      orgData,
    });
  };

  return (
    <DataTableWrapper
      loading={
        isLoadingCustodians || isLoadingCustodianTypes || isLoadingContact || isLoadingCountries || isLoadingUnits || isLoadingOrgs || isDeletingCustodian
      }
      rows={rows || []}
      columns={custodianColumns}
      filename="CustodianData"
      addButtonHeading="Add Custodian"
      onAddButtonClick={onAddButtonClick}
      editAction={editItem}
      deleteAction={deleteItem}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to delete this Custodian?"
      tableHeader="Custodians"
    >
      <Route path={addCustodianPath} component={AddCustodians} />
      <Route path={`${editCustodianPath}/:id`} component={AddCustodians} />
    </DataTableWrapper>
  );
};

export default Custodian;
