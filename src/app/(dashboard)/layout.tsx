'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, sidebarOpen } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 10-hour idle timeout logic (10 * 60 * 60 * 1000 = 36000000 ms)
    const TIMEOUT_MS = 10 * 60 * 60 * 1000;
    
    const checkTimeout = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - parseInt(lastActivity, 10) > TIMEOUT_MS) {
        useAppStore.getState().logout();
      }
    };

    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Check on mount
    checkTimeout();
    updateActivity();

    // Listeners for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    // Periodically check if timeout exceeded while tab is open but inactive
    const interval = setInterval(checkTimeout, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(interval);
    };
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarOpen ? 'pl-[240px]' : 'pl-[72px]'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
