/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Percent, 
  Boxes,
  HelpCircle
} from 'lucide-react';
import { Product } from '../types';

interface ProductsScreenProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function ProductsScreen({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}: ProductsScreenProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');

  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      
      const matchesVisibility = 
        visibilityFilter === 'All' || 
        (visibilityFilter === 'Visible' && p.visible) || 
        (visibilityFilter === 'Hidden' && !p.visible);

      return matchesSearch && matchesCategory && matchesVisibility;
    });
  }, [products, searchQuery, categoryFilter, visibilityFilter]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div id="products-screen-container" className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Catalog Header */}
      <div id="products-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <span>Product Catalog</span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 bg-coffee-50 dark:bg-coffee-950/20 text-coffee-700 dark:text-coffee-400 border border-coffee-100/40 rounded-full font-semibold">
              {filteredProducts.length} Item{filteredProducts.length !== 1 && 's'}
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Manage café items, stock limits, prices, margins, and visibility states.
          </p>
        </div>
        
        <button
          id="btn-catalog-add"
          onClick={onAddProduct}
          className="px-4.5 py-2.5 bg-coffee-700 hover:bg-coffee-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div id="products-filter-row" className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-zinc-900 p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={15} />
          </span>
          <input
            id="product-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, item name, or descriptions..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            id="product-category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Visibility Filter */}
        <div>
          <select
            id="product-visibility-select"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
          >
            <option value="All">All Visibility</option>
            <option value="Visible">Visible (In Menu)</option>
            <option value="Hidden">Hidden (Archived)</option>
          </select>
        </div>

      </div>

      {/* Catalog Table Card */}
      <div id="product-table-card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-800/20 border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-4 px-5">Product Info</th>
                <th className="py-4 px-4 font-mono">SKU / Code</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-right">Pricing (Cost / Sell)</th>
                <th className="py-4 px-4 text-center">Profit Margin</th>
                <th className="py-4 px-4 text-right">Stock Level</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 font-medium">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const profitMargin = prod.sellingPrice > 0 
                    ? ((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) * 100 
                    : 0;
                  
                  const isLowStock = prod.stock <= prod.minStock;

                  return (
                    <tr 
                      key={prod.id} 
                      id={`product-row-${prod.id}`}
                      className="text-gray-700 dark:text-zinc-300 hover:bg-gray-50/30 dark:hover:bg-zinc-800/10 transition-colors"
                    >
                      {/* Image + Info */}
                      <td className="py-4 px-5 max-w-[280px]">
                        <div className="flex items-start gap-3.5">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-gray-150 dark:border-zinc-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-zinc-50 truncate">{prod.name}</h4>
                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 line-clamp-2 leading-relaxed font-normal">{prod.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-4 font-mono text-gray-900 dark:text-zinc-100 font-semibold">
                        {prod.sku}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-coffee-50 dark:bg-coffee-950/20 text-coffee-700 dark:text-coffee-400 border border-coffee-100/20">
                          {prod.category}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono text-gray-900 dark:text-zinc-100 font-bold">{formatMoney(prod.sellingPrice)}</div>
                        <div className="font-mono text-[10px] text-gray-400 mt-0.5">Cost: {formatMoney(prod.costPrice)}</div>
                      </td>

                      {/* Margin */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-0.5 font-mono font-semibold px-2 py-0.5 rounded-md text-[10px]
                          ${profitMargin > 50 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-coffee-50 dark:bg-coffee-950/10 text-coffee-600 dark:text-coffee-400'
                          }
                        `}>
                          {profitMargin.toFixed(0)}%
                        </span>
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-4 text-right">
                        <div className={`font-mono font-bold text-sm
                          ${isLowStock ? 'text-red-500 font-black animate-pulse' : 'text-gray-900 dark:text-zinc-100'}
                        `}>
                          {prod.stock}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-normal">
                          {prod.unit} (Min: {prod.minStock})
                        </div>
                      </td>

                      {/* Visibility Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold
                          ${prod.visible 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                          }
                        `}>
                          {prod.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                          <span>{prod.visible ? 'Visible' : 'Hidden'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            id={`btn-product-edit-${prod.id}`}
                            onClick={() => onEditProduct(prod)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-coffee-700 dark:hover:text-coffee-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Edit2 size={13.5} />
                          </button>
                          <button
                            id={`btn-product-delete-${prod.id}`}
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${prod.name}" from the catalog?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Trash2 size={13.5} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500 font-medium">
                    No products matching current search criteria found. Click "Add New Product" to populate!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
