#!/bin/sh

# Create environment configuration from environment variables
cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL:-http://localhost:3001/api}",
  REACT_APP_APP_NAME: "${REACT_APP_APP_NAME:-React App}",
  REACT_APP_ENV: "${REACT_APP_ENV:-production}",
  REACT_APP_VERSION: "${REACT_APP_VERSION:-1.0.0}",
  REACT_APP_OAUTH_TOKEN_URL: "${REACT_APP_OAUTH_TOKEN_URL:-http://localhost:3001/oauth/token/}",
  REACT_APP_OAUTH_CLIENT_ID: "${REACT_APP_OAUTH_CLIENT_ID:-your-client-id}"
};
EOF

# Execute the main command
exec "$@"