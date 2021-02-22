import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCustodianType } from "midgard/redux/custodian/actions/custodian.actions";
import DataTableWrapper from "midgard/components/DataTableWrapper/DataTableWrapper";
import { 
  CUSTODIAN_TYPE_TOOLTIP,
  CUSTODIAN_TYPE_COLUMNS,
} from "../ConfigurationConstants";
import { routes } from "midgard/routes/routesConstants";
import { Route } from "react-router-dom";
import AddCustodianType from "../forms/AddCustodianType";
import { deleteCustodianType } from "midgard/redux/custodian/actions/custodian.actions";

const CustodianType = (props) => {
  const { 
    dispatch,
    loading,
    custodianTypeList,
    redirectTo,
    history, 
  } = props;
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
      type: "edit",
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
      toolTipTitle="Custodian Type"
      toolTipText={CUSTODIAN_TYPE_TOOLTIP}
      addButtonHeading="Custodian Type"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to Delete this Custodian Type?"}
    >
      <Route path={`${addPath}`} component={AddCustodianType} />
      <Route path={`${editPath}/:id`} component={AddCustodianType} />
    </DataTableWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
});

export default connect(mapStateToProps)(CustodianType);
