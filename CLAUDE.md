# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 🚨 MANDATORY CODING STANDARDS AND WORKFLOW

## CRITICAL: Read CODING_STYLE.md First
Before making ANY changes to this codebase, you MUST:
1. **Read and understand** `CODING_STYLE.md` completely
2. **Follow ALL patterns and conventions** documented in that file
3. **Complete the pre-commit checklist** before finishing any task

## 🔄 MANDATORY DEVELOPMENT WORKFLOW

### For EVERY code change, you MUST:

1. **Plan Implementation**
   - Follow established patterns in `CODING_STYLE.md`
   - Use existing component structures and TypeScript conventions
   - Maintain consistency with state management and API patterns

2. **Write Clean Code**
   - No console.log or console.error statements
   - Proper TypeScript typing for all code
   - JSDoc documentation for components
   - Follow naming conventions exactly

3. **Test Functionality**
   - Ensure all features work correctly
   - Verify error handling and user feedback
   - Check loading states and notifications

4. **Update Documentation (MANDATORY)**
   - Update `README.md` if adding new features/components
   - Update `CLAUDE.md` with implementation details  
   - Keep documentation accurate and current
   - Update `CODING_STYLE.md` if introducing new patterns

5. **Pre-Commit Checklist**
   - Code follows all established patterns
   - No debug statements or console logs
   - All TypeScript errors resolved
   - Documentation is updated
   - Code is production-ready

**FAILURE TO FOLLOW THIS WORKFLOW IS UNACCEPTABLE**

---

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
**Comprehensive Testing Setup** with 430+ test scenarios covering all possible use cases:
- **Unit Tests**: Vitest project targeting `src/**/*.test.{ts,tsx}` with jsdom environment
- **Component Tests**: React Testing Library with full user interaction simulation
- **Integration Tests**: Complete user flow testing from authentication to user management
- **API Tests**: Comprehensive mocking and testing of all API endpoints with error scenarios
- **Store Tests**: Zustand state management with persistence, cleanup, and synchronization testing
- **Hook Tests**: Custom hooks testing with complex usage scenarios and edge cases
- **Utility Tests**: Environment configuration, user roles, and constants validation
- **Storybook Tests**: Separate Vitest project using Playwright browser for component story testing
- **E2E Tests**: Playwright targeting `e2e/` directory with automatic dev server startup

#### Comprehensive Test Coverage (430+ scenarios)
**API Layer Tests**: 99 test scenarios
- Authentication API (47 tests): Login, registration, password reset, email verification, error handling
- User Management API (52 tests): CRUD operations, role management, invitations, sequential API calls

**State Management Tests**: 80 test scenarios
- Auth Store (36 tests): Token management, expiration, cleanup, persistence
- Theme Store (44 tests): Light/dark/system modes, DOM integration, event handling

**Component Tests**: 73 test scenarios
- Theme Toggle (31 tests): Rendering, interactions, accessibility, store integration
- User Menu (42 tests): Menu behavior, user management access, logout flow, keyboard navigation

**Utility Function Tests**: 87 test scenarios
- Environment Config (28 tests): Docker runtime, Vite build-time, fallbacks, edge cases
- User Roles (29 tests): Role detection, permissions, access control logic
- Constants (30 tests): Immutability, consistency, message validation

**Custom Hook Tests**: 73 test scenarios
- Loader Hook (32 tests): State management, function behavior, complex usage scenarios
- Notification Hook (41 tests): Auto-removal, manual removal, state persistence, edge cases

**Integration Tests**: 19 comprehensive scenarios
- Complete authentication flows (login, logout, registration, password reset)
- Theme system integration with DOM manipulation
- Global UI system (loader, notifications) integration
- Navigation and route protection
- User management access control
- Error handling and recovery
- State persistence across sessions
- Performance and accessibility testing

#### Test Implementation Features
- **Production-Ready**: All tests follow established coding standards and patterns
- **Comprehensive Mocking**: API calls, timers, DOM methods, localStorage, external dependencies
- **Real-world Scenarios**: Tests mirror actual user interactions and business logic
- **Error Boundary Testing**: Graceful failure handling and recovery patterns
- **Security Testing**: Permission-based access control and role validation
- **Performance Testing**: Rapid interactions, concurrent operations, memory management
- **Accessibility Testing**: Screen reader support, keyboard navigation, ARIA compliance
- **Cross-browser Compatibility**: Tests work across different environments and configurations

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
│   ├── auth.ts         # Complete authentication API (login, register, reset, verify)
│   └── users.ts        # User management API (CRUD, invites, roles, organizations)
├── assets/             # Static assets (logos, images)
├── components/         # Reusable UI components
│   ├── Button/        # Button component with stories/tests
│   ├── TopBar/        # Navigation with gradient background and user menu
│   ├── ThemeToggle/   # Theme switching component
│   ├── UserMenu/      # User dropdown menu with profile and logout
│   ├── GlobalLoader/  # Global loading overlay
│   ├── GlobalNotification/ # Global notification system
│   ├── UserManagement/ # User management components
│   │   ├── UsersTab.tsx # Users table with editing capabilities
│   │   └── UserRolesTab.tsx # User roles table (read-only, no edit/delete)
│   ├── EditUserModal/ # User editing modal with organization and role assignment
│   ├── InviteUsersModal/ # Multi-user invitation modal
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
│   └── UserManagement/ # Complete user management system with tabbed interface
├── stores/            # Zustand state stores
│   ├── authStore.ts   # Authentication state
│   └── themeStore.ts  # Theme state
├── styles/            # Global styles and theme definitions
├── test/              # Test setup and utilities
├── utils/             # Utility functions
│   ├── env.ts         # Environment variable handling
│   ├── constants.ts   # Application constants and messages
│   └── userRoles.ts   # User role utilities and helpers
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

#### **User Management System (Complete)**:
- **Complete CRUD Operations** for user management
- **Tabbed Interface** with Users and User Roles tabs
- **User Invitations** with bulk email invite functionality
- **User Editing** with modal interface for status, organization, and role changes
- **Conditional API Updates** with sequential organization and user field updates
- **Role-based Permissions** display with read-only user roles table
- **Real-time Data Refresh** after all operations
- **Advanced Filtering** by status, organization, and role
- **Clean Console** - removed all debug logging for production readiness

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
- **TanStack Query integration** for all authentication and user management operations
- **Error handling** with user-friendly messages
- **Loading states** integrated with global loader
- **Promise-based mutations** for reliable state management
- **Intelligent API routing** based on data changes (organization vs user field updates)

## User Management API Implementation

### Conditional API Update System
The user update functionality implements intelligent API routing based on the fields being modified:

#### **API Endpoints**:
- **Organization Updates**: `PATCH /coreuser/update_org/{userId}/` - Handles organization_name changes
- **User Field Updates**: `PATCH /coreuser/{userId}/` - Handles is_active and core_groups changes

#### **Update Logic Flow**:
```typescript
// Sequential API calls based on data changes
1. If organization_name is being updated:
   → Call updateUserOrganization() first
   → If this fails, stop and show error notification
   
2. If is_active or core_groups are being updated:
   → Call updateUserFields() second
   → Return result from this call as the final user object

3. If only organization was updated:
   → Fetch updated user data via GET /coreuser/{userId}/
```

#### **UserUpdateData Interface**:
```typescript
interface UserUpdateData {
  is_active?: boolean
  organization_name?: string  
  core_groups?: number[]
}
```

#### **Error Handling**:
- **Sequential Processing**: Organization update must succeed before user fields update
- **Fail-Fast Approach**: If first API call fails, operation stops immediately
- **User Notifications**: Clear error messages displayed via global notification system
- **No Console Logging**: All debug console statements removed for production readiness

### Data Management
- **TanStack Query Integration**: Efficient caching and automatic refetching
- **Real-time Updates**: Data automatically refreshes after successful operations
- **Optimistic Updates**: UI updates immediately with rollback on API failure
- **Type Safety**: Full TypeScript interfaces for all API data structures

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

#### User Management System (Complete Implementation)
- **Full-Featured Interface**: Complete user management with tabbed navigation
- **Users Tab**: 
  - User table with comprehensive user information display
  - Edit functionality via modal interface
  - User filtering and search capabilities
  - User invitation system with bulk email support
- **User Roles Tab**:
  - Read-only permissions matrix showing CRUD permissions per role
  - Organization-specific and global roles display
  - Clean table layout without edit/delete functionality (removed per requirements)
- **Modal System**:
  - EditUserModal for user status, organization, and role management
  - InviteUsersModal for sending bulk email invitations
- **API Integration**: 
  - Conditional API calls based on data changes (organization vs user fields)
  - Sequential processing for organization updates followed by user field updates
  - Comprehensive error handling with user notifications

#### Component Patterns
- All UI components use standard CSS custom properties for theming
- Hover states and animations follow consistent patterns
- Responsive design implemented across all components
- Accessibility considerations with proper ARIA labels and keyboard navigation

## 🧪 Comprehensive Test Implementation

### Test Files Created (430+ Test Scenarios)

The codebase now includes comprehensive test coverage with the following test files:

#### API Layer Tests
- **`src/api/auth.test.ts`** - Authentication API testing (47 scenarios)
  - Login flow with token and user data retrieval
  - Registration with email verification requirement
  - Password reset request and confirmation
  - Email verification from registration emails
  - Error handling for all authentication scenarios
  - Network error and edge case testing

- **`src/api/users.test.ts`** - User Management API testing (52 scenarios)
  - Users, core groups, and organizations queries
  - User invitation system with bulk email support
  - Complex user update logic with conditional API calls
  - Sequential API processing (organization updates → user field updates)
  - Comprehensive error handling and edge cases
  - Query caching and stale time validation

#### State Management Tests
- **`src/stores/authStore.test.ts`** - Authentication state testing (36 scenarios)
  - Token management with expiration handling
  - User data persistence and cleanup
  - Authentication state synchronization
  - localStorage integration and rehydration
  - Token expiration cleanup and validation
  - Edge cases and error scenarios

- **`src/stores/themeStore.test.ts`** - Theme system testing (44 scenarios)
  - Light/dark/system theme modes
  - OS preference detection and integration
  - DOM manipulation and CSS class application
  - Event listener management and cleanup
  - Theme persistence across sessions
  - System theme change responsiveness

#### Component Tests
- **`src/components/ThemeToggle/ThemeToggle.test.tsx`** - Theme toggle testing (31 scenarios)
  - Theme selection UI interactions
  - Active state management and visual feedback
  - Accessibility and keyboard navigation
  - Store integration and state synchronization
  - Rapid interaction handling
  - Edge cases and error scenarios

- **`src/components/UserMenu/UserMenu.test.tsx`** - User menu testing (42 scenarios)
  - Menu open/close behavior with click-outside handling
  - User information display and formatting
  - Logout functionality with navigation
  - User management access control
  - Keyboard navigation and escape key handling
  - Event listener cleanup and memory management

#### Utility Function Tests
- **`src/utils/env.test.ts`** - Environment configuration testing (28 scenarios)
  - Docker runtime vs Vite build-time variable handling
  - Fallback hierarchy and default values
  - SSR compatibility and edge cases
  - Environment variable validation
  - Type safety and configuration consistency
  - Real-world deployment scenarios

- **`src/utils/userRoles.test.ts`** - User roles and permissions testing (29 scenarios)
  - Role detection logic (global admin, admin, user)
  - Permission-based access control
  - User management access validation
  - Complex user group scenarios
  - Edge cases and malformed data handling
  - Integration with authentication system

- **`src/utils/constants.test.ts`** - Application constants testing (30 scenarios)
  - Constants structure and type validation
  - Message consistency and formatting
  - Immutability and configuration integrity
  - Cross-constant consistency validation
  - User-friendly message validation
  - Naming convention compliance

#### Custom Hook Tests
- **`src/hooks/useLoader.test.ts`** - Global loader hook testing (32 scenarios)
  - Loading state management and message handling
  - State persistence across hook instances
  - Function identity and performance optimization
  - Complex usage scenarios and edge cases
  - Store integration and cleanup
  - Rapid interaction handling

- **`src/hooks/useNotification.test.ts`** - Notification system testing (41 scenarios)
  - Notification creation with auto-removal timers
  - Manual removal and state management
  - Persistent vs temporary notification handling
  - Multiple notification types (success, error, warning, info)
  - State synchronization across hook instances
  - Message validation and edge case handling

#### Integration Tests
- **`src/test/integration.test.tsx`** - Complete user flow testing (19 scenarios)
  - Full authentication flows (login, logout, registration, password reset)
  - Theme system integration with DOM manipulation
  - Global UI system integration (loader + notifications)
  - Navigation and route protection validation
  - User management access control integration
  - Error handling and recovery patterns
  - State persistence across sessions
  - Performance and accessibility validation

### Test Implementation Standards

All tests follow the established coding standards and include:
- **Comprehensive Mocking**: API calls, timers, DOM methods, localStorage
- **TypeScript Integration**: Full type safety with proper interfaces
- **Error Boundary Testing**: Graceful failure handling patterns
- **Real-world Scenarios**: Tests mirror actual user interactions
- **Performance Testing**: Rapid interactions and concurrent operations
- **Security Validation**: Permission-based access and role verification
- **Accessibility Testing**: Keyboard navigation and screen reader support
- **Cross-environment Compatibility**: Works across development and production setups

### Running Specific Test Suites

```bash
# API Layer Tests
npm run test src/api/auth.test.ts
npm run test src/api/users.test.ts

# State Management Tests  
npm run test src/stores/authStore.test.ts
npm run test src/stores/themeStore.test.ts

# Component Tests
npm run test src/components/ThemeToggle/ThemeToggle.test.tsx
npm run test src/components/UserMenu/UserMenu.test.tsx

# Utility Tests
npm run test src/utils/env.test.ts
npm run test src/utils/userRoles.test.ts
npm run test src/utils/constants.test.ts

# Hook Tests
npm run test src/hooks/useLoader.test.ts
npm run test src/hooks/useNotification.test.ts

# Integration Tests
npm run test src/test/integration.test.tsx

# Run all tests
npm run test
```

This comprehensive test suite ensures production-ready code quality, covers all possible user scenarios, and provides confidence for ongoing development and maintenance.