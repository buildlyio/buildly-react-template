import React from 'react';
import { oauthService } from '@modules/oauth/oauth.service';

export const getUser = () => (
  oauthService.getOauthUser() ? oauthService.getOauthUser().data : null
);

export const getOrganization = () => {
  const user = getUser();
  return user && user.organization ? user.organization.organization_uuid : null;
};

export const UserContext = React.createContext(getUser());
