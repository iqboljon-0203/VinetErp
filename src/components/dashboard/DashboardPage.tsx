'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp, ShoppingCart, Wallet, AlertTriangle,
  ArrowUpRight, Download, Plus, Search, Filter,
  Banknote, CreditCard, Building2, Package
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { mockSalesData, mockTopProducts } from '@/lib/mock-data'; // keep chart mocks for now until we have real historical data
import { formatCurrency, formatNumber, getStatusClass, cn } from '@/lib/utils';
import { STATUS_LABELS, PAYMENT_LABELS } from '@/lib/constants';
import { getDashboardStats, getRecentOrders } from '@/lib/api';
import type { OrderStatus, PaymentMethod } from '@/lib/types';

const paymentIcons: Record<string, React.ElementType> = {
  cash: Banknote,
  card: CreditCard,
  transfer: Building2,
};

export default function DashboardPage() {
  const { language } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    dailySales: 0,
    dailySalesChange: 0,
    activeOrders: 0,
    cashBalance: 0,
    lowStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardStats, orders] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(5)
        ]);
        setStats(dashboardStats);
        setRecentOrders(orders);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">{t('dashboard.title', language)}</h1>
          <p className="page-description">{t('dashboard.subtitle', language)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            {t('dashboard.report', language)}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4" />
            {t('dashboard.new_order', language)}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Sales */}
        <div className="metric-card animate-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('dashboard.daily_sales', language)}
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.dailySales)}</p>
          )}
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">+{stats.dailySalesChange}%</span>
            <span className="text-xs text-muted-foreground">{t('dashboard.vs_yesterday', language)}</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="metric-card animate-in-delay-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('dashboard.active_orders', language)}
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-foreground">{formatNumber(stats.activeOrders)}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">{t('dashboard.in_production', language)}</p>
        </div>

        {/* Cash Balance */}
        <div className="metric-card animate-in-delay-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('dashboard.cash_balance', language)}
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.cashBalance)}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">{t('dashboard.current_balance', language)}</p>
        </div>

        {/* Low Stock */}
        <div className="metric-card-danger animate-in-delay-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              {t('dashboard.low_stock', language)}
            </span>
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-red-600">{stats.lowStockCount} {language === 'uz' ? 'ta' : 'шт'}</p>
          )}
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <Package className="w-3 h-3" />
            {t('dashboard.requires_restock', language)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('dashboard.sales_performance', language)}</h2>
            <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors">
              {t('dashboard.last_7_days', language)}
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [formatCurrency(value as number), language === 'uz' ? 'Savdo' : 'Продажи']}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2.5} fill="url(#salesGradient)" dot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t('dashboard.top_products', language)}</h2>
          <div className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTopProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="percentage"
                  stroke="none"
                >
                  {mockTopProducts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {mockTopProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }} />
                  <span className="text-sm text-foreground">{product.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{product.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{t('dashboard.recent_orders', language)}</h2>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={language === 'uz' ? 'Buyurtma qidirish...' : 'Поиск заказов...'}
                className="pl-9 pr-4 py-2 text-sm bg-muted/50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 w-52"
              />
            </div>
            <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('orders.order_id', language)}</th>
                <th>{t('orders.client_name', language)}</th>
                <th>Sana</th>
                <th>{t('orders.total_price', language)}</th>
                <th>{t('common.status', language)}</th>
                <th>{t('orders.payment', language)}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">Yuklanmoqda...</td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">Buyurtmalar topilmadi</td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusLabel = STATUS_LABELS[order.status as OrderStatus]?.[language] || order.status;
                  const paymentLabel = PAYMENT_LABELS[order.payment_method as PaymentMethod];
                  const PayIcon = paymentIcons[order.payment_method] || Banknote;
                  return (
                    <tr key={order.id}>
                      <td>
                        <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="text-sm font-medium text-foreground">{order.client_name}</td>
                      <td className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-sm font-semibold text-foreground">{formatCurrency(order.total_price)}</td>
                      <td>
                        <span className={cn('status-badge', getStatusClass(order.status))}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <PayIcon className="w-4 h-4" />
                          {paymentLabel?.[language] || order.payment_method}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
