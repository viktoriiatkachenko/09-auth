'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

const privateRoutes = ['/profile', '/notes'];

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();

          const isPrivateRoute = privateRoutes.some((route) =>
            pathname.startsWith(route),
          );

          if (isPrivateRoute) {
            await logout();
            router.replace('/sign-in');
            return;
          }
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return children;
}