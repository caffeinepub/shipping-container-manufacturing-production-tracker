import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import AccessDeniedScreen from './AccessDeniedScreen';
import ProfileSetupModal from './ProfileSetupModal';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: role, isLoading: roleLoading, isFetched: roleFetched } = useGetCallerRole();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Role-based route access control - must be called before any returns
  useEffect(() => {
    if (isAuthenticated && roleFetched && role === 'viewer') {
      // Define viewer-allowed routes
      const viewerAllowedRoutes = ['/dashboard', '/production-dashboard'];
      
      // Check if current path is not in allowed routes
      const isAllowedRoute = viewerAllowedRoutes.some(route => currentPath === route || currentPath === '/');
      
      if (!isAllowedRoute) {
        // Redirect viewer to production dashboard if trying to access restricted routes
        navigate({ to: '/production-dashboard' });
      }
    }
  }, [isAuthenticated, role, roleFetched, currentPath, navigate]);

  // Show loading state while checking authentication
  if (isInitializing || (isAuthenticated && (profileLoading || roleLoading))) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show access denied
  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  // Show profile setup modal for first-time users
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupModal open={true} />}
      {children}
    </>
  );
}
