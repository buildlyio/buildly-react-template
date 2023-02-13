import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getUnitsOfMeasure,
  deleteUnitsOfMeasure,
} from '../../../../redux/items/actions/items.actions';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { routes } from '../../../../routes/routesConstants';
import { getUnitsOfMeasureColumns } from '../ConfigurationConstants';
import AddUnitOfMeasure from '../forms/AddUnitOfMeasure';

const UnitOfMeasure = ({
  dispatch,
  loading,
  unitsOfMeasure,
  redirectTo,
  history,
  timezone,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/unit-of-measure`
    : `${routes.CONFIGURATION}/unit-of-measure/add`;

  const editPath = redirectTo
    ? `${redirectTo}/unit-of-measure`
    : `${routes.CONFIGURATION}/unit-of-measure/edit`;

  useEffect(() => {
    if (!loading && !unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
  }, [unitsOfMeasure]);

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
    dispatch(deleteUnitsOfMeasure(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={unitsOfMeasure || []}
      columns={getUnitsOfMeasureColumns(timezone)}
      filename="UnitsOfMeasure"
      addButtonHeading="Unit of Measure"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openDeleteModal={openDeleteModal}
      setDeleteModal={setDeleteModal}
      handleDeleteModal={handleDeleteModal}
      deleteModalTitle="Are you sure you want to Delete this Unit of Measure?"
      tableHeight="300px"
    >
      <Route path={`${addPath}`} component={AddUnitOfMeasure} />
      <Route path={`${editPath}/:id`} component={AddUnitOfMeasure} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(UnitOfMeasure);
