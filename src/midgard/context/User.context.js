import React from "react"
import { oauthService } from 'midgard/modules/oauth/oauth.service'

export const user = oauthService.getOauthUser().data;
export const UserContext = React.createContext(user);
