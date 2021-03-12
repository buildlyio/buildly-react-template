// Configuration for development environment

const API_URL = 'https://dev.example.com/';
const GITHUB_CLIENT_ID = '7623a737f3e51da735a0';

export const environment = window['environment'] || {
  API_URL,
  OAUTH_CLIENT_ID: 'HlQNSZYDHxxx9pR8ZutYyBiWALUp8KCjdr6fZLmB',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  GITHUB_CLIENT_ID,
  production: false,
};
