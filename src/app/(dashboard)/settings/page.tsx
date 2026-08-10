'use client';

import React, { useState } from 'react';
import { 
  SlidersHorizontal, Shield, Puzzle, Send, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [tgEnabled, setTgEnabled] = useState(true);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure platform preferences, manage access, and connect external services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Nav */}
        <div className="md:col-span-3 space-y-1">
          <button 
            onClick={() => setActiveTab('general')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
              activeTab === 'general' ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            General
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
              activeTab === 'users' ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Shield className="w-4 h-4" />
            Users & Roles
          </button>

          <button 
            onClick={() => setActiveTab('integrations')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
              activeTab === 'integrations' ? "bg-blue-50/50 text-[#0f62fe] border-l-4 border-l-[#0f62fe]" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-4 border-l-transparent"
            )}
          >
            <Puzzle className="w-4 h-4" />
            Integrations
          </button>
        </div>

        {/* Right Content */}
        <div className="md:col-span-9">
          {activeTab === 'integrations' && (
            <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-1">Integration Settings</h2>
              <p className="text-sm text-muted-foreground mb-8">Manage connections with third-party tools and communication channels.</p>

              {/* Telegram Card */}
              <div className="border border-border rounded-lg p-6">
                {/* Header & Toggle */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Telegram Bot Notifications</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Send real-time alerts and daily summaries to a secure Telegram channel.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setTgEnabled(!tgEnabled)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        tgEnabled ? "bg-[#0f62fe]" : "bg-gray-300"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        tgEnabled ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                    <span className="text-sm font-medium text-foreground">Enable</span>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2">
                      Telegram Bot Token <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password" 
                      defaultValue="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono text-2xl tracking-widest leading-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2">
                      Admin Chat ID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      defaultValue="-100987654321"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3">Notification Events</h4>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex h-5 items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#0f62fe] focus:ring-[#0f62fe]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Low Stock Alerts</p>
                      <p className="text-xs text-muted-foreground">Immediate notification when inventory falls below minimum thresholds.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex h-5 items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#0f62fe] focus:ring-[#0f62fe]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Daily Financial Summary</p>
                      <p className="text-xs text-muted-foreground">Automated end-of-day report on production costs and margins.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex h-5 items-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#0f62fe] focus:ring-[#0f62fe]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">New Orders (High Priority)</p>
                      <p className="text-xs text-muted-foreground">Alert for new incoming orders tagged as critical or high volume.</p>
                    </div>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                  <button className="px-6 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors text-foreground">
                    Cancel
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-[#0f62fe] text-white rounded-md hover:bg-[#0353e9] transition-colors shadow-sm">
                    <Zap className="w-4 h-4 fill-current" />
                    Save & Test Connection
                  </button>
                </div>

              </div>
            </div>
          )}

          {activeTab !== 'integrations' && (
            <div className="bg-white rounded-xl border border-border p-8 shadow-sm h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Select Integrations to see the configured view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
