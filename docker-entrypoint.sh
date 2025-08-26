#!/bin/sh

# Create environment configuration from environment variables
# All variables use VITE_ prefix
cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:3001/api}",
  VITE_APP_NAME: "${VITE_APP_NAME:-React App}",
  VITE_ENV: "${VITE_ENV:-production}",
  VITE_VERSION: "${VITE_VERSION:-1.0.0}",
  VITE_OAUTH_TOKEN_URL: "${VITE_OAUTH_TOKEN_URL:-http://localhost:3001/oauth/token/}",
  VITE_OAUTH_CLIENT_ID: "${VITE_OAUTH_CLIENT_ID:-your-client-id}"
};
EOF

# Execute the main command
exec "$@"