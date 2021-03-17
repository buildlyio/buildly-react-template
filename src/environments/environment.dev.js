// Configuration for development environment

const API_URL = 'https://tp-dev-api.buildly.io/';
const GITHUB_CLIENT_ID = '076e9a822c235db9057f';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'pljxXjxQbtzLbh8pPQG3xLLrW6tC6XghOp2OGCUS',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  production: false,
};
