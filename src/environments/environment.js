// Default configuration for local use

const API_URL = 'http://127.0.0.1:8080/';

export const environment = window.environment || {
  API_URL,
  OAUTH_CLIENT_ID: 'wkXLlC9h3k0jxIx7oLllxpFVU89Dxgi7O8FYZyfX',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  production: false,
};
