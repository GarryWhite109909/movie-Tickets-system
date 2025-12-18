'use client';

import { useSyncExternalStore } from 'react';
import { auth, type AuthUser } from '@/utils/auth';

export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      window.addEventListener('auth-change', onStoreChange);
      return () => window.removeEventListener('auth-change', onStoreChange);
    },
    () => auth.getUser(),
    () => null
  );
}

