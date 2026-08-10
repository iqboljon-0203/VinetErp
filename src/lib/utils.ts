import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format UZS currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' UZS';
}

/** Format short currency (e.g. 45.2M) */
export function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1) + 'B UZS';
  }
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + 'M UZS';
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + 'K UZS';
  }
  return amount.toLocaleString() + ' UZS';
}

/** Format number with spaces */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

/** Format date */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Format date with time */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Generate order number */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900) + 100;
  return `#ORD-${year}-${rand}`;
}

/** Generate unique ID */
export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15);
}

/** Get status color class */
export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'status-pending',
    printing: 'status-printing',
    cutting: 'status-cutting',
    gluing: 'status-gluing',
    packing: 'status-packing',
    ready: 'status-ready',
    delivered: 'status-delivered',
    returned: 'status-returned',
  };
  return map[status] || 'status-pending';
}

/** Get payment method icon name */
export function getPaymentIcon(method: string): string {
  const map: Record<string, string> = {
    cash: 'Banknote',
    card: 'CreditCard',
    transfer: 'Building2',
  };
  return map[method] || 'Banknote';
}

/** Check if stock is low */
export function isLowStock(current: number, min: number): boolean {
  return current <= min;
}

/** Check if stock is critical (below 50% of min) */
export function isCriticalStock(current: number, min: number): boolean {
  return current <= min * 0.5;
}

/** Calculate total BOM cost */
export function calculateBomCost(
  recipes: { quantity_needed: number; cost_price: number }[]
): number {
  return recipes.reduce((total, r) => total + r.quantity_needed * r.cost_price, 0);
}
