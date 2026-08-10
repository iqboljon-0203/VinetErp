'use client';

import React, { useState, useEffect } from 'react';
import {
  Download, Plus, Search, Calendar, ChevronDown, 
  Wallet, ReceiptText, ClipboardList, ArrowUpRight, ArrowDownRight,
  Banknote, CreditCard, Building2, Shuffle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { getTransactions, createTransaction } from '@/lib/api';

const typeIcons: Record<string, React.ElementType> = {
  income: Wallet,
  expense: ReceiptText,
  refund: Shuffle,
};

const typeColors: Record<string, string> = {
  income: 'bg-green-50 text-green-700',
  expense: 'bg-red-50 text-red-700',
  refund: 'bg-amber-50 text-amber-700',
};

const typeDotColors: Record<string, string> = {
  income: 'bg-green-500',
  expense: 'bg-red-500',
  refund: 'bg-amber-500',
};

export default function FinancePage() {
  const { language, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: 0,
    payment_method: 'cash',
    reference_type: 'other',
    reference_id: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTransaction({
        ...formData,
        user_id: currentUser?.id
      });
      setShowAddModal(false);
      setFormData({
        type: 'expense',
        amount: 0,
        payment_method: 'cash',
        reference_type: 'other',
        reference_id: '',
        description: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Tranzaksiyani saqlashda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const cashBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => 
    !searchQuery || 
    t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.reference_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kassa va Moliya</h1>
          <p className="text-sm text-muted-foreground mt-1">Kirim, chiqim va joriy kassa qoldig'i</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border bg-white rounded-md hover:bg-muted transition-colors text-foreground shadow-sm">
            <Download className="w-4 h-4" />
            Eksport (CSV)
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0f62fe] text-white rounded-md hover:bg-[#0353e9] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yangi Tranzaksiya
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-white rounded-xl border border-border p-6 relative overflow-hidden group shadow-sm">
          <div className="absolute right-0 top-6 opacity-10">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L30 30L60 50L120 0" stroke="#0f62fe" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Jami Kirim</h3>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Joriy Oy</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-foreground">{formatCurrency(totalIncome).replace(' UZS','')}</span>
            <span className="text-sm font-semibold text-muted-foreground">UZS</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl border border-border p-6 relative overflow-hidden group shadow-sm">
          <div className="absolute right-0 top-6 opacity-10">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L30 30L60 10L120 60" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <ReceiptText className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Jami Chiqim</h3>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Joriy Oy</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-foreground">{formatCurrency(totalExpense).replace(' UZS','')}</span>
            <span className="text-sm font-semibold text-muted-foreground">UZS</span>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-white rounded-xl border border-border p-6 relative overflow-hidden group shadow-sm">
          <div className="absolute right-0 top-6 opacity-10">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="30" r="20" stroke="#0f62fe" strokeWidth="6" />
              <circle cx="40" cy="40" r="15" stroke="#0f62fe" strokeWidth="6" />
            </svg>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#0f62fe]" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Kassa Qoldig'i</h3>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Sof Foyda / Balans</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className={cn("text-4xl font-bold", cashBalance < 0 ? "text-red-600" : "text-foreground")}>
              {formatCurrency(cashBalance).replace(' UZS','')}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">UZS</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-border shadow-sm">
        {/* Table Header & Actions */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Tranzaksiyalar Tarixi</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value="Joriy oy"
                  readOnly
                  className="pl-9 pr-4 py-2 text-sm border border-border rounded-md text-foreground w-[220px] focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>
              <div className="relative">
                <select className="pl-4 pr-10 py-2 text-sm border border-border rounded-md text-foreground appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px] shadow-sm">
                  <option>Barchasi</option>
                  <option>Kirim</option>
                  <option>Chiqim</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qidirish (ID yoki izoh)..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sana</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Turi</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Summa (UZS)</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">To'lov Turi</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mijoz / Izoh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Yuklanmoqda...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Tranzaksiyalar topilmadi</td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const date = new Date(t.created_at);
                  const isIncome = t.type === 'income';
                  
                  return (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{date.toLocaleDateString()}</div>
                        <div className="text-muted-foreground mt-0.5">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold", typeColors[t.type] || typeColors.expense)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", typeDotColors[t.type] || typeDotColors.expense)} /> 
                          {t.type === 'income' ? 'Kirim' : t.type === 'expense' ? 'Chiqim' : t.type}
                        </span>
                      </td>
                      <td className={cn("px-6 py-4 font-bold", isIncome ? "text-green-600" : "text-red-600")}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 uppercase text-xs font-semibold text-muted-foreground">
                        {t.payment_method}
                      </td>
                      <td className="px-6 py-4">
                        {t.client_name && <div className="font-semibold text-primary">{t.client_name}</div>}
                        <div className="text-muted-foreground">{t.description || '-'}</div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Yangi Tranzaksiya</h2>
                <p className="text-sm text-muted-foreground mt-1">Kassaga kirim yoki chiqim yozish</p>
              </div>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Turi</label>
                  <select 
                    required
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="income">Kirim (+)</option>
                    <option value="expense">Chiqim (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">To'lov shakli</label>
                  <select 
                    required
                    value={formData.payment_method}
                    onChange={e => setFormData({...formData, payment_method: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="cash">Naqd (Kassa)</option>
                    <option value="card">Plastik karta</option>
                    <option value="transfer">Perekisleniye</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Summa (UZS)</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={formData.amount || ''}
                  onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Summani kiriting..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Izoh (Majburiy emas)</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  placeholder="Nima uchun kirim/chiqim qilindi?"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !formData.amount}
                  className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
