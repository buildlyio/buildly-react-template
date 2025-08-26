import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export const RootRedirect = () => {
  const { isAuthenticated } = useAuthStore()
  
  // Redirect based on authentication status
  return (
    <Navigate 
      to={isAuthenticated ? "/app" : "/login"} 
      replace 
    />
  )
}