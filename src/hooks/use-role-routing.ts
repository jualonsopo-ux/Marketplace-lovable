import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRoutingOptions {
  onboardingPath?: string;
  loginPath?: string;
  roleSwitchPath?: string;
}

export function useRoleRouting(options: RoleRoutingOptions = {}) {
  const navigate = useNavigate();
  const { user, profile, loading, isAuthenticated } = useAuth();
  
  const {
    onboardingPath = '/auth',
    loginPath = '/login', 
    roleSwitchPath = '/role-switch'
  } = options;

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      navigate(loginPath);
      return;
    }

    // If no profile found, redirect to onboarding
    if (!profile) {
      console.log('No profile found, redirecting to onboarding');
      navigate(onboardingPath);
      return;
    }

    // Handle role-based routing
    const handleRoleRouting = () => {
      switch (profile.role) {
        case 'admin':
          // Admin can access everything, default to admin dashboard
          navigate('/admin/dashboard');
          break;
          
        case 'coach':
          navigate('/coach/dashboard');
          break;
          
        case 'client':
          navigate('/client/dashboard');
          break;
          
        default:
          // Unknown role, redirect to onboarding
          console.log('Unknown role, redirecting to onboarding');
          navigate(onboardingPath);
      }
    };

    // Get user's role preference from localStorage
    const lastUsedRole = localStorage.getItem('coachwave_last_role');
    const currentPath = window.location.pathname;

    // If user is admin and has a preference, respect it
    if (profile.role === 'admin' && lastUsedRole) {
      const preferredPath = 
        lastUsedRole === 'coach' ? '/coach/dashboard' :
        lastUsedRole === 'client' ? '/client/dashboard' : 
        '/admin/dashboard';
      
      // Only redirect if not already on a dashboard path
      if (!currentPath.startsWith('/admin/') && 
          !currentPath.startsWith('/coach/') && 
          !currentPath.startsWith('/client/')) {
        navigate(preferredPath);
        return;
      }
    }

    // Standard role routing
    handleRoleRouting();
  }, [loading, isAuthenticated, user, profile, navigate, onboardingPath, loginPath]);

  // Helper function to switch roles (for admin users)
  const switchRole = (role: 'admin' | 'coach' | 'client') => {
    if (profile?.role !== 'admin') {
      console.warn('Only admin users can switch roles');
      return;
    }

    // Save preference
    localStorage.setItem('coachwave_last_role', role);
    
    // Navigate to appropriate dashboard
    const targetPath = 
      role === 'admin' ? '/admin/dashboard' :
      role === 'coach' ? '/coach/dashboard' :
      '/client/dashboard';
    
    navigate(targetPath);
  };

  return {
    currentRole: profile?.role,
    canSwitchRoles: profile?.role === 'admin',
    switchRole,
    isReady: !loading && !!profile
  };
}