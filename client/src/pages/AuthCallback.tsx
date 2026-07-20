import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import client from '@/api/client';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    async function exchangeTokens() {
      try {
        const { data } = await client.get('/auth/exchange-token', {
          withCredentials: true,
        });

        if (data.data?.accessToken && data.data?.refreshToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          await refreshUser();
          navigate('/dashboard');
        } else {
          navigate('/login?error=auth_failed');
        }
      } catch {
        navigate('/login?error=auth_failed');
      }
    }

    exchangeTokens();
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
