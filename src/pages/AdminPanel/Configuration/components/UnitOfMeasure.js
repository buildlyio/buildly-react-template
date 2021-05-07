import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getUnitsOfMeasure,
  deleteUnitsOfMeasure,
} from '@redux/items/actions/items.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { routes } from '@routes/routesConstants';
import { UNITS_OF_MEASURE_COLUMNS } from '../ConfigurationConstants';
import AddUnitOfMeasure from '../forms/AddUnitOfMeasure';

const UnitOfMeasure = ({
  dispatch,
  loading,
  unitsOfMeasure,
  redirectTo,
  history,
}) => {
  const [openConfirmModal, setConfirmModal] = useState(false);
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
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteUnitsOfMeasure(deleteId));
    setConfirmModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={unitsOfMeasure || []}
      columns={UNITS_OF_MEASURE_COLUMNS}
      filename="UnitsOfMeasure"
      addButtonHeading="Unit of Measure"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle="Are you sure you want to Delete this Unit of Measure?"
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
});

export default connect(mapStateToProps)(UnitOfMeasure);
