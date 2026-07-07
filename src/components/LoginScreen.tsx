/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coffee, Key, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('eleanor.v@brewmaster.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Background image of Cafe from Google Cloud Storage hotlink
  const bgImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCzO5LP6IEEFAR7woYAS2O2Hdap2ljIioHJhK-ga4-TmyGqbPCyx6VwuT7OggdEEU_KbcQHbIltfG8k7utQxZHNAMeLF4MgH52qhJoZdaLP_o88cb1cCzspttNsHKWUIfqQTsLnKQM8_ezPtfyM3R13qfYlULWYSJWheMYT3k-1HHFS082jJiQRTgssCMeH1Inx8Vt-IpmPZb0ERu8wnx8Ira4PVdUp9ED0FR4ZyDSDveO47zVwq_o";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    // Simulate validation
    setTimeout(() => {
      setLoading(false);
      if (email === 'eleanor.v@brewmaster.com' && password === 'password') {
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Hint: use eleanor.v@brewmaster.com & password');
      }
    }, 800);
  };

  return (
    <div id="login-container" className="min-h-screen w-full flex bg-gray-50 dark:bg-zinc-950">
      
      {/* Left side: Beautiful Cafe Ambience Image Panel */}
      <div 
        id="login-image-panel"
        className="hidden md:flex md:w-1/2 lg:w-3/5 bg-cover bg-center relative items-end p-12"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/20 to-transparent z-0" />
        
        {/* Brand/Quote overlay */}
        <div id="login-overlay-content" className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3.5 mb-5 bg-white/10 backdrop-blur-md px-4.5 py-2.5 rounded-full w-fit border border-white/20">
            <Coffee className="text-white fill-white/10" size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest text-white">THE DAILY GRIND</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight mb-4">
            Crafting perfect moments, one bean at a time.
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed">
            BrewMaster Pro provides real-time POS processing, catalog syncing, stock optimization, and advanced analytics for cafe owners and staff.
          </p>
        </div>
      </div>

      {/* Right side: Elegant login card */}
      <div id="login-form-panel" className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-12 relative">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-none">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-3.5 rounded-2xl bg-coffee-50 dark:bg-coffee-950/20 border border-coffee-100 dark:border-coffee-900/30 text-coffee-700 dark:text-coffee-400">
              <Coffee size={28} className="fill-coffee-700/10" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 font-medium">
              Login to BrewMaster Pro POS & Operations Console
            </p>
          </div>

          {error && (
            <div id="login-error" className="mb-6 p-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300 tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-zinc-600">
                  <Mail size={16} />
                </span>
                <input
                  id="login-input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@brewmaster.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500/20 focus:border-coffee-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300 tracking-wide uppercase">Password</label>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Demo Mode: Default password is "password"'); }}
                  className="text-[11px] font-medium text-coffee-600 dark:text-coffee-400 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-zinc-600">
                  <Key size={16} />
                </span>
                <input
                  id="login-input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500/20 focus:border-coffee-500 transition-all"
                />
                <button
                  id="login-btn-toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="login-checkbox-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4.5 h-4.5 text-coffee-600 border-gray-300 dark:border-zinc-700 rounded focus:ring-coffee-500/20"
                />
                <span className="text-xs text-gray-500 dark:text-zinc-400">Remember session</span>
              </label>
              
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                <ShieldCheck size={12} />
                <span>Secure Console</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-btn-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-coffee-700 hover:bg-coffee-800 text-white font-medium text-sm rounded-xl transition-all duration-150 transform active:scale-[0.99] hover:shadow-lg hover:shadow-coffee-700/20 disabled:opacity-50 flex items-center justify-center gap-2.5 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Request Access */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800/60 text-center">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Need account access? </span>
            <button 
              onClick={() => alert('Please contact store administrator Eleanor Vance (eleanor.v@brewmaster.com) to provision new credentials.')}
              className="text-xs font-semibold text-coffee-600 dark:text-coffee-400 hover:underline"
            >
              Request Access
            </button>
          </div>
        </div>

        {/* System Credentials Hint */}
        <p className="mt-6 text-[10px] font-mono text-gray-400 dark:text-zinc-600 bg-gray-100 dark:bg-zinc-900/50 px-3 py-1.5 rounded-md text-center max-w-sm border border-gray-200/10">
          🔑 DEMO CREDENTIALS<br/>
          Email: <span className="text-coffee-600 dark:text-coffee-400 font-semibold">eleanor.v@brewmaster.com</span> | Pass: <span className="text-coffee-600 dark:text-coffee-400 font-semibold">password</span>
        </p>
      </div>
    </div>
  );
}
