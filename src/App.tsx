// React and routing imports
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Store imports for global state management
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'

// Component imports
import { RootRedirect } from './components/RootRedirect/RootRedirect'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { GlobalLoader } from './components/GlobalLoader/GlobalLoader'
import { GlobalNotification } from './components/GlobalNotification/GlobalNotification'

// Page imports
import { Login } from './pages/Login/Login'
import { Register } from './pages/Register/Register'
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword'
import { ResetPasswordConfirm } from './pages/ResetPasswordConfirm/ResetPasswordConfirm'
import { VerifyEmail } from './pages/VerifyEmail/VerifyEmail'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { UserManagement } from './pages/UserManagement/UserManagement'

// Global styles
import './styles/theme.css'
import './App.css'

// Configure TanStack Query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
})

/**
 * Main App component that sets up routing, global providers, and initialization logic
 * Features:
 * - React Router for client-side routing
 * - TanStack Query for server state management
 * - Authentication state management with auto-cleanup
 * - Theme system with light/dark/system modes
 * - Protected routes with automatic redirects
 */
function App() {
  const { cleanupExpiredAuth } = useAuthStore()
  const { initializeTheme } = useThemeStore()
  
  // Initialize theme and auth on app start
  useEffect(() => {
    // Clean up any expired authentication tokens on app startup
    cleanupExpiredAuth()
    
    // Initialize theme system and get cleanup function
    const cleanupTheme = initializeTheme()
    
    // Return cleanup function for theme system
    return cleanupTheme
  }, [cleanupExpiredAuth, initializeTheme])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root route - redirects based on auth status */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Authentication routes - accessible to unauthenticated users */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected app routes - requires authentication */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/app/user-management" 
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to root for handling */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
        
        {/* Global loader for API calls */}
        <GlobalLoader />
        
        {/* Global notifications */}
        <GlobalNotification />
      </Router>
    </QueryClientProvider>
  )
}

export default App
