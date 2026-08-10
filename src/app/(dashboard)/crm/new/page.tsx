'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Search, Plus, UploadCloud, Link as LinkIcon,
  CreditCard, Banknote, Building2, Send, AlertTriangle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import type { PaymentMethod } from '@/lib/types';
import { getClients, getItems, createOrder, createTransaction, updateClientBalance } from '@/lib/api';

export default function NewOrderPage() {
  const { language, currentUser } = useAppStore();
  const router = useRouter();

  // Data states
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [advanceAmount, setAdvanceAmount] = useState('0');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [fetchedClients, fetchedItems] = await Promise.all([
          getClients(),
          getItems()
        ]);
        setClients(fetchedClients);
        // Faqat tayyor mahsulotlarni ajratib olamiz
        setProducts(fetchedItems.filter(i => i.category_name?.toLowerCase().includes('tayyor')));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const q = parseInt(quantity) || 0;
  const totalPrice = selectedProduct ? selectedProduct.price_per_unit * q : 0;
  const advance = parseInt(advanceAmount.replace(/\D/g, '')) || 0;
  const remaining = totalPrice - advance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Create the order
      const orderData = {
        order_number: orderNumber,
        client_id: selectedClientId,
        total_price: totalPrice,
        paid_amount: advance,
        status: 'pending',
        file_url: fileUrl || null
      };

      const itemsData = [{
        item_id: selectedProductId,
        quantity: q,
        unit_price: selectedProduct.price_per_unit,
        total_price: totalPrice
      }];

      const newOrder = await createOrder(orderData, itemsData);

      // 2. If there is an advance payment, record a transaction
      if (advance > 0) {
        await createTransaction({
          type: 'income',
          amount: advance,
          payment_method: paymentMethod,
          reference_type: 'order',
          reference_id: newOrder.id,
          description: `Buyurtma uchun avans: ${orderNumber}`,
          user_id: currentUser?.id,
          client_id: selectedClientId
        });
      }

      // 3. Update Client Balance (if remaining debt exists)
      // client.balance is typically what the client owes us.
      if (remaining > 0) {
        // Here we add to their debt (balance is positive meaning they owe us? Wait, usually balance > 0 means debt in this context)
        // Let's assume balance > 0 means we owe them, balance < 0 means they owe us.
        // If remaining > 0, they owe us -> balance goes down by `remaining`.
        await updateClientBalance(selectedClientId, -remaining);
      }

      router.push('/crm');
    } catch (err) {
      console.error(err);
      alert('Buyurtma yaratishda xatolik yuz berdi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Ma'lumotlar yuklanmoqda...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-lg transition-colors border border-border bg-card"
          title={t('orders.back', language)}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('orders.create', language)}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('orders.create_subtitle', language)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Details */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('client.details', language)}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('client.select', language)}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>{t('client.search', language)}</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || '-'})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Client Info */}
            {selectedClient ? (
              <div className={cn(
                'rounded-xl border p-4 flex flex-col justify-center',
                selectedClient.balance < 0 ? 'bg-red-50/50 border-red-200' : 'bg-muted/30'
              )}>
                <p className="text-sm font-semibold text-foreground">{selectedClient.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedClient.phone || '-'}</p>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {t('client.balance', language)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xl font-bold',
                      selectedClient.balance < 0 ? 'text-red-600' : 'text-emerald-600'
                    )}>
                      {formatCurrency(selectedClient.balance)}
                    </span>
                    {selectedClient.balance < 0 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/10 flex items-center justify-center p-6 text-muted-foreground text-sm">
                {t('client.select', language)}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">2</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('product.info', language)}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('orders.product', language)}
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>{t('product.select', language)}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price_per_unit)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('common.quantity', language)}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {selectedProduct && (
            <div className="mt-6 p-4 bg-muted/30 rounded-xl flex items-center justify-between border border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('product.unit_price', language)}</p>
                <p className="text-sm font-medium text-foreground">{formatCurrency(selectedProduct.price_per_unit)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('product.total_order_price', language)}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Design Files */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('design.title', language)}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <UploadCloud className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t('design.upload', language)}</p>
              <p className="text-[10px] text-muted-foreground mt-3">Yaqin orada ishga tushadi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('design.cloud_link', language)} (Google Drive, Telegram...)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('payment.title', language)}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                {t('payment.method', language)}
              </label>
              <div className="space-y-3">
                {(['cash', 'card', 'transfer'] as PaymentMethod[]).map((method) => {
                  const icons: Record<string, React.ElementType> = {
                    cash: Banknote, card: CreditCard, transfer: Building2
                  };
                  const labels: Record<string, string> = {
                    cash: t('payment.cash', language),
                    card: t('payment.card', language),
                    transfer: t('payment.transfer', language),
                  };
                  const Icon = icons[method];
                  
                  return (
                    <label
                      key={method}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        paymentMethod === method ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <Icon className={cn('w-5 h-5', paymentMethod === method ? 'text-primary' : 'text-muted-foreground')} />
                      <span className={cn('text-sm font-medium', paymentMethod === method ? 'text-primary' : 'text-foreground')}>
                        {labels[method]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('payment.advance', language)}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={advanceAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAdvanceAmount(val ? formatNumber(parseInt(val)) : '');
                    }}
                    placeholder="0"
                    className="w-full px-4 py-2.5 text-lg font-semibold bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">UZS</span>
                </div>
              </div>

              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">{t('payment.remaining', language)}:</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(remaining)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
          >
            {t('common.cancel', language)}
          </button>
          <button
            type="submit"
            disabled={!selectedClientId || !selectedProductId || q <= 0 || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold bg-[#0f62fe] text-white rounded-xl hover:bg-[#0353e9] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? 'Yaratilmoqda...' : (
              <>
                <Send className="w-4 h-4" />
                {t('orders.send_to_production', language)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
