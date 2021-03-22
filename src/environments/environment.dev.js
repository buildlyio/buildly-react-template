// Configuration for development environment

const API_URL = 'http://localhost:8080/';
const GITHUB_CLIENT_ID = '076e9a822c235db9057f';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'wkXLlC9h3k0jxIx7oLllxpFVU89Dxgi7O8FYZyfX',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  production: false,
};
