'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setUser, language, setLanguage } = useAppStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Fetch user role from public.users table
      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        // Note: If no user record exists in public.users yet (e.g. just signed up in auth),
        // we'll default to 'admin' for now, but usually this is an error.
        const role = userData?.role || 'admin';
        
        // 3. Set global state
        setUser(authData.user, role as UserRole);
        
        // 4. Redirect to dashboard
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px] animate-in">
        {/* Language Toggle */}
        <div className="absolute -top-12 right-0">
          <button
            onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-white/80 backdrop-blur-sm rounded-lg border border-border hover:bg-white transition-colors"
          >
            {language === 'uz' ? '🇷🇺 Русский' : '🇺🇿 Oʻzbekcha'}
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-900/5 border border-white/50 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-44 h-14 flex items-center justify-center mb-2 overflow-hidden mix-blend-multiply">
              <img src="/logo.png" alt="VINET ERP" className="w-full h-full object-contain scale-[2.2]" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">VINET ERP</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'uz' ? 'Tizimga kirish' : 'Вход в систему'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {language === 'uz' ? 'Email manzil' : 'Email адрес'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vinet.uz"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {language === 'uz' ? 'Parol' : 'Пароль'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 mt-2',
                email && password
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {language === 'uz' ? 'Tizimga kirish' : 'Войти'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 VINET ERP. {language === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'Все права защищены.'}
        </p>
      </div>
    </div>
  );
}
