import React from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import { getUser } from '../../../../context/User.context';
import { routes } from '../../../../routes/routesConstants';
import { getMappingOrg } from '../../../../utils/constants';
import EditMapping from '../forms/EditMapping';
import { useQuery } from 'react-query';
import { getAllOrganizationQuery } from '../../../../react-query/queries/authUser/getAllOrganizationQuery';
import { getCustodianQuery } from '../../../../react-query/queries/custodians/getCustodianQuery';
import useAlert from '@hooks/useAlert';

const MappingOrg = ({
  history,
  redirectTo,
}) => {
  const user = getUser();
  const organization = user.organization.organization_uuid;

  const { displayAlert } = useAlert();

  const editPath = redirectTo || `${routes.CONSORTIUM}/mapping-edit`;

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
  );

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert),
  );

  const editData = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: item.custody_org_uuid ? 'edit' : 'set',
      from: redirectTo || routes.CONSORTIUM,
      data: item,
      orgData,
    });
  };

  return (
    <DataTableWrapper
      noSpace
      hideAddButton
      loading={isLoadingOrgs || isLoadingCustodians}
      rows={custodianData || []}
      columns={getMappingOrg(orgData)}
      filename="Mapping Custodian to Organization"
      editAction={editData}
    >
      <Route path={`${editPath}/:id`} component={EditMapping} />
    </DataTableWrapper>
  );
};

export default MappingOrg;
