# React TypeScript App Template

A modern React web application template built with the latest technologies and best practices. This template includes TypeScript, Vite, ESLint, Storybook, end-to-end testing, and Docker support with flexible environment variable handling.

## 🚀 Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **ESLint** with TypeScript and React rules
- **Storybook** for component development and documentation
- **Vitest** for unit testing with React Testing Library
- **Playwright** for end-to-end testing
- **Docker** support with multi-stage builds
- **Environment variable handling** for both Docker and local development
- **Modern CSS** with responsive design
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
REACT_APP_API_URL=http://dev-api.example.com/
REACT_APP_APP_NAME=React App
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
REACT_APP_OAUTH_TOKEN_URL=http://dev-api.example.com/token/
REACT_APP_OAUTH_CLIENT_ID=your-client-id
```

**Local overrides (`.env.development.local`) - Optional:**
```env
# Create this file locally if you need to override any values
# This file is not committed to git
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_OAUTH_TOKEN_URL=http://localhost:8000/oauth/token/
REACT_APP_OAUTH_CLIENT_ID=your-local-client-id
REACT_APP_APP_NAME=My Local React App
```

### Docker Runtime (Injected via environment)
When running in Docker, environment variables are injected at runtime:
```bash
docker run -e REACT_APP_API_URL=https://api.example.com \
           -e REACT_APP_APP_NAME="Production App" \
           -e REACT_APP_OAUTH_TOKEN_URL=https://api.example.com/oauth/token/ \
           -e REACT_APP_OAUTH_CLIENT_ID=prod-client-id \
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
  -e REACT_APP_API_URL=https://api.example.com \
  -e REACT_APP_APP_NAME="My Production App" \
  -e REACT_APP_ENV=production \
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
      - REACT_APP_API_URL=https://api.example.com
      - REACT_APP_APP_NAME=Production App
      - REACT_APP_ENV=production
      - REACT_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Button/          # Example component with tests & stories
│   ├── test/                # Test setup and utilities
│   ├── utils/               # Utility functions (env, etc.)
│   └── App.tsx              # Main app component
├── e2e/                     # End-to-end tests
├── .storybook/              # Storybook configuration
├── public/                  # Static assets
├── Dockerfile               # Docker configuration
├── docker-entrypoint.sh     # Docker environment injection script
├── nginx.conf               # Nginx configuration for Docker
├── playwright.config.ts     # E2E test configuration
└── vite.config.ts           # Vite configuration
```

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
2. Run with environment variables: `docker run -p 80:80 -e REACT_APP_API_URL=... react-app`
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
