import React, { useMemo, useState } from 'react';
import {
  FileText, Download, Search, CheckCircle2, AlertTriangle, Clock,
  Calendar, MoreVertical, RotateCcw, ChevronLeft, ChevronRight, Filter, Eye, Check
} from 'lucide-react';
import { BENCHMARK_SAMPLES } from '../../engine/sampleData';
import { generateCompliancePdf } from '../../engine/reportGenerator';

const DATES = {
  'sample-1': '12 Sep 2025',
  'sample-2': '10 Sep 2025',
  'sample-3': '08 Sep 2025',
  'sample-4': '05 Sep 2025'
};

function statusInfo(status) {
  if (status === 'COMPLIANT') return { label: 'COMPLIANT', badgeClass: 'badge-pass', textClass: 'text-emerald-400', barClass: 'bg-emerald-400' };
  if (status === 'PARTIALLY_COMPLIANT') return { label: 'UNDER REVIEW', badgeClass: 'badge-warn', textClass: 'text-amber-400', barClass: 'bg-amber-400' };
  return { label: 'NON-COMPLIANT', badgeClass: 'badge-fail', textClass: 'text-rose-400', barClass: 'bg-rose-400' };
}

export default function ReportsView({ productData, inspections }) {
  const rows = inspections && inspections.length ? inspections : BENCHMARK_SAMPLES;
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [selected, setSelected] = useState([]);
  const [page] = useState(1);

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((r) => r.category).filter(Boolean)))],
    [rows]
  );

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase();
    const matchesQ = !q || [r.name, r.brand, r.id].some((v) => String(v || '').toLowerCase().includes(q));
    const matchesStatus = status === 'ALL' || r.status === status;
    const matchesCat = category === 'ALL' || r.category === category;
    return matchesQ && matchesStatus && matchesCat;
  });

  const reset = () => {
    setQuery('');
    setStatus('ALL');
    setCategory('ALL');
    setDateRange('ALL');
    setSelected([]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((r) => r.id));
  };

  const toggleOne = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="rp-page space-y-6">
      <div className="rp-wrap space-y-6">
        
        {/* Header */}
        <header className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-lg">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 dark:text-white font-heading">Inspection Reports & Notice Registry</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-700 dark:text-cyan-300 border border-indigo-500/20 dark:border-cyan-500/30">
                  Certified Records
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
                Generate, certify, and archive official Legal Metrology compliance notices and inspection certificates in PDF format.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => generateCompliancePdf(productData)}
            className="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-lg font-bold"
          >
            <Download className="w-4 h-4" /> Download Active Notice (PDF)
          </button>
        </header>

        {/* KPI Mini-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 flex items-center justify-between border-stone-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block">Total Dossiers</span>
              <strong className="text-2xl font-extrabold text-stone-900 dark:text-white font-mono">128</strong>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">↑ +12% this month</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10">
            <div>
              <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block">Compliant Certs</span>
              <strong className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">72</strong>
              <span className="text-[10px] text-stone-500 dark:text-slate-400 font-bold block mt-0.5">56% Compliance</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center justify-between border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10">
            <div>
              <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block">Breach Notices</span>
              <strong className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">48</strong>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block mt-0.5">38% Liable</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center justify-between border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10">
            <div>
              <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block">Under Review</span>
              <strong className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">8</strong>
              <span className="text-[10px] text-stone-500 dark:text-slate-400 font-bold block mt-0.5">Pending Action</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product, brand or report ID..."
              className="w-full bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 absolute left-2.5 top-3" />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-stone-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
            <option value="PARTIALLY_COMPLIANT">Under Review</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-stone-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={reset}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 border-stone-300 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Reports Table */}
        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="sm-data-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selected.length === filtered.length}
                      onChange={toggleAll}
                      className="rounded border-stone-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th>#</th>
                  <th>Product</th>
                  <th>Brand & Category</th>
                  <th>Status</th>
                  <th>Compliance Score</th>
                  <th>Inspection Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const st = statusInfo(row.status);
                  return (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(row.id)}
                          onChange={() => toggleOne(row.id)}
                          className="rounded border-stone-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="font-mono text-stone-500 dark:text-slate-500">{idx + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={row.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 shadow-sm" />
                          <span className="font-bold text-stone-900 dark:text-white">{row.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-stone-800 dark:text-slate-300 font-medium">{row.brand}</span>
                        <span className="text-stone-500 dark:text-slate-500 block text-xs font-mono">{row.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${st.badgeClass} text-[9px]`}>{st.label}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-stone-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-stone-300 dark:border-slate-800">
                            <div className={`h-full ${st.barClass}`} style={{ width: `${row.score}%` }} />
                          </div>
                          <strong className={`font-mono text-xs ${st.textClass}`}>{row.score}%</strong>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-stone-600 dark:text-slate-400">{DATES[row.id] || '12 Sep 2025'}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => generateCompliancePdf(row)}
                          className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-stone-300 dark:border-slate-700 hover:border-indigo-400 ml-auto"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-600 dark:text-slate-400">
            <span>Showing 1–{filtered.length} of {filtered.length} compliance records</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled className="p-1 rounded bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <span className="font-mono font-bold text-stone-900 dark:text-white px-2">1</span>
              <button type="button" disabled className="p-1 rounded bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
