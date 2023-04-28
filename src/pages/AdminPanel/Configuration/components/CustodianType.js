import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getCustodianType,
  deleteCustodianType,
} from '../../../../redux/custodian/actions/custodian.actions';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { routes } from '../../../../routes/routesConstants';
import { getColumns } from '../ConfigurationConstants';
import AddCustodianType from '../forms/AddCustodianType';
import { getUnitOfMeasure } from '@redux/items/actions/items.actions';
import { UserContext } from '@context/User.context';

const CustodianType = ({
  dispatch,
  loading,
  custodianTypeList,
  redirectTo,
  history,
  timezone,
  unitOfMeasure,
}) => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addPath = redirectTo
    ? `${redirectTo}/custodian-type`
    : `${routes.CONFIGURATION}/custodian-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/custodian-type`
    : `${routes.CONFIGURATION}/custodian-type/edit`;

  useEffect(() => {
    if (!unitOfMeasure) {
      dispatch(getUnitOfMeasure(organization));
    }
  }, []);

  useEffect(() => {
    if (!loading && !custodianTypeList) {
      dispatch(getCustodianType());
    }
  }, [custodianTypeList]);

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
    dispatch(deleteCustodianType(deleteId));
    setDeleteModal(false);
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      rows={custodianTypeList || []}
      columns={getColumns(
        timezone,
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
          : '',
        _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
          ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.optionsReducer,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(CustodianType);
