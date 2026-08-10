'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import type { UserRole } from '@/lib/types';

// 10 hours in milliseconds
const SESSION_TIMEOUT_MS = 10 * 60 * 60 * 1000; 

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, logout } = useAppStore();
  const lastActive = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-login and sync state with Supabase Auth
  useEffect(() => {
    // Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch role from public.users
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser(session.user, (data?.role as UserRole) || 'admin');
          });
      } else if (pathname !== '/login') {
        router.push('/login');
      }
    });

    // Listen to Auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        logout();
        router.push('/login');
      } else if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUser(session.user, (data?.role as UserRole) || 'admin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, setUser, logout]);

  // Session Timeout Logic (Activity Tracker)
  useEffect(() => {
    const updateActivity = () => {
      lastActive.current = Date.now();
    };

    const checkTimeout = () => {
      const now = Date.now();
      if (now - lastActive.current > SESSION_TIMEOUT_MS) {
        console.warn('Session expired due to inactivity (10 hours).');
        supabase.auth.signOut(); // Automatically triggers the SIGNED_OUT event above
      }
    };

    // Attach listeners to user events
    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('click', updateActivity, { passive: true });
    window.addEventListener('scroll', updateActivity, { passive: true });

    // Check every minute if session timed out
    timerRef.current = setInterval(checkTimeout, 60 * 1000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return <>{children}</>;
}
