'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Scissors, Printer, Droplets, PackageCheck,
  Clock, CheckCircle2, Truck, RotateCcw, GripVertical, FileImage,
  Users, LayoutGrid, Phone, Wallet
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { formatCurrency, getStatusClass, cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';
import type { OrderStatus } from '@/lib/types';
import { getOrders, getClients, createClient } from '@/lib/api';

const stageIcons: Record<string, React.ElementType> = {
  pending: Clock,
  printing: Printer,
  cutting: Scissors,
  gluing: Droplets,
  packing: PackageCheck,
  ready: CheckCircle2,
  delivered: Truck,
  returned: RotateCcw,
};

const stageColors: Record<string, string> = {
  pending: 'border-amber-300 bg-amber-50',
  printing: 'border-blue-300 bg-blue-50',
  cutting: 'border-purple-300 bg-purple-50',
  gluing: 'border-orange-300 bg-orange-50',
  packing: 'border-cyan-300 bg-cyan-50',
  ready: 'border-emerald-300 bg-emerald-50',
  delivered: 'border-slate-300 bg-slate-50',
  returned: 'border-red-300 bg-red-50',
};

const dotColors: Record<string, string> = {
  pending: 'bg-amber-400',
  printing: 'bg-blue-500',
  cutting: 'bg-purple-500',
  gluing: 'bg-orange-500',
  packing: 'bg-cyan-500',
  ready: 'bg-emerald-500',
  delivered: 'bg-slate-400',
  returned: 'bg-red-500',
};

export default function CRMPage() {
  const { language } = useAppStore();
  const [activeTab, setActiveTab] = useState<'kanban' | 'clients'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Client Modal State
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedOrders, fetchedClients] = await Promise.all([
        getOrders(),
        getClients()
      ]);
      setOrders(fetchedOrders);
      setClients(fetchedClients);
    } catch (err) {
      console.error("Error loading CRM data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingClient(true);
    try {
      await createClient(newClientName, newClientPhone);
      setShowAddClient(false);
      setNewClientName('');
      setNewClientPhone('');
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error adding client", err);
      alert("Xatolik: Mijoz qo'shilmadi");
    } finally {
      setIsSubmittingClient(false);
    }
  };

  // Group orders by status for kanban
  const kanbanStatuses: OrderStatus[] = ['pending', 'printing', 'cutting', 'gluing', 'packing', 'ready', 'delivered'];

  const filteredOrders = (status: OrderStatus) => {
    const statusOrders = orders.filter(o => o.status === status);
    if (!searchQuery) return statusOrders;
    return statusOrders.filter(o =>
      o.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredClients = clients.filter(c => 
    !searchQuery || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">{t('orders.title', language)}</h1>
          <p className="page-description">Mijozlar bilan ishlash va buyurtmalar holati</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border">
            <button
              onClick={() => setActiveTab('kanban')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === 'kanban' ? "bg-white text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              {language === 'uz' ? 'Buyurtmalar (Kanban)' : 'Заказы (Канбан)'}
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === 'clients' ? "bg-white text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="w-4 h-4" />
              {language === 'uz' ? 'Mijozlar' : 'Клиенты'}
            </button>
          </div>

          {activeTab === 'kanban' ? (
            <Link
              href="/crm/new"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              {t('orders.new', language)}
            </Link>
          ) : (
            <button
              onClick={() => setShowAddClient(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              {language === 'uz' ? 'Yangi Mijoz' : 'Новый Клиент'}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'uz' ? 'Ism yoki raqam bo\'yicha qidirish...' : 'Поиск по имени или номеру...'}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* CONTENT: KANBAN */}
      {activeTab === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar items-start">
          {isLoading ? (
            <div className="w-full py-20 flex justify-center text-muted-foreground">Yuklanmoqda...</div>
          ) : (
            kanbanStatuses.map((status) => {
              const columnOrders = filteredOrders(status);
              const StatusIcon = stageIcons[status] || Clock;
              const statusLabel = STATUS_LABELS[status]?.[language] || status;

              return (
                <div key={status} className="kanban-column min-w-[300px] max-w-[320px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full', dotColors[status])} />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">{statusLabel}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground bg-white rounded-full px-2 py-0.5 border">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {columnOrders.map((order) => {
                      const hasDebt = false; // We can calc this if we track paid_amount

                      return (
                        <Link href={`/crm/${order.id}`} key={order.id}>
                          <div className={cn('kanban-card group shadow-sm hover:shadow-md transition-shadow', stageColors[status])}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-primary">{order.order_number}</span>
                              <GripVertical className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{order.client_name}</p>
                            
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                              <span className="text-xs font-semibold text-foreground">{formatCurrency(order.total_price)}</span>
                              {hasDebt && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                                  Qarz
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                    {columnOrders.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50 bg-muted/20 rounded-xl border border-dashed border-border/50">
                        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-2">
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs">{language === 'uz' ? 'Buyurtmalar yo\'q' : 'Нет заказов'}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CONTENT: CLIENTS TABLE */}
      {activeTab === 'clients' && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4">Mijoz (Firma)</th>
                  <th className="px-6 py-4">Telefon</th>
                  <th className="px-6 py-4">Balans</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Yuklanmoqda...</td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Mijozlar topilmadi</td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {client.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-muted-foreground" />
                          <span className={cn(
                            "font-semibold",
                            client.balance < 0 ? "text-red-600" : client.balance > 0 ? "text-emerald-600" : "text-foreground"
                          )}>
                            {formatCurrency(client.balance)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          Batafsil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Yangi mijoz qo'shish</h2>
                <p className="text-sm text-muted-foreground mt-1">Mijoz bazasiga yangi yozuv qo'shish</p>
              </div>
            </div>
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Firma yoki Ism</label>
                <input 
                  type="text" 
                  required
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Masalan: Fayz Photo Studio"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Telefon Raqam</label>
                <input 
                  type="text" 
                  value={newClientPhone}
                  onChange={e => setNewClientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingClient || !newClientName}
                  className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {isSubmittingClient ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
