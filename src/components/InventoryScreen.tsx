/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  RefreshCw,
  FolderSync,
  History,
  TrendingDown,
  TrendingUp,
  Package,
  Activity,
  UserCheck
} from 'lucide-react';
import { Product, InventoryLog } from '../types';

interface InventoryScreenProps {
  products: Product[];
  inventoryLogs: InventoryLog[];
  onRestock: (productId: string, amount: number) => void;
  onAuditAdjust: (productId: string, targetStock: number) => void;
}

export default function InventoryScreen({ 
  products, 
  inventoryLogs, 
  onRestock, 
  onAuditAdjust 
}: InventoryScreenProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockLevelFilter, setStockLevelFilter] = useState('All');
  
  // Local state for inline stock adjustments
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [customStockVal, setCustomStockVal] = useState<number>(0);

  // Stats
  const stats = useMemo(() => {
    const totalSkus = products.length;
    const lowStock = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValuation = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

    return { totalSkus, lowStock, outOfStock, totalValuation };
  }, [products]);

  // Filters
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      
      let matchesLevel = true;
      if (stockLevelFilter === 'Low Stock') {
        matchesLevel = p.stock <= p.minStock && p.stock > 0;
      } else if (stockLevelFilter === 'Out of Stock') {
        matchesLevel = p.stock === 0;
      } else if (stockLevelFilter === 'In Stock') {
        matchesLevel = p.stock > p.minStock;
      }

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [products, searchQuery, categoryFilter, stockLevelFilter]);

  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleInlineSave = (prodId: string) => {
    if (customStockVal < 0) {
      alert('Stock cannot be a negative value');
      return;
    }
    onAuditAdjust(prodId, customStockVal);
    setEditingStockId(null);
  };

  return (
    <div id="inventory-screen" className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div id="inventory-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <Boxes className="text-coffee-700" size={24} />
            <span>Stock Manager</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Real-time stock auditing, automatic alert thresholds, and logs of all incoming/outgoing items.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div id="inventory-stats-row" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total SKUs */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total SKU Items</span>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 font-mono mt-1">{stats.totalSkus}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-500">
            <Package size={18} />
          </div>
        </div>

        {/* Low Stock SKUs */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Low Stock SKUs</span>
            <h3 className={`text-lg font-black font-mono mt-1 ${stats.lowStock > 0 ? 'text-orange-500' : 'text-gray-900 dark:text-zinc-100'}`}>
              {stats.lowStock}
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${stats.lowStock > 0 ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-500'}`}>
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* Out of Stock SKUs */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Out of Stock SKUs</span>
            <h3 className={`text-lg font-black font-mono mt-1 ${stats.outOfStock > 0 ? 'text-red-500' : 'text-gray-900 dark:text-zinc-100'}`}>
              {stats.outOfStock}
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${stats.outOfStock > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Stock Value</span>
            <h3 className="text-lg font-black text-coffee-700 dark:text-coffee-400 font-mono mt-1">
              {formatMoney(stats.totalValuation)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-coffee-50 dark:bg-coffee-950/20 text-coffee-700 dark:text-coffee-400">
            <TrendingUp size={18} />
          </div>
        </div>

      </div>

      {/* Main Double Column Layout */}
      <div id="inventory-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Product stock adjustments table (col-span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-white dark:bg-zinc-900 p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="relative col-span-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Search size={14} />
              </span>
              <input
                id="inventory-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU or Name..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <select
                id="inventory-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                id="inventory-level-select"
                value={stockLevelFilter}
                onChange={(e) => setStockLevelFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="All">All Stock Levels</option>
                <option value="In Stock">Healthy Stock</option>
                <option value="Low Stock">Low Stock Alerts</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-zinc-800/20 border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Product Info</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3 text-right">In Stock Count</th>
                    <th className="py-3.5 px-3 text-center">Alert Limit</th>
                    <th className="py-3.5 px-4 text-center">Quick restock / audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 font-medium">
                  {filteredProducts.map(p => {
                    const isLow = p.stock <= p.minStock && p.stock > 0;
                    const isOut = p.stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/20 dark:hover:bg-zinc-800/10 transition-colors">
                        
                        {/* Info */}
                        <td className="py-3 px-4 max-w-[200px]">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-9 h-9 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 truncate">{p.name}</h4>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.sku}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                            {p.category}
                          </span>
                        </td>

                        {/* Stock Count */}
                        <td className="py-3 px-3 text-right">
                          {editingStockId === p.id ? (
                            <input
                              id={`input-stock-audit-${p.id}`}
                              type="number"
                              value={customStockVal}
                              onChange={(e) => setCustomStockVal(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 border border-coffee-500 bg-white dark:bg-zinc-800 rounded-md text-right font-mono text-xs text-gray-900 focus:outline-none"
                            />
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className={`font-mono text-sm font-bold
                                ${isOut ? 'text-red-600 font-black' : isLow ? 'text-orange-500' : 'text-gray-900 dark:text-zinc-100'}
                              `}>
                                {p.stock}
                              </span>
                              <span className="text-[9px] text-gray-400 font-normal">{p.unit}</span>
                            </div>
                          )}
                        </td>

                        {/* Min Level */}
                        <td className="py-3 px-3 text-center font-mono font-semibold text-gray-400">
                          {p.minStock} {p.unit}
                        </td>

                        {/* Audit / Restock Actions */}
                        <td className="py-3 px-4 text-center">
                          {editingStockId === p.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                id={`btn-audit-save-${p.id}`}
                                onClick={() => handleInlineSave(p.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-md transition-colors"
                              >
                                Save
                              </button>
                              <button
                                id={`btn-audit-cancel-${p.id}`}
                                onClick={() => setEditingStockId(null)}
                                className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-bold text-[10px] rounded-md transition-colors"
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                id={`btn-inventory-restock10-${p.id}`}
                                onClick={() => onRestock(p.id, 10)}
                                className="px-2 py-1 bg-coffee-50 dark:bg-coffee-950/20 hover:bg-coffee-100 text-coffee-700 dark:text-coffee-400 border border-coffee-100/30 rounded-lg text-[9px] font-bold transition-all"
                              >
                                +10
                              </button>
                              <button
                                id={`btn-inventory-restock50-${p.id}`}
                                onClick={() => onRestock(p.id, 50)}
                                className="px-2 py-1 bg-coffee-50 dark:bg-coffee-950/20 hover:bg-coffee-100 text-coffee-700 dark:text-coffee-400 border border-coffee-100/30 rounded-lg text-[9px] font-bold transition-all"
                              >
                                +50
                              </button>
                              <button
                                id={`btn-inventory-audit-${p.id}`}
                                onClick={() => {
                                  setEditingStockId(p.id);
                                  setCustomStockVal(p.stock);
                                }}
                                className="px-2 py-1 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-gray-200 dark:border-zinc-800 rounded-lg text-[9px] font-bold transition-all"
                              >
                                Audit
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column: Recent Inventory Activity Logs & Audit adjustments (col-span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 dark:border-zinc-800 pb-3">
              <h3 className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                <Activity size={14} className="text-coffee-700" />
                <span>Stock Operations Log</span>
              </h3>
              <span className="text-[9px] font-mono font-medium px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-full">
                Live Audit
              </span>
            </div>

            <div id="inventory-logs" className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
              {inventoryLogs.length > 0 ? (
                inventoryLogs.map((log) => {
                  const isStockIn = log.type === 'Stock In';
                  const isAlert = log.type === 'Low Stock Alert';
                  const isAudit = log.type === 'Audit Adjustment';

                  return (
                    <div 
                      key={log.id} 
                      className={`p-3 border rounded-xl flex flex-col space-y-1.5 transition-colors
                        ${isAlert 
                          ? 'border-red-50 bg-red-50/10 dark:border-red-950/20 dark:bg-red-950/5' 
                          : isStockIn 
                          ? 'border-emerald-50 bg-emerald-50/10 dark:border-emerald-950/10 dark:bg-emerald-950/5'
                          : 'border-gray-100 bg-gray-50/30 dark:border-zinc-800/40'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md
                          ${isAlert 
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/50' 
                            : isStockIn 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'
                            : isAudit
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50'
                            : 'bg-gray-100 text-gray-600 dark:bg-zinc-800'
                          }
                        `}>
                          {log.type}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gray-800 dark:text-zinc-200">{log.productName}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {log.sku}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100/50 dark:border-zinc-800/40 text-[10px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <UserCheck size={11} className="text-gray-400" />
                          <span>{log.user}</span>
                        </span>
                        <span className={`font-mono font-bold
                          ${isStockIn ? 'text-emerald-600' : 'text-red-500'}
                        `}>
                          {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  No stock activity logged yet. Issue restocks or make sales to generate entries.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
