# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern React 19 template built with TypeScript, Vite, and comprehensive tooling. This is a production-ready template featuring dual environment variable support for both local development and Docker containerization, with integrated testing, linting, and component development workflows.

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

All environment variables must be prefixed with `REACT_APP_` and defined in the `EnvConfig` interface in `src/utils/env.ts`.

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
env.API_URL           // REACT_APP_API_URL
env.APP_NAME          // REACT_APP_APP_NAME
env.OAUTH_TOKEN_URL   // REACT_APP_OAUTH_TOKEN_URL
env.OAUTH_CLIENT_ID   // REACT_APP_OAUTH_CLIENT_ID
env.IS_DEVELOPMENT    // boolean derived from REACT_APP_ENV
```

### Docker Environment Override
When running in Docker, environment variables are injected at container startup and override any build-time values, enabling the same image to run in different environments.

### Testing Setup Requirements
Unit tests require `src/test/setup.ts` which provides Jest DOM matchers and mocks the global `window._env_` object with test values.