// Environment configuration utility
// Supports both Docker runtime injection and Vite build-time variables

interface EnvConfig {
  REACT_APP_API_URL: string;
  REACT_APP_APP_NAME: string;
  REACT_APP_ENV: string;
  REACT_APP_VERSION: string;
  REACT_APP_OAUTH_TOKEN_URL: string;
  REACT_APP_OAUTH_CLIENT_ID: string;
}

// Docker runtime environment (injected via docker-entrypoint.sh)
declare global {
  interface Window {
    _env_?: EnvConfig;
  }
}

// Fallback to Vite environment variables for local development
const getEnvVar = (key: keyof EnvConfig): string => {
  // Try Docker runtime environment first
  if (window._env_ && window._env_[key]) {
    return window._env_[key];
  }
  
  // Fallback to Vite build-time variables
  const viteKey = `VITE_${key.replace('REACT_APP_', '')}`;
  const envValue = import.meta.env[viteKey] || import.meta.env[key];
  
  // Default values if nothing is set
  const defaults: EnvConfig = {
    REACT_APP_API_URL: 'http://localhost:3001/api',
    REACT_APP_APP_NAME: 'React App',
    REACT_APP_ENV: 'development',
    REACT_APP_VERSION: '1.0.0',
    REACT_APP_OAUTH_TOKEN_URL: 'http://localhost:3001/oauth/token/',
    REACT_APP_OAUTH_CLIENT_ID: 'your-client-id',
  };
  
  return envValue || defaults[key];
};

export const env = {
  API_URL: getEnvVar('REACT_APP_API_URL'),
  APP_NAME: getEnvVar('REACT_APP_APP_NAME'),
  ENV: getEnvVar('REACT_APP_ENV'),
  VERSION: getEnvVar('REACT_APP_VERSION'),
  OAUTH_TOKEN_URL: getEnvVar('REACT_APP_OAUTH_TOKEN_URL'),
  OAUTH_CLIENT_ID: getEnvVar('REACT_APP_OAUTH_CLIENT_ID'),
  IS_PRODUCTION: getEnvVar('REACT_APP_ENV') === 'production',
  IS_DEVELOPMENT: getEnvVar('REACT_APP_ENV') === 'development',
};