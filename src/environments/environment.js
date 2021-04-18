// Default configuration for local use

const API_URL = 'http://127.0.0.1:8080/';

export const environment = window.environment || {
  API_URL,
  OAUTH_CLIENT_ID: 'ixcHKq5Z5YQTyvpZqoJqyRHfg2t9x0V5WvWLtBCG',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  production: false,
};
