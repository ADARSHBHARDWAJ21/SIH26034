import React, { useState } from 'react';
import { BENCHMARK_SAMPLES } from '../../engine/sampleData';
import { Sparkles, CheckCircle2, AlertOctagon, Filter, ChevronRight, Zap } from 'lucide-react';

export default function SampleSelector({ selectedSampleId, onSelectSample }) {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = ['ALL', 'Snack Foods', 'Beverages', 'Personal Care / Cosmetics', 'Electronics'];

  const filteredSamples = BENCHMARK_SAMPLES.filter(s =>
    filterCategory === 'ALL' || s.category === filterCategory
  );

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white font-heading tracking-tight">Benchmark Commodity Test Suite</h3>
            <p className="text-xs text-stone-600 dark:text-slate-400">One-click test predefined packaging labels for legal metrology offences</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white border-transparent shadow-sm font-bold'
                  : 'bg-stone-100 dark:bg-slate-800/60 text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-slate-700'
              }`}
              style={filterCategory === cat ? { backgroundColor: '#2563eb', color: '#ffffff' } : {}}
            >
              {cat === 'ALL' ? 'All Samples' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSamples.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          const isCompliant = sample.status === "COMPLIANT";

          return (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`group cursor-pointer rounded-2xl p-3.5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-50/70 dark:bg-indigo-950/30 border-blue-500 shadow-xl ring-2 ring-blue-500/40'
                  : 'bg-white dark:bg-slate-900/80 border-stone-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 bg-stone-100 dark:bg-slate-950">
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 dark:from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute top-2 right-2">
                    {isCompliant ? (
                      <span className="badge badge-pass text-[9px] py-0.5 px-2 shadow-md">
                        <CheckCircle2 className="w-3 h-3" /> COMPLIANT
                      </span>
                    ) : (
                      <span className="badge badge-fail text-[9px] py-0.5 px-2 shadow-md">
                        <AlertOctagon className="w-3 h-3" /> {sample.violationsCount} OFFENCE(S)
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {sample.name}
                </h4>
                <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">{sample.brand} • <span className="font-mono text-stone-400 dark:text-slate-400">{sample.category}</span></p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-stone-200 dark:border-slate-800/80">
                <span className="text-stone-500 dark:text-slate-400 font-medium">Compliance Rating</span>
                <span className={`font-extrabold font-mono text-sm ${isCompliant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {sample.score}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
