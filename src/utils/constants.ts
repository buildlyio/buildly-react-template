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
  RESETTING_PASSWORD: 'Resetting your password...',
  REGISTERING_USER: 'Creating your account...',
  VERIFYING_EMAIL: 'Verifying your email...',
} as const

// Notification messages
export const NOTIFICATION_MESSAGES = {
  PASSWORD_RESET_SUCCESS: 'Password reset successful! You can now sign in with your new password.',
  LOGIN_SUCCESS: 'Welcome back! You have successfully signed in.',
  LOGOUT_SUCCESS: 'You have been successfully signed out.',
  ACCOUNT_CREATED: 'Account created successfully! Please check your email and click the verification link before signing in.',
  EMAIL_SENT: 'If an account with that email exists, we have sent you a password reset link.',
  EMAIL_VERIFIED: 'Email verified successfully! You can now sign in with your account.',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed. The link may be invalid or expired.',
} as const