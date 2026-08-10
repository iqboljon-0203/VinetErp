'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, Clock, Printer, Scissors, Droplets, PackageCheck,
  Truck, Download, Share2, CreditCard, Banknote, User
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { mockOrders, mockOrderItems, mockProductionStages, mockTransactions } from '@/lib/mock-data';
import { formatCurrency, formatDateTime, cn, getStatusClass } from '@/lib/utils';
import { STATUS_LABELS, ORDER_STATUS_FLOW } from '@/lib/constants';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { language } = useAppStore();
  const router = useRouter();

  // Next.js 14+ client components x params handling is slightly different, but for mock purposes we'll use unwrap or just ID
  const orderId = params.id;
  
  const order = mockOrders.find((o) => o.id === orderId) || mockOrders[0];
  const items = mockOrderItems.filter((i) => i.order_id === order.id);
  const stages = mockProductionStages.filter((s) => s.order_id === order.id);
  const transactions = mockTransactions.filter((t) => t.reference_id === order.id);

  const currentStageIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const statusLabel = STATUS_LABELS[order.status]?.[language] || order.status;
  const remaining = order.total_price - order.paid_amount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors border border-border bg-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {t('orders.order_id', language)}: {order.order_number}
              </h1>
              <span className={cn('status-badge text-sm px-3 py-1', getStatusClass(order.status))}>
                {statusLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
            <Share2 className="w-4 h-4" />
            {language === 'uz' ? 'Ulashish' : 'Поделиться'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            <Download className="w-4 h-4" />
            {t('dashboard.report', language)} (PDF)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Bar */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              {language === 'uz' ? 'Ishlab chiqarish jarayoni' : 'Процесс производства'}
            </h2>
            
            <div className="relative flex justify-between">
              {/* Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
                style={{ width: `${(Math.max(0, currentStageIndex) / (ORDER_STATUS_FLOW.length - 1)) * 100}%` }}
              />

              {ORDER_STATUS_FLOW.map((status, index) => {
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const sLabel = STATUS_LABELS[status]?.[language] || status;
                
                return (
                  <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300',
                      isCompleted ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground/30',
                      isCurrent && 'ring-4 ring-primary/20 bg-primary/5'
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <span className={cn(
                      'text-xs font-semibold absolute top-10 whitespace-nowrap',
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {sLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-8" /> {/* Spacer for absolute text */}
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-xl border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {language === 'uz' ? 'Buyurtma tarkibi' : 'Состав заказа'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('orders.product', language)}</th>
                    <th>{t('common.quantity', language)}</th>
                    <th>{t('product.unit_price', language)}</th>
                    <th className="text-right">{t('common.total', language)}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium text-foreground">{item.product_name}</td>
                      <td>{item.quantity} {language === 'uz' ? 'dona' : 'шт'}</td>
                      <td>{formatCurrency(item.unit_price)}</td>
                      <td className="text-right font-semibold">{formatCurrency(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-muted/20 border-t border-border flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('common.total', language)}:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.total_price)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>{t('payment.advance', language)}:</span>
                  <span className="font-semibold">-{formatCurrency(order.paid_amount)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="font-bold text-foreground">{t('payment.remaining', language)}:</span>
                  <span className={cn('font-bold', remaining > 0 ? 'text-red-600' : 'text-foreground')}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t('client.details', language)}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {(order.client_name || 'Mijoz').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{order.client_name || 'Mijoz'}</p>
                <p className="text-sm text-muted-foreground mt-0.5">+998 90 123 45 67</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {t('finance.transactions', language)}
              </h2>
              {remaining > 0 && (
                <button className="text-xs font-semibold text-primary hover:underline">
                  {language === 'uz' ? 'To\'lov qabul qilish' : 'Принять оплату'}
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <div key={txn.id} className="flex items-start justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {txn.payment_method === 'cash' ? <Banknote className="w-4 h-4 text-emerald-600" /> : <CreditCard className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(txn.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(txn.date)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === 'uz' ? 'To\'lovlar yo\'q' : 'Нет оплат'}
                </p>
              )}
            </div>
          </div>

          {/* Attached Files */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t('design.title', language)}
            </h2>
            <div className="p-4 rounded-lg bg-muted/50 border border-border border-dashed flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">ZIP</div>
                <div>
                  <p className="text-sm font-medium text-foreground">vinetka_dizayn.zip</p>
                  <p className="text-xs text-muted-foreground">145 MB</p>
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors text-primary">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
