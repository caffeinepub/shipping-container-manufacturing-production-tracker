import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-muted-foreground">
            You need to be logged in as an administrator to access the production tracking system.
          </p>
        </div>
        <Button onClick={login} disabled={loginStatus === 'logging-in'} size="lg">
          {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
        </Button>
      </div>
    </div>
  );
}
