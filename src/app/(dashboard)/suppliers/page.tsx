'use client';

import React, { useState } from 'react';
import { 
  Plus, Users, Wallet, Building2, Phone, Mail, 
  X, ChevronDown, DollarSign
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { mockSuppliers, mockRawMaterials } from '@/lib/mock-data';

export default function SuppliersPage() {
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);

  const totalDebt = mockSuppliers.reduce((sum, s) => sum + (s.balance < 0 ? s.balance : 0), 0);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto relative">
      {/* Background Content */}
      <div className={cn("transition-all duration-300", isSlideoverOpen ? "opacity-30 blur-sm pointer-events-none" : "opacity-100")}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suppliers & Purchases</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage raw material vendors and register incoming purchase orders.</p>
          </div>
          <button 
            onClick={() => setIsSlideoverOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0f62fe] text-white rounded-md hover:bg-[#0353e9] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Purchase
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Active Suppliers */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Active Suppliers</h3>
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-foreground">{mockSuppliers.length}</span>
            </div>
            <p className="text-xs text-[#0f62fe] font-medium">+2 this month</p>
          </div>

          {/* Total Payable Debt */}
          <div className="bg-[#fef2f2] rounded-xl border border-[#fecaca] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Payable Debt (Past Due Invs)</h3>
              <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-red-600">{formatCurrency(totalDebt)}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Across 3 vendors</p>
          </div>

          {/* YTD Purchases */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">YTD Purchases</h3>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-foreground">{formatCurrency(450000000)}</span>
            </div>
          </div>
        </div>

        {/* Supplier Directory Table */}
        <div className="bg-white rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Supplier Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white">
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Supplier Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Balance</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {mockSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded border border-border bg-gray-50 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{supplier.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">ID: SUP-{supplier.id.split('-')[0].toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{supplier.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span>contact@{supplier.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={cn(
                        "font-bold text-base",
                        supplier.balance < 0 ? "text-red-600" : "text-foreground"
                      )}>
                        {formatCurrency(supplier.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="px-3 py-1.5 text-xs font-medium border border-border rounded text-foreground hover:bg-muted transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Panel */}
      {isSlideoverOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/10 transition-opacity"
            onClick={() => setIsSlideoverOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-start justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-foreground">New Purchase (Kirim)</h2>
                <p className="text-sm text-muted-foreground mt-1">Register incoming raw materials</p>
              </div>
              <button 
                onClick={() => setIsSlideoverOpen(false)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
              
              {/* Select Supplier */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">
                  Select Supplier
                </label>
                <div className="relative">
                  <select className="w-full pl-4 pr-10 py-2.5 text-sm border border-border rounded-md text-foreground appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="">Choose a supplier...</option>
                    {mockSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Material Details Card */}
              <div className="border border-border rounded-lg p-5 bg-white">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 mb-4">
                  Material Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2">
                      Raw Material
                    </label>
                    <div className="relative">
                      <select className="w-full pl-4 pr-10 py-2 text-sm border border-border rounded-md text-foreground appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">Select item...</option>
                        {mockRawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-2">
                        Quantity Received
                      </label>
                      <div className="relative">
                        <input type="number" placeholder="0" className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-12" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Units</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-2">
                        Unit Price
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input type="text" placeholder="0.00" className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Purchase Value */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Purchase Value</span>
                <span className="text-xl font-bold text-foreground">$0.00</span>
              </div>

              {/* Payments */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2">
                    Amount Paid (Now)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input type="text" placeholder="0.00" className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2">
                    Amount to Debt
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-500" />
                    <input type="text" placeholder="0.00" className="w-full pl-8 pr-3 py-2 text-sm border border-red-200 bg-red-50/50 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-red-600 font-medium" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">
                  Notes / Reference
                </label>
                <textarea 
                  placeholder="e.g. PO-2023-109..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setIsSlideoverOpen(false)}
                className="px-6 py-2.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 text-sm font-medium bg-[#0f62fe] text-white rounded-md hover:bg-[#0353e9] transition-colors">
                Confirm Purchase
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
