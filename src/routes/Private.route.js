import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { oauthService } from '@modules/oauth/oauth.service';

/**
 * Generic component for a protected route
 */
export function PrivateRoute({ children }) {
  const location = useLocation();

  return oauthService.hasValidAccessToken()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}
