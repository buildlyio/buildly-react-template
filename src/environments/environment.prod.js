// Configuration for production environment

const API_URL = 'https://example.com/';
const GITHUB_CLIENT_ID = '7623a737f3e51da735a0';
const FEEDBACK_SHEET =
  'https://sheet.best/api/sheets/fd4d0563-683c-4f3f-813c-526b5dc72606';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'ZXGkzJEpPQKMOT6sb4xXON0eZyMgrrS9uQIOSU5H',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  FEEDBACK_SHEET,
  production: true,
};
