# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern React 19 template built with TypeScript, Vite, and comprehensive tooling. This is a production-ready template featuring OAuth authentication, light/dark/system theme support, dual environment variable support for both local development and Docker containerization, with integrated testing, linting, and component development workflows.

## Development Commands

### Setup and Installation
```bash
npm install                    # Install dependencies
cp .env.example .env.development  # Set up environment variables
```

### Development Server
```bash
npm run dev                    # Start dev server on port 3000
npm run preview                # Preview production build locally
```

**Important**: Always stop the dev server before making configuration changes to avoid cached issues.

### Building and Deployment
```bash
npm run build                  # TypeScript compilation + Vite build
npm run docker:build           # Build Docker image
npm run docker:run             # Run Docker container on port 80
```

### Testing and Quality
```bash
# Unit Testing (Vitest + React Testing Library)
npm run test                   # Run in watch mode
npm run test:coverage          # Run with coverage report
vitest run src/path/to/test.test.tsx  # Run single test file

# End-to-End Testing (Playwright)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Run with Playwright UI
npx playwright test --debug    # Debug E2E tests

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Auto-fix ESLint issues

# Component Development
npm run storybook              # Start Storybook on port 6006
npm run build-storybook        # Build static Storybook
```

## Architecture and Key Patterns

### Environment Variable System
The app uses a dual environment system supporting both local development and Docker runtime injection:

- **Local Development**: Vite loads `.env.development.local` → `.env.development` → `.env.local` → `.env`
- **Docker Runtime**: Variables injected via `docker-entrypoint.sh` into `window._env_`
- **Environment Utility**: `src/utils/env.ts` provides unified access with fallback hierarchy

All environment variables must be prefixed with `VITE_` and defined in the `EnvConfig` interface in `src/utils/env.ts`.

### Authentication System
Complete OAuth-based authentication system with full user lifecycle support:

#### **Core Authentication Features**:
- **OAuth Login**: Multipart/form-data POST to token endpoint with client credentials
- **User Registration**: Account creation with email verification requirement
- **Password Reset**: Secure password reset via email links
- **Email Verification**: Token-based email verification from registration emails
- **Session Management**: Persistent login state with automatic cleanup

#### **State Management**: 
- **Zustand Store** (`src/stores/authStore.ts`) with localStorage persistence
- **Token Management**: Automatic expiration handling and cleanup
- **Authentication Guards**: Prevents access to auth pages when logged in

#### **API Integration**:
- **TanStack Query Mutations**: All auth operations use React Query for state management
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Integrated loader system for all authentication operations

#### **User Experience**:
- **Global Notifications**: Success/error notifications that persist across page navigation
- **Automatic Redirects**: Smart routing based on authentication state
- **Form Validation**: Client-side validation for all authentication forms
- **Immediate Feedback**: No artificial delays, immediate responses to user actions

### Theme System
Comprehensive theme system with light/dark/system modes:

- **Theme Modes**: Light, Dark, and System (follows OS preference)
- **State Management**: Zustand store (`src/stores/themeStore.ts`) with localStorage persistence
- **CSS Custom Properties**: Dynamic theme switching via CSS variables
- **System Integration**: Automatic detection and response to OS theme changes
- **Default Mode**: System preference with automatic switching

### Global UI System
Unified system for user feedback and loading states:

#### **Global Loader** (`src/components/GlobalLoader/`):
- **Overlay System**: Full-screen loading overlay during API operations
- **Contextual Messages**: Custom loading messages for different operations
- **State Management**: Zustand-based global loader state
- **Non-blocking**: Prevents user interaction during critical operations

#### **Global Notifications** (`src/components/GlobalNotification/`):
- **Toast System**: Non-intrusive notifications for user feedback
- **Multiple Types**: Success, error, warning, and info notifications
- **Persistent Options**: Notifications can persist across page navigation
- **Auto-dismiss**: Configurable auto-dismiss timing with manual close option
- **Animation**: Smooth slide-in/out animations with progress indicators

#### **Integration Pattern**:
```typescript
// Global loader usage
const { showLoader, hideLoader } = useLoader()
showLoader(LOADER_MESSAGES.SIGNING_IN)

// Global notifications usage  
const { showSuccess, showError } = useNotification()
showSuccess(NOTIFICATION_MESSAGES.LOGIN_SUCCESS)
showError('Custom error message', { persistent: true })
```

### Testing Architecture
**Dual Testing Setup** via Vite configuration:
- **Unit Tests**: Vitest project targeting `src/**/*.test.{ts,tsx}` with jsdom environment
- **Storybook Tests**: Separate Vitest project using Playwright browser for component story testing
- **E2E Tests**: Playwright targeting `e2e/` directory with automatic dev server startup

### Component Structure
Components follow co-location pattern: each component has its own directory with:
- `ComponentName.tsx` - Main component
- `ComponentName.test.tsx` - Unit tests
- `ComponentName.stories.tsx` - Storybook stories
- `ComponentName.css` - Component-specific styles (if needed)

### Docker Multi-Stage Build
- **Build Stage**: Node.js container compiles TypeScript and builds with Vite
- **Runtime Stage**: Nginx Alpine serves static files
- **Environment Injection**: `docker-entrypoint.sh` creates runtime environment configuration

### Build and Bundle Configuration
- **Vite**: Development server on port 3000, optimized production builds
- **TypeScript**: Strict mode enabled, ES2022 target, React JSX transform
- **ESLint**: TypeScript + React rules with Storybook integration
- **Vitest**: Two-project setup (unit + storybook) with jsdom and Playwright browser environments

## Important Implementation Details

### Dynamic Document Title
The app sets `document.title` dynamically using `useEffect` in the main App component, pulling from environment variables rather than static HTML.

### Environment Variable Access Pattern
```typescript
import { env } from '@/utils/env'

// Available environment variables:
env.API_URL           // VITE_API_URL
env.APP_NAME          // VITE_APP_NAME
env.OAUTH_TOKEN_URL   // VITE_OAUTH_TOKEN_URL
env.OAUTH_CLIENT_ID   // VITE_OAUTH_CLIENT_ID
env.IS_DEVELOPMENT    // boolean derived from VITE_ENV
env.VERSION           // VITE_VERSION
```

### Authentication Implementation Pattern
```typescript
import { useAuthStore } from '@/stores/authStore'
import { useLoginMutation } from '@/api/auth'

// Authentication state access
const { isAuthenticated, user, logout, checkAuth } = useAuthStore()

// Login mutation
const loginMutation = useLoginMutation()
await loginMutation.mutateAsync({ username, password })
```

### Theme Implementation Pattern
```typescript
import { useThemeStore } from '@/stores/themeStore'

// Theme state and actions
const { mode, resolvedTheme, setTheme } = useThemeStore()

// Theme initialization (call in App.tsx)
const { initializeTheme } = useThemeStore()
useEffect(() => {
  const cleanup = initializeTheme()
  return cleanup
}, [])
```

### Routing Architecture
- **Root Route (`/`)**: Authentication check and redirect logic
- **Authentication Routes** (accessible to unauthenticated users):
  - `/login` - OAuth login form with username/password
  - `/register` - User registration with email verification
  - `/forgot-password` - Password reset request form
  - `/reset-password-confirm/:uid/:token` - Password reset confirmation from email
  - `/verify-email` - Email verification from registration emails
- **Protected Routes** (requires authentication):
  - `/app` - Main dashboard page
  - `/app/user-management` - User management interface
- **Smart Redirects**: Automatic routing based on authentication state and user context

### Docker Environment Override
When running in Docker, environment variables are injected at container startup and override any build-time values, enabling the same image to run in different environments.

### Testing Setup Requirements
Unit tests require `src/test/setup.ts` which provides Jest DOM matchers and mocks the global `window._env_` object with test values.

## Key Dependencies and Versions

### Core Dependencies
- **React**: v19.1.1 with new JSX transform
- **TypeScript**: v5.8.3 with strict mode
- **Vite**: v7.1.2 for build tooling and dev server
- **React Router**: v7.8.2 for client-side routing
- **Zustand**: v5.0.8 for state management
- **TanStack Query**: v5.85.5 for server state management

### Development Tools
- **Vitest**: v3.2.4 for unit testing with jsdom
- **Playwright**: v1.55.0 for end-to-end testing
- **Storybook**: v9.1.3 for component development
- **ESLint**: v9.34.0 with TypeScript and React rules

## File Structure Overview

```
src/
├── api/                 # API layer (TanStack Query)
│   └── auth.ts         # Complete authentication API (login, register, reset, verify)
├── assets/             # Static assets (logos, images)
├── components/         # Reusable UI components
│   ├── Button/        # Button component with stories/tests
│   ├── ThemeToggle/   # Theme switching component
│   ├── GlobalLoader/  # Global loading overlay
│   ├── GlobalNotification/ # Global notification system
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
│   ├── useLoader.ts   # Global loader state management
│   └── useNotification.ts # Global notification system
├── pages/             # Route-level components
│   ├── Dashboard/     # Protected dashboard page
│   ├── Login/         # OAuth login page
│   ├── Register/      # User registration page
│   ├── ForgotPassword/ # Password reset request page
│   ├── ResetPasswordConfirm/ # Password reset confirmation page
│   ├── VerifyEmail/   # Email verification page
│   └── UserManagement/ # User management interface
├── stores/            # Zustand state stores
│   ├── authStore.ts   # Authentication state
│   └── themeStore.ts  # Theme state
├── styles/            # Global styles and theme definitions
├── test/              # Test setup and utilities
├── utils/             # Utility functions
│   ├── env.ts         # Environment variable handling
│   └── constants.ts   # Application constants and messages
└── App.tsx            # Main application component
```

## Important Notes

### Server Management
Always stop the development server (`npm run dev`) before making configuration changes to avoid cached issues.

### Theme Colors
- **Primary**: #1B5FA3 (Buildly blue)
- **Secondary**: #F9943B (Buildly orange)
- **System Default**: Follows OS preference with automatic switching

### Authentication Flow
**Login Flow**:
1. User visits `/` → checks authentication status
2. If authenticated → redirects to `/app` (Dashboard)
3. If not authenticated → redirects to `/login`
4. After successful login → automatic redirect to `/app`
5. Logout → clears state and redirects to `/login`

**Registration Flow**:
1. User visits `/register` → fills registration form
2. After successful registration → shows success notification and redirects to `/login`
3. User receives verification email → clicks link to `/verify-email?token=...`
4. Email verification → automatic redirect to `/login` with success/error notification

**Password Reset Flow**:
1. User visits `/forgot-password` → enters email
2. After request → shows confirmation and redirects to `/login`
3. User receives reset email → clicks link to `/reset-password-confirm/:uid/:token`
4. Password reset → automatic redirect to `/login` with success notification

**Protected Route Access**:
- All `/app/*` routes require authentication
- Unauthenticated users automatically redirected to `/login`
- Authenticated users cannot access auth pages (redirected to `/app`)

### Docker Deployment
The application uses multi-stage Docker builds with runtime environment injection, allowing the same image to be deployed across different environments without rebuilding.

## Current Implementation Status

### ✅ Completed Features

#### **Authentication System (Complete)**:
- **OAuth Login** with username/password authentication
- **User Registration** with email verification requirement
- **Password Reset** via secure email links
- **Email Verification** from registration emails
- **Session Management** with persistent login state
- **Protected Routes** with automatic redirects
- **Form Validation** and error handling

#### **Global UI System (Complete)**:
- **Global Loader** with contextual messages
- **Global Notifications** with multiple types and persistence
- **Theme System** with light/dark/system modes
- **Responsive Design** across all components

#### **State Management (Complete)**:
- **Authentication State** via Zustand with localStorage
- **Theme State** via Zustand with localStorage
- **Loader State** via Zustand for global loading
- **Notification State** via Zustand for global notifications

#### **API Layer (Complete)**:
- **TanStack Query integration** for all authentication operations
- **Error handling** with user-friendly messages
- **Loading states** integrated with global loader
- **Promise-based mutations** for reliable state management

## Current Application Architecture

### User Interface Components

#### TopBar Component
- **Location**: `src/components/TopBar/TopBar.tsx`
- **Features**: 
  - Gradient background matching login page design (`linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`)
  - Theme-aware logo switching (light logo for dark theme, dark logo for light theme)
  - Sticky positioning for persistent navigation
  - Responsive design with mobile breakpoints
- **Contains**: ThemeToggle and UserMenu components

#### ThemeToggle Component  
- **Location**: `src/components/ThemeToggle/ThemeToggle.tsx`
- **Features**: 
  - Pill-shaped container with three theme options
  - Icon-only design with hover tooltips
  - Smooth animations and transitions
  - Visual feedback with active state highlighting
- **Theme Options**: Light, Dark, System (follows OS preference)

#### UserMenu Component
- **Location**: `src/components/UserMenu/UserMenu.tsx`
- **Features**: 
  - Circular profile icon trigger
  - Dropdown menu with glass morphism effects
  - User profile information display
  - Two menu options: User Management and Logout
  - Click-outside and escape key handling

#### Authentication Pages
- **Login**: `/login` - OAuth authentication with gradient background
- **Register**: `/register` - User registration with grouped form fields (first/last name, username/email, password/confirm password on same lines)
- **Forgot Password**: `/forgot-password` - Password reset interface

#### Protected Pages
- **Dashboard**: `/app` - Default authenticated landing page
- **User Management**: `/app/user-management` - Clean interface ready for user management features (all previous cards/sections removed)

### Recent Changes and Current State

#### TopBar Styling
- Uses gradient background matching login page design
- All text and icons use theme-appropriate colors (standard CSS custom properties)
- Removed custom glass morphism effects in favor of standard theme system

#### User Management Page
- **Cleaned State**: All user cards, roles/permissions, activity logs, security settings, and current user information sections have been removed
- **Current State**: Clean layout with header and empty content area ready for new functionality
- **Purpose**: Provides a clean slate for implementing specific user management features

#### Theme System Integration
- All components use CSS custom properties for consistent theming
- Automatic light/dark theme support through media queries
- Theme toggle provides visual feedback and smooth transitions

### Code Quality and Documentation

#### Comments and Documentation
- **Added comprehensive comments** to key components for better understanding:
  - `App.tsx`: Main application setup and routing
  - `TopBar.tsx`: Navigation component features and structure
  - `ThemeToggle.tsx`: Theme switching functionality and UI patterns
  - `UserManagement.tsx`: Current clean state and future-ready structure

#### File Structure Standards
- Components follow co-location pattern with `.tsx`, `.css`, `.test.tsx`, and `.stories.tsx` files
- Clear separation between pages, components, stores, and utilities
- Consistent import organization and commenting

### Important Implementation Notes

#### TopBar Background
- **Current**: Uses login page gradient (`linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`)
- **Colors**: Buildly blue (#1B5FA3) to Buildly orange (#F9943B)
- **Theme Integration**: Works with standard CSS custom property theme system

#### User Management Interface
- **Current State**: Minimal interface with just header
- **Ready for**: Implementation of specific user management functionality
- **Architecture**: Clean separation allows for easy feature addition without technical debt

#### Component Patterns
- All UI components use standard CSS custom properties for theming
- Hover states and animations follow consistent patterns
- Responsive design implemented across all components
- Accessibility considerations with proper ARIA labels and keyboard navigation