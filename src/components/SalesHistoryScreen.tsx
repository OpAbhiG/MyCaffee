/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  DollarSign, 
  FileText, 
  RotateCcw, 
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { Sale, ScreenId } from '../types';

interface SalesHistoryProps {
  sales: Sale[];
  onRefundSale: (saleId: string) => void;
}

export default function SalesHistoryScreen({ sales, onRefundSale }: SalesHistoryProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeDateTab, setActiveDateTab] = useState('All');
  const [selectedSaleReceipt, setSelectedSaleReceipt] = useState<Sale | null>(null);

  // Stats summaries
  const stats = useMemo(() => {
    const completed = sales.filter(s => s.status === 'Completed');
    const revenue = completed.reduce((sum, s) => sum + s.total, 0);
    const avgBill = completed.length > 0 ? revenue / completed.length : 0;
    return {
      revenue,
      avgBill,
      totalCount: sales.length,
      refundCount: sales.filter(s => s.status === 'Refunded').length
    };
  }, [sales]);

  // Filters calculation
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      // 1. Search Query
      const matchesSearch = 
        s.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Payment Method
      const matchesMethod = methodFilter === 'All' || s.paymentMethod === methodFilter;

      // 3. Status
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

      // 4. Date Tabs
      let matchesDate = true;
      const saleDate = new Date(s.timestamp);
      const today = new Date();
      
      if (activeDateTab === 'Today') {
        matchesDate = saleDate.toDateString() === today.toDateString();
      } else if (activeDateTab === 'Yesterday') {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        matchesDate = saleDate.toDateString() === yesterday.toDateString();
      } else if (activeDateTab === 'This Week') {
        // Simple 7 days calculation
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = saleDate >= sevenDaysAgo;
      } else if (activeDateTab === 'This Month') {
        matchesDate = saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesMethod && matchesStatus && matchesDate;
    });
  }, [sales, searchQuery, methodFilter, statusFilter, activeDateTab]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getPaymentColor = (method: string) => {
    switch (method) {
      case 'Cash': return 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400';
      case 'Card': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400';
      case 'UPI': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div id="sales-history-screen" className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div id="history-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <History className="text-coffee-700" size={24} />
            <span>Sales Ledger</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Access past invoices, handle refunds, review customer tickets, and track transaction logs.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div id="history-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Invoices */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Invoices</span>
          <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 font-mono mt-1">{stats.totalCount}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">All time records</p>
        </div>

        {/* Ledger Net Sales */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Ledger Net Sales</span>
          <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{formatMoney(stats.revenue)}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Completed orders</p>
        </div>

        {/* Average Transaction Value */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Avg. Bill Value</span>
          <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 font-mono mt-1">{formatMoney(stats.avgBill)}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Per checked order</p>
        </div>

        {/* Total Refunds */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Refunded Orders</span>
          <h3 className="text-lg font-black text-red-500 font-mono mt-1">{stats.refundCount}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Inverted records</p>
        </div>

      </div>

      {/* Search, Filter, Date Row */}
      <div id="history-filter-card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm space-y-4">
        
        {/* Date Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-50 dark:border-zinc-800 pb-3 scrollbar-none">
          {['All', 'Today', 'Yesterday', 'This Week', 'This Month'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveDateTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${activeDateTab === tab 
                  ? 'bg-coffee-700 text-white shadow-sm' 
                  : 'bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={14} />
            </span>
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bill Number, Customer Name..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <select
              id="history-method-select"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
            >
              <option value="All">All Payment Methods</option>
              <option value="Cash">Cash Only</option>
              <option value="Card">Card Only</option>
              <option value="UPI">UPI Only</option>
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              id="history-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

        </div>

      </div>

      {/* Ledger Table Panel */}
      <div id="ledger-table-card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/20 border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-4 px-5">Invoicing Code</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Purchased Items</th>
                <th className="py-4 px-4 text-right">Receipt Amount</th>
                <th className="py-4 px-4">Method</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 font-medium">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const itemsSummary = sale.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
                  return (
                    <tr 
                      key={sale.id} 
                      id={`ledger-row-${sale.id}`}
                      className="text-gray-700 dark:text-zinc-300 hover:bg-gray-50/30 dark:hover:bg-zinc-800/10 transition-colors"
                    >
                      {/* Invoicing Code */}
                      <td className="py-4.5 px-5 font-mono text-gray-900 dark:text-zinc-100 font-semibold">
                        {sale.billNumber}
                      </td>

                      {/* Date */}
                      <td className="py-4.5 px-4 text-gray-400 font-mono">
                        {new Date(sale.timestamp).toLocaleDateString()} {new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>

                      {/* Customer */}
                      <td className="py-4.5 px-4 font-bold text-gray-800 dark:text-zinc-200">
                        {sale.customerName}
                      </td>

                      {/* Items summary */}
                      <td className="py-4.5 px-4 max-w-[200px] truncate" title={itemsSummary}>
                        <span className="text-gray-500 font-normal">{itemsSummary}</span>
                      </td>

                      {/* Amount */}
                      <td className="py-4.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-zinc-100">
                        {formatMoney(sale.total)}
                      </td>

                      {/* Method */}
                      <td className="py-4.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono ${getPaymentColor(sale.paymentMethod)}`}>
                          {sale.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px]
                          ${sale.status === 'Completed' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                          }
                        `}>
                          {sale.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Receipt Action */}
                          <button
                            id={`btn-ledger-receipt-${sale.id}`}
                            onClick={() => setSelectedSaleReceipt(sale)}
                            title="View Receipt"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-coffee-700 dark:hover:text-coffee-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <FileText size={13.5} />
                          </button>
                          
                          {/* Refund Action */}
                          <button
                            id={`btn-ledger-refund-${sale.id}`}
                            disabled={sale.status === 'Refunded'}
                            onClick={() => {
                              if (window.confirm(`Issue complete refund for invoice ${sale.billNumber}?`)) {
                                onRefundSale(sale.id);
                              }
                            }}
                            title={sale.status === 'Refunded' ? 'Already Refunded' : 'Issue Refund'}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-20 disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                          >
                            <RotateCcw size={13.5} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500 font-medium">
                    No transactions matched current filters. Clear filters to load past ledger archives.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Receipt Modal Popup */}
      {selectedSaleReceipt && (
        <div id="receipt-details-backdrop" className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div id="receipt-details-modal" className="bg-white dark:bg-zinc-900 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl p-6 border border-gray-100 dark:border-zinc-800 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800/80">
              <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-1.5">
                <FileText size={16} className="text-coffee-700" />
                <span>Invoice Receipt details</span>
              </h3>
              <button 
                onClick={() => setSelectedSaleReceipt(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="font-mono text-[10px] text-gray-600 dark:text-zinc-400 space-y-2 leading-relaxed bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-dashed border-gray-250 dark:border-zinc-800">
              <div className="text-center font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest text-xs">THE DAILY GRIND</div>
              <div className="text-center border-b border-gray-200 dark:border-zinc-800/80 pb-2">104 Coffee Lane, CA</div>
              
              <div className="flex justify-between mt-2 text-gray-400 font-medium">
                <span>Bill: {selectedSaleReceipt.billNumber}</span>
                <span>Status: {selectedSaleReceipt.status}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Date: {new Date(selectedSaleReceipt.timestamp).toLocaleDateString()}</span>
                <span>Time: {new Date(selectedSaleReceipt.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="text-gray-400 mb-2 font-medium">Customer: {selectedSaleReceipt.customerName}</div>
              <div className="border-b border-gray-200 dark:border-zinc-800/80 my-2" />

              {/* Items detail list */}
              <div className="space-y-1.5">
                {selectedSaleReceipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-700 dark:text-zinc-300 font-semibold">
                    <span>{index + 1}. {item.name} (x{item.quantity})</span>
                    <span>{formatMoney(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-gray-200 dark:border-zinc-800/80 my-2" />
              
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>{formatMoney(selectedSaleReceipt.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Tax (8%)</span>
                <span>{formatMoney(selectedSaleReceipt.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-zinc-100 text-xs mt-2 border-t border-gray-200 dark:border-zinc-800/80 pt-2">
                <span>Total Checked</span>
                <span>{formatMoney(selectedSaleReceipt.total)}</span>
              </div>
              <div className="flex justify-between text-gray-400 mt-1 font-medium">
                <span>Payment Mode</span>
                <span>{selectedSaleReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                id="btn-ledger-receipt-print"
                onClick={() => { alert('Invoiced receipt reprint complete.'); setSelectedSaleReceipt(null); }}
                className="flex-1 py-2.5 bg-coffee-700 hover:bg-coffee-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
              >
                Reprint Receipt
              </button>
              <button
                onClick={() => setSelectedSaleReceipt(null)}
                className="py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-colors text-center"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
