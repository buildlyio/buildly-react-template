// Configuration for production environment

const API_URL = 'https://app-api.tpath.io/';
const MAP_API_KEY = 'AIzaSyC95TcB_eTARGYYduIqDf-7u4O6JEjNIgQ';

export const environment = {
  ...(window.environment || {
    API_URL,
    OAUTH_CLIENT_ID: 'pljxXjxQbtzLbh8pPQG3xLLrW6tC6XghOp2OGCUS',
    OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
    MAP_API_KEY,
    MAP_API_URL: `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    GEO_CODE_API: 'AIzaSyDw-lNn69CSWKBGz97HeVuJQKIhiVLcFyE',
    session_timeout: 1000,
    production: true,
  }),
};
