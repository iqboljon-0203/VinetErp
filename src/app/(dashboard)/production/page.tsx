'use client';

import React from 'react';
import {
  Printer, Scissors, Droplets, PackageCheck, Clock, CheckCircle2,
  User, ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { mockProductionStages, mockOrders } from '@/lib/mock-data';
import { formatCurrency, cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';
import type { StageName } from '@/lib/types';

const stageIcons: Record<StageName, React.ElementType> = {
  printing: Printer,
  cutting: Scissors,
  gluing: Droplets,
  packing: PackageCheck,
};

const stageColorMap: Record<StageName, { bg: string; border: string; dot: string }> = {
  printing: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  cutting: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  gluing: { bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
  packing: { bg: 'bg-cyan-50', border: 'border-cyan-200', dot: 'bg-cyan-500' },
};

export default function ProductionPage() {
  const { language } = useAppStore();

  const stages: StageName[] = ['printing', 'cutting', 'gluing', 'packing'];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">{t('production.title', language)}</h1>
        <p className="page-description">{t('production.subtitle', language)}</p>
      </div>

      {/* Production Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {stages.map((stage) => {
          const stageStages = mockProductionStages.filter(
            (ps) => ps.stage_name === stage && ps.status !== 'completed'
          );
          const Icon = stageIcons[stage];
          const colors = stageColorMap[stage];
          const stageLabel = STATUS_LABELS[stage]?.[language] || stage;

          return (
            <div key={stage} className="kanban-column min-w-[280px] max-w-[320px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2.5 h-2.5 rounded-full', colors.dot)} />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">{stageLabel}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground bg-white rounded-full px-2 py-0.5 border">
                  {stageStages.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageStages.map((ps) => {
                  const order = mockOrders.find((o) => o.id === ps.order_id);
                  return (
                    <div key={ps.id} className={cn('rounded-lg border p-4 transition-all duration-200 hover:shadow-md', colors.bg, colors.border)}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary">{ps.order_number}</span>
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{order?.client_name || '—'}</p>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{ps.assigned_user_name || '—'}</span>
                        <span className="ml-auto text-xs font-semibold text-emerald-600">
                          {formatCurrency(ps.kpi_amount)}
                        </span>
                      </div>

                      <div className="mt-3">
                        <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-white/80 border border-border rounded-lg hover:bg-white transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {language === 'uz' ? 'Bosqichni tugatish' : 'Завершить этап'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {stageStages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                    <Icon className="w-8 h-8 mb-2" />
                    <p className="text-xs">{language === 'uz' ? 'Vazifalar yo\'q' : 'Нет задач'}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
