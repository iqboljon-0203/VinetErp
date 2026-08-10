'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Users, Factory, Package,
  BookOpen, Wallet, UserCog, Truck, Settings, HelpCircle,
  ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, ShoppingCart, Users, Factory, Package,
  BookOpen, Wallet, UserCog, Truck, Settings, HelpCircle,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, userRole, sidebarOpen, toggleSidebar, language } = useAppStore();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  const filteredBottomItems = BOTTOM_NAV_ITEMS.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-border flex flex-col transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-[240px]' : 'w-[72px]'
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 border-b border-border flex-shrink-0 w-full overflow-hidden", sidebarOpen ? "justify-center" : "justify-center")}>
        <div className={cn("flex items-center justify-center flex-shrink-0 transition-all duration-300", sidebarOpen ? "w-[180px] h-[52px]" : "w-10 h-10")}>
          <img src="/logo.png" alt="VINET ERP" className={cn("w-full h-full object-contain", sidebarOpen ? "scale-[2.2]" : "scale-[4.0]")} />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredNavItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const label = language === 'ru' ? item.titleRu : item.title;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item group relative',
                isActive && 'sidebar-item-active'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {sidebarOpen && (
                <span className="truncate">{label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {/* Tooltip for collapsed sidebar */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-3 border-t border-border space-y-1">
        {filteredBottomItems.map((item) => {
          const Icon = iconMap[item.icon] || Settings;
          const isActive = pathname === item.href;
          const label = language === 'ru' ? item.titleRu : item.title;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item group relative',
                isActive && 'sidebar-item-active'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {sidebarOpen && <span className="truncate">{label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-50"
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
