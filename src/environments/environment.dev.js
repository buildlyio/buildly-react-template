// Configuration for development environment

const API_URL = 'http://localhost:8080/';
const GITHUB_CLIENT_ID = '076e9a822c235db9057f';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'HlQNSZYDHxxx9pR8ZutYyBiWALUp8KCjdr6fZLmB',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  production: false,
};
