import React, { useEffect } from 'react';
import {
  ArrowRight, ClipboardList, ShieldCheck, AlertTriangle, Clock, Camera, Layers,
  Search, FileText, BookOpen, Package, Bell, Play, Linkedin, Youtube, Facebook,
  ChevronRight, TrendingUp, TrendingDown, MoreHorizontal, FileCheck2, Sparkles,
  Scale, ShieldAlert, Cpu, BarChart3, CheckCircle2, Zap, ExternalLink, MapPin
} from 'lucide-react';

const TREND = [
  { label: 'Aug 01', c: 42, n: 28 },
  { label: 'Aug 08', c: 78, n: 22 },
  { label: 'Aug 15', c: 36, n: 52 },
  { label: 'Aug 22', c: 88, n: 24 },
  { label: 'Aug 26', c: 70, n: 16 }
];

const VIOLATIONS = [
  { label: 'Rule 6(1)(c) - Net Qty Unit', pct: 28, count: 42, color: '#f43f5e' },
  { label: 'Rule 6(1)(e) - MRP Tax Clause', pct: 22, count: 35, color: '#fb7185' },
  { label: 'Rule 6(1)(d) - Mfg Date Format', pct: 18, count: 26, color: '#f59e0b' },
  { label: 'Rule 6(1)(f) - Consumer Email', pct: 15, count: 21, color: '#818cf8' },
  { label: 'Rule 7 - Font Height (PDP)', pct: 10, count: 14, color: '#06b6d4' }
];

const CATEGORIES = [
  { label: 'Packaged Foods', pct: 32, color: '#38bdf8' },
  { label: 'Beverages', pct: 18, color: '#818cf8' },
  { label: 'Personal Care', pct: 16, color: '#34d399' },
  { label: 'Home Care', pct: 12, color: '#fbbf24' },
  { label: 'Electronics', pct: 8, color: '#fb7185' },
  { label: 'Others', pct: 14, color: '#94a3b8' }
];

const RECENT = [
  { name: 'Potato Chips 150g', brand: 'Bingo', category: 'Snacks', status: 'COMPLIANT', score: 98, date: '26 Aug 2025', thumb: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=120&q=80' },
  { name: 'Toned Milk 1L', brand: 'Amul', category: 'Dairy', status: 'NON_COMPLIANT', score: 87, date: '26 Aug 2025', thumb: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=120&q=80' },
  { name: 'Face Cream 50g', brand: "Pond's", category: 'Cosmetics', status: 'COMPLIANT', score: 96, date: '25 Aug 2025', thumb: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=120&q=80' },
  { name: 'Wireless Earbuds', brand: 'boAt', category: 'Electronics', status: 'NON_COMPLIANT', score: 89, date: '25 Aug 2025', thumb: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=120&q=80' },
  { name: 'Green Tea 100g', brand: 'Tetley', category: 'Beverages', status: 'COMPLIANT', score: 92, date: '24 Aug 2025', thumb: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=120&q=80' }
];

export default function HomeLanding({
  onStartInspection,
  onWatchDemo,
  onOpenBatch,
  onOpenAnalytics,
  onOpenRegulations,
  onOpenReports,
  onGenerateReport,
  onOpenAbout,
  highlight
}) {
  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(highlight);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, [highlight]);

  const kpi = { total: 248, compliant: 182, nonCompliant: 54, pending: 12 };

  const quickActions = [
    { title: 'New Package Audit', desc: 'Scan or upload single packaging label for instant OCR check', icon: Camera, tone: 'from-cyan-500/20 to-blue-500/10 text-cyan-500 dark:text-cyan-400 border-cyan-500/30', onClick: onStartInspection },
    { title: 'Batch Inspection Suite', desc: 'Upload multiple product photos for bulk catalogue enforcement', icon: Layers, tone: 'from-indigo-500/20 to-purple-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/30', onClick: onOpenBatch },
    { title: 'Enforcement Analytics', desc: 'Category risk heatmaps, trend metrics & Section 36 penalties', icon: BarChart3, tone: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30', onClick: onOpenAnalytics },
    { title: 'Generate Official Notice', desc: 'Export audit assessment certificates & violation notices in PDF', icon: FileText, tone: 'from-rose-500/20 to-pink-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30', onClick: onGenerateReport },
    { title: 'Rulebook 2011 Explorer', desc: 'Statutory declarations, font height calculators & act sections', icon: BookOpen, tone: 'from-amber-500/20 to-orange-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30', onClick: onOpenRegulations },
    { title: 'Compliance Registry', desc: 'Search and filter past inspector records & audit dossiers', icon: Search, tone: 'from-sky-500/20 to-indigo-500/10 text-sky-500 dark:text-sky-400 border-sky-500/30', onClick: onOpenReports }
  ];

  const donut = `conic-gradient(${CATEGORIES.map((c, i, arr) => {
    const start = arr.slice(0, i).reduce((s, x) => s + x.pct, 0);
    return `${c.color} ${start}% ${start + c.pct}%`;
  }).join(',')})`;

  return (
    <div className="smartmet-shell space-y-8 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 border-b border-stone-200 dark:border-slate-800/80">
        <div className="sm-wrap relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
                <span>AI Packaging Scanner</span>
                <span className="text-stone-400 dark:text-slate-500">•</span>
                <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold">Instant Label Check</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.08] font-heading">
                Check Any Product Label <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">with AI in Seconds</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
                Scan or upload any package photo to instantly check MRP, weight, expiry date, and manufacturer details. Automatically catch missing label information and see if a product follows legal packaging rules.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onStartInspection}
                  className="btn btn-primary text-sm py-3 px-6 shadow-xl flex items-center gap-2 font-bold"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                >
                  <Camera className="w-4 h-4 text-white" /> Start Product Inspection
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={onWatchDemo || onStartInspection}
                  className="btn btn-secondary text-sm py-3 px-5 flex items-center gap-2 border-stone-300 dark:border-slate-700 hover:border-blue-400"
                >
                  <Play className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> Watch Live Scan Demo
                </button>
              </div>

              {/* Live Metric Pills */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 dark:border-slate-800/80 text-xs">
                <div>
                  <span className="text-stone-500 dark:text-slate-400 block font-medium">Label Scanning</span>
                  <strong className="text-stone-900 dark:text-white font-mono text-base font-bold">99.4% Accuracy</strong>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-slate-400 block font-medium">Check Speed</span>
                  <strong className="text-blue-600 dark:text-cyan-400 font-mono text-base font-bold">&lt; 1.2 Seconds</strong>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-slate-400 block font-medium">Package Rules</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base font-bold">Fully Verified</strong>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Banner / Interactive Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-45 transition duration-1000 group-hover:duration-200" />
                
                <div className="relative glass-panel p-5 bg-white/95 dark:bg-slate-900/90 shadow-2xl overflow-hidden border-stone-200 dark:border-slate-700/80">
                  
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                      <span className="text-xs font-mono font-bold text-stone-800 dark:text-white uppercase tracking-wider">
                        Live Label Scanner Telemetry
                      </span>
                    </div>
                    <span className="badge badge-pass text-[10px]">PCR-2011 COMPLIANT</span>
                  </div>

                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80"
                      alt="Product inspection preview"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="scanner-laser" />

                    {/* HUD Overlays */}
                    <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-400 text-[10px] font-mono text-cyan-300">
                      OCR: Net Qty [150 g] • PASS
                    </div>
                    <div className="absolute bottom-3 right-3 bg-stone-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400 text-[10px] font-mono text-emerald-300">
                      MRP: ₹ 35.00 (Incl. Taxes) • PASS
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white">Bingo Potato Chips 150g</h4>
                      <p className="text-stone-500 dark:text-slate-400 text-[11px]">8/8 Mandatory Declarations Verified</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-lg">98%</span>
                      <span className="text-[10px] text-stone-500 dark:text-slate-400 block uppercase font-semibold">Compliance</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Body Wrap */}
      <div className="sm-wrap space-y-8">
        
        {/* KPI Command Center Strip */}
        <div className="sm-kpi-grid">
          
          <div className="sm-kpi-card">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 dark:text-slate-400 font-semibold block">Total Inspections Audited</span>
              <div className="flex items-baseline gap-2">
                <span className="sm-kpi-val">{kpi.total}</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" /> +12%
                </span>
              </div>
              <span className="text-[11px] text-stone-400 dark:text-slate-500 block">Active dossier repository</span>
            </div>
            <div className="sm-kpi-icon bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>

          <div className="sm-kpi-card">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 dark:text-slate-400 font-semibold block">Fully Compliant Packages</span>
              <div className="flex items-baseline gap-2">
                <span className="sm-kpi-val text-emerald-600 dark:text-emerald-400">{kpi.compliant}</span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">73%</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400/80 block flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Zero Offence Records
              </span>
            </div>
            <div className="sm-kpi-icon bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="sm-kpi-card">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 dark:text-slate-400 font-semibold block">Statutory Non-Compliance</span>
              <div className="flex items-baseline gap-2">
                <span className="sm-kpi-val text-rose-600 dark:text-rose-400">{kpi.nonCompliant}</span>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">22%</span>
              </div>
              <span className="text-[11px] text-rose-600 dark:text-rose-400/80 block flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" /> Section 36 Liable
              </span>
            </div>
            <div className="sm-kpi-icon bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="sm-kpi-card">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 dark:text-slate-400 font-semibold block">Under Officer Review</span>
              <div className="flex items-baseline gap-2">
                <span className="sm-kpi-val text-amber-600 dark:text-amber-400">{kpi.pending}</span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">5%</span>
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400/80 block flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> Awaiting Adjudication
              </span>
            </div>
            <div className="sm-kpi-icon bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Quick Actions Grid */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading">Inspector Command Center</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">Launch direct compliance inspection workflows and automated rule analyzers</p>
            </div>
            <button type="button" onClick={onStartInspection} className="text-xs text-indigo-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1">
              Launch Studio <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="sm-qa-grid">
            {quickActions.map((qa, idx) => {
              const Icon = qa.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={qa.onClick}
                  className="sm-qa-tile group border-stone-200 dark:border-slate-800 hover:border-indigo-400"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className={`sm-qa-icon bg-gradient-to-br ${qa.tone}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors mb-1">
                      {qa.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">{qa.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Analytics & Breach Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Trend Bar Chart */}
          <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white font-heading">Monthly Enforcement Trend</h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400">Compliant vs Non-Compliant package distribution over time</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" /> Compliant
                  </span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 dark:bg-rose-400" /> Offence
                  </span>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between gap-4 pt-4 border-b border-stone-200 dark:border-slate-800/80 pb-2">
                {TREND.map((t, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      <div
                        style={{ height: `${t.c}%` }}
                        className="w-1/2 max-w-[20px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                        title={`Compliant: ${t.c}`}
                      />
                      <div
                        style={{ height: `${t.n}%` }}
                        className="w-1/2 max-w-[20px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                        title={`Non-Compliant: ${t.n}`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-stone-500 dark:text-slate-400">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
              <span>Overall Compliance Health Index: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">77.4%</strong></span>
              <button type="button" onClick={onOpenAnalytics} className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline">
                Deep Dive Analytics →
              </button>
            </div>
          </div>

          {/* Top Violation Types & Categories */}
          <div className="lg:col-span-5 glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-heading">Top Rule Violations</h3>
              <span className="text-xs font-mono text-stone-500 dark:text-slate-400">Rules 2011</span>
            </div>

            <div className="space-y-3">
              {VIOLATIONS.map((v, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 dark:text-slate-300 truncate max-w-[200px]">{v.label}</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{v.pct}% ({v.count})</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-slate-950 rounded-full overflow-hidden border border-stone-200 dark:border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${v.pct * 3}%`, background: v.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex-shrink-0 shadow-inner" style={{ background: donut }} />
                <div>
                  <span className="text-xs font-bold text-stone-900 dark:text-white">Commodity Sectors</span>
                  <span className="text-[11px] text-stone-500 dark:text-slate-400 block">6 Core Regulated Categories</span>
                </div>
              </div>
              <button type="button" onClick={onOpenRegulations} className="btn btn-secondary text-xs py-1.5 px-3">
                View Rules
              </button>
            </div>
          </div>

        </div>

        {/* Recent Inspections Table */}
        <div className="glass-panel p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading">Recent Packaging Compliance Audits</h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">Live inspection queue and verdict ratings</p>
            </div>
            <button type="button" onClick={onOpenReports} className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> View All Records
            </button>
          </div>

          <div className="sm-table-container">
            <table className="sm-data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand & Category</th>
                  <th>Compliance Verdict</th>
                  <th>Rating</th>
                  <th>Audit Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENT.map((row, idx) => (
                  <tr key={idx} onClick={onStartInspection}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={row.thumb} alt={row.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-slate-800" />
                        <div>
                          <strong className="text-stone-900 dark:text-white block">{row.name}</strong>
                          <span className="text-[11px] text-stone-400 dark:text-slate-400 font-mono">ID: #SM-2025-082{idx}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-stone-700 dark:text-slate-200 font-semibold">{row.brand}</span>
                      <span className="text-stone-400 dark:text-slate-500 block text-xs font-mono">{row.category}</span>
                    </td>
                    <td>
                      {row.status === 'COMPLIANT' ? (
                        <span className="badge badge-pass text-[10px]">FULLY COMPLIANT</span>
                      ) : (
                        <span className="badge badge-fail text-[10px]">NON-COMPLIANT</span>
                      )}
                    </td>
                    <td>
                      <span className={`font-mono font-bold text-sm ${row.status === 'COMPLIANT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {row.score}%
                      </span>
                    </td>
                    <td className="font-mono text-xs text-stone-500 dark:text-slate-400">{row.date}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={onStartInspection}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-slate-900 hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 border border-stone-200 dark:border-slate-800 transition-colors"
                        title="Inspect this package"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Enforcement Radar & Notifications Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Notifications Feed */}
          <div id="smartmet-notifications" className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white font-heading">Regulatory Stream</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-cyan-500/10 text-indigo-700 dark:text-cyan-300">Live</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Rule 6(1)(d) Breach Detected
                  </strong>
                  <span className="text-[10px] text-stone-400 dark:text-slate-400 font-mono">2h ago</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-slate-300">MRP missing mandatory tax inclusion clause on scanned Potato Chips.</p>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Gazette Amendment Notice
                  </strong>
                  <span className="text-[10px] text-stone-400 dark:text-slate-400 font-mono">5h ago</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-slate-300">Updated unit sale price rules for multi-pack e-commerce commodities.</p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" /> Batch Dossier Generated
                  </strong>
                  <span className="text-[10px] text-stone-400 dark:text-slate-400 font-mono">1d ago</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-slate-300">Report #SM-2025-0826-001 certified for Central Enforcement Cell.</p>
              </div>
            </div>
          </div>

          {/* Useful Official Resources */}
          <div id="smartmet-resources" className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white font-heading">Statutory Rulebooks</h3>
              </div>
              <button type="button" onClick={onOpenRegulations} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenRegulations}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 hover:bg-stone-100 dark:hover:bg-slate-800/80 border border-stone-200 dark:border-slate-800 flex items-center justify-between transition-colors group"
              >
                <div>
                  <strong className="text-xs text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 block">Packaged Commodities Rules, 2011</strong>
                  <span className="text-[10px] text-stone-500 dark:text-slate-400">Department of Consumer Affairs</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={onOpenRegulations}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 hover:bg-stone-100 dark:hover:bg-slate-800/80 border border-stone-200 dark:border-slate-800 flex items-center justify-between transition-colors group"
              >
                <div>
                  <strong className="text-xs text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 block">Legal Metrology Act, 2009 (No. 1 of 2010)</strong>
                  <span className="text-[10px] text-stone-500 dark:text-slate-400">Section 36 & 37 Penalties & Offence Sections</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={onOpenRegulations}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 hover:bg-stone-100 dark:hover:bg-slate-800/80 border border-stone-200 dark:border-slate-800 flex items-center justify-between transition-colors group"
              >
                <div>
                  <strong className="text-xs text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 block">Bureau of Indian Standards (BIS)</strong>
                  <span className="text-[10px] text-stone-500 dark:text-slate-400">Standard Labelling Guidelines</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          {/* National Mission Highlight */}
          <div id="smartmet-about" className="glass-panel p-6 bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-cyan-950/30 border-indigo-200 dark:border-indigo-500/30 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-cyan-400 font-mono flex items-center gap-1.5">
                🇮🇳 National Compliance Initiative
              </span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading leading-snug">
                Ensuring Fair Trade & Consumer Rights Across Bharat
              </h3>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                SmartMet automates packaging inspections to protect 1.4B consumers against deceptive packaging, illegal units, and missing manufacturer details.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onOpenAbout || onStartInspection}
                className="btn btn-primary text-xs w-full py-2.5 font-bold shadow-lg"
              >
                Explore SmartMet Platform <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Enterprise SaaS Footer */}
      <footer className="sm-footer border-t border-stone-200 dark:border-slate-800">
        <div className="sm-wrap flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-900 dark:text-white font-heading">SmartMet™</span>
            <span className="text-stone-300 dark:text-slate-600">|</span>
            <span>SIH26034 • Ministry of Consumer Affairs, Food & Public Distribution</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-stone-900 dark:hover:text-white transition-colors">Back to Top</button>
            <button type="button" onClick={onOpenRegulations} className="hover:text-stone-900 dark:hover:text-white transition-colors">Regulations</button>
            <button type="button" onClick={onOpenAbout} className="hover:text-stone-900 dark:hover:text-white transition-colors">About</button>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> System Operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
