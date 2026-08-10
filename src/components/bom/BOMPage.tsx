'use client';

import React, { useState, useEffect } from 'react';
import {
  Factory, Search, Filter, Wrench, Package,
  AlertCircle, ChevronRight, Settings2, Play, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { STATUS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

export default function BOMPage() {
  const { language } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const statusFlow: OrderStatus[] = ['pending', 'printing', 'cutting', 'gluing', 'packing', 'ready', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      try {
        await updateOrderStatus(orderId, nextStatus);
        fetchData();
      } catch (err) {
        console.error(err);
        alert("Statusni o'zgartirishda xatolik yuz berdi");
      }
    }
  };

  // Only show orders that are in production phases
  const productionStatuses = ['pending', 'printing', 'cutting', 'gluing', 'packing', 'ready'];
  const productionOrders = orders.filter(o => 
    productionStatuses.includes(o.status) &&
    (!searchQuery || o.order_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ishlab chiqarish (Production)</h1>
          <p className="text-sm text-muted-foreground mt-1">Buyurtmalar holati va sex jarayonlarini boshqarish</p>
        </div>
      </div>

      {/* Production Pipeline */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" />
            Jarayondagi Buyurtmalar
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ID bo'yicha qidirish..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Yuklanmoqda...</div>
          ) : productionOrders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">Ishlab chiqarishda buyurtmalar yo'q</div>
          ) : (
            <div className="grid gap-4">
              {productionOrders.map((order) => {
                const statusLabel = STATUS_LABELS[order.status as OrderStatus]?.[language] || order.status;
                
                return (
                  <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-border rounded-xl hover:border-primary/30 transition-colors bg-white shadow-sm">
                    
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0">
                        <Wrench className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground text-lg">{order.order_number}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border">
                            {order.client_name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Holati: <strong className="text-foreground">{statusLabel}</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.status !== 'ready' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, order.status)}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#0f62fe] text-white rounded-lg hover:bg-[#0353e9] transition-colors shadow-sm"
                        >
                          Keyingi bosqich <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <div className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Tayyor
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
