// Configuration for development environment

const API_URL = 'http://34.149.57.55/';
const GITHUB_CLIENT_ID = '076e9a822c235db9057f';
const FEEDBACK_SHEET =
  'https://sheet.best/api/sheets/fd4d0563-683c-4f3f-813c-526b5dc72606';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'wkXLlC9h3k0jxIx7oLllxpFVU89Dxgi7O8FYZyfX',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  FEEDBACK_SHEET,
  production: false,
};
