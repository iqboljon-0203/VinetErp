'use client';

import React, { useState } from 'react';
import { Plus, Search, Phone, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { mockClients } from '@/lib/mock-data';
import { formatCurrency, cn } from '@/lib/utils';

export default function ClientsPage() {
  const { language } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockClients.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">{t('nav.clients', language)}</h1>
          <p className="page-description">{language === 'uz' ? 'Mijozlar bazasini boshqarish.' : 'Управление базой клиентов.'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" />
          {t('client.add_new', language)}
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('client.search', language)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="bg-card rounded-xl border">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.name', language)}</th>
                <th>{t('common.phone', language)}</th>
                <th>{language === 'uz' ? 'Buyurtmalar' : 'Заказы'}</th>
                <th>{t('client.balance', language)}</th>
                <th>{t('common.actions', language)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td className="font-medium text-foreground">{client.name}</td>
                  <td>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="text-foreground">{client.total_orders}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {client.balance < 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      <span className={cn('font-bold', client.balance < 0 ? 'text-red-600' : client.balance > 0 ? 'text-emerald-600' : 'text-foreground')}>
                        {formatCurrency(client.balance)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
