'use client';

import React, { useState, useEffect } from 'react';
import {
  Package, Search, Filter, Plus, AlertTriangle,
  ArrowDownToLine, ArrowUpFromLine, Layers, Factory,
  MoreVertical, Edit2, Trash2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { formatCurrency, cn } from '@/lib/utils';
import { getItems, getCategories, createItem } from '@/lib/api';

export default function InventoryPage() {
  const { language } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'raw' | 'product'>('all');
  
  // Data State
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    unit: 'dona',
    stock_level: 0,
    min_stock_level: 10,
    price_per_unit: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedItems, fetchedCats] = await Promise.all([
        getItems(),
        getCategories()
      ]);
      setItems(fetchedItems);
      setCategories(fetchedCats);
      if (fetchedCats.length > 0) {
        setFormData(prev => ({ ...prev, category_id: fetchedCats[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createItem(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        unit: 'dona',
        stock_level: 0,
        min_stock_level: 10,
        price_per_unit: 0
      });
      fetchData();
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Mahsulot qo'shishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // We assume items have a 'type' or we filter by category if type is missing.
    // For simplicity, we just filter by search for now unless we enforce item type.
    const type = item.category_name.toLowerCase().includes('tayyor') ? 'product' : 'raw';
    const matchesTab = activeTab === 'all' || type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const lowStockCount = items.filter(i => i.stock_level <= i.min_stock_level).length;
  const totalValue = items.reduce((acc, i) => acc + (i.stock_level * i.price_per_unit), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">{t('inventory.title', language)}</h1>
          <p className="page-description">{t('inventory.subtitle', language)}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
            <ArrowDownToLine className="w-4 h-4" />
            {language === 'uz' ? 'Eksport' : 'Экспорт'}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            {t('inventory.add_item', language)}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Jami Turlar</p>
          </div>
          <p className="text-2xl font-bold text-foreground pl-13">{items.length}</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Ombor Qiymati</p>
          </div>
          <p className="text-2xl font-bold text-foreground pl-13">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Kamaygan Xomashyo</p>
          </div>
          <p className="text-2xl font-bold text-red-600 pl-13">{lowStockCount}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border">
          <button
            onClick={() => setActiveTab('all')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeTab === 'all' ? "bg-white text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground")}
          >
            Barchasi
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeTab === 'raw' ? "bg-white text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground")}
          >
            Xomashyo
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeTab === 'product' ? "bg-white text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground")}
          >
            Tayyor Mahsulot
          </button>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'uz' ? 'Qidirish...' : 'Поиск...'}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Nomlanishi</th>
                <th className="px-6 py-4">Kategoriya</th>
                <th className="px-6 py-4">Qoldiq</th>
                <th className="px-6 py-4">Narxi (Birlik)</th>
                <th className="px-6 py-4">Jami Qiymat</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Yuklanmoqda...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Ma'lumot topilmadi</td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLowStock = item.stock_level <= item.min_stock_level;
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", 
                            isLowStock ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                          )}>
                            {item.category_name.toLowerCase().includes('tayyor') ? <Factory className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {item.id.split('-')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {item.category_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-bold", isLowStock ? "text-red-600" : "text-foreground")}>
                            {item.stock_level}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.unit}</span>
                          {isLowStock && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 ml-1" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {formatCurrency(item.price_per_unit)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {formatCurrency(item.stock_level * item.price_per_unit)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
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

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Yangi maxsulot/xomashyo qo'shish</h2>
                <p className="text-sm text-muted-foreground mt-1">Ombor bazasiga yangi qator qo'shish</p>
              </div>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Nomi</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Masalan: Fotoplyonka A4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Kategoriya</label>
                  <select 
                    required
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">O'lchov Birligi</label>
                  <select 
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="dona">Dona</option>
                    <option value="metr">Metr</option>
                    <option value="kg">Kg</option>
                    <option value="litr">Litr</option>
                    <option value="rulon">Rulon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Boshlang'ich Qoldiq</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={formData.stock_level}
                    onChange={e => setFormData({...formData, stock_level: Number(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Minimal chegara (Alert)</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={formData.min_stock_level}
                    onChange={e => setFormData({...formData, min_stock_level: Number(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">1 Birlik Narxi (UZS)</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={formData.price_per_unit}
                  onChange={e => setFormData({...formData, price_per_unit: Number(e.target.value)})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
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
                  disabled={isSubmitting || !formData.name || !formData.category_id}
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
