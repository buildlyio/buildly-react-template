# Buildly React Template

A modern React web application template built with the latest technologies and best practices. This production-ready template features OAuth authentication, comprehensive theme system, user management interface, and Docker support with flexible environment variable handling.

## 🚀 Features

### Core Technologies
- **React 19** with TypeScript and modern JSX transform
- **Vite** for lightning-fast development and optimized builds
- **TanStack Query v5** for server state management and caching
- **React Router v6** for client-side routing
- **Zustand** for lightweight global state management

### Authentication & Security
- **OAuth 2.0** authentication flow with token management
- **Protected routes** with automatic redirects
- **Persistent login state** with automatic token cleanup
- **Secure form handling** with multipart/form-data support

### Theme System
- **Light/Dark/System themes** with automatic OS preference detection
- **CSS custom properties** for dynamic theme switching
- **Persistent theme preferences** with localStorage
- **Responsive design** across all screen sizes

### Development Tools
- **ESLint** with TypeScript and React rules
- **Storybook** for component development and documentation  
- **Vitest** for unit testing with React Testing Library
- **Playwright** for end-to-end testing
- **Docker** support with multi-stage builds and runtime environment injection
- **Hot Module Replacement (HMR)** for fast development

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerization)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd react-app-template
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy base development environment
   cp .env.example .env.development
   
   # Optionally create local overrides (not committed to git)
   # Edit .env.development.local with your local values if needed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run unit tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with UI

### Storybook
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

### Docker
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

## 🌍 Environment Variables

The application supports environment variables through multiple methods with automatic loading priority:

### Local Development (.env files)
Vite automatically loads environment files in this priority order:
1. `.env.development.local` - Local overrides (not committed to git)
2. `.env.development` - Development environment defaults
3. `.env.local` - Local overrides for all environments (not committed)
4. `.env` - Global defaults

**Base development config (`.env.development`):**
```env
VITE_API_URL=http://dev-api.example.com/
VITE_APP_NAME=React App
VITE_ENV=development
VITE_VERSION=1.0.0
VITE_OAUTH_TOKEN_URL=http://dev-api.example.com/token/
VITE_OAUTH_CLIENT_ID=your-client-id
```

**Local overrides (`.env.development.local`) - Optional:**
```env
# Create this file locally if you need to override any values
# This file is not committed to git
VITE_API_URL=http://localhost:8000/api
VITE_OAUTH_TOKEN_URL=http://localhost:8000/oauth/token/
VITE_OAUTH_CLIENT_ID=your-local-client-id
VITE_APP_NAME=My Local React App
```

### Docker Runtime (Injected via environment)
When running in Docker, environment variables are injected at runtime using VITE_ prefix:
```bash
docker run -e VITE_API_URL=https://api.example.com \
           -e VITE_APP_NAME="Production App" \
           -e VITE_OAUTH_TOKEN_URL=https://api.example.com/oauth/token/ \
           -e VITE_OAUTH_CLIENT_ID=prod-client-id \
           -p 80:80 react-app
```

The environment utility (`src/utils/env.ts`) automatically handles both scenarios.

## 🐳 Docker Usage

### Build and run with Docker:

```bash
# Build the image
docker build -t react-app .

# Run with default environment
docker run -p 80:80 react-app

# Run with custom environment variables
docker run -p 80:80 \
  -e VITE_API_URL=https://api.example.com \
  -e VITE_APP_NAME="My Production App" \
  -e VITE_ENV=production \
  -e VITE_OAUTH_CLIENT_ID=your-prod-client-id \
  react-app
```

### Docker Compose example:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.example.com
      - VITE_APP_NAME=Production App
      - VITE_ENV=production
      - VITE_VERSION=1.0.0
      - VITE_OAUTH_TOKEN_URL=https://api.example.com/oauth/token/
      - VITE_OAUTH_CLIENT_ID=your-production-client-id
```

## 📁 Project Structure

```
├── src/
│   ├── api/                 # API layer with TanStack Query
│   │   └── auth.ts          # Authentication API calls
│   ├── assets/              # Static assets (logos, images)
│   │   ├── light-logo.png   # Logo for light theme
│   │   └── dark-logo.png    # Logo for dark theme
│   ├── components/          # Reusable UI components
│   │   ├── Button/          # Button component with tests & stories
│   │   ├── TopBar/          # Navigation bar with gradient background
│   │   ├── ThemeToggle/     # Theme switcher component
│   │   ├── UserMenu/        # User dropdown menu
│   │   ├── ProtectedRoute/  # Route protection wrapper
│   │   └── ui/              # Base UI components
│   ├── pages/               # Route-level page components
│   │   ├── Login/           # OAuth login page
│   │   ├── Register/        # User registration page
│   │   ├── ForgotPassword/  # Password reset page
│   │   ├── Dashboard/       # Protected dashboard
│   │   └── UserManagement/  # User management interface
│   ├── stores/              # Zustand state stores
│   │   ├── authStore.ts     # Authentication state management
│   │   └── themeStore.ts    # Theme state management
│   ├── styles/              # Global styles and theme definitions
│   │   ├── theme.css        # CSS custom properties for themes
│   │   └── auth-pages.css   # Shared authentication page styles
│   ├── test/                # Test setup and utilities
│   ├── utils/               # Utility functions
│   │   └── env.ts           # Environment variable handling
│   └── App.tsx              # Main app component with routing
├── e2e/                     # End-to-end tests
├── .storybook/              # Storybook configuration
├── public/                  # Static assets
├── Dockerfile               # Docker configuration
├── docker-entrypoint.sh     # Docker environment injection script
├── nginx.conf               # Nginx configuration for Docker
├── playwright.config.ts     # E2E test configuration
├── CLAUDE.md                # Claude Code assistant instructions
└── vite.config.ts           # Vite configuration with dual test setup
```

## 🔐 Authentication & Routing

### Authentication Flow
The application implements OAuth 2.0 authentication with persistent state management:

1. **Unauthenticated users** are redirected to `/login`
2. **Login form** submits credentials to OAuth token endpoint
3. **Successful authentication** stores tokens and redirects to `/app`
4. **Protected routes** automatically check authentication status
5. **Token expiration** triggers automatic cleanup and re-authentication

### Route Architecture
```
/ (root)               → RootRedirect (checks auth status)
├── /login             → Login page (public)
├── /register          → Registration page (public)
├── /forgot-password   → Password reset page (public)
└── /app/*             → Protected routes (requires authentication)
    ├── /app           → Dashboard (default protected page)
    └── /app/user-management → User management interface
```

### Theme System
The theme system provides three modes with automatic persistence:
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Dark, high-contrast interface
- **System Theme**: Automatically follows OS preference

Theme state is managed globally and persists across sessions using localStorage.

## 🧪 Testing

### Unit Tests
Unit tests use Vitest with React Testing Library:
```bash
npm run test                 # Run in watch mode
npm run test:coverage        # Run with coverage
```

### Component Stories
Storybook provides isolated component development and testing:
```bash
npm run storybook           # Start Storybook
```

### End-to-End Tests
Playwright provides full browser testing:
```bash
npm run test:e2e            # Run E2E tests
npm run test:e2e:ui         # Run with Playwright UI
```

## 🔧 Configuration

### TypeScript
- Strict type checking enabled
- Modern ES2022 target
- React JSX transform
- Path aliases support (can be configured in `tsconfig.json`)

### ESLint
- TypeScript and React rules
- Automatic formatting
- Storybook integration
- Modern ES2022 syntax support

### Vite
- Fast HMR for development
- Optimized production builds
- Automatic code splitting
- Environment variable handling

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, etc.)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Configure environment variables in your hosting platform

### Docker Deployment
1. Build image: `docker build -t react-app .`
2. Run with environment variables: `docker run -p 80:80 -e VITE_API_URL=... react-app`
3. Deploy to your container platform (AWS ECS, Google Cloud Run, etc.)

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vite.dev/)
- [Storybook Documentation](https://storybook.js.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run linting and tests: `npm run lint && npm run test`
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
