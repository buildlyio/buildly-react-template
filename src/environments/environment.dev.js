// Configuration for development environment

const API_URL = 'https://dev.example.com/';

export const environment = window.environment || {
  API_URL,
  OAUTH_CLIENT_ID: 'HlQNSZYDHxxx9pR8ZutYyBiWALUp8KCjdr6fZLmB',
  OAUTH_TOKEN_URL: `${API_URL}oauth/token/`,
  production: false,
};
