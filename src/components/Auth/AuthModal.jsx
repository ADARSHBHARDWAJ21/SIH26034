import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, Eye, EyeOff, Shield, Zap, Target, ShieldCheck, FileText, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../../engine/authService';

function SmartMetMark({ compact = false }) {
  return (
    <div className={`sm-logo ${compact ? 'sm-logo-compact' : ''}`}>
      <svg viewBox="0 0 48 48" className="sm-logo-mark" aria-hidden="true">
        <rect x="4" y="4" width="14" height="4" rx="1.5" fill="#6366f1" />
        <rect x="4" y="4" width="4" height="14" rx="1.5" fill="#6366f1" />
        <rect x="30" y="4" width="14" height="4" rx="1.5" fill="#6366f1" />
        <rect x="40" y="4" width="4" height="14" rx="1.5" fill="#6366f1" />
        <rect x="4" y="30" width="4" height="14" rx="1.5" fill="#6366f1" />
        <rect x="4" y="40" width="14" height="4" rx="1.5" fill="#6366f1" />
        <rect x="40" y="30" width="4" height="14" rx="1.5" fill="#6366f1" />
        <rect x="30" y="40" width="14" height="4" rx="1.5" fill="#6366f1" />
        <rect x="14" y="12" width="16" height="20" rx="2" fill="none" stroke="#6366f1" strokeWidth="2.2" />
        <path d="M18 18h8M18 22h8M18 26h5" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="30" cy="30" r="6" fill="none" stroke="#06b6d4" strokeWidth="2.2" />
        <path d="M34.2 34.2L39 39" stroke="#06b6d4" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <div className="sm-logo-text">
        <div className="sm-logo-name font-heading">Smart<span>Met</span><sup>™</sup></div>
        <div className="sm-logo-sub">Legal Metrology AI Studio</div>
      </div>
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('Official');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (isSignup) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      const res = await registerUser(fullName, email, password, role);
      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      }
    } else {
      const res = await loginUser(email, password, role);
      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      }
    }
  };

  const handleQuickLogin = async (demoRole) => {
    if (demoRole === 'Official') {
      const res = await loginUser("inspector@metrology.gov.in", "admin123", "Official");
      onAuthSuccess(res.user);
    } else {
      const res = await loginUser("consumer@gmail.com", "user123", "Consumer");
      onAuthSuccess(res.user);
    }
    onClose();
  };

  return (
    <div className="sm-auth-backdrop">
      <div className="sm-auth-card">
        <button type="button" className="sm-auth-close" onClick={onClose} aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {/* Left Info Pane */}
        <aside className="sm-auth-left">
          <SmartMetMark />
          <div className="space-y-2 my-auto py-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white font-heading leading-tight">
              Safer Products,<br />
              <span className="bg-gradient-to-r from-indigo-600 to-amber-600 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">Stronger Bharat</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 via-stone-400 to-emerald-500 rounded-full my-3" />
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              AI-assisted legal metrology compliance enforcement for a transparent and fair consumer marketplace.
            </p>

            <ul className="space-y-2 text-xs text-stone-700 dark:text-slate-200 pt-4">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Instant Spatial OCR Analysis
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600 dark:text-indigo-400" /> Rule 6(1) Declarations Validation
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Section 36 Penalty Adjudication
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Certified PDF Audit Notices
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-slate-800 text-[10px] text-stone-500 dark:text-slate-400 font-mono">
            Legal Metrology (Packaged Commodities) Rules, 2011
          </div>
        </aside>

        {/* Right Form Pane */}
        <div className="sm-auth-right space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-cyan-400 block mb-1">
              {isSignup ? 'Create Officer Account' : 'Portal Sign In'}
            </span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-heading">
              {isSignup ? 'Register on SmartMet' : 'Welcome to SmartMet'}
            </h3>
          </div>

          {/* Role Toggle Switch */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
            <button
              type="button"
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all border-0 ${
                role === 'Official'
                  ? 'bg-indigo-600 text-white shadow font-bold'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              onClick={() => setRole('Official')}
            >
              <Shield className="w-3.5 h-3.5" /> Official Inspector
            </button>
            <button
              type="button"
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all border-0 ${
                role === 'Consumer'
                  ? 'bg-indigo-600 dark:bg-cyan-600 text-white shadow font-bold'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              onClick={() => setRole('Consumer')}
            >
              <User className="w-3.5 h-3.5" /> Consumer / Brand
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <label className="sm-auth-field">
                Full Legal Name
                <span>
                  <User className="w-4 h-4 text-stone-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Officer Rajesh Kumar"
                  />
                </span>
              </label>
            )}

            <label className="sm-auth-field">
              Official Email Address
              <span>
                <Mail className="w-4 h-4 text-stone-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'Official' ? 'inspector@metrology.gov.in' : 'consumer@gmail.com'}
                />
              </span>
            </label>

            <label className="sm-auth-field">
              Password
              <span>
                <Lock className="w-4 h-4 text-stone-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </span>
            </label>

            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-500/30">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary text-xs w-full py-2.5 font-bold shadow-lg flex items-center justify-center gap-2"
            >
              {isSignup ? 'Create Account' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
            <span>Quick Demo:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Official')}
                className="text-indigo-600 dark:text-cyan-400 font-mono text-[11px] hover:underline font-bold"
              >
                [Inspector]
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Consumer')}
                className="text-amber-600 dark:text-indigo-400 font-mono text-[11px] hover:underline font-bold"
              >
                [Consumer]
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-stone-500 dark:text-slate-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export { SmartMetMark };
