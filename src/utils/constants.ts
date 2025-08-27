// Application constants

// Authentication
export const AUTH_CONSTANTS = {
  DEFAULT_TOKEN_EXPIRY_SECONDS: 3600, // 1 hour
  MIN_PASSWORD_LENGTH: 8,
} as const

// UI/UX
export const UI_CONSTANTS = {
  NAVIGATION_DELAY_MS: 100, // Delay before navigation to ensure state updates
} as const

// Loader messages
export const LOADER_MESSAGES = {
  SIGNING_IN: 'Signing you in...',
  LOADING: 'Loading...',
  SAVING: 'Saving changes...',
  PROCESSING: 'Processing...',
  FETCHING_DATA: 'Fetching data...',
  CREATING_ACCOUNT: 'Creating your account...',
  SENDING_EMAIL: 'Sending reset email...',
} as const