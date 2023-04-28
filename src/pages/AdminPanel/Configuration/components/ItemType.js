import React, { useEffect, useState, useContext } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getItemType,
  deleteItemType,
  getUnitOfMeasure,
} from '../../../../redux/items/actions/items.actions';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../ConfigurationConstants';
import AddItemType from '../forms/AddItemType';

const ItemType = ({
  dispatch,
  loading,
  itemTypeList,
  redirectTo,
  history,
  timezone,
  unitOfMeasure,
}) => {
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/item-type`
    : `${routes.CONFIGURATION}/item-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/item-type`
    : `${routes.CONFIGURATION}/item-type/edit`;

  useEffect(() => {
    if (!unitOfMeasure) {
      dispatch(getUnitOfMeasure(organization));
    }
  }, []);

  useEffect(() => {
    if (!loading && !itemTypeList) {
      dispatch(getItemType(organization));
    }
  }, [itemTypeList]);

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
    dispatch(deleteItemType(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={itemTypeList || []}
      columns={getColumns(
        timezone,
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
          : '',
      )}
      filename="ItemType"
      addButtonHeading="Item Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Item Type?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddItemType} />
      <Route path={`${editPath}/:id`} component={AddItemType} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(ItemType);
