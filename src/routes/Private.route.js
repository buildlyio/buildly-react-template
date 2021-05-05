import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { oauthService } from '@modules/oauth/oauth.service';

/**
 * Generic component for a protected route
 */
export const PrivateRoute = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      oauthService.hasValidAccessToken()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}
  />
);
