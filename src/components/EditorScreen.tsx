/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  HelpCircle, 
  Image as ImageIcon,
  DollarSign,
  Percent,
  TrendingUp,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';

interface EditorScreenProps {
  editingProduct: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const PRESET_IMAGES = [
  { name: 'Espresso', url: 'https://images.unsplash.com/photo-1510970127400-ab1360b74952?w=300&auto=format&fit=crop&q=80' },
  { name: 'Macchiato', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80' },
  { name: 'Cappuccino', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&auto=format&fit=crop&q=80' },
  { name: 'Cold Brew', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80' },
  { name: 'Matcha', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=80' },
  { name: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80' },
  { name: 'Muffin', url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&auto=format&fit=crop&q=80' },
  { name: 'Craft Mug', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80' },
  { name: 'Coffee Beans', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=80' },
];

export default function EditorScreen({ editingProduct, onSave, onCancel }: EditorScreenProps) {
  
  // Local states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coffee');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [unit, setUnit] = useState('cups');
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [showPresets, setShowPresets] = useState(false);
  const [error, setError] = useState('');

  // Hydrate editing product
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setSku(editingProduct.sku);
      setDescription(editingProduct.description);
      setSellingPrice(editingProduct.sellingPrice);
      setCostPrice(editingProduct.costPrice);
      setStock(editingProduct.stock);
      setMinStock(editingProduct.minStock);
      setUnit(editingProduct.unit);
      setVisible(editingProduct.visible);
      setImage(editingProduct.image);
    } else {
      // Auto-generate fresh SKU for new product
      generateSku('Coffee');
    }
  }, [editingProduct]);

  // Handle auto SKU generation
  const generateSku = (cat: string) => {
    const prefix = cat.slice(0, 3).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}-${rand}`);
  };

  // Calculate live profit margin
  const profitMargin = sellingPrice > 0 
    ? ((sellingPrice - costPrice) / sellingPrice) * 100 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product Name is required');
      return;
    }
    if (!sku.trim()) {
      setError('SKU / Code is required');
      return;
    }
    if (sellingPrice < 0 || costPrice < 0) {
      setError('Prices cannot be negative values');
      return;
    }
    if (stock < 0 || minStock < 0) {
      setError('Stock parameters cannot be negative values');
      return;
    }

    const payload: Product = {
      id: editingProduct?.id || `p_${Date.now()}`,
      name: name.trim(),
      category,
      sku: sku.trim(),
      description: description.trim(),
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      stock: Number(stock),
      minStock: Number(minStock),
      unit,
      visible,
      image
    };

    onSave(payload);
  };

  return (
    <div id="editor-screen-container" className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Navigation Header */}
      <div id="editor-header" className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/60 pb-5">
        <div className="flex items-center gap-4">
          <button
            id="btn-editor-back"
            onClick={onCancel}
            className="p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
              {editingProduct ? 'Edit Product Parameters' : 'Add New Cafe Product'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              Configure inventory tags, margins, and visibility across terminal interfaces.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div id="editor-error" className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image Selection Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Product Image</h3>
            
            <div id="editor-image-preview-box" className="relative group rounded-xl overflow-hidden aspect-video lg:aspect-square bg-gray-50 border border-gray-150 dark:border-zinc-800 flex flex-col items-center justify-center p-2">
              {image ? (
                <>
                  <img 
                    src={image} 
                    alt="Product Preview" 
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] text-white font-semibold bg-gray-900/80 px-2.5 py-1.5 rounded-md">Change Photo</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-5">
                  <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                  <span className="text-xs text-gray-400">No Image Selected</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Image URL Link</label>
              <input
                id="editor-image-url-input"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste product image hotlink..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
              />
            </div>

            {/* Presets Grid */}
            <div>
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="w-full py-1.5 px-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-150 dark:hover:bg-zinc-700/80 rounded-lg text-[10px] font-semibold text-gray-600 dark:text-zinc-400 transition-colors text-center"
              >
                {showPresets ? 'Hide Professional Presets' : 'Choose from Café Presets'}
              </button>
              {showPresets && (
                <div className="grid grid-cols-3 gap-2 mt-2.5 max-h-48 overflow-y-auto p-1 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950/30">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImage(img.url);
                        setShowPresets(false);
                      }}
                      className="group flex flex-col items-center gap-1 p-1 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all border border-transparent hover:border-gray-150 dark:hover:border-zinc-700"
                    >
                      <img 
                        src={img.url} 
                        alt={img.name} 
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 object-cover rounded-md"
                      />
                      <span className="text-[9px] font-medium text-gray-500 group-hover:text-gray-900 dark:group-hover:text-zinc-200 truncate w-full text-center">{img.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Columns: Basic Info + Pricing + Stock */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Product Name</label>
                <input
                  id="editor-input-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vanilla Foam Cold Brew"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Category</label>
                <select
                  id="editor-select-category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (!editingProduct) generateSku(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Tea & Others">Tea & Others</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SKU / Code */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase flex items-center justify-between">
                  <span>SKU / Code</span>
                  <button
                    type="button"
                    onClick={() => generateSku(category)}
                    className="text-[10px] text-coffee-600 dark:text-coffee-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles size={10} /> Auto-Gen
                  </button>
                </label>
                <input
                  id="editor-input-sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. COF-102"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                />
              </div>

              {/* Unit Of Measure */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Unit of Measure</label>
                <select
                  id="editor-select-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                >
                  <option value="cups">cups (Beverages)</option>
                  <option value="pcs">pcs (Bakery/Goods)</option>
                  <option value="bags">bags (Beans)</option>
                  <option value="ml">ml (Fluids)</option>
                  <option value="grams">grams (Weights)</option>
                </select>
              </div>

              {/* Visibility Switch */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Visibility Status</label>
                <div className="flex items-center gap-3 py-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      id="editor-toggle-visible"
                      type="checkbox" 
                      checked={visible} 
                      onChange={() => setVisible(!visible)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-coffee-500/20 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all dark:after:bg-zinc-900 peer-checked:bg-coffee-700"></div>
                  </label>
                  <span className="text-xs text-gray-600 dark:text-zinc-400 font-medium">
                    {visible ? 'Show in POS Terminal' : 'Archived (Hidden)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Product Description</label>
              <textarea
                id="editor-input-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe flavor notes, allergen alerts, size details..."
                rows={3}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all resize-none"
              />
            </div>

          </div>

          {/* Section 2: Pricing & Profits */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <span>Financials & Margin Assessment</span>
              <TrendingUp size={13} className="text-coffee-600" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Selling Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Selling Price ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-mono text-xs font-bold">$</span>
                  <input
                    id="editor-input-selling"
                    type="number"
                    step="0.01"
                    min="0"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                  />
                </div>
              </div>

              {/* Cost Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Cost Price ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-mono text-xs font-bold">$</span>
                  <input
                    id="editor-input-cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice || ''}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                  />
                </div>
              </div>

              {/* Live Margin Card */}
              <div className="p-3.5 bg-gray-50 dark:bg-zinc-800/30 border border-gray-150 dark:border-zinc-800/50 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Profit Margin</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className={`text-xl font-bold font-mono
                    ${profitMargin > 50 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : profitMargin > 20 
                      ? 'text-coffee-600 dark:text-coffee-400' 
                      : 'text-red-500'
                    }
                  `}>
                    {profitMargin >= 0 ? `${profitMargin.toFixed(1)}%` : 'Negative!'}
                  </span>
                  {profitMargin > 0 && <span className="text-[9px] text-gray-400 font-medium">gross</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Stock Management */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Inventory Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock Count */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Initial / Current Stock</label>
                <input
                  id="editor-input-stock"
                  type="number"
                  min="0"
                  value={stock || ''}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                />
              </div>

              {/* Min Stock */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-zinc-300 uppercase">Min Alert Stock Level</label>
                <input
                  id="editor-input-minstock"
                  type="number"
                  min="0"
                  value={minStock || ''}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-3.5 pt-4">
            <button
              id="btn-editor-cancel"
              type="button"
              onClick={onCancel}
              className="px-5 py-3 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-semibold text-xs rounded-xl transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              id="btn-editor-save"
              type="submit"
              className="px-6 py-3 bg-coffee-700 hover:bg-coffee-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-coffee-700/10 transition-all active:scale-95"
            >
              <Save size={14} />
              <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
