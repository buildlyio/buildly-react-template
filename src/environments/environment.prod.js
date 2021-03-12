// Configuration for production environment

const API_URL = "https://example.com/";

export const environment = window["environment"] || {
  API_URL,
  OAUTH_CLIENT_ID: "ZXGkzJEpPQKMOT6sb4xXON0eZyMgrrS9uQIOSU5H",
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  production: true,
};
