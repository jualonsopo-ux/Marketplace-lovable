import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function useRoleRedirect() {
  const { profile, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading || !isAuthenticated || !profile) return

    // Don't redirect if user is already on an appropriate page
    const currentPath = location.pathname

    // Define role-based home pages
    const roleRedirects = {
      coach: '/coach/dashboard',
      client: '/client/dashboard', 
      admin: '/admin/dashboard'
    } as const

    const targetPath = roleRedirects[profile.role as keyof typeof roleRedirects]
    
    if (!targetPath) return // Unknown role, don't redirect
    
    // Only redirect if user is on root path or wrong role area
    if (currentPath === '/' || 
        (profile.role === 'coach' && !currentPath.startsWith('/coach')) ||
        (profile.role === 'client' && !currentPath.startsWith('/client')) ||
        (profile.role === 'admin' && !currentPath.startsWith('/admin'))) {
      navigate(targetPath, { replace: true })
    }
  }, [profile, isAuthenticated, loading, navigate, location])
}