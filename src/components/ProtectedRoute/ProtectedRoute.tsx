import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { checkAuth } = useAuthStore()
  const location = useLocation()
  
  if (!checkAuth()) {
    // Redirect to login with the attempted location
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }
  
  return <>{children}</>
}