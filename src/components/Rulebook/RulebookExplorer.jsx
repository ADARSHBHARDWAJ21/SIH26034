import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, Search, Factory, Box, Weight, Calendar, IndianRupee, User,
  Globe, Tag, Scale, ArrowRight, ExternalLink, Calculator, FileText, LayoutGrid,
  FileCheck2, Tag as TagIcon, MoreHorizontal, Sparkles
} from 'lucide-react';
import { LEGAL_METROLOGY_RULES } from '../../engine/sampleData';

const RULE_META = {
  'Rule 6(1)(a)': { groups: ['mandatory', 'consumer'], icon: Factory, tone: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30' },
  'Rule 6(1)(b)': { groups: ['mandatory', 'labelling'], icon: Box, tone: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30' },
  'Rule 6(1)(c)': { groups: ['mandatory', 'labelling'], icon: Weight, tone: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30' },
  'Rule 6(1)(d)': { groups: ['mandatory', 'labelling'], icon: Calendar, tone: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30' },
  'Rule 6(1)(e)': { groups: ['pricing'], icon: IndianRupee, tone: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30' },
  'Rule 6(1)(f)': { groups: ['consumer'], icon: User, tone: 'from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30' },
  'Rule 6(1)(g)': { groups: ['mandatory'], icon: Globe, tone: 'from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/30' },
  'Rule 6(11)': { groups: ['pricing', 'other'], icon: Tag, tone: 'from-violet-500/20 to-indigo-500/10 text-violet-400 border-violet-500/30' }
};

const TABS = [
  { id: 'all', label: 'All Rules', icon: LayoutGrid },
  { id: 'mandatory', label: 'Mandatory Declarations', icon: FileCheck2 },
  { id: 'labelling', label: 'Labelling & Display', icon: TagIcon },
  { id: 'pricing', label: 'Pricing & Tax', icon: IndianRupee },
  { id: 'consumer', label: 'Consumer Information', icon: User },
  { id: 'other', label: 'Other Provisions', icon: MoreHorizontal }
];

export default function RulebookExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('all');
  const [pdpArea, setPdpArea] = useState(150);
  const searchRef = useRef(null);

  const fontRules = [
    { area: 'Up to 50 cm²', minHeight: '1.0 mm', minHeightVolume: '1.5 mm', maxArea: 50 },
    { area: '50 cm² to 100 cm²', minHeight: '1.5 mm', minHeightVolume: '2.0 mm', maxArea: 100 },
    { area: '100 cm² to 500 cm²', minHeight: '2.5 mm', minHeightVolume: '3.0 mm', maxArea: 500 },
    { area: '500 cm² to 2500 cm²', minHeight: '4.0 mm', minHeightVolume: '4.0 mm', maxArea: 2500 },
    { area: 'Above 2500 cm²', minHeight: '6.0 mm', minHeightVolume: '6.0 mm', maxArea: 99999 }
  ];
  const currentFontRule = fontRules.find((r) => pdpArea <= r.maxArea) || fontRules[fontRules.length - 1];

  const tabCounts = useMemo(() => {
    const counts = { all: LEGAL_METROLOGY_RULES.length };
    TABS.forEach((t) => {
      if (t.id === 'all') return;
      counts[t.id] = LEGAL_METROLOGY_RULES.filter((r) => (RULE_META[r.ruleNo]?.groups || []).includes(t.id)).length;
    });
    return counts;
  }, []);

  const filteredRules = LEGAL_METROLOGY_RULES.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      r.ruleNo.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    const matchesTab = tab === 'all' || (RULE_META[r.ruleNo]?.groups || []).includes(tab);
    return matchesSearch && matchesTab;
  });

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="rb-page space-y-6">
      <div className="rb-wrap space-y-6">
        
        {/* Header */}
        <header className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-lg">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 dark:text-white font-heading">Legal Metrology Rules, 2011 Knowledge Base</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                  Gazette Official
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                Official statutory declarations handbook, Rule 7 font height parameters, and Section 36 offence penalties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                ref={searchRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rules (MRP, Units, Origin)..."
                className="w-full bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl pl-8 pr-12 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 absolute left-2.5 top-3" />
              <kbd className="absolute right-2 top-2 px-1.5 py-0.5 text-[9px] font-mono bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded text-stone-500 dark:text-slate-400">
                Ctrl K
              </kbd>
            </div>

            <a
              href="https://www.indiacode.nic.in/handle/123456789/2150"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 border-stone-300 dark:border-slate-700 shrink-0"
            >
              <span>Act 2009</span> <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-500/30 font-bold'
                    : 'bg-stone-100 dark:bg-slate-900/60 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/70 dark:hover:bg-slate-800'
                }`}
                style={isActive ? { backgroundColor: '#2563eb', color: '#ffffff' } : {}}
              >
                <Icon className="w-3.5 h-3.5" style={isActive ? { color: '#ffffff' } : {}} />
                <span style={isActive ? { color: '#ffffff' } : {}}>{t.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isActive ? 'bg-white/25 text-white' : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400'}`}
                  style={isActive ? { color: '#ffffff' } : {}}
                >
                  {tabCounts[t.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => {
            const meta = RULE_META[rule.ruleNo] || { icon: FileText, tone: 'from-blue-500/20 to-indigo-500/10 text-blue-500 dark:text-blue-400 border-blue-500/30' };
            const Icon = meta.icon;

            return (
              <article key={rule.ruleNo} className="glass-panel p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${meta.tone} border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold font-mono text-sm text-indigo-600 dark:text-cyan-400">{rule.ruleNo}</span>
                    </div>
                    <span className="badge badge-pass text-[9px]">MANDATORY STATUTORY CLAUSE</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-1">{rule.title}</h3>
                    <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">{rule.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-slate-400 font-mono text-[11px]">
                    <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Statutory Offence Section: <strong>{rule.penaltySection || 'Section 36, Act 2009'}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-[11px]">
                      <span className="text-stone-500 dark:text-slate-500 block">1st Offence Fine:</span>
                      <strong className="text-rose-600 dark:text-rose-400 font-mono">{rule.fineFirstOffence || 'Up to ₹ 25,000'}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-[11px]">
                      <span className="text-stone-500 dark:text-slate-500 block">2nd Offence Fine:</span>
                      <strong className="text-rose-600 dark:text-rose-400 font-mono">{rule.fineSecondOffence || 'Up to ₹ 50,000 + Jail'}</strong>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Rule 7 Interactive Font Height Calculator */}
        <section className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
              <h2 className="text-base font-bold text-stone-900 dark:text-white font-heading">
                Interactive Numeral Font Height Calculator (Rule 7)
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500 dark:text-slate-400">Principal Display Panel (PDP) Verification</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-700 dark:text-slate-300 block">
                Principal Display Panel Area (A): <strong className="text-indigo-600 dark:text-cyan-400 font-mono text-sm">{pdpArea} cm²</strong>
              </label>
              <input
                type="range"
                min="10"
                max="3000"
                step="10"
                value={pdpArea}
                onChange={(e) => setPdpArea(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-400"
              />
              <span className="text-[10px] text-stone-500 dark:text-slate-500 block">Width × Height of principal packaging surface area</span>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-stone-500 dark:text-slate-400 block font-medium">Standard Min Height of Numeral</span>
              <strong className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-cyan-400 block">{currentFontRule.minHeight}</strong>
              <span className="text-[10px] text-stone-500 dark:text-slate-500">For printed paper, carton & pouch packaging</span>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-stone-500 dark:text-slate-400 block font-medium">Min Height for Blown/Molded Containers</span>
              <strong className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block">{currentFontRule.minHeightVolume}</strong>
              <span className="text-[10px] text-stone-500 dark:text-slate-500">For glass/plastic bottles & metal tins</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
