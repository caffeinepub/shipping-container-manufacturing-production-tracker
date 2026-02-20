import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import AccessDeniedScreen from './AccessDeniedScreen';
import ProfileSetupModal from './ProfileSetupModal';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show loading state while checking authentication
  if (isInitializing || (isAuthenticated && (profileLoading || adminLoading))) {
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

  // Not admin - show access denied
  if (!isAdmin) {
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
