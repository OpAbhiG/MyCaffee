/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  ExternalLink, 
  Coffee, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Code,
  Palette,
  Maximize2
} from 'lucide-react';
import { ScreenId } from '../types';

interface ShowcaseScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface ScreenShowcaseItem {
  id: ScreenId;
  title: string;
  badge: string;
  description: string;
  specifications: string[];
  previewUrl: string;
}

export default function ShowcaseScreen({ onNavigate }: ShowcaseScreenProps) {
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const screens: ScreenShowcaseItem[] = [
    {
      id: 'login',
      title: 'Screen 01: Employee Login',
      badge: 'Authentication',
      description: 'The entrance console for checkout staff, managers, and store administrators.',
      specifications: [
        'Responsive split-screen container with blurring background overlays',
        'Automatic secure demo session credentials preloading',
        'Error verification toast notification indicators'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCzO5LP6IEEFAR7woYAS2O2Hdap2ljIioHJhK-ga4-TmyGqbPCyx6VwuT7OggdEEU_KbcQHbIltfG8k7utQxZHNAMeLF4MgH52qhJoZdaLP_o88cb1cCzspttNsHKWUIfqQTsLnKQM8_ezPtfyM3R13qfYlULWYSJWheMYT3k-1HHFS082jJiQRTgssCMeH1Inx8Vt-IpmPZb0ERu8wnx8Ira4PVdUp9ED0FR4ZyDSDveO47zVwq_o'
    },
    {
      id: 'dashboard',
      title: 'Screen 02: Operations Dashboard',
      badge: 'Analytics Overview',
      description: 'The core mission-control panel summarizing sales volume, low stock flags, and weekly performance trends.',
      specifications: [
        'Six fluid state metrics with responsive colored status cards',
        'Interactive Recharts Weekly Sales Line Chart & Area Trend models',
        'Direct Quick Action launchers to checkout terminal and editor forms'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB17Z_nae3dWm7aFPTMQad7rNMSbkxa_CZDS3lzYEOyRenFUajh4PQROoP3xDQ2Szrcfp_TCJzAv1u7zbBMcP_51p2rGn3YEjF_-Y950zVgNjhTYGod7-TSqOQ6PSNxCJ9ksOGd3Z2ZVMQ0ebykC9fBWrm-7dh07PIv-gHm70tvRZrcooS7dt2iQ4bplvgPWPOwNKq7I-qpG4J7X4KMebtp6OQvAnIkmEq6ojYYF70hNN00By8nBYYl'
    },
    {
      id: 'products',
      title: 'Screen 03: Product Catalog',
      badge: 'Inventory List',
      description: 'The master grid detailing all café items, prices, margins, SKU codes, and visibility flags.',
      specifications: [
        'Instant client-side fuzzy searching on SKU, name, and descriptions',
        'Dynamic dropdown filtration based on categories and visibility',
        'Profit margin gross percentage calculator with dynamic coloring'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd-sA-_WJOV-Ywsk0Y89m5xbqiuPiUCE2Cg7EfO-cCS1A5NLXyaCz2IGurFzpnCwl1Md8mS7Gh7YD68xJPK3GLcf9pG7CnOgXFV6yHseyvNUc8pswXx9uZ6gWST8CyeSWOci7EJXdsBy2ZXx_BE3CP5KauFOcgFEuy3DpJx0hmupyrSiW7AOe_HlzzZgYoK4C89jgRK2iKLyrfqfBr5DK46WIhv_kpXHsM7RreUHliVILNnI5NH3Sn'
    },
    {
      id: 'editor',
      title: 'Screen 04: Product Editor Form',
      badge: 'Data Management',
      description: 'A modular, high-contrast form designed to add or modify items within the catalog.',
      specifications: [
        'Automatic SKU generator using categorical prefixes and randomized hashes',
        'Live profit margin assessor computing gross percentages dynamically',
        'Interactive visual asset selection pane supporting high-res café presets'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP0cSYnZ5f8a4ibR-1VdgE28SzdnVwV1bqNFOCF9IWUQRivOnbnItY0IJ5A2pa15tfFlxYfp34pY_vOsIcLWJXj911mrSvaceSQriSsnHo6xBxwWgn3x9WsDNCtD4YdQLFSW3XshSelvsHKosOh4vym9Miiv7_Fq2ZfbhfaX_CBeyr87oIfnfW20UHAn4yfXjV6CPlQicIUSKMD5SQ6lT3BQloE1mgb9QKRqAiY03eUhV3GEt1EKJF'
    },
    {
      id: 'pos',
      title: 'Screen 05: Point of Sale Terminal',
      badge: 'Checkout Terminal',
      description: 'An interactive cash register screen allowing instant cart creation, taxation calculation, and receipts printing.',
      specifications: [
        'Categorized tabs and quick search filters to locate beverages instantly',
        'Fluid quantity counters checking real-time store inventory thresholds',
        'Interactive receipt print modal generator with custom receipt receipt layout'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxN5FT8Rv3TOqiet6ZZ89WtEcBRK_sRXrNFT2TEsPW5DfefIZ8tWqzr0Pni7sDiWy49kKzZ5oAIWLhhI5SHvKc9k6pJBFGqRh-MtRTZ3eWZsKK6TohJXULMiX8sXGik1ek8V-eaVTvbm_GxhR9Es4GjAFL-g3ic37pL7oI0xARhY7eq1FIMwIZCwnm5bcBM25oXxW99UPP8M1xLhzFzJ-i-RoD35YxyRmot0kY3OVziLAchHC2bEGQ'
    },
    {
      id: 'sales-history',
      title: 'Screen 06: Transaction History Ledger',
      badge: 'Sales Ledgers',
      description: 'An immutable accounting archive hosting previous checked receipts, customer logs, and refund actions.',
      specifications: [
        'Interactive filtering across date frames (Today, Week, Month)',
        'Detailed transaction slip reprint modals with invoice data',
        'One-click Refund reverse auditor returning stock back into inventory'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARqworLoItTKCWrAWL263nWBKaSjJBXddG9OYEX5hKMi1wa0cDIr7czZctKafo7ndTLG9DLqXooMfLQLlFAaTEWbNEd0AU1ytEagiNVbuPWwX0VFaZHWA-XDWfM9wqx6vZxAUZJraRwj8r3LN8MKO3E1i3EMrtYFl90oC_Qf_-tWf7OFfpFBz3y2WKXt-ruqHUBfC1whddycZOdP5iYfsCw-6gYi-eY-a5q5fZpVVfJEf10HD6f0BN'
    },
    {
      id: 'inventory',
      title: 'Screen 07: Stock Manager & Audit',
      badge: 'Supply Chain',
      description: 'A stock management board tracking material supplies, incoming restock volumes, and live activity logs.',
      specifications: [
        'Dynamic alert notifications highlighting low and out of stock SKUs',
        'Quick adjustment controls (+10, +50, custom audit values)',
        'Automatic log generator recording Operator names and action counts'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCfJFZNiFeUZ4p3_fnvx5KvGZXMWBqzGW9WZnKMa8ncbqWn5wpDOxLeIAAFgNRHUtW4Ef5AvzYZoD8A2JcFj6Toz_mUDOc2L4Ji873gaNF0mzQIfQaf18Ui3oC5eScXsIHNJCWNNmpjQ-zbQCfDlvncoyrkE9KsfdGrl7nHq9s7Kek5xXpd5UgfajcTLn_DRKdWBAqYSd6GMG1z2WK_QTGm8UqMJe_D9zEqz7IVrjtxRKiieQybEc1'
    },
    {
      id: 'reports',
      title: 'Screen 08: Reports & Financial Analytics',
      badge: 'Deep Analytics',
      description: 'An advanced data-reporting screen compiling gross profits, category distributions, and cashier leadership.',
      specifications: [
        'Double linear area gradients visualizing daily cost vs profit trend lines',
        'Peak hours orders distribution charts mapping high-volume blocks',
        'Categorical donut charts measuring product group percentages'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBQA1Loex0LzKPsVagu7JHuLJ04hCtvTE9JHjmeAdsxVB4CzyTf3eVtNiAoy8yDRZOkHKtWk1kM-VGjSTo1h8AwQvosUzE6TR_YBzQ-UBOENnMSstJnqe82bInhdTnpeP0yQOB7gyaLQfICjqTk7deXs1Dvd509rjmsvBeFaMDm2VVTj9_b9uWRc-1cx3d33ECcbcnkfo1TNhLBem-NJiUH-hadlKrism6eqPybfPLTJ_a9MGmIB0-'
    },
    {
      id: 'settings',
      title: 'Screen 09: System Store Settings',
      badge: 'Configuration',
      description: 'An administration control form editing profile coordinates, color themes, staff rosters, and system resets.',
      specifications: [
        'Dynamic brand color picker palette modifying the global layout values',
        'Staff member registration form preloaded with role hierarchy tags',
        'Toggle controls supporting real-time Light/Dark interface themes'
      ],
      previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaDD7P_Nyvoe6N7J2ePPYhI1WOSYkccY7IO4Y6CJkz1q6hcLP2bnVBtmAVB0r4cf-_W2ArzcKHRY0WW7kqa9Eio3xIwx2g65vJzat4969IVJgyhCpCHmKFVrSKeWNp5nKo0CRJXm-xEZqtX9Kh6OlgQf1F_bYoNTDHqR1Scem0_jaLVZsQSDytfe5O0XgQ5CGppnySDGf7ST7mKtYYe6gdbayijiehuvHKpB-HfzFtR_X88tzc7OEu'
    }
  ];

  return (
    <div id="showcase-screen" className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div id="showcase-header" className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-coffee-700 text-white rounded-xl">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <span>BrewMaster Pro Showcase</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-coffee-100 dark:bg-coffee-950/20 text-coffee-700 rounded-md">
                10 Fully-Featured Screens
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              An exhaustive architectural walkthrough of the 10 custom designed management screens requested.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Specifications Overview */}
      <div id="showcase-tech-specs" className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-coffee-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-coffee-100/30 dark:border-zinc-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-coffee-800 dark:text-coffee-400 font-bold text-xs">
            <Code size={14} />
            <span>ARCHITECTURE</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-semibold">
            React 19 + TypeScript + Vite 6
          </p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Fully decoupled modular UI screens designed in strict adherence to framework structural instructions.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-coffee-800 dark:text-coffee-400 font-bold text-xs">
            <Palette size={14} />
            <span>STYLES & TYPOGRAPHY</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-semibold">
            Tailwind CSS v4 + Space Grotesk
          </p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            High-contrast visual palettes with Space Grotesk display headers, Inter body text, and JetBrains Mono metric indicators.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-coffee-800 dark:text-coffee-400 font-bold text-xs">
            <Sparkles size={14} />
            <span>INTERACTIVE FIDELITY</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-semibold">
            Full Client-Side State Synchronization
          </p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Local storage integration syncing cash transactions, automated stock deducts, audit logs, and dark theme toggles.
          </p>
        </div>
      </div>

      {/* Grid of screens */}
      <div id="showcase-screens-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map((scr) => (
          <div 
            key={scr.id} 
            id={`showcase-card-${scr.id}`}
            className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-coffee-200 transition-all"
          >
            {/* Visual preview header with expand */}
            <div className="relative aspect-[16/10] bg-gray-100 border-b border-gray-100 overflow-hidden">
              <img 
                src={scr.previewUrl} 
                alt={scr.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-101"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-zinc-950/80 backdrop-blur-sm text-[9px] font-bold text-white rounded-md uppercase font-mono tracking-wider">
                {scr.badge}
              </span>
              <button
                id={`btn-expand-preview-${scr.id}`}
                onClick={() => setSelectedPreview(scr.previewUrl)}
                title="Expand Preview"
                className="absolute bottom-3 right-3 p-1.5 bg-white/90 dark:bg-zinc-900/90 rounded-lg text-gray-600 dark:text-zinc-400 hover:text-coffee-700 transition-colors shadow-sm"
              >
                <Maximize2 size={13} />
              </button>
            </div>

            {/* Description content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-black text-gray-900 dark:text-zinc-100 tracking-tight">{scr.title}</h3>
                <p className="text-[11px] text-gray-400 dark:text-zinc-400 font-normal leading-relaxed">{scr.description}</p>
                
                {/* Specifications Bullets */}
                <ul className="space-y-1.5 pt-2">
                  {scr.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[9.5px] text-gray-500 dark:text-zinc-500 leading-normal">
                      <CheckCircle2 size={11} className="text-coffee-600 flex-shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <button
                id={`btn-launch-showcase-${scr.id}`}
                onClick={() => onNavigate(scr.id)}
                className="w-full py-2 bg-coffee-50 dark:bg-coffee-950/10 hover:bg-coffee-700 dark:hover:bg-coffee-700 hover:text-white text-coffee-700 dark:text-coffee-400 font-semibold text-xs rounded-xl border border-coffee-100 dark:border-coffee-900/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>Launch Interactive Screen</span>
                <ExternalLink size={11} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Expanded Preview Lightbox Modal */}
      {selectedPreview && (
        <div 
          id="showcase-lightbox-backdrop" 
          onClick={() => setSelectedPreview(null)}
          className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="relative max-w-4xl w-full bg-transparent rounded-xl overflow-hidden p-1">
            <img 
              src={selectedPreview} 
              alt="Expanded Design Preview" 
              className="w-full h-auto rounded-lg shadow-2xl object-contain max-h-[85vh]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-4 right-4 bg-zinc-950/80 text-white font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
              Click anywhere to close
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
