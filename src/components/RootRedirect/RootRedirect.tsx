import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export const RootRedirect = () => {
  const { checkAuth } = useAuthStore()
  
  // Redirect based on authentication status
  return (
    <Navigate 
      to={checkAuth() ? "/app" : "/login"} 
      replace 
    />
  )
}