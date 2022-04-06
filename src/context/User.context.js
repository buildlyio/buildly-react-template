import React from 'react';
import { oauthService } from '../modules/oauth/oauth.service';

export const getUser = () => (
  oauthService.getOauthUser()
    ? oauthService.getOauthUser().data
    : null
);

export const UserContext = React.createContext(getUser());
