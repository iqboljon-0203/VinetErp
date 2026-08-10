'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, Star, Wallet, TrendingUp, Download, Filter, 
  MoreHorizontal, Key, Edit, Trash
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { mockKpiSummaries } from '@/lib/mock-data';
import { getUsers } from '@/lib/api';

export default function StaffPage() {
  const { language, userRole } = useAppStore();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'password'>('create');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'worker',
    base_salary: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (mode: 'create' | 'password', user?: any) => {
    setModalMode(mode);
    setErrorMsg('');
    if (mode === 'create') {
      setFormData({ name: '', email: '', password: '', phone: '', role: 'worker', base_salary: 0 });
    } else if (mode === 'password' && user) {
      setSelectedUser(user);
      setFormData({ ...formData, password: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server error');
      } else if (modalMode === 'password') {
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser.id, newPassword: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server error');
      }

      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPayrollEst = usersList.reduce((sum, u) => sum + (u.base_salary || 0), 0);
  const totalKpi = mockKpiSummaries.reduce((sum, k) => sum + k.total_kpi, 0);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">HR & Xodimlar</h1>
          <p className="text-sm text-muted-foreground mt-1">Xodimlarni va rollarni boshqarish.</p>
        </div>
        {userRole === 'admin' && (
          <button 
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0f62fe] text-white rounded-md hover:bg-[#0353e9] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yangi Xodim Qo'shish
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-border p-6 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] pointer-events-none">
            <Users className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Jami xodimlar</h3>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-foreground">{usersList.length} Faol</span>
          </div>
        </div>
      </div>

      {/* Staff Directory */}
      <div className="bg-white rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Xodimlar ro'yxati</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Xodim</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Oylik (Base)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">Yuklanmoqda...</td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">Xodimlar topilmadi.</td>
                </tr>
              ) : (
                usersList.map((user) => {
                  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
                  
                  return (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-muted-foreground">{user.phone}</p>
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-foreground">
                        {formatCurrency(user.base_salary)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {userRole === 'admin' && (
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleOpenModal('password', user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Parolni o'zgartirish"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {modalMode === 'create' ? 'Yangi xodim qo`shish' : 'Parolni o`zgartirish'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {errorMsg && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {modalMode === 'create' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ismi</label>
                    <input 
                      type="text" 
                      required 
                      className="input-field"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email (Login)</label>
                    <input 
                      type="email" 
                      required 
                      className="input-field"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefon</label>
                    <input 
                      type="text" 
                      className="input-field"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rol</label>
                    <select 
                      className="input-field"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="admin">Admin</option>
                      <option value="seller">Sotuvchi (CRM)</option>
                      <option value="warehouse">Omborchi</option>
                      <option value="worker">Ishchi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Oylik (Base)</label>
                    <input 
                      type="number" 
                      className="input-field"
                      value={formData.base_salary}
                      onChange={e => setFormData({...formData, base_salary: Number(e.target.value)})}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {modalMode === 'create' ? 'Parol' : 'Yangi Parol'}
                </label>
                <input 
                  type="text" 
                  required 
                  minLength={6}
                  className="input-field"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
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
