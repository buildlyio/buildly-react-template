import React from "react"
import { oauthService } from 'midgard/modules/oauth/oauth.service'


export const user = oauthService.getOauthUser() ? oauthService.getOauthUser().data : null ;

export const UserContext = React.createContext(user);
