# Buildly React Template

A modern React web application template built with the latest technologies and best practices. This production-ready template features complete OAuth authentication system with user registration, email verification, password reset, comprehensive theme system, global notification system, and Docker support with flexible environment variable handling.

## 🚀 Features

### Core Technologies
- **React 19** with TypeScript and modern JSX transform
- **Vite** for lightning-fast development and optimized builds
- **TanStack Query v5** for server state management and caching
- **React Router v6** for client-side routing
- **Zustand** for lightweight global state management

### Authentication & Security
- **Complete OAuth 2.0** authentication system with token management
- **User Registration** with email verification requirement
- **Password Reset** via secure email links with token-based confirmation
- **Email Verification** for new user accounts
- **Protected routes** with automatic authentication-based redirects
- **Persistent login state** with automatic token cleanup and expiration handling
- **Form validation** with client-side validation and error handling
- **Session management** with secure token storage and automatic cleanup

### UI & User Experience
- **Light/Dark/System themes** with automatic OS preference detection
- **Global notification system** with toast notifications for user feedback
- **Global loading overlay** with contextual loading messages
- **Responsive design** across all screen sizes and devices
- **CSS custom properties** for dynamic theme switching
- **Persistent preferences** with localStorage integration
- **Smooth animations** and transitions throughout the interface

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
│   │   ├── auth.ts          # Complete authentication API (login, register, reset, verify)
│   │   └── users.ts         # User management API (CRUD operations, roles, organizations)
│   ├── assets/              # Static assets (logos, images)
│   │   ├── light-logo.png   # Logo for light theme
│   │   └── dark-logo.png    # Logo for dark theme
│   ├── components/          # Reusable UI components
│   │   ├── Button/          # Button component with tests & stories
│   │   ├── TopBar/          # Navigation bar with gradient background
│   │   ├── ThemeToggle/     # Theme switcher component
│   │   ├── UserMenu/        # User dropdown menu
│   │   ├── ProtectedRoute/  # Route protection wrapper
│   │   ├── GlobalLoader/    # Global loading overlay system
│   │   ├── GlobalNotification/ # Global toast notification system
│   │   ├── UserManagement/  # User management components
│   │   │   ├── UsersTab.tsx # Users table with editing capabilities
│   │   │   └── UserRolesTab.tsx # User roles and permissions table (read-only)
│   │   ├── EditUserModal/   # User editing modal with organization and role assignment
│   │   ├── InviteUsersModal/# Multi-user invitation modal
│   │   └── ui/              # Base UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── useLoader.ts     # Global loader state management
│   │   └── useNotification.ts # Global notification system
│   ├── pages/               # Route-level page components
│   │   ├── Login/           # OAuth login page
│   │   ├── Register/        # User registration with email verification
│   │   ├── ForgotPassword/  # Password reset request page
│   │   ├── ResetPasswordConfirm/ # Password reset confirmation page
│   │   ├── VerifyEmail/     # Email verification page
│   │   ├── Dashboard/       # Protected dashboard
│   │   └── UserManagement/  # Complete user management system with tabbed interface
│   ├── stores/              # Zustand state stores
│   │   ├── authStore.ts     # Authentication state management
│   │   └── themeStore.ts    # Theme state management
│   ├── styles/              # Global styles and theme definitions
│   │   ├── theme.css        # CSS custom properties for themes
│   │   └── auth-pages.css   # Shared authentication page styles
│   ├── test/                # Test setup and utilities
│   ├── utils/               # Utility functions
│   │   ├── env.ts           # Environment variable handling
│   │   ├── constants.ts     # Application constants and messages
│   │   └── userRoles.ts     # User role utilities and helpers
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

## 🔐 Complete Authentication System

### Authentication Features
The application provides a complete authentication system with full user lifecycle support:

- **OAuth 2.0 Login** - Secure username/password authentication with token management
- **User Registration** - Account creation with comprehensive form validation
- **Email Verification** - Token-based email verification for new accounts
- **Password Reset** - Secure password reset via email links
- **Session Management** - Persistent login state with automatic token cleanup
- **Protected Routes** - Authentication-based access control with automatic redirects

### Authentication Flows

#### **Login Flow**:
1. User visits root `/` → authentication check
2. Unauthenticated users redirected to `/login`
3. Login form submits credentials to OAuth endpoint
4. Successful authentication stores tokens and redirects to `/app`
5. Token expiration triggers automatic cleanup and re-authentication

#### **Registration Flow**:
1. User visits `/register` → fills out registration form
2. Form validation ensures all required fields and password requirements
3. Successful registration shows success notification and redirects to `/login`
4. User receives verification email with token link
5. Clicking email link goes to `/verify-email?token=...` → automatic verification and redirect

#### **Password Reset Flow**:
1. User visits `/forgot-password` → enters email address
2. Password reset request sent, user redirected to `/login` with confirmation
3. User receives email with reset link to `/reset-password-confirm/:uid/:token`
4. User enters new password → successful reset redirects to `/login`

### Route Architecture
```
/ (root)                           → RootRedirect (authentication check)
├── Authentication Routes (public access)
│   ├── /login                     → OAuth login form
│   ├── /register                  → User registration with validation
│   ├── /forgot-password           → Password reset request
│   ├── /reset-password-confirm/:uid/:token → Password reset confirmation
│   └── /verify-email              → Email verification from registration
└── Protected Routes (requires authentication)
    ├── /app                       → Main dashboard
    └── /app/user-management       → User management interface
```

### Global UI Systems

#### **Notification System**
- **Toast Notifications** - Non-intrusive user feedback
- **Multiple Types** - Success, error, warning, and info notifications
- **Persistent Options** - Notifications can survive page navigation
- **Auto-dismiss** - Configurable timing with manual close options

#### **Loading System**  
- **Global Overlay** - Full-screen loading during API operations
- **Contextual Messages** - Custom loading messages for different operations
- **User Protection** - Prevents interaction during critical operations

#### **Theme System**
- **Light Theme** - Clean, bright interface
- **Dark Theme** - Dark, high-contrast interface  
- **System Theme** - Automatically follows OS preference
- **Persistent State** - Theme preferences stored in localStorage

## 👥 User Management System

### Complete User Administration
The application provides a comprehensive user management system with full CRUD operations and role-based permissions:

- **User List Management** - View, edit, and manage all system users
- **User Invitations** - Send email invitations to new users with bulk invite support
- **User Editing** - Modify user status, organization assignment, and role permissions
- **Role Management** - View user roles and permissions (read-only display)
- **Organization Management** - Assign users to different organizations
- **Real-time Updates** - Automatic data refresh after operations

### User Management Features

#### **Users Tab**
- **User Table** - Displays all users with key information:
  - Full name, username, email
  - Organization assignment
  - User role (derived from core groups)
  - Active/inactive status
  - Join date
- **Search & Filter** - Filter users by status, organization, or role
- **Edit Functionality** - In-line editing with modal interface
- **Bulk Actions** - Mass user operations and invitations

#### **User Roles Tab** 
- **Permissions Matrix** - Visual display of role permissions:
  - Create, Read, Update, Delete permissions per role
  - Organization-specific and global roles
  - Role hierarchy and inheritance
- **Read-Only Display** - Permissions viewing without editing capabilities

#### **User Invitations**
- **Email Invitations** - Send invites to multiple email addresses
- **Bulk Invite Support** - Add multiple emails simultaneously
- **Invitation Tracking** - Monitor invitation status and responses
- **Automatic User Creation** - Users created upon invitation acceptance

#### **User Editing**
- **Modal Interface** - Clean, focused editing experience
- **Organization Assignment** - Move users between organizations
- **Role Management** - Assign appropriate roles and permissions
- **Status Management** - Activate/deactivate user accounts
- **Real-time Validation** - Client-side form validation with error handling

### API Integration

#### **Conditional Update Logic**
The user update system uses intelligent API calls based on data changes:

- **Organization Updates** - Uses `/coreuser/update_org/{id}/` endpoint for organization changes
- **User Field Updates** - Uses `/coreuser/{id}/` endpoint for status and role changes  
- **Sequential Processing** - Organization updates processed first, then user fields
- **Error Handling** - Comprehensive error handling with user-friendly notifications
- **Optimistic Updates** - UI updates immediately with rollback on failure

#### **Data Management**
- **TanStack Query Integration** - Efficient data fetching with caching
- **Automatic Refresh** - Data automatically refreshes after operations
- **Loading States** - Global loading indicators during operations
- **Error Recovery** - Graceful error handling with retry mechanisms

### User Interface Design

#### **Tabbed Interface** 
- **Clean Navigation** - Easy switching between users and roles
- **Visual Indicators** - Tab badges show counts for users and roles
- **Responsive Design** - Mobile-friendly interface across all screen sizes

#### **Modern Table Design**
- **Sortable Columns** - Click to sort by any column
- **Responsive Layout** - Tables adapt to different screen sizes
- **Action Buttons** - Intuitive edit and action controls
- **Status Indicators** - Visual status indicators for user states

#### **Modal System**
- **Focused Editing** - Distraction-free editing environment
- **Form Validation** - Real-time validation with helpful error messages
- **Save/Cancel Actions** - Clear action buttons with confirmation

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
