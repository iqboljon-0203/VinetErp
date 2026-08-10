'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldCheck, User, Package, Wrench, MoreVertical, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { ROLE_LABELS } from '@/lib/constants';
import type { UserRole, User as LocalUser } from '@/lib/types';

export default function HRPage() {
  const { language, userRole } = useAppStore();
  
  // State for User List
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Create User Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seller' as UserRole,
    phone: '',
    base_salary: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setUsers(data);
    }
    setIsLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      setFormStatus({ type: 'success', message: 'Yangi foydalanuvchi muvaffaqiyatli yaratildi!' });
      setFormData({ name: '', email: '', password: '', role: 'seller', phone: '', base_salary: 0 });
      fetchUsers(); // Refresh list

      // Auto close after success
      setTimeout(() => {
        setShowCreateModal(false);
        setFormStatus(null);
      }, 2000);
      
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="p-8 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground">Kirish taqiqlangan</h2>
          <p className="text-muted-foreground mt-2">Bu sahifani faqat Admin ko'ra oladi.</p>
        </div>
      </div>
    );
  }

  const roleIcons = {
    admin: ShieldCheck,
    seller: User,
    warehouse: Package,
    worker: Wrench,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Xodimlar Boshqaruvi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Yangi xodimlarni tizimga qo'shish va parollarini boshqarish
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Yangi Xodim
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Jami xodimlar</p>
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Adminlar</p>
          <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Sotuvchilar</p>
          <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.role === 'seller').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Ustalar</p>
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'worker').length}</p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Xodimlar ro'yxati</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Xodim</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Telefon</th>
                <th className="px-6 py-4">Oylik (Oklad)</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : users.map((user) => {
                const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User;
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate w-40">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{ROLE_LABELS[user.role]?.[language] || user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {user.base_salary > 0 ? `${user.base_salary.toLocaleString()} UZS` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-bold">Yangi xodim qo'shish</h2>
              <p className="text-sm text-muted-foreground mt-1">Tizimga kirish uchun login va parol yarating</p>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              
              {formStatus && (
                <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                  formStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {formStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <p className="mt-0.5">{formStatus.message}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">F.I.O</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Aliyev Vali"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Rol</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="seller">Sotuvchi (CRM)</option>
                  <option value="warehouse">Omborchi</option>
                  <option value="worker">Usta (Ishlab chiqarish)</option>
                  <option value="admin">Admin (Rahbar)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email (Login)</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="vali@dreamerp.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Parol</label>
                  <input 
                    type="text" 
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Eng kamida 6ta belgi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Telefon</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="+99890..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Oklad (UZS)</label>
                  <input 
                    type="number" 
                    value={formData.base_salary}
                    onChange={e => setFormData({...formData, base_salary: Number(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
