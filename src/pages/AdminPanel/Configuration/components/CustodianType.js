import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getCustodianType,
  deleteCustodianType,
} from '@redux/custodian/actions/custodian.actions';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { routes } from '@routes/routesConstants';
import { CUSTODIAN_TYPE_COLUMNS } from '../ConfigurationConstants';
import AddCustodianType from '../forms/AddCustodianType';

const CustodianType = ({
  dispatch,
  loading,
  custodianTypeList,
  redirectTo,
  history,
}) => {
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/custodian-type`
    : `${routes.CONFIGURATION}/custodian-type/add`;

  const editPath = redirectTo
    ? `${redirectTo}/custodian-type`
    : `${routes.CONFIGURATION}/custodian-type/edit`;

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
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteCustodianType(deleteId));
    setConfirmModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={custodianTypeList || []}
      columns={CUSTODIAN_TYPE_COLUMNS}
      filename="CustodianType"
      addButtonHeading="Custodian Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle="Are you sure you want to Delete this Custodian Type?"
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
});

export default connect(mapStateToProps)(CustodianType);
