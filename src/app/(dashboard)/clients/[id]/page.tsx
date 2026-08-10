'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Phone, Mail, MapPin, AlertTriangle, 
  Filter, Calendar, Download, CheckCircle2
} from 'lucide-react';
import { mockClients, mockOrders } from '@/lib/mock-data';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  // Try to find the client, fallback to first mock client if not found
  const client = mockClients.find(c => c.id === params.id) || mockClients[0];
  const clientOrders = mockOrders.filter(o => o.client_id === client.id);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/crm" className="hover:text-foreground transition-colors">CRM</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/clients" className="hover:text-foreground transition-colors">Clients</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{client.name}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-lg border border-border bg-gray-50 flex items-center justify-center p-2">
            <div className="w-full h-full rounded bg-white border border-border flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-muted-foreground">{client.name.charAt(0)}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-3">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {client.phone}
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                contact@{client.name.toLowerCase().replace(/\s+/g, '')}.com
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Tashkent, UZ
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Balance</span>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xl border",
              client.balance < 0 
                ? "bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5]" 
                : "bg-green-50 text-green-700 border-green-200"
            )}>
              {client.balance < 0 && <AlertTriangle className="w-5 h-5" />}
              {formatCurrency(client.balance)}
            </div>
          </div>
          <button className="w-full md:w-auto px-6 py-2 bg-[#0f62fe] text-white text-sm font-medium rounded-md hover:bg-[#0353e9] transition-colors flex items-center justify-center gap-2">
            <WalletIcon className="w-4 h-4" />
            Receive Payment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        <button className="pb-3 text-sm font-semibold text-[#0f62fe] border-b-2 border-[#0f62fe]">
          Order History
        </button>
        <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Payment History
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-border">
        {/* Table Header & Actions */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border bg-white rounded-md hover:bg-muted transition-colors text-foreground">
              <Filter className="w-4 h-4 text-muted-foreground" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border bg-white rounded-md hover:bg-muted transition-colors text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Last 90 Days
            </button>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-[#0f62fe] hover:underline">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product / Run</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {clientOrders.map((order, i) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/crm/${order.id}`} className="font-semibold text-[#0f62fe] hover:underline">
                      #{order.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {formatDateTime(order.created_at).split(',')[0]} {/* Just Date */}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      Photobook Production Run {/* Mock Product */}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                      Qty: 50 units
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'delivered' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e2e8f0] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e0e7ff] text-[#0f62fe]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0f62fe]" /> In Production
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {/* If empty, show mock data matching screenshot */}
              {clientOrders.length === 0 && (
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <a href="#" className="font-semibold text-[#0f62fe] hover:underline">#ORD-9021</a>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">Oct 24, 2023</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">Custom Aluminum Extrusion</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Qty: 5,000 units</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">$42,500.00</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e0e7ff] text-[#0f62fe]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0f62fe]" /> In Production
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-white">
          <p className="text-xs text-muted-foreground font-medium">Showing 1 to {Math.max(clientOrders.length, 4)} of 24 orders</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 flex items-center justify-center rounded-md border border-border bg-white text-muted-foreground text-xs font-medium hover:bg-muted transition-colors">
              Previous
            </button>
            <button className="px-4 py-1.5 flex items-center justify-center rounded-md border border-border bg-white text-foreground text-xs font-medium hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
