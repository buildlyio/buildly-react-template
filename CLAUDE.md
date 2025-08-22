# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Buildly React Template is a React frontend application that connects to Buildly Core. It implements authentication, user management, and provides a foundation for building data management interfaces using Material-UI components. The application includes automatic version checking with forced refresh capabilities.

## Development Commands

### Setup and Installation
```bash
yarn install                    # Install dependencies
```

### Development
```bash
yarn run start:local          # Start dev server for local development (port 3000)
yarn run https:local          # Start HTTPS dev server for local development  
yarn run start:dev            # Start dev server pointing to dev API
yarn run start:prod           # Start dev server pointing to prod API
```

### Building
```bash
yarn run build                # Build for development
yarn run build:dev            # Build for dev environment
yarn run build:prod           # Build for production
```

### Testing and Quality
```bash
yarn run test                 # Run Jest tests in watch mode
yarn run test:prod           # Run Jest tests once
yarn run test-coverage       # Run tests with coverage report
yarn run lint                # Run ESLint on src/**/*.js files
```

### Deployment
```bash
yarn run serve               # Serve built files from dist/ directory
```

## Architecture

### Technology Stack
- **React 18** with hooks and functional components
- **Material-UI v6** for UI components and theming
- **React Router v6** for client-side routing
- **TanStack Query v5** (formerly React Query) for server state management
- **Zustand v4** for client state management
- **i18next** for internationalization
- **Webpack 5** for bundling
- **Jest + React Testing Library** for testing

### Key Architectural Patterns

**State Management:**
- Zustand stores in `src/zustand/` for global client state (alerts, etc.)
- TanStack Query v5 in `src/react-query/` for server state management
- React Context for user authentication state

**Authentication Flow:**
- OAuth2 Bearer token flow implemented in `src/modules/oauth/`
- Token storage in localStorage with expiration checking
- Private routes protected by `PrivateRoute` component
- Authentication state managed via `oauthService`

**API Communication:**
- Centralized HTTP service in `src/modules/http/http.service.js`
- Automatic Bearer token injection for authenticated requests
- TanStack Query for caching and synchronization
- All API queries use new v5 syntax: `useQuery({ queryKey: [...], queryFn: ... })`

**Routing Structure:**
- Public routes: login, register, password reset, verification
- Private routes: dashboard, user management (admin/global admin only)
- Route protection based on token validity and user permissions
- React Router v6 with nested routing structure using wildcards (`/*`) for UserManagement

**Version Management:**
- Automatic version checking system that polls `/version.json` every 30 seconds
- Forces browser refresh when new versions are deployed
- Version info generated during webpack build process

### Directory Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React contexts (App, User)
├── hooks/              # Custom React hooks
├── layout/             # Layout components (TopBar, Container)
├── modules/            # Business logic modules (http, oauth)
├── pages/              # Route-level page components
├── react-query/        # API queries and mutations
├── routes/             # Route definitions and guards
├── styles/             # Theme and styling
├── utils/              # Utility functions
└── zustand/            # Global state stores
```

### Environment Configuration

The app requires environment configuration via `.env.development.local` file:
```javascript
window.env = {
    API_URL: "https://dev.example.com/",
    OAUTH_TOKEN_URL: "https://dev.example.com/oauth/token/",
    OAUTH_CLIENT_ID: "your-client-id",
    PRODUCTION: "false"
}
```

### Webpack Aliases

The following path aliases are configured for cleaner imports:
- `@assets` → `./src/assets`
- `@components` → `./src/components`
- `@context` → `./src/context`
- `@hooks` → `./src/hooks`
- `@layout` → `./src/layout`
- `@modules` → `./src/modules`
- `@pages` → `./src/pages`
- `@react-query` → `./src/react-query`
- `@routes` → `./src/routes`
- `@styles` → `./src/styles`
- `@utils` → `./src/utils`
- `@zustand` → `./src/zustand`

## Development Guidelines

### Adding New Features
1. Use functional components with hooks
2. Follow the established directory structure
3. Implement server state with TanStack Query v5
4. Use Zustand for global client state
5. Add proper TypeScript types where applicable
6. Follow Material-UI v6 theming patterns

### React Query Migration (TanStack Query v5)
- **CRITICAL**: All useQuery calls must use object syntax: `useQuery({ queryKey: [...], queryFn: ... })`
- **CRITICAL**: All useMutation calls must use object syntax: `useMutation({ mutationFn: ... })`
- Old v3 array syntax will cause "Bad argument type" errors
- When adding new queries/mutations, always use the v5 syntax

### Permission System
- User management routes are protected by `hasAdminRights()` or `hasGlobalAdminRights()`
- Admin rights: `!group.is_global && group.is_org_level` with full permissions
- Global admin rights: `group.is_global` with full permissions
- Always check user permissions before rendering admin-only components

### Styling and Layout
- DataTableWrapper component supports full-width tables via CSS overrides
- UserManagement component uses viewport-width styling to break out of container constraints
- TopBar logo uses `object-fit: contain` to prevent compression
- Material-UI v6 uses `sx` prop for inline styling

### Testing
- Tests should be placed alongside components
- Use Jest and React Testing Library for component testing
- Run `yarn run test-coverage` before submitting changes
- Enzyme has been replaced with React Testing Library

### API Integration
- Use `httpService.makeRequest()` for authenticated API calls
- Organize queries in `src/react-query/queries/`
- Organize mutations in `src/react-query/mutations/`
- Handle errors gracefully with user-friendly alerts
- Bearer tokens are automatically injected (JWT support removed)