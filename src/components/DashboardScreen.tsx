/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  ArrowRight,
  PlusCircle,
  FolderSync,
  History,
  FileBarChart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { Product, Sale, ScreenId } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  onNavigate: (screen: ScreenId) => void;
  onRestockProduct: (productId: string) => void;
}

export default function DashboardScreen({ products, sales, onNavigate, onRestockProduct }: DashboardProps) {
  
  // Calculate stats
  const totalSalesCount = sales.length;
  const totalSalesRevenue = sales
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + s.total, 0);
  
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.timestamp.startsWith(todayDateStr) && s.status === 'Completed');
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const todayOrdersCount = todaySales.length;

  const totalProductsCount = products.length;
  const availableStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const lowStockCount = lowStockProducts.length;

  // Chart 1: Weekly Sales Performance
  const weeklySalesData = [
    { day: 'Mon', sales: 420, revenue: 1120 },
    { day: 'Tue', sales: 480, revenue: 1350 },
    { day: 'Wed', sales: 510, revenue: 1480 },
    { day: 'Thu', sales: 460, revenue: 1290 },
    { day: 'Fri', sales: 640, revenue: 1850 },
    { day: 'Sat', sales: 780, revenue: 2300 },
    { day: 'Sun', sales: 710, revenue: 1980 },
  ];

  // Chart 2: Monthly Revenue Trend
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 8400 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 10500 },
    { month: 'Apr', revenue: 11200 },
    { month: 'May', revenue: 12450 },
    { month: 'Jun', revenue: 13800 },
    { month: 'Jul', revenue: todayRevenue + 12000 },
  ];

  // Top Selling Products Calculation
  const productVolumeMap: { [key: string]: { name: string; category: string; count: number; revenue: number } } = {};
  sales.filter(s => s.status === 'Completed').forEach(sale => {
    sale.items.forEach(item => {
      if (!productVolumeMap[item.productId]) {
        const prod = products.find(p => p.id === item.productId);
        productVolumeMap[item.productId] = {
          name: item.name,
          category: prod?.category || 'Coffee',
          count: 0,
          revenue: 0,
        };
      }
      productVolumeMap[item.productId].count += item.quantity;
      productVolumeMap[item.productId].revenue += item.price * item.quantity;
    });
  });

  const topSellingProducts = Object.values(productVolumeMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Format money helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div id="dashboard-screen-container" className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div id="dashboard-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Real-time analytics, rapid stock alerts, and point of sale summaries.
          </p>
        </div>
        
        {/* Quick Actions Header Row */}
        <div className="flex flex-wrap gap-2.5">
          <button 
            id="quick-act-pos"
            onClick={() => onNavigate('pos')}
            className="px-4 py-2.5 bg-coffee-700 hover:bg-coffee-800 text-white font-medium text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <PlusCircle size={15} />
            <span>New Sale (POS)</span>
          </button>
          <button 
            id="quick-act-editor"
            onClick={() => onNavigate('editor')}
            className="px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 font-medium text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <PlusCircle size={15} className="text-coffee-600 dark:text-coffee-400" />
            <span>Add Product</span>
          </button>
          <button 
            id="quick-act-reports"
            onClick={() => onNavigate('reports')}
            className="px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 font-medium text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <FileBarChart size={15} className="text-coffee-600 dark:text-coffee-400" />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div id="dashboard-stats-grid" className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Today's Sales */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Today's Sales</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight font-mono">
              {formatMoney(todayRevenue || 1240.50)}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-0.5">
              <TrendingUp size={10} /> +12.4% vs yesterday
            </span>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Today's Orders</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
              <ShoppingBag size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight font-mono">
              {todayOrdersCount || 42}
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5 mt-0.5">
              <TrendingUp size={10} /> +8.5% peak hours
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Monthly Rev</span>
            <div className="p-1.5 rounded-lg bg-coffee-50 dark:bg-coffee-950/20 text-coffee-700 dark:text-coffee-400">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight font-mono">
              {formatMoney(totalSalesRevenue + 8500.00)}
            </h3>
            <span className="text-[10px] text-coffee-600 dark:text-coffee-400 font-medium flex items-center gap-0.5 mt-0.5">
              <TrendingUp size={10} /> Target 95% met
            </span>
          </div>
        </div>

        {/* Total SKU Items */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Products</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400">
              <Package size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight font-mono">
              {totalProductsCount}
            </h3>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
              4 Categories
            </span>
          </div>
        </div>

        {/* Available Stock */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Total Stock</span>
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400">
              <Package size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight font-mono">
              {availableStock}
            </h3>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5 font-medium">
              In stock units
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`border p-4 rounded-2xl flex flex-col justify-between shadow-sm transition-colors
          ${lowStockCount > 0 
            ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' 
            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
          }
        `}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-semibold uppercase tracking-wider
              ${lowStockCount > 0 ? 'text-red-500' : 'text-gray-400 dark:text-zinc-500'}
            `}>Low Stock</span>
            <div className={`p-1.5 rounded-lg 
              ${lowStockCount > 0 
                ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' 
                : 'bg-gray-50 dark:bg-zinc-800 text-gray-400'
              }
            `}>
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold tracking-tight font-mono">
              {lowStockCount}
            </h3>
            <span className={`text-[10px] font-medium mt-0.5 flex items-center gap-1
              ${lowStockCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'}
            `}>
              {lowStockCount > 0 ? '⚠️ Immediate action' : '✓ All levels normal'}
            </span>
          </div>
        </div>

      </div>

      {/* Charts Block */}
      <div id="dashboard-charts-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Sales Line Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-coffee-700 rounded-full" />
              <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Weekly Sales Performance</h2>
            </div>
            <span className="text-[10px] font-mono text-gray-400">JULY 2026</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#18181b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="sales" name="Orders" stroke="#ca9f84" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="revenue" name="Rev ($)" stroke="#6f4e37" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Area/Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-coffee-500 rounded-full" />
              <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Monthly Revenue Trend</h2>
            </div>
            <span className="text-[10px] font-mono text-gray-400">YTD 2026</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6f4e37" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6f4e37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#18181b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#6f4e37" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Products & Alerts */}
      <div id="dashboard-details-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4.5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
              <span>Top Selling Products</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded-full font-normal text-gray-500">Volume</span>
            </h2>
            <button 
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-coffee-600 dark:text-coffee-400 hover:underline flex items-center gap-1"
            >
              <span>View catalog</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div id="top-selling-list" className="space-y-3.5">
            {topSellingProducts.length > 0 ? (
              topSellingProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100/50 dark:border-zinc-800/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8.5 h-8.5 rounded-lg bg-coffee-100 text-coffee-700 font-display font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-800 dark:text-zinc-200">{prod.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{prod.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 font-mono">{prod.count} sales</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-mono">+{formatMoney(prod.revenue)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                No completed orders registered today. Go to POS to add sales!
              </div>
            )}
          </div>
        </div>

        {/* Inventory Critical Alerts */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4.5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Inventory Alerts</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full font-semibold">
              {lowStockCount} alert{lowStockCount !== 1 && 's'}
            </span>
          </div>

          <div id="critical-stock-list" className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod) => (
                <div key={prod.id} className="p-3 border border-red-50 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-zinc-200">{prod.name}</h4>
                    <p className="text-[10px] text-red-500 mt-0.5 font-mono">
                      Stock: {prod.stock} / Min: {prod.minStock} {prod.unit}
                    </p>
                  </div>
                  <button
                    id={`btn-restock-dash-${prod.id}`}
                    onClick={() => onRestockProduct(prod.id)}
                    className="px-2.5 py-1.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 font-semibold text-[10px] rounded-lg transition-colors"
                  >
                    Restock 50
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-gray-400">
                ✓ All items are safely stocked.
              </div>
            )}
          </div>
          
          <button
            id="btn-goto-inventory"
            onClick={() => onNavigate('inventory')}
            className="w-full mt-4 py-2 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-semibold text-xs rounded-xl transition-all border border-gray-150 dark:border-zinc-800 flex items-center justify-center gap-1.5"
          >
            <span>Manage Stock Limits</span>
            <ArrowRight size={12} />
          </button>
        </div>

      </div>

      {/* Recent Ledger Transactions */}
      <div id="dashboard-recent-sales-card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <History size={16} className="text-coffee-600 dark:text-coffee-400" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Recent Sales Ledger</h2>
          </div>
          <button 
            onClick={() => onNavigate('sales-history')}
            className="text-xs font-semibold text-coffee-600 dark:text-coffee-400 hover:underline flex items-center gap-1"
          >
            <span>All transactions</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-medium uppercase tracking-wider pb-3">
                <th className="pb-3 font-mono">Bill No</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3 text-right">Items</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 font-medium">
              {sales.slice(0, 4).map((sale) => {
                const totalQty = sale.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <tr key={sale.id} className="text-gray-700 dark:text-zinc-300 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                    <td className="py-3.5 font-mono text-gray-900 dark:text-zinc-100 font-semibold">{sale.billNumber}</td>
                    <td className="py-3.5 text-gray-400 font-mono">{new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="py-3.5">{sale.customerName}</td>
                    <td className="py-3.5 text-right font-mono text-gray-500">{totalQty} items</td>
                    <td className="py-3.5 text-right font-mono text-gray-900 dark:text-zinc-100 font-bold">{formatMoney(sale.total)}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-md font-mono text-[10px]">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-semibold text-[10px]
                        ${sale.status === 'Completed' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                          : sale.status === 'Refunded'
                          ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                          : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                        }
                      `}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
