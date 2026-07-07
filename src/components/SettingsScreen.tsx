/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Palette, 
  Users, 
  ShieldAlert, 
  Save, 
  Volume2, 
  RefreshCw,
  Moon,
  Sun,
  UserPlus
} from 'lucide-react';
import { StoreSettings, StaffMember } from '../types';

interface SettingsScreenProps {
  settings: StoreSettings;
  staffList: StaffMember[];
  onSaveSettings: (settings: StoreSettings) => void;
  onToggleStaffStatus: (staffId: string) => void;
  onAddStaff: (member: StaffMember) => void;
  onResetDatabase: () => void;
}

const BRAND_COLORS = [
  { name: 'Coffee Brown', hex: '#6F4E37' },
  { name: 'Charcoal Black', hex: '#1E1E1E' },
  { name: 'Forest Green', hex: '#2E5A44' },
  { name: 'Ocean Navy', hex: '#1E3A8A' },
  { name: 'Velvet Maroon', hex: '#7F1D1D' }
];

export default function SettingsScreen({ 
  settings, 
  staffList, 
  onSaveSettings, 
  onToggleStaffStatus, 
  onAddStaff, 
  onResetDatabase 
}: SettingsScreenProps) {
  
  // Local store profile
  const [storeName, setStoreName] = useState(settings.storeName);
  const [contact, setContact] = useState(settings.contact);
  const [address, setAddress] = useState(settings.address);
  const [website, setWebsite] = useState(settings.website);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  
  // Local brand color
  const [brandColor, setBrandColor] = useState(settings.brandColor);

  // Local preferences
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(settings.autoPrintReceipt);
  const [lowStockAlerts, setLowStockAlerts] = useState(settings.lowStockAlerts);

  // Local staff add form
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Admin' | 'Manager' | 'Cashier' | 'Barista'>('Barista');

  const handleSaveAll = () => {
    onSaveSettings({
      storeName,
      contact,
      address,
      website,
      logoUrl,
      brandColor,
      darkMode,
      autoPrintReceipt,
      lowStockAlerts
    });
    
    // Toggle actual dark class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    alert('Configuration settings saved successfully!');
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      alert('Name and Email fields are required');
      return;
    }

    onAddStaff({
      id: `st_${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: 'Active'
    });

    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaff(false);
    alert(`Successfully added ${newStaffName} to the staff roster.`);
  };

  const toggleLocalDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div id="settings-screen" className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div id="settings-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <Settings className="text-coffee-700" size={24} />
            <span>Store Configuration</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Configure branding aesthetics, system interface properties, active staff rosters, and print limits.
          </p>
        </div>

        <button
          id="btn-settings-save"
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2.5 shadow-md hover:shadow-coffee-700/10 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Save size={14} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div id="settings-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Store Profile */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Store size={14} className="text-coffee-700" />
              <span>Café Store Profile</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Café Store Name</label>
                <input
                  id="settings-input-name"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Contact Phone</label>
                <input
                  id="settings-input-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Website URL</label>
                <input
                  id="settings-input-website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Store Logo URL</label>
                <input
                  id="settings-input-logo"
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Physical Address</label>
              <textarea
                id="settings-input-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Section 2: Staff & Permission list */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-zinc-800/50">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Users size={14} className="text-coffee-700" />
                <span>Staff & Access Permissions</span>
              </h3>
              
              <button
                id="btn-settings-add-staff"
                onClick={() => setShowAddStaff(!showAddStaff)}
                className="text-[10px] font-bold text-coffee-600 dark:text-coffee-400 hover:underline flex items-center gap-1"
              >
                <UserPlus size={11} />
                <span>{showAddStaff ? 'Cancel' : 'Add Staff Member'}</span>
              </button>
            </div>

            {/* Quick add form */}
            {showAddStaff && (
              <form onSubmit={handleAddStaffSubmit} className="p-4 bg-gray-50 dark:bg-zinc-950/30 border border-gray-150 dark:border-zinc-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-400">Full Name</label>
                  <input
                    id="new-staff-name"
                    type="text"
                    required
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Leo Davinci"
                    className="w-full px-2 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-400">Email Contact</label>
                  <input
                    id="new-staff-email"
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="name@cafe.com"
                    className="w-full px-2 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Role Title</label>
                    <select
                      id="new-staff-role"
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="Barista">Barista</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <button
                    id="btn-submit-new-staff"
                    type="submit"
                    className="px-3.5 py-1.5 bg-coffee-700 hover:bg-coffee-800 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            {/* Staff list */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-semibold border-b border-gray-50 pb-2">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Role Badge</th>
                    <th className="pb-2">Contact Email</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 font-semibold">
                  {staffList.map((st) => (
                    <tr key={st.id} className="text-gray-700 dark:text-zinc-300">
                      <td className="py-2.5 font-bold text-gray-900 dark:text-zinc-100">{st.name}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase
                          ${st.role === 'Admin' 
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/20' 
                            : st.role === 'Manager'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-coffee-50 text-coffee-700'
                          }
                        `}>
                          {st.role}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-gray-400 font-normal">{st.email}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold
                          ${st.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-zinc-100 text-zinc-400'
                          }
                        `}>
                          {st.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          id={`btn-staff-status-${st.id}`}
                          onClick={() => onToggleStaffStatus(st.id)}
                          className="text-[10px] text-coffee-600 dark:text-coffee-400 hover:underline font-bold"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Column: Branding & Preference settings (col-span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Aesthetic branding */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} className="text-coffee-700" />
              <span>Aesthetic Branding</span>
            </h3>

            {/* Quick Palette selections */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Primary Theme Accent</label>
              <div className="grid grid-cols-2 gap-2">
                {BRAND_COLORS.map((col) => {
                  const isSel = brandColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setBrandColor(col.hex)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-[10px] font-bold border transition-all
                        ${isSel 
                          ? 'border-gray-900 dark:border-zinc-50 bg-gray-50/50 font-black shadow-sm' 
                          : 'border-gray-150 dark:border-zinc-800 bg-transparent text-gray-500'
                        }
                      `}
                    >
                      <div className="w-3.5 h-3.5 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: col.hex }} />
                      <span className="truncate">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Brand hex */}
            <div className="space-y-1.5 pt-2 border-t border-gray-50 dark:border-zinc-800/80">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase">Custom Theme Hex Code</label>
              <div className="flex gap-2">
                <input
                  id="settings-input-brand-color"
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-mono font-bold"
                />
                <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: brandColor }} />
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} className="text-coffee-700" />
              <span>System Preferences</span>
            </h3>

            <div className="space-y-4">
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">Interface Dark Mode</h4>
                  <p className="text-[10px] text-gray-400">Eye-safe slate-colored theme</p>
                </div>
                <button
                  id="btn-settings-toggle-dark"
                  type="button"
                  onClick={toggleLocalDarkMode}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-300 hover:text-coffee-700 transition-colors border"
                >
                  {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              </div>

              {/* Receipt auto printing */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">Receipt Auto-printing</h4>
                  <p className="text-[10px] text-gray-400">Print slip immediately on Checkout</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="settings-toggle-print"
                    type="checkbox" 
                    checked={autoPrintReceipt} 
                    onChange={() => setAutoPrintReceipt(!autoPrintReceipt)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:width-4 after:transition-all peer-checked:bg-coffee-700"></div>
                </label>
              </div>

              {/* Low stock alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">Inventory Audio Alerts</h4>
                  <p className="text-[10px] text-gray-400">Triggers alerts on low supplies</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    id="settings-toggle-alerts"
                    type="checkbox" 
                    checked={lowStockAlerts} 
                    onChange={() => setLowStockAlerts(!lowStockAlerts)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:width-4 after:transition-all peer-checked:bg-coffee-700"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Danger zone */}
          <div className="border border-red-100 bg-red-50/10 p-5 rounded-2xl space-y-3.5">
            <h3 className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>Danger Zone Operations</span>
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Resetting clears all custom items, sales history ledger values, and returns coordinates to factory default templates.
            </p>
            <button
              id="btn-settings-reset-db"
              type="button"
              onClick={() => {
                if (window.confirm('WARNING: Are you absolutely sure you want to reset all custom database values back to factory defaults? This will wipe recent transactions.')) {
                  onResetDatabase();
                }
              }}
              className="w-full py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-red-200/50 active:scale-[0.98]"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              <span>Reset POS Database</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
