import React, { useState } from 'react';
import { BarChart3, TrendingDown, PieChart, ShieldAlert, Award, AlertOctagon, Calculator, Sparkles, Scale, Info } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [unitCount, setUnitCount] = useState(250);

  const topViolations = [
    { rule: "Rule 6(1)(c) - Net Quantity Unit", count: 42, percentage: 38, detail: "Illegal non-standard units ('gms', 'ltrs', 'pcs')", color: "from-rose-500 to-pink-500" },
    { rule: "Rule 6(1)(e) - MRP Tax Clause", count: 35, percentage: 31, detail: "Missing mandatory '(incl. of all taxes)' clause", color: "from-amber-500 to-orange-500" },
    { rule: "Rule 6(1)(f) - Consumer Care Email", count: 28, percentage: 25, detail: "Missing official customer care email address", color: "from-indigo-500 to-purple-500" },
    { rule: "Rule 6(1)(g) - Country of Origin", count: 19, percentage: 17, detail: "Missing origin country on imported/packaged goods", color: "from-cyan-500 to-blue-500" },
    { rule: "Rule 6(11) - Unit Sale Price", count: 14, percentage: 12, detail: "Missing unit rate per gram/ml declaration", color: "from-teal-500 to-emerald-500" },
  ];

  const categoryRisk = [
    { category: "Cosmetics & Personal Care", nonComplianceRate: "54%", risk: "HIGH", color: "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/20" },
    { category: "Snack Foods & Confectionery", nonComplianceRate: "42%", risk: "HIGH", color: "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/20" },
    { category: "Beverages & Dairy", nonComplianceRate: "28%", risk: "MEDIUM", color: "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/20" },
    { category: "Consumer Electronics", nonComplianceRate: "12%", risk: "LOW", color: "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20" },
  ];

  // Fine compounding estimation
  const firstOffenceEstimate = Math.min(25000 * unitCount, 5000000);
  const secondOffenceEstimate = Math.min(50000 * unitCount, 10000000);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 shadow-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white font-heading">Inspector Enforcement & Risk Analytics</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-700 dark:text-cyan-300 border border-indigo-500/20 dark:border-cyan-500/30">
                Macro Intelligence
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
              Macro compliance metrics, category breach rates, and cumulative penalty estimators under Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Frequent Violations Bar Chart */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
            <h3 className="font-bold text-stone-900 dark:text-white text-base flex items-center gap-2 font-heading">
              <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Most Frequent Rule Violations
            </h3>
            <span className="text-xs text-stone-500 dark:text-slate-400 font-mono">Last 30 Days</span>
          </div>

          <div className="space-y-4">
            {topViolations.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-800 dark:text-slate-200">{item.rule}</span>
                  <span className="text-indigo-600 dark:text-cyan-400 font-mono">{item.percentage}% ({item.count} cases)</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-stone-200 dark:border-slate-800 p-0.5 shadow-inner">
                  <div
                    className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${item.percentage * 2.5}%` }}
                  />
                </div>
                <span className="text-[10px] text-stone-500 dark:text-slate-400 italic block">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Category Risk Heatmap */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-slate-800">
              <h3 className="font-bold text-stone-900 dark:text-white text-base flex items-center gap-2 font-heading">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" /> Category Risk Heatmap
              </h3>
              <span className="text-xs text-stone-500 dark:text-slate-400 font-mono">Sector Benchmark</span>
            </div>

            <div className="space-y-3">
              {categoryRisk.map((cat, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${cat.color}`}>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white">{cat.category}</h4>
                    <span className="text-[11px] text-stone-600 dark:text-slate-300 font-mono">Non-Compliance Offence Rate: {cat.nonComplianceRate}</span>
                  </div>
                  <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-md bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-white shadow-sm">
                    {cat.risk} RISK
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-stone-50 dark:bg-slate-950/80 rounded-2xl border border-indigo-500/20 dark:border-indigo-500/30 text-xs text-stone-700 dark:text-slate-300 shadow-inner">
            <span className="font-bold text-indigo-700 dark:text-cyan-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Key Enforcement Finding:
            </span>
            Over 38% of non-compliant packaged commodities violate Rule 6(1)(c) by using obsolete units like <code className="text-indigo-700 dark:text-cyan-300 font-mono">gms</code> instead of mandatory metric symbol <code className="text-indigo-700 dark:text-cyan-300 font-mono">g</code>.
          </div>
        </div>

      </div>

      {/* Interactive Offence Fine Compounding Calculator */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200 dark:border-slate-800">
          <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-stone-900 dark:text-white text-base font-heading">Cumulative Batch Offence Fine Estimator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-700 dark:text-slate-300 block">
              Estimated Non-Compliant Batch Units: <span className="font-mono text-indigo-600 dark:text-cyan-400 text-sm font-bold">{unitCount} Units</span>
            </label>
            <input
              type="range"
              min="10"
              max="2000"
              step="10"
              value={unitCount}
              onChange={(e) => setUnitCount(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-400"
            />
            <span className="text-[10px] text-stone-500 dark:text-slate-500 block">Adjust slider to simulate market seizure quantity</span>
          </div>

          <div className="p-4.5 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
            <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block">Sec 36(1) First Offence Estimate</span>
            <span className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 block">
              ₹ {firstOffenceEstimate.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-slate-500 block">Up to ₹ 25,000 per violation</span>
          </div>

          <div className="p-4.5 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
            <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block">Sec 36(2) Repeat Offence Estimate</span>
            <span className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 block">
              ₹ {secondOffenceEstimate.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-semibold">+ Mandatory Imprisonment Up to 1 Year</span>
          </div>
        </div>
      </div>

    </div>
  );
}
