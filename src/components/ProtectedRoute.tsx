import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to auth page
        navigate('/auth')
      } else if (!profile) {
        // User is authenticated but has no profile, redirect to create profile page
        navigate('/create-profile')
      }
    }
  }, [user, profile, loading, navigate])

  // Show nothing while checking auth status
  if (loading) {
    return <div>Loading...</div>
  }

  // Only render children if user is authenticated and has a profile
  return user && profile ? <>{children}</> : null
}

export default ProtectedRoute
