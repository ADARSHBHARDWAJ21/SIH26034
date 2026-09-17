import React, { useState } from 'react';
import {
  Bell, User, ChevronDown, Sun, Moon, Sparkles, Shield,
  Layers, BarChart3, BookOpen, FileText, Camera, Menu, X, LogOut, CheckCircle2
} from 'lucide-react';
import { SmartMetMark } from './Auth/AuthModal';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  theme,
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'scanner', label: 'Inspect Studio', icon: Camera },
    { id: 'batch', label: 'Batch Audit', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'rulebook', label: 'Rulebook 2011', icon: BookOpen },
    { id: 'reports', label: 'Reports & Notice', icon: FileText },
  ];

  const initials = currentUser?.name
    ? currentUser.name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()
    : 'G';

  const roleLabel = currentUser
    ? (currentUser.role === 'Official' ? 'Inspector' : 'Consumer')
    : 'Guest';

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sm-nav">
      <div className="sm-nav-inner">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer text-left p-0 focus:outline-none"
          >
            <SmartMetMark compact />
          </button>
        </div>

        {/* Desktop & Responsive Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-stone-100/90 dark:bg-slate-900/60 p-1 rounded-full border border-stone-200 dark:border-slate-800 backdrop-blur-md shadow-inner overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/35 font-bold'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-200/60 dark:hover:bg-slate-800/50'
                }`}
                style={isActive ? { color: '#ffffff', backgroundColor: '#2563eb' } : {}}
              >
                <Icon className="w-3.5 h-3.5" style={isActive ? { color: '#ffffff' } : {}} />
                <span style={isActive ? { color: '#ffffff', fontWeight: 'bold' } : {}}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle, Notifications, User */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="sm-nav-icon-btn text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="sm-nav-icon-btn text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white relative"
            title="Notifications & Regulatory Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* User Account / Login */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="sm-nav-user"
              >
                <div className="sm-nav-avatar">{initials}</div>
                <div className="hidden sm:block text-left">
                  <div className="sm-nav-user-name line-clamp-1">{currentUser.name}</div>
                  <div className="sm-nav-user-role flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-blue-600 dark:text-cyan-400" /> {roleLabel}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 dark:text-slate-400 transition-transform duration-200 hidden sm:block ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Menu Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 border-stone-200 dark:border-slate-800">
                  <div className="p-2 border-b border-stone-200 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 font-mono truncate">{currentUser.email || 'inspector@metrology.gov.in'}</p>
                    <span className="inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/20">
                      {roleLabel} Access Granted
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUserDropdownOpen(false); handleTabClick('scanner'); }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Inspection Workbench
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUserDropdownOpen(false); handleTabClick('reports'); }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" /> Compliance Records
                  </button>
                  <div className="border-t border-stone-200 dark:border-slate-800 my-1" />
                  <button
                    type="button"
                    onClick={() => { setUserDropdownOpen(false); onLogout(); }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md"
            >
              <User className="w-3.5 h-3.5" />
              <span>Inspector Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
