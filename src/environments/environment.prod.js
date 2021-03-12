// Configuration for production environment

const API_URL = 'https://example.com/';
const GITHUB_CLIENT_ID = '7623a737f3e51da735a0';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'ZXGkzJEpPQKMOT6sb4xXON0eZyMgrrS9uQIOSU5H',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  production: true,
};
