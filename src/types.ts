/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  description: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  visible: boolean;
  image: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  billNumber: string;
  timestamp: string; // ISO string or simple display string
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  status: 'Completed' | 'Refunded' | 'Pending';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Barista';
  email: string;
  status: 'Active' | 'Inactive';
}

export interface StoreSettings {
  storeName: string;
  contact: string;
  address: string;
  website: string;
  logoUrl: string;
  brandColor: string;
  darkMode: boolean;
  autoPrintReceipt: boolean;
  lowStockAlerts: boolean;
}

export interface InventoryLog {
  id: string;
  timestamp: string;
  productName: string;
  sku: string;
  type: 'Stock In' | 'Stock Out' | 'Audit Adjustment' | 'Low Stock Alert';
  quantity: number;
  user: string;
}

export type ScreenId =
  | 'login'
  | 'dashboard'
  | 'products'
  | 'editor'
  | 'pos'
  | 'sales-history'
  | 'inventory'
  | 'reports'
  | 'settings'
  | 'showcase';
