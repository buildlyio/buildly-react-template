// Environment configuration utility
// Supports both Docker runtime injection and Vite build-time variables

interface EnvConfig {
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_ENV: string;
  VITE_VERSION: string;
  VITE_OAUTH_TOKEN_URL: string;
  VITE_OAUTH_CLIENT_ID: string;
}

// Docker runtime environment (injected via docker-entrypoint.sh)
declare global {
  interface Window {
    _env_?: EnvConfig;
  }
}

// Get environment variable from Docker runtime or Vite build-time
const getEnvVar = (key: keyof EnvConfig): string => {
  // Try Docker runtime environment first
  if (window._env_ && window._env_[key]) {
    return window._env_[key];
  }
  
  // Get from Vite environment variables
  const envValue = import.meta.env[key];
  
  // Default values if nothing is set
  const defaults: EnvConfig = {
    VITE_API_URL: 'http://localhost:3001/api',
    VITE_APP_NAME: 'React App',
    VITE_ENV: 'development',
    VITE_VERSION: '1.0.0',
    VITE_OAUTH_TOKEN_URL: 'http://localhost:3001/oauth/token/',
    VITE_OAUTH_CLIENT_ID: 'your-client-id',
  };
  
  return envValue || defaults[key];
};

export const env = {
  API_URL: getEnvVar('VITE_API_URL'),
  APP_NAME: getEnvVar('VITE_APP_NAME'),
  ENV: getEnvVar('VITE_ENV'),
  VERSION: getEnvVar('VITE_VERSION'),
  OAUTH_TOKEN_URL: getEnvVar('VITE_OAUTH_TOKEN_URL'),
  OAUTH_CLIENT_ID: getEnvVar('VITE_OAUTH_CLIENT_ID'),
  IS_PRODUCTION: getEnvVar('VITE_ENV') === 'production',
  IS_DEVELOPMENT: getEnvVar('VITE_ENV') === 'development',
};