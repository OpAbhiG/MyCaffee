/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Coffee, 
  Boxes, 
  History, 
  BarChart3, 
  Settings, 
  Eye, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  storeName: string;
}

export default function Sidebar({ currentScreen, onNavigate, onLogout, storeName }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingBag },
    { id: 'products', label: 'Product Catalog', icon: Coffee },
    { id: 'inventory', label: 'Stock Manager', icon: Boxes },
    { id: 'sales-history', label: 'Sales Ledger', icon: History },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'showcase', label: 'Project Showcase', icon: Eye },
  ] as const;

  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAvmYBwsGbu11SHb4mAp_x8vhGe_h5m9UqUAugOINWnX6bLt-V6OiDOLDzoAPp75_td28aATKWlPFnAZQi3qz-MHpOmRn9Sa15hdbahT-Hi-8uVlcF9bemiJUp_CS5arnEy_7IWtSnr0I9h-mW4x8Ab2ckKK1hGnJ6oq0Iv8SawYQO2nKTm40zWcxau5yZ2tSvwCl3RK9oV0ngHU7Nmnieu5Qw8WPzBqw5RjzV1Prbg3BxBlus1LeWL";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        id="mobile-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-700 hover:text-coffee-700 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar container */}
      <div 
        id="sidebar-container"
        className={`fixed lg:sticky top-0 left-0 h-full bg-white dark:bg-[#0c0c0e] border-r border-gray-100 dark:border-white/5 flex flex-col transition-all duration-300 z-40
          ${isOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div id="sidebar-header" className="p-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-coffee-700 dark:bg-cyber-gradient text-white flex-shrink-0 dark:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Coffee size={20} />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-display font-semibold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
                  {storeName}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-coffee-600 dark:text-indigo-400 font-semibold">
                  BrewMaster OS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (item.id === 'products' && currentScreen === 'editor');
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-coffee-700 text-white shadow-md shadow-coffee-700/15 dark:bg-gradient-to-r dark:from-indigo-950/40 dark:to-cyan-950/20 dark:text-cyan-400 dark:border dark:border-indigo-500/30 dark:shadow-[0_0_15px_rgba(99,102,241,0.15)] font-semibold' 
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                  }
                `}
              >
                <Icon size={19} className={`flex-shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'} ${isActive && 'dark:text-cyan-400'}`} />
                {isOpen && (
                  <span className="text-sm tracking-wide whitespace-nowrap">{item.label}</span>
                )}
                
                {/* Active Indicator Pin for dark mode */}
                {isActive && (
                  <span className="absolute left-1 w-1 h-5 rounded-full bg-coffee-700 dark:bg-cyan-400 hidden lg:block" />
                )}
                
                {/* Tooltip for collapsed mode */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-950 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile / Bottom Action */}
        <div id="sidebar-footer" className="p-4 border-t border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/1">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <img 
              id="sidebar-user-avatar"
              src={avatarUrl} 
              alt="Eleanor Vance" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl border border-gray-150 dark:border-zinc-800 object-cover flex-shrink-0"
            />
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 truncate">Eleanor Vance</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 font-mono truncate">Administrator</p>
              </div>
            )}
            {isOpen && (
              <button 
                id="btn-sidebar-logout"
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {!isOpen && (
            <button
              id="btn-sidebar-collapsed-logout"
              onClick={onLogout}
              className="w-full mt-2 py-2 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
