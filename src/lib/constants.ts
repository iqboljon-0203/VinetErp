// ============================================
// DREAMERP — Constants
// ============================================

import type { OrderStatus, UserRole, NavItem } from './types';

// Navigation items with role-based access
export const NAV_ITEMS: NavItem[] = [
  { title: 'Boshqaruv paneli', titleRu: 'Панель управления', href: '/', icon: 'LayoutDashboard', roles: ['admin', 'seller', 'warehouse', 'worker'] },
  { title: 'CRM va Buyurtmalar', titleRu: 'CRM и Заказы', href: '/crm', icon: 'ShoppingCart', roles: ['admin', 'seller'] },
  { title: 'Mijozlar', titleRu: 'Клиенты', href: '/clients', icon: 'Users', roles: ['admin', 'seller'] },
  { title: 'Ishlab chiqarish', titleRu: 'Производство', href: '/production', icon: 'Factory', roles: ['admin', 'worker'] },
  { title: 'Ombor', titleRu: 'Склад', href: '/inventory', icon: 'Package', roles: ['admin', 'warehouse'] },
  { title: 'BOM / Retseptlar', titleRu: 'BOM / Рецепты', href: '/bom', icon: 'BookOpen', roles: ['admin', 'warehouse'] },
  { title: 'Moliya', titleRu: 'Финансы', href: '/finance', icon: 'Wallet', roles: ['admin'] },
  { title: 'Xodimlar', titleRu: 'Сотрудники', href: '/staff', icon: 'UserCog', roles: ['admin'] },
  { title: "Ta'minotchilar", titleRu: 'Поставщики', href: '/suppliers', icon: 'Truck', roles: ['admin', 'warehouse'] },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { title: 'Sozlamalar', titleRu: 'Настройки', href: '/settings', icon: 'Settings', roles: ['admin', 'seller', 'warehouse', 'worker'] },
  { title: 'Yordam', titleRu: 'Поддержка', href: '/support', icon: 'HelpCircle', roles: ['admin', 'seller', 'warehouse', 'worker'] },
];

// Order status flow
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending', 'printing', 'cutting', 'gluing', 'packing', 'ready', 'delivered',
];

// Status labels (uz)
export const STATUS_LABELS: Record<OrderStatus, { uz: string; ru: string }> = {
  pending: { uz: 'Kutilyapti', ru: 'Ожидание' },
  printing: { uz: 'Chop etish', ru: 'Печать' },
  cutting: { uz: 'Kesish', ru: 'Резка' },
  gluing: { uz: 'Yelimlash', ru: 'Склейка' },
  packing: { uz: 'Qadoqlash', ru: 'Упаковка' },
  ready: { uz: 'Tayyor', ru: 'Готово' },
  delivered: { uz: 'Topshirildi', ru: 'Доставлено' },
  returned: { uz: 'Qaytarildi', ru: 'Возвращено' },
};

// Role labels
export const ROLE_LABELS: Record<UserRole, { uz: string; ru: string }> = {
  admin: { uz: 'Admin / Rahbar', ru: 'Админ / Руководитель' },
  seller: { uz: 'Sotuvchi (CRM)', ru: 'Продавец (CRM)' },
  warehouse: { uz: 'Omborchi', ru: 'Кладовщик' },
  worker: { uz: 'Usta', ru: 'Мастер' },
};

// Payment method labels
export const PAYMENT_LABELS = {
  cash: { uz: 'Naqd pul', ru: 'Наличные', icon: 'Banknote' },
  card: { uz: 'Plastik karta', ru: 'Карта', icon: 'CreditCard' },
  transfer: { uz: "Pul ko'chirish", ru: 'Перевод', icon: 'Building2' },
};

// Category badge colors
export const CATEGORY_COLORS: Record<string, string> = {
  "Qog'oz": 'bg-blue-100 text-blue-700',
  'Oyna': 'bg-emerald-100 text-emerald-700',
  'Faner': 'bg-amber-100 text-amber-700',
  'Plastik': 'bg-purple-100 text-purple-700',
  'Koja': 'bg-rose-100 text-rose-700',
  'Kley': 'bg-orange-100 text-orange-700',
  'Vinetka': 'bg-indigo-100 text-indigo-700',
  'Fotokitob': 'bg-cyan-100 text-cyan-700',
};

// Inventory log type labels
export const INVENTORY_LOG_LABELS = {
  in: { uz: 'Kirim', ru: 'Приход', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  out: { uz: 'Chiqim', ru: 'Расход', color: 'text-blue-600', bg: 'bg-blue-50' },
  reserve: { uz: 'Zaxira', ru: 'Резерв', color: 'text-amber-600', bg: 'bg-amber-50' },
  scrap: { uz: 'Brak', ru: 'Брак', color: 'text-red-600', bg: 'bg-red-50' },
};

// Transaction type labels
export const TRANSACTION_TYPE_LABELS = {
  income: { uz: 'Kirim', ru: 'Приход', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  expense: { uz: 'Chiqim', ru: 'Расход', color: 'text-red-600', bg: 'bg-red-50' },
  refund: { uz: 'Qaytarish', ru: 'Возврат', color: 'text-amber-600', bg: 'bg-amber-50' },
};
