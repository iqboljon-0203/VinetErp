// ============================================
// DREAMERP — Global Store (Zustand)
// ============================================

import { create } from 'zustand';
import type { Language, UserRole, User as LocalUser } from './types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppState {
  // Auth
  currentUser: SupabaseUser | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  loginTimestamp: number | null;
  setUser: (user: SupabaseUser | null, role?: UserRole | null) => void;
  logout: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  currentUser: null,
  userRole: null,
  isAuthenticated: false,
  loginTimestamp: null,
  setUser: (user, role = null) => {
    set({ 
      currentUser: user, 
      isAuthenticated: !!user, 
      userRole: role,
      loginTimestamp: !!user ? Date.now() : null 
    });
  },
  logout: () => {
    set({ currentUser: null, isAuthenticated: false, userRole: null, loginTimestamp: null });
  },

  // Language
  language: 'uz',
  setLanguage: (lang: Language) => set({ language: lang }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  // Notifications
  notificationCount: 4,
  setNotificationCount: (count: number) => set({ notificationCount: count }),
}));
