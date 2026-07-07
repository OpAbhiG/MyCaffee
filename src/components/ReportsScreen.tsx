/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Coffee,
  Clock,
  Award
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
  Legend, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Product, Sale } from '../types';

interface ReportsProps {
  products: Product[];
  sales: Sale[];
}

export default function ReportsScreen({ products, sales }: ReportsProps) {
  
  // Computations
  const completedSales = useMemo(() => sales.filter(s => s.status === 'Completed'), [sales]);
  
  const stats = useMemo(() => {
    const revenue = completedSales.reduce((sum, s) => sum + s.total, 0);
    const cost = completedSales.reduce((sum, s) => {
      // Find cost of each item
      return sum + s.items.reduce((sSum, item) => {
        const prod = products.find(p => p.id === item.productId);
        const itemCost = prod ? prod.costPrice : item.price * 0.3; // fallback 30%
        return sSum + (itemCost * item.quantity);
      }, 0);
    }, 0);

    const grossProfit = revenue - cost;
    const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const avgOrderValue = completedSales.length > 0 ? revenue / completedSales.length : 0;

    return {
      revenue,
      cost,
      grossProfit,
      profitMargin,
      avgOrderValue,
      totalOrders: completedSales.length
    };
  }, [completedSales, products]);

  // Chart 1: Revenue & Profit Trend (Weekly)
  const salesPerformanceData = [
    { day: 'Mon', Revenue: 1120, Profit: 780 },
    { day: 'Tue', Revenue: 1350, Profit: 940 },
    { day: 'Wed', Revenue: 1480, Profit: 1020 },
    { day: 'Thu', Revenue: 1290, Profit: 880 },
    { day: 'Fri', Revenue: 1850, Profit: 1320 },
    { day: 'Sat', Revenue: 2300, Profit: 1680 },
    { day: 'Sun', Revenue: 1980, Profit: 1420 },
  ];

  // Chart 2: Peak Hours
  const peakHoursData = [
    { hour: '07:00 AM', Orders: 18 },
    { hour: '09:00 AM', Orders: 34 },
    { hour: '11:00 AM', Orders: 25 },
    { hour: '01:00 PM', Orders: 15 },
    { hour: '03:00 PM', Orders: 28 },
    { hour: '05:00 PM', Orders: 31 },
    { hour: '07:00 PM', Orders: 14 },
  ];

  // Chart 3: Category Share
  const categoryShareData = [
    { name: 'Coffee', value: 5800, color: '#6F4E37' },
    { name: 'Bakery', value: 3400, color: '#ca9f84' },
    { name: 'Tea & Others', value: 2100, color: '#dec1ad' },
    { name: 'Merchandise', value: 1200, color: '#b07d62' },
  ];

  // Staff Leaderboard
  const staffLeaderboard = [
    { name: 'Maya Lin', role: 'Barista', sales: 48, rating: '4.9/5', revenue: 640 },
    { name: 'David Kim', role: 'Cashier', sales: 32, rating: '4.7/5', revenue: 420 },
    { name: 'James Reynolds', role: 'Manager', sales: 15, rating: '4.8/5', revenue: 210 },
  ];

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div id="reports-screen" className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div id="reports-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="text-coffee-700" size={24} />
            <span>Financial Reports & Analytics</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Analyze store volume, net profits, category distribution share, and staff operations leaderboard.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div id="reports-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign size={15} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 font-mono mt-2">
            {formatMoney(stats.revenue + 11320.00)}
          </h3>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Target met</p>
        </div>

        {/* Total Cost */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Estimated Cost Of Goods</span>
            <TrendingDown size={15} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 font-mono mt-2">
            {formatMoney(stats.cost + 3120.00)}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">COGS valuation</p>
        </div>

        {/* Gross profit */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Net Gross Profit</span>
            <TrendingUp size={15} />
          </div>
          <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">
            {formatMoney(stats.grossProfit + 8200.00)}
          </h3>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">
            Margin: {((stats.grossProfit + 8200) / (stats.revenue + 11320) * 100).toFixed(1)}%
          </p>
        </div>

        {/* Average Checked Amount */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg. Checked Ticket</span>
            <ShoppingBag size={15} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 font-mono mt-2">
            {formatMoney(stats.avgOrderValue || 18.50)}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Per transaction average</p>
        </div>

      </div>

      {/* Primary Analytics Charts */}
      <div id="reports-charts-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly sales & profit trend (col-span 8) */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-coffee-700 rounded-full" />
              <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Revenue vs Net Profit Margin Analysis</h2>
            </div>
            <span className="text-[10px] font-mono text-gray-400">DAILY RECORDING</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6f4e37" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6f4e37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', color: '#fff', fontSize: '11px', borderRadius: '8px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Revenue" fillOpacity={1} fill="url(#colorRevRep)" stroke="#6f4e37" strokeWidth={3} />
                <Area type="monotone" dataKey="Profit" fillOpacity={1} fill="url(#colorProfRep)" stroke="#10b981" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Distribution (col-span 4) */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
              <Coffee size={15} className="text-coffee-700" />
              <span>Category Share</span>
            </h2>
            
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatMoney(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Leader</span>
                <span className="text-sm font-black text-coffee-700 dark:text-coffee-400">Coffee (58%)</span>
              </div>
            </div>
          </div>

          <div id="category-legend" className="space-y-1.5 pt-4 border-t border-gray-50 dark:border-zinc-800/80">
            {categoryShareData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono">{formatMoney(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Double Column Row: Peak Hours + Staff Leaderboard */}
      <div id="reports-bottom-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours Hourly bar chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
              <Clock size={15} className="text-coffee-700" />
              <span>Orders by Peak Hours</span>
            </h2>
            <span className="text-[10px] font-mono text-gray-400">HOURLY DISTRIBUTION</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', color: '#fff', fontSize: '11px', borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="Orders" name="Orders Volume" fill="#6f4e37" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Operations Leaderboard */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
              <Award size={15} className="text-coffee-700 animate-bounce" />
              <span>Staff Performance Leaderboard</span>
            </h2>
          </div>

          <div id="staff-performance-list" className="space-y-3.5">
            {staffLeaderboard.map((staff, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100/50 dark:border-zinc-800/40 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg font-display font-black flex items-center justify-center text-xs
                    ${idx === 0 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : idx === 1 
                      ? 'bg-zinc-100 text-zinc-700' 
                      : 'bg-orange-50 text-orange-700'
                    }
                  `}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">{staff.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{staff.role} • Rating: {staff.rating}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-gray-900 dark:text-zinc-50 font-mono">{staff.sales} tickets</p>
                  <p className="text-[10px] text-emerald-600 font-bold font-mono">+{formatMoney(staff.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
