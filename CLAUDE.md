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
OAuth-based authentication with persistent login state:

- **OAuth Flow**: Multipart/form-data POST to token endpoint with client credentials
- **State Management**: Zustand store (`src/stores/authStore.ts`) with localStorage persistence
- **Token Management**: Automatic expiration handling and cleanup
- **Protected Routes**: React Router integration with automatic redirects
- **API Integration**: TanStack Query for authentication mutations

### Theme System
Comprehensive theme system with light/dark/system modes:

- **Theme Modes**: Light, Dark, and System (follows OS preference)
- **State Management**: Zustand store (`src/stores/themeStore.ts`) with localStorage persistence
- **CSS Custom Properties**: Dynamic theme switching via CSS variables
- **System Integration**: Automatic detection and response to OS theme changes
- **Default Mode**: System preference with automatic switching

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
- **Login Route (`/login`)**: OAuth login form for unauthenticated users
- **Protected Route (`/app`)**: Dashboard and authenticated application content
- **Automatic Redirects**: Based on authentication state

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
│   └── auth.ts         # Authentication API calls
├── assets/             # Static assets (logos, images)
├── components/         # Reusable UI components
│   ├── Button/        # Button component with stories/tests
│   ├── ThemeToggle/   # Theme switching component
│   └── ui/            # Base UI components
├── pages/             # Route-level components
│   ├── Dashboard/     # Protected dashboard page
│   └── Login/         # Authentication page
├── stores/            # Zustand state stores
│   ├── authStore.ts   # Authentication state
│   └── themeStore.ts  # Theme state
├── styles/            # Global styles and theme definitions
├── test/              # Test setup and utilities
├── utils/             # Utility functions
│   └── env.ts         # Environment variable handling
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
1. User visits `/` → checks authentication status
2. If authenticated → redirects to `/app` (Dashboard)
3. If not authenticated → redirects to `/login`
4. After login → automatic redirect to `/app`
5. Logout → clears state and redirects to `/login`

### Docker Deployment
The application uses multi-stage Docker builds with runtime environment injection, allowing the same image to be deployed across different environments without rebuilding.

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