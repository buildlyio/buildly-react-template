import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getUser } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { itemColumns, getItemFormattedRow } from '@utils/constants';
import AddItems from './forms/AddItems';
import { useQuery } from 'react-query';
import { getItemQuery } from '@react-query/queries/items/getItemQuery';
import { getItemTypeQuery } from '@react-query/queries/items/getItemTypeQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getProductQuery } from '@react-query/queries/items/getProductQuery';
import { getProductTypeQuery } from '@react-query/queries/items/getProductTypeQuery';
import { useDeleteItemMutation } from '@react-query/mutations/items/deleteItemMutation';
import useAlert from '@hooks/useAlert';

const Items = ({ history, redirectTo }) => {
  const user = getUser();
  const organization = user.organization.organization_uuid;

  const { displayAlert } = useAlert();

  const [rows, setRows] = useState([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');

  const { data: itemData, isLoading: isLoadingItems } = useQuery(
    ['items', organization],
    () => getItemQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: itemTypesData, isLoading: isLoadingItemTypes } = useQuery(
    ['itemTypes', organization],
    () => getItemTypeQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: productData, isLoading: isLoadingProducts } = useQuery(
    ['products', organization],
    () => getProductQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: productTypesData, isLoading: isLoadingProductTypes } = useQuery(
    ['productTypes', organization],
    () => getProductTypeQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const addItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.ITEMS}/add`;

  const editItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.ITEMS}/edit`;

  useEffect(() => {
    if (!_.isEmpty(itemData) && !_.isEmpty(itemTypesData) && !_.isEmpty(unitData)) {
      setRows(getItemFormattedRow(itemData, itemTypesData, unitData));
    }
  }, [itemData, itemTypesData, unitData]);

  const editItems = (item) => {
    history.push(`${editItemPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.ITEMS,
      data: item,
      itemTypesData,
      productData,
      productTypesData,
      unitData,
    });
  };

  const deleteItems = (item) => {
    setDeleteItemId(item.id);
    setDeleteModal(true);
  };

  const { mutate: deleteItemMutation, isLoading: isDeletingItem } = useDeleteItemMutation(organization, displayAlert);

  const handleDeleteModal = () => {
    setDeleteModal(false);
    deleteItemMutation(deleteItemId);
  };

  const onAddButtonClick = () => {
    history.push(addItemPath, {
      from: redirectTo || routes.ITEMS,
      itemTypesData,
      productData,
      productTypesData,
      unitData,
    });
  };

  return (
    <div>
      <DataTableWrapper
        loading={isLoadingItems || isLoadingItemTypes || isLoadingUnits || isLoadingProducts || isLoadingProductTypes || isDeletingItem}
        rows={rows || []}
        columns={itemColumns(
          _.find(
            unitData,
            (unit) => _.toLower(unit.unit_of_measure_for) === 'currency',
          )
            ? _.find(
              unitData,
              (unit) => _.toLower(unit.unit_of_measure_for) === 'currency',
            ).unit_of_measure
            : '',
        )}
        filename="ItemsData"
        addButtonHeading="Add Item"
        onAddButtonClick={onAddButtonClick}
        editAction={editItems}
        deleteAction={deleteItems}
        openDeleteModal={openDeleteModal}
        setDeleteModal={setDeleteModal}
        handleDeleteModal={handleDeleteModal}
        deleteModalTitle="Are you sure you want to delete this Item?"
        tableHeader="Items"
      >
        <Route path={`${addItemPath}`} component={AddItems} />
        <Route path={`${editItemPath}/:id`} component={AddItems} />
      </DataTableWrapper>
    </div>
  );
};

export default Items;
