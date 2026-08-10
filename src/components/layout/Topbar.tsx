'use client';

import React from 'react';
import { Search, Bell, Clock, HelpCircle, Globe, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ROLE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Topbar() {
  const { currentUser, userRole, language, setLanguage, notificationCount, logout, sidebarOpen } = useAppStore();

  if (!currentUser) return null;

  const roleLabel = userRole ? ROLE_LABELS[userRole]?.[language] || userRole : 'Foydalanuvchi';

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 transition-all duration-300',
        sidebarOpen ? 'left-[240px]' : 'left-[72px]'
      )}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={language === 'uz' ? 'Buyurtma, mijoz yoki mahsulot qidirish...' : 'Поиск заказов, клиентов или продуктов...'}
          className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title={language === 'uz' ? 'Русский тилга ўтиш' : 'Переключить на узбекский'}
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase font-semibold">{language === 'uz' ? 'UZ' : 'RU'}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Activity */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <Clock className="w-5 h-5" />
        </button>

        {/* Help */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-foreground leading-tight">{currentUser?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
            title={language === 'uz' ? 'Chiqish' : 'Выйти'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
