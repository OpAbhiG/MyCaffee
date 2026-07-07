/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Sale, StaffMember, StoreSettings, InventoryLog } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic Espresso',
    category: 'Coffee',
    sku: 'COF-001',
    description: 'Double shot of our signature master blend. Intensely aromatic, rich crema, and a sweet, dark cocoa finish.',
    sellingPrice: 3.50,
    costPrice: 0.80,
    stock: 150,
    minStock: 20,
    unit: 'cups',
    visible: true,
    image: 'https://images.unsplash.com/photo-1510970127400-ab1360b74952?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    sku: 'COF-002',
    description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and drizzled with buttery caramel.',
    sellingPrice: 4.80,
    costPrice: 1.20,
    stock: 120,
    minStock: 25,
    unit: 'cups',
    visible: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p3',
    name: 'Velvet Cappuccino',
    category: 'Coffee',
    sku: 'COF-003',
    description: 'Perfect balance of espresso, steamed milk, and a luxurious, thick layer of micro-foam. Dusted with cinnamon.',
    sellingPrice: 4.50,
    costPrice: 1.05,
    stock: 180,
    minStock: 25,
    unit: 'cups',
    visible: true,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    name: 'Slow Cold Brew',
    category: 'Coffee',
    sku: 'COF-004',
    description: 'Steeped for 20 hours in cold water, producing an incredibly smooth, low-acid coffee with natural sweet notes.',
    sellingPrice: 5.00,
    costPrice: 1.20,
    stock: 85,
    minStock: 15,
    unit: 'cups',
    visible: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p5',
    name: 'Uji Matcha Latte',
    category: 'Tea & Others',
    sku: 'TEA-001',
    description: 'Premium stone-ground matcha from Uji, Kyoto, steamed with creamy milk and lightly sweetened.',
    sellingPrice: 5.20,
    costPrice: 1.40,
    stock: 60,
    minStock: 15,
    unit: 'cups',
    visible: true,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p6',
    name: 'Flaky Butter Croissant',
    category: 'Bakery',
    sku: 'BAK-001',
    description: 'Traditional French-style butter croissant. Hand-rolled, golden-brown, crispy exterior with layered, airy interior.',
    sellingPrice: 3.80,
    costPrice: 1.50,
    stock: 8, // Low stock!
    minStock: 15,
    unit: 'pcs',
    visible: true,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p7',
    name: 'Fudge Chocolate Muffin',
    category: 'Bakery',
    sku: 'BAK-002',
    description: 'Rich chocolate muffin loaded with Belgian dark chocolate chunks and a melting fudge core.',
    sellingPrice: 4.20,
    costPrice: 1.60,
    stock: 14,
    minStock: 10,
    unit: 'pcs',
    visible: true,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p8',
    name: 'Ceramic Craft Mug',
    category: 'Merchandise',
    sku: 'MER-001',
    description: 'Limited edition artisanal matte-glazed ceramic mug. Perfect weight and grip. Dishwasher and microwave safe.',
    sellingPrice: 15.00,
    costPrice: 6.00,
    stock: 32,
    minStock: 5,
    unit: 'pcs',
    visible: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p9',
    name: 'Signature House Blend (250g)',
    category: 'Merchandise',
    sku: 'MER-002',
    description: 'Whole-bean coffee bag. Fair-trade medium roast with notes of sweet red cherry, brown sugar, and hazelnut.',
    sellingPrice: 18.00,
    costPrice: 9.00,
    stock: 4, // Low stock!
    minStock: 10,
    unit: 'bags',
    visible: true,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 's1',
    billNumber: 'TXN-2026-0001',
    timestamp: '2026-07-07T08:32:00Z',
    customerName: 'Sarah Jenkins',
    items: [
      { productId: 'p1', name: 'Classic Espresso', price: 3.50, quantity: 1 },
      { productId: 'p6', name: 'Flaky Butter Croissant', price: 3.80, quantity: 2 }
    ],
    subtotal: 11.10,
    tax: 0.89,
    total: 11.99,
    paymentMethod: 'Card',
    status: 'Completed'
  },
  {
    id: 's2',
    billNumber: 'TXN-2026-0002',
    timestamp: '2026-07-07T09:15:00Z',
    customerName: 'Marcus Aurelius',
    items: [
      { productId: 'p2', name: 'Caramel Macchiato', price: 4.80, quantity: 2 },
      { productId: 'p7', name: 'Fudge Chocolate Muffin', price: 4.20, quantity: 1 }
    ],
    subtotal: 13.80,
    tax: 1.10,
    total: 14.90,
    paymentMethod: 'UPI',
    status: 'Completed'
  },
  {
    id: 's3',
    billNumber: 'TXN-2026-0003',
    timestamp: '2026-07-07T10:04:00Z',
    customerName: 'Walk-in Customer',
    items: [
      { productId: 'p3', name: 'Velvet Cappuccino', price: 4.50, quantity: 1 }
    ],
    subtotal: 4.50,
    tax: 0.36,
    total: 4.86,
    paymentMethod: 'Cash',
    status: 'Completed'
  },
  {
    id: 's4',
    billNumber: 'TXN-2026-0004',
    timestamp: '2026-07-07T11:45:00Z',
    customerName: 'Diana Prince',
    items: [
      { productId: 'p5', name: 'Uji Matcha Latte', price: 5.20, quantity: 1 },
      { productId: 'p8', name: 'Ceramic Craft Mug', price: 15.00, quantity: 1 }
    ],
    subtotal: 20.20,
    tax: 1.62,
    total: 21.82,
    paymentMethod: 'Card',
    status: 'Completed'
  },
  {
    id: 's5',
    billNumber: 'TXN-2026-0005',
    timestamp: '2026-07-06T14:20:00Z',
    customerName: 'Bruce Wayne',
    items: [
      { productId: 'p4', name: 'Slow Cold Brew', price: 5.00, quantity: 4 },
      { productId: 'p9', name: 'Signature House Blend (250g)', price: 18.00, quantity: 2 }
    ],
    subtotal: 56.00,
    tax: 4.48,
    total: 60.48,
    paymentMethod: 'Card',
    status: 'Completed'
  },
  {
    id: 's6',
    billNumber: 'TXN-2026-0006',
    timestamp: '2026-07-06T16:10:00Z',
    customerName: 'Clara Oswald',
    items: [
      { productId: 'p3', name: 'Velvet Cappuccino', price: 4.50, quantity: 2 },
      { productId: 'p6', name: 'Flaky Butter Croissant', price: 3.80, quantity: 1 }
    ],
    subtotal: 12.80,
    tax: 1.02,
    total: 13.82,
    paymentMethod: 'UPI',
    status: 'Refunded'
  },
  {
    id: 's7',
    billNumber: 'TXN-2026-0007',
    timestamp: '2026-07-05T11:22:00Z',
    customerName: 'Peter Parker',
    items: [
      { productId: 'p1', name: 'Classic Espresso', price: 3.50, quantity: 2 },
      { productId: 'p7', name: 'Fudge Chocolate Muffin', price: 4.20, quantity: 2 }
    ],
    subtotal: 15.40,
    tax: 1.23,
    total: 16.63,
    paymentMethod: 'Cash',
    status: 'Completed'
  },
  {
    id: 's8',
    billNumber: 'TXN-2026-0008',
    timestamp: '2026-07-05T15:40:00Z',
    customerName: 'Tony Stark',
    items: [
      { productId: 'p1', name: 'Classic Espresso', price: 3.50, quantity: 4 },
      { productId: 'p8', name: 'Ceramic Craft Mug', price: 15.00, quantity: 3 }
    ],
    subtotal: 59.00,
    tax: 4.72,
    total: 63.72,
    paymentMethod: 'Card',
    status: 'Completed'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st1',
    name: 'Eleanor Vance',
    role: 'Admin',
    email: 'eleanor.v@brewmaster.com',
    status: 'Active'
  },
  {
    id: 'st2',
    name: 'James Reynolds',
    role: 'Manager',
    email: 'james.r@brewmaster.com',
    status: 'Active'
  },
  {
    id: 'st3',
    name: 'Maya Lin',
    role: 'Barista',
    email: 'maya.l@brewmaster.com',
    status: 'Active'
  },
  {
    id: 'st4',
    name: 'David Kim',
    role: 'Cashier',
    email: 'david.k@brewmaster.com',
    status: 'Inactive'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'The Daily Grind',
  contact: '+1 (555) 345-6789',
  address: '104 Coffee Lane, Espresso Valley, CA 94025',
  website: 'www.thedailygrind.cafe',
  logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80',
  brandColor: '#6F4E37', // Coffee Brown
  darkMode: false,
  autoPrintReceipt: true,
  lowStockAlerts: true
};

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'log1',
    timestamp: '2026-07-07T08:00:00Z',
    productName: 'Classic Espresso',
    sku: 'COF-001',
    type: 'Stock In',
    quantity: 50,
    user: 'Eleanor Vance'
  },
  {
    id: 'log2',
    timestamp: '2026-07-07T11:45:00Z',
    productName: 'Uji Matcha Latte',
    sku: 'TEA-001',
    type: 'Stock Out',
    quantity: 1,
    user: 'Maya Lin'
  },
  {
    id: 'log3',
    timestamp: '2026-07-06T10:00:00Z',
    productName: 'Signature House Blend (250g)',
    sku: 'MER-002',
    type: 'Audit Adjustment',
    quantity: -2,
    user: 'James Reynolds'
  },
  {
    id: 'log4',
    timestamp: '2026-07-06T15:30:00Z',
    productName: 'Flaky Butter Croissant',
    sku: 'BAK-001',
    type: 'Low Stock Alert',
    quantity: 8,
    user: 'System'
  }
];
