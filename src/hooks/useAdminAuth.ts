import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getStoredUser } from '@/lib/auth';

interface StoredUser {
  role: string;
}

export function useAdminAuth() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAccess = useCallback(() => {
    try {
      const userData = getStoredUser<StoredUser>();
      if (!userData) {
        router.push('/login');
        return;
      }

      if (userData.role !== 'admin') {
        router.push('/');
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
    } catch {
      router.push('/login');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  return {
    isAdmin,
    loading,
    logout,
    checkAdminAccess,
  };
}
