import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { RootRedirect } from './components/RootRedirect/RootRedirect'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { Login } from './pages/Login/Login'
import { Dashboard } from './pages/Dashboard/Dashboard'
import './styles/theme.css'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const { cleanupExpiredAuth } = useAuthStore()
  const { initializeTheme } = useThemeStore()
  
  // Initialize theme and auth on app start
  useEffect(() => {
    cleanupExpiredAuth()
    const cleanupTheme = initializeTheme()
    
    // Return cleanup function
    return cleanupTheme
  }, [cleanupExpiredAuth, initializeTheme])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root route - redirects based on auth status */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Login route - accessible to unauthenticated users */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected app routes - requires authentication */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to root for handling */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
