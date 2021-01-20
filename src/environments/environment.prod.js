// Configuration for production environment

const API_URL = "https://app.tpath.io/";

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: "pljxXjxQbtzLbh8pPQG3xLLrW6tC6XghOp2OGCUS",
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  production: true,
};
