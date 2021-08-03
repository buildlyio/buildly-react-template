import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import {
  loadAllOrgs,
} from '@redux/authuser/actions/authuser.actions';
import {
  getCustodians,
} from '@redux/custodian/actions/custodian.actions';
import { routes } from '@routes/routesConstants';
import { getMappingOrg } from '../ConsortiumConstant';
import EditMapping from '../forms/EditMapping';

const MappingOrg = ({
  dispatch,
  loading,
  custodianData,
  history,
  redirectTo,
  allOrgs,
}) => {
  const editPath = redirectTo || `${routes.CONSORTIUM}/mapping-edit`;

  useEffect(() => {
    if (!allOrgs) {
      dispatch(loadAllOrgs());
    }
    if (!custodianData) {
      dispatch(getCustodians());
    }
  }, []);

  const editData = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: item.custody_org_uuid ? 'edit' : 'set',
      from: redirectTo || routes.CONSORTIUM,
      data: item,
    });
  };

  return (
    <DataTableWrapper
      noSpace
      loading={loading}
      hideAddButton
      rows={custodianData || []}
      columns={getMappingOrg(allOrgs)}
      filename="Mapping Custodian to Organization"
      editAction={editData}
    >
      <Route path={`${editPath}/:id`} component={EditMapping} />
    </DataTableWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.authReducer,
});

export default connect(mapStateToProps)(MappingOrg);
