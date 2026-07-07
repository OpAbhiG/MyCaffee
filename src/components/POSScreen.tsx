/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CreditCard, 
  Coins, 
  QrCode, 
  Receipt,
  CheckCircle2,
  X
} from 'lucide-react';
import { Product, Sale, SaleItem } from '../types';

interface POSScreenProps {
  products: Product[];
  onCompleteSale: (items: SaleItem[], paymentMethod: 'Cash' | 'Card' | 'UPI', customerName: string) => void;
}

export default function POSScreen({ products, onCompleteSale }: POSScreenProps) {
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [recentTxn, setRecentTxn] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Tabs
  const tabs = ['All', 'Coffee', 'Bakery', 'Tea & Others', 'Merchandise'];

  // Filter products (only visible ones)
  const visibleProducts = useMemo(() => {
    return products.filter(p => p.visible);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter(p => {
      const matchesTab = activeTab === 'All' || p.category === activeTab;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [visibleProducts, activeTab, searchQuery]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`"${product.name}" is currently out of stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Cannot add more. Only ${product.stock} units available in inventory.`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;

      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }

      if (nextQty > existing.product.stock) {
        alert(`Cannot add more. Only ${existing.product.stock} units available in inventory.`);
        return prev;
      }

      return prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: nextQty } 
          : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Math
  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Convert cart to sale items
    const saleItems: SaleItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.sellingPrice,
      quantity: item.quantity
    }));

    // Generate random bill number for display on receipt
    const billNo = `TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRecentTxn(billNo);

    // Call state saver
    onCompleteSale(saleItems, paymentMethod, customerName || 'Walk-in Customer');

    // Display receipt overlay
    setShowReceipt(true);
    setCart([]);
    setCustomerName('Walk-in Customer');
  };

  return (
    <div id="pos-screen-container" className="h-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Product Selection Grid (col-span 7) */}
      <div id="pos-products-panel" className="lg:col-span-7 flex flex-col space-y-4">
        
        {/* Title & Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <ShoppingBag size={20} className="text-coffee-700" />
              <span>POS Terminal</span>
            </h1>
            <p className="text-[11px] text-gray-400">Select items to populate order ticket</p>
          </div>

          <div className="relative w-full sm:w-60">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={14} />
            </span>
            <input
              id="pos-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, name..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
            />
          </div>
        </div>

        {/* Categories Tab Selectors */}
        <div id="pos-tabs" className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab}
              id={`pos-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150
                ${activeTab === tab 
                  ? 'bg-coffee-700 text-white shadow-sm' 
                  : 'bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/60 text-gray-500 dark:text-zinc-400 border border-gray-150 dark:border-zinc-800/80'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div 
          id="pos-items-grid" 
          className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3.5 pr-1 max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-240px)]"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(prod => (
              <button
                key={prod.id}
                id={`pos-item-btn-${prod.id}`}
                onClick={() => addToCart(prod)}
                disabled={prod.stock <= 0}
                className={`group text-left bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl overflow-hidden p-2.5 hover:shadow-md hover:border-coffee-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between relative active:scale-[0.98]
                  ${prod.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 mb-3.5 flex-shrink-0">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-coffee-700 rounded-md shadow-sm uppercase font-mono">
                    {prod.category}
                  </span>

                  {/* Stock Tag */}
                  <span className={`absolute bottom-2 right-2 px-2 py-0.5 text-[9px] font-bold rounded-md shadow-sm font-mono
                    ${prod.stock <= prod.minStock 
                      ? 'bg-red-500/90 text-white' 
                      : 'bg-zinc-900/80 text-white'
                    }
                  `}>
                    {prod.stock <= 0 ? 'OUT OF STOCK' : `${prod.stock} left`}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-100 line-clamp-1 group-hover:text-coffee-700 dark:group-hover:text-coffee-400 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{prod.sku}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-black text-gray-900 dark:text-zinc-50 font-mono">
                      {formatMoney(prod.sellingPrice)}
                    </span>
                    <div className="p-1.5 rounded-lg bg-coffee-50 dark:bg-coffee-950/20 text-coffee-700 dark:text-coffee-400 group-hover:bg-coffee-700 group-hover:text-white transition-all">
                      <Plus size={12} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-xs text-gray-400 font-medium">
              No matching products are currently visible on menu.
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Order Cart Ticket (col-span 5) */}
      <div id="pos-ticket-panel" className="lg:col-span-5 flex flex-col bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-none overflow-hidden h-[calc(100vh-130px)] lg:sticky lg:top-8">
        
        {/* Ticket Header */}
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <Receipt size={16} className="text-coffee-700" />
              <span>Current Order</span>
            </h2>
            <button 
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="text-[10px] font-bold text-red-500 hover:underline disabled:opacity-30 disabled:no-underline"
            >
              Clear All
            </button>
          </div>

          {/* Customer Input */}
          <div className="mt-4 grid grid-cols-3 items-center gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide col-span-1">Customer:</label>
            <input
              id="pos-customer-input"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Walk-in Customer"
              className="px-2 py-1 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs text-gray-800 dark:text-zinc-200 col-span-2 font-medium"
            />
          </div>
        </div>

        {/* Cart items list */}
        <div id="pos-ticket-items" className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {cart.length > 0 ? (
            cart.map(item => (
              <div 
                key={item.product.id} 
                id={`pos-cart-item-${item.product.id}`}
                className="flex items-center justify-between p-2.5 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 rounded-xl border border-gray-50 dark:border-zinc-800/20"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-zinc-200 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{formatMoney(item.product.sellingPrice)}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-lg p-0.5">
                    <button
                      id={`btn-cart-minus-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-7 text-center text-xs font-bold font-mono text-gray-800 dark:text-zinc-100">{item.quantity}</span>
                    <button
                      id={`btn-cart-plus-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    id={`btn-cart-remove-${item.product.id}`}
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-10">
              <ShoppingBag size={32} className="text-gray-300 dark:text-zinc-700 mb-2.5 stroke-1" />
              <p className="text-xs font-semibold">Active ticket is empty</p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 max-w-[200px] mt-1">
                Click products on the left menu grid to populate the bill receipt.
              </p>
            </div>
          )}
        </div>

        {/* Totals & Payments section */}
        <div className="p-5 border-t border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-800/10 space-y-4">
          
          {/* Subtotal, tax, total math */}
          <div className="space-y-1.5 text-xs font-medium">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>VAT / CGST (8%)</span>
              <span className="font-mono">{formatMoney(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-800 dark:text-zinc-100 text-sm font-bold pt-2 border-t border-gray-150 dark:border-zinc-800/50">
              <span>Grand Total</span>
              <span className="font-mono text-base font-black text-coffee-700 dark:text-coffee-400">{formatMoney(total)}</span>
            </div>
          </div>

          {/* Payment selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="pos-payment-cash"
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all
                  ${paymentMethod === 'Cash' 
                    ? 'bg-coffee-700 text-white border-coffee-700 shadow-sm' 
                    : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-250 dark:border-zinc-800 hover:bg-gray-50'
                  }
                `}
              >
                <Coins size={15} />
                <span>Cash</span>
              </button>

              <button
                id="pos-payment-card"
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all
                  ${paymentMethod === 'Card' 
                    ? 'bg-coffee-700 text-white border-coffee-700 shadow-sm' 
                    : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-250 dark:border-zinc-800 hover:bg-gray-50'
                  }
                `}
              >
                <CreditCard size={15} />
                <span>Card</span>
              </button>

              <button
                id="pos-payment-upi"
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all
                  ${paymentMethod === 'UPI' 
                    ? 'bg-coffee-700 text-white border-coffee-700 shadow-sm' 
                    : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-250 dark:border-zinc-800 hover:bg-gray-50'
                  }
                `}
              >
                <QrCode size={15} />
                <span>UPI Scan</span>
              </button>
            </div>
          </div>

          {/* Place order button */}
          <button
            id="btn-pos-complete"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-3.5 bg-coffee-700 hover:bg-coffee-800 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99] uppercase tracking-wide flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={15} />
            <span>Complete Sale & Print</span>
          </button>

        </div>

      </div>

      {/* Bill Receipt Dialog Overlay */}
      {showReceipt && (
        <div id="receipt-modal-backdrop" className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div id="receipt-modal" className="bg-white dark:bg-zinc-900 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl p-6 border border-gray-100 dark:border-zinc-800 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Success info */}
            <div className="text-center pb-2 border-b border-gray-100 dark:border-zinc-800/80">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-50">Transaction Completed!</h3>
              <p className="text-[10px] text-gray-400 mt-1 font-mono font-medium">{recentTxn}</p>
            </div>

            {/* Receipt Bill Format */}
            <div className="font-mono text-[10px] text-gray-600 dark:text-zinc-400 space-y-2 leading-relaxed bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-dashed border-gray-250 dark:border-zinc-800">
              <div className="text-center font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-widest text-xs">THE DAILY GRIND</div>
              <div className="text-center border-b border-gray-200 dark:border-zinc-800/80 pb-2">104 Coffee Lane, CA</div>
              
              <div className="flex justify-between mt-2 text-gray-400 font-medium">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Time: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="text-gray-400 mb-2 font-medium">Customer: {customerName || 'Walk-in Customer'}</div>
              <div className="border-b border-gray-200 dark:border-zinc-800/80 my-2" />

              {/* Items detail */}
              <div className="space-y-1">
                {products.filter(p => p.sellingPrice > 0).slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{idx + 1}. {p.name} (x1)</span>
                    <span>{formatMoney(p.sellingPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-gray-200 dark:border-zinc-800/80 my-2" />
              
              <div className="flex justify-between font-bold text-gray-800 dark:text-zinc-200 mt-2">
                <span>Total Received</span>
                <span>{formatMoney(total || 13.50)}</span>
              </div>
              <div className="flex justify-between text-gray-400 mt-0.5 font-medium">
                <span>Method</span>
                <span>{paymentMethod}</span>
              </div>
              <div className="text-center text-[9px] text-gray-400 dark:text-zinc-500 pt-3 italic uppercase font-semibold">Thank you! Please visit again.</div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2">
              <button
                id="btn-receipt-print"
                onClick={() => { alert('Receipt printed successfully! (Simulator Interface)'); setShowReceipt(false); }}
                className="flex-1 py-2.5 bg-coffee-700 hover:bg-coffee-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors active:scale-95 text-center"
              >
                Print Receipt
              </button>
              <button
                id="btn-receipt-close"
                onClick={() => setShowReceipt(false)}
                className="py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-colors active:scale-95 text-center"
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
