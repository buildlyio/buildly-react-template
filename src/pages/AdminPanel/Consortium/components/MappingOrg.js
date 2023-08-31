import React, { useContext, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../../../context/User.context';
import {
  loadAllOrgs,
} from '../../../../redux/authuser/actions/authuser.actions';
import {
  getCustodians,
} from '../../../../redux/custodian/actions/custodian.actions';
import { routes } from '../../../../routes/routesConstants';
import { getMappingOrg } from '../../../../utils/constants';
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
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (_.isEmpty(allOrgs)) {
      dispatch(loadAllOrgs());
    }
    if (_.isEmpty(custodianData)) {
      dispatch(getCustodians(organization));
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
      hideAddButton
      loading={loading}
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
