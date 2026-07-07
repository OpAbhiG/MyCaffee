/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ScreenId, Product, Sale, StaffMember, StoreSettings, InventoryLog, SaleItem } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_STAFF, 
  INITIAL_SETTINGS, 
  INITIAL_INVENTORY_LOGS 
} from './data';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import ProductsScreen from './components/ProductsScreen';
import EditorScreen from './components/EditorScreen';
import POSScreen from './components/POSScreen';
import SalesHistoryScreen from './components/SalesHistoryScreen';
import InventoryScreen from './components/InventoryScreen';
import ReportsScreen from './components/ReportsScreen';
import SettingsScreen from './components/SettingsScreen';
import ShowcaseScreen from './components/ShowcaseScreen';

// Local Storage Keys
const LSK_PRODUCTS = 'brewmaster_products_v1';
const LSK_SALES = 'brewmaster_sales_v1';
const LSK_STAFF = 'brewmaster_staff_v1';
const LSK_SETTINGS = 'brewmaster_settings_v1';
const LSK_LOGS = 'brewmaster_logs_v1';
const LSK_SCREEN = 'brewmaster_screen_v1';

export default function App() {
  
  // Navigation Screen State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    const saved = localStorage.getItem(LSK_SCREEN);
    return (saved as ScreenId) || 'showcase'; // Default to Showcase overview to show off all screens first!
  });

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);

  // Selected product for editor (null if creating new)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    // 1. Products
    const savedProducts = localStorage.getItem(LSK_PRODUCTS);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(LSK_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    // 2. Sales
    const savedSales = localStorage.getItem(LSK_SALES);
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    } else {
      setSales(INITIAL_SALES);
      localStorage.setItem(LSK_SALES, JSON.stringify(INITIAL_SALES));
    }

    // 3. Staff
    const savedStaff = localStorage.getItem(LSK_STAFF);
    if (savedStaff) {
      setStaffList(JSON.parse(savedStaff));
    } else {
      setStaffList(INITIAL_STAFF);
      localStorage.setItem(LSK_STAFF, JSON.stringify(INITIAL_STAFF));
    }

    // 4. Settings
    const savedSettings = localStorage.getItem(LSK_SETTINGS);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      // Hydrate Dark class on document
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem(LSK_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }

    // 5. Inventory Logs
    const savedLogs = localStorage.getItem(LSK_LOGS);
    if (savedLogs) {
      setInventoryLogs(JSON.parse(savedLogs));
    } else {
      setInventoryLogs(INITIAL_INVENTORY_LOGS);
      localStorage.setItem(LSK_LOGS, JSON.stringify(INITIAL_INVENTORY_LOGS));
    }
  }, []);

  // Save current navigation target
  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    localStorage.setItem(LSK_SCREEN, screen);
  };

  // Helper to save state to localStorage
  const persistProducts = (nextProds: Product[]) => {
    setProducts(nextProds);
    localStorage.setItem(LSK_PRODUCTS, JSON.stringify(nextProds));
  };

  const persistSales = (nextSales: Sale[]) => {
    setSales(nextSales);
    localStorage.setItem(LSK_SALES, JSON.stringify(nextSales));
  };

  const persistLogs = (nextLogs: InventoryLog[]) => {
    setInventoryLogs(nextLogs);
    localStorage.setItem(LSK_LOGS, JSON.stringify(nextLogs));
  };

  const persistStaff = (nextStaff: StaffMember[]) => {
    setStaffList(nextStaff);
    localStorage.setItem(LSK_STAFF, JSON.stringify(nextStaff));
  };

  // Core Business Logics

  // 1. Saving product from form
  const handleSaveProduct = (product: Product) => {
    const isEditing = products.some(p => p.id === product.id);
    let nextProducts: Product[];

    if (isEditing) {
      nextProducts = products.map(p => p.id === product.id ? product : p);
      
      // Log stock adjustment if changed
      const original = products.find(p => p.id === product.id);
      if (original && original.stock !== product.stock) {
        const delta = product.stock - original.stock;
        const log: InventoryLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          productName: product.name,
          sku: product.sku,
          type: 'Audit Adjustment',
          quantity: delta,
          user: 'Eleanor Vance'
        };
        persistLogs([log, ...inventoryLogs]);
      }
    } else {
      nextProducts = [...products, product];
      const log: InventoryLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        productName: product.name,
        sku: product.sku,
        type: 'Stock In',
        quantity: product.stock,
        user: 'Eleanor Vance'
      };
      persistLogs([log, ...inventoryLogs]);
    }

    persistProducts(nextProducts);
    setEditingProduct(null);
    handleNavigate('products');
  };

  // 2. Deleting product
  const handleDeleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    const nextProducts = products.filter(p => p.id !== productId);
    persistProducts(nextProducts);

    if (target) {
      const log: InventoryLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        productName: target.name,
        sku: target.sku,
        type: 'Audit Adjustment',
        quantity: -target.stock,
        user: 'Eleanor Vance'
      };
      persistLogs([log, ...inventoryLogs]);
    }
  };

  // 3. Complete checkout on POS
  const handleCompleteSale = (items: SaleItem[], paymentMethod: 'Cash' | 'Card' | 'UPI', customerName: string) => {
    
    // Subtotal calculations
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const saleNo = `TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSale: Sale = {
      id: `s_${Date.now()}`,
      billNumber: saleNo,
      timestamp: new Date().toISOString(),
      customerName,
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
      status: 'Completed'
    };

    // Update Sales list
    const nextSales = [newSale, ...sales];
    persistSales(nextSales);

    // Subtract stock quantities
    let nextLogs = [...inventoryLogs];
    const nextProducts = products.map(p => {
      const purchased = items.find(item => item.productId === p.id);
      if (purchased) {
        const nextStock = Math.max(0, p.stock - purchased.quantity);
        
        // Log "Stock Out"
        const outLog: InventoryLog = {
          id: `log_${Date.now()}_out_${p.id}`,
          timestamp: new Date().toISOString(),
          productName: p.name,
          sku: p.sku,
          type: 'Stock Out',
          quantity: -purchased.quantity,
          user: 'Maya Lin' // Active barista operator
        };
        nextLogs = [outLog, ...nextLogs];

        // Trigger "Low Stock Alert" log if below limit
        if (nextStock <= p.minStock) {
          const alertLog: InventoryLog = {
            id: `log_${Date.now()}_alert_${p.id}`,
            timestamp: new Date().toISOString(),
            productName: p.name,
            sku: p.sku,
            type: 'Low Stock Alert',
            quantity: nextStock,
            user: 'System'
          };
          nextLogs = [alertLog, ...nextLogs];
        }

        return { ...p, stock: nextStock };
      }
      return p;
    });

    persistProducts(nextProducts);
    persistLogs(nextLogs);
  };

  // 4. Issue Refund
  const handleRefundSale = (saleId: string) => {
    const saleIndex = sales.findIndex(s => s.id === saleId);
    if (saleIndex === -1) return;

    const sale = sales[saleIndex];
    if (sale.status === 'Refunded') return;

    // Set refund status
    const updatedSale: Sale = { ...sale, status: 'Refunded' };
    const nextSales = sales.map(s => s.id === saleId ? updatedSale : s);
    persistSales(nextSales);

    // Return products back to inventory
    let nextLogs = [...inventoryLogs];
    const nextProducts = products.map(p => {
      const returnedItem = sale.items.find(item => item.productId === p.id);
      if (returnedItem) {
        const nextStock = p.stock + returnedItem.quantity;
        
        // Log "Stock In" refund return
        const log: InventoryLog = {
          id: `log_${Date.now()}_ref_${p.id}`,
          timestamp: new Date().toISOString(),
          productName: p.name,
          sku: p.sku,
          type: 'Audit Adjustment',
          quantity: returnedItem.quantity,
          user: 'James Reynolds' // Manager active operator
        };
        nextLogs = [log, ...nextLogs];

        return { ...p, stock: nextStock };
      }
      return p;
    });

    persistProducts(nextProducts);
    persistLogs(nextLogs);
    alert(`Invoiced checkout ${sale.billNumber} successfully refunded and materials returned to stock.`);
  };

  // 5. Restocking +10, +50 from stock managers
  const handleRestockProduct = (productId: string, amount: number = 50) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const nextProducts = products.map(p => 
      p.id === productId ? { ...p, stock: p.stock + amount } : p
    );
    persistProducts(nextProducts);

    const log: InventoryLog = {
      id: `log_${Date.now()}_re_${productId}`,
      timestamp: new Date().toISOString(),
      productName: prod.name,
      sku: prod.sku,
      type: 'Stock In',
      quantity: amount,
      user: 'Eleanor Vance'
    };
    persistLogs([log, ...inventoryLogs]);
  };

  // 6. Hard Audit direct input adjustment
  const handleAuditAdjustProduct = (productId: string, targetStock: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const delta = targetStock - prod.stock;
    const nextProducts = products.map(p => 
      p.id === productId ? { ...p, stock: targetStock } : p
    );
    persistProducts(nextProducts);

    const log: InventoryLog = {
      id: `log_${Date.now()}_audit_${productId}`,
      timestamp: new Date().toISOString(),
      productName: prod.name,
      sku: prod.sku,
      type: 'Audit Adjustment',
      quantity: delta,
      user: 'Eleanor Vance'
    };
    persistLogs([log, ...inventoryLogs]);
  };

  // 7. General settings save
  const handleSaveSettings = (nextSettings: StoreSettings) => {
    setSettings(nextSettings);
    localStorage.setItem(LSK_SETTINGS, JSON.stringify(nextSettings));
  };

  // 8. Toggle staff active state
  const handleToggleStaffStatus = (staffId: string) => {
    const nextStaff = staffList.map(st => 
      st.id === staffId 
        ? { ...st, status: st.status === 'Active' ? 'Inactive' : 'Active' as any } 
        : st
    );
    persistStaff(nextStaff);
  };

  // 9. Add new staff
  const handleAddStaffMember = (member: StaffMember) => {
    const nextStaff = [...staffList, member];
    persistStaff(nextStaff);
  };

  // 10. Database wipe & resets
  const handleResetDatabase = () => {
    localStorage.removeItem(LSK_PRODUCTS);
    localStorage.removeItem(LSK_SALES);
    localStorage.removeItem(LSK_STAFF);
    localStorage.removeItem(LSK_SETTINGS);
    localStorage.removeItem(LSK_LOGS);

    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setStaffList(INITIAL_STAFF);
    setSettings(INITIAL_SETTINGS);
    setInventoryLogs(INITIAL_INVENTORY_LOGS);

    // Hard reset light class
    document.documentElement.classList.remove('dark');

    alert('BrewMaster Pro database successfully returned to factory template specs!');
    handleNavigate('showcase');
  };

  // Router dispatcher
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLoginSuccess={() => handleNavigate('dashboard')} />;
      
      case 'dashboard':
        return (
          <DashboardScreen 
            products={products} 
            sales={sales} 
            onNavigate={handleNavigate}
            onRestockProduct={(id) => handleRestockProduct(id, 50)}
          />
        );
      
      case 'products':
        return (
          <ProductsScreen 
            products={products}
            onAddProduct={() => {
              setEditingProduct(null);
              handleNavigate('editor');
            }}
            onEditProduct={(product) => {
              setEditingProduct(product);
              handleNavigate('editor');
            }}
            onDeleteProduct={handleDeleteProduct}
          />
        );

      case 'editor':
        return (
          <EditorScreen 
            editingProduct={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(null);
              handleNavigate('products');
            }}
          />
        );

      case 'pos':
        return (
          <POSScreen 
            products={products} 
            onCompleteSale={handleCompleteSale}
          />
        );

      case 'sales-history':
        return (
          <SalesHistoryScreen 
            sales={sales} 
            onRefundSale={handleRefundSale}
          />
        );

      case 'inventory':
        return (
          <InventoryScreen 
            products={products}
            inventoryLogs={inventoryLogs}
            onRestock={handleRestockProduct}
            onAuditAdjust={handleAuditAdjustProduct}
          />
        );

      case 'reports':
        return (
          <ReportsScreen 
            products={products} 
            sales={sales} 
          />
        );

      case 'settings':
        return (
          <SettingsScreen 
            settings={settings}
            staffList={staffList}
            onSaveSettings={handleSaveSettings}
            onToggleStaffStatus={handleToggleStaffStatus}
            onAddStaff={handleAddStaffMember}
            onResetDatabase={handleResetDatabase}
          />
        );

      case 'showcase':
      default:
        return <ShowcaseScreen onNavigate={handleNavigate} />;
    }
  };

  // Layout presentation
  if (currentScreen === 'login') {
    return <div id="app-root-shell" className="w-full h-full">{renderScreenContent()}</div>;
  }

  return (
    <div id="app-root-shell" className="min-h-screen w-full flex bg-gray-50/50 dark:bg-immersive-bg dark:bg-immersive-grid text-gray-800 dark:text-slate-200 transition-colors">
      
      {/* Persisted Collapsible Sidebar Navigation */}
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        onLogout={() => handleNavigate('login')}
        storeName={settings.storeName}
      />

      {/* Main Workspace Frame */}
      <main id="app-workspace" className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        
        {/* Dynamic Showcase Quick-Link Header Banner */}
        {currentScreen !== 'showcase' && (
          <div id="showcase-sticky-banner" className="bg-coffee-700/5 dark:bg-[#0a0a0c]/80 dark:backdrop-blur-xl px-6 py-2.5 border-b border-coffee-100/30 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-coffee-800 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <Sparkles size={12} className="animate-pulse dark:text-cyan-400" />
              <span>You are viewing: <strong className="font-bold uppercase font-mono dark:text-cyan-300">{currentScreen.replace('-', ' ')}</strong></span>
            </span>
            <button 
              id="banner-showcase-redirect"
              onClick={() => handleNavigate('showcase')}
              className="text-coffee-700 dark:text-indigo-400 font-bold hover:underline"
            >
              Back to Project Overview & Screen Specifications →
            </button>
          </div>
        )}

        <div className="flex-1">
          {renderScreenContent()}
        </div>
      </main>

    </div>
  );
}
