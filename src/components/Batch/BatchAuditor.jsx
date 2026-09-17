import React, { useState, useEffect } from 'react';
import { Layers, Upload, Download, CheckCircle2, AlertOctagon, Search, Filter, FileText, ArrowUpDown, Eye, X, ShieldAlert, Sparkles, Package } from 'lucide-react';
import { BENCHMARK_SAMPLES } from '../../engine/sampleData';
import { analyzeLegalMetrologyCompliance } from '../../engine/metrologyRulesEngine';
import { fetchScanLogs, saveBatchScans } from '../../engine/apiService';

export default function BatchAuditor() {
  const [batchItems, setBatchItems] = useState(BENCHMARK_SAMPLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBatchItem, setSelectedBatchItem] = useState(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  useEffect(() => {
    async function loadDbScans() {
      setIsLoadingDb(true);
      const dbScans = await fetchScanLogs();
      if (dbScans && dbScans.length > 0) {
        setBatchItems(dbScans);
      }
      setIsLoadingDb(false);
    }
    loadDbScans();
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map((file, idx) => {
      const fakeText = `PACKAGE BATCH ITEM ${idx + 1}\nNet Qty: ${100 + idx * 50} gms\nMRP: Rs ${99 + idx * 10}\nMfg: 08/2026\nPacked by: Sample Manufacturer Ltd`;
      const analysis = analyzeLegalMetrologyCompliance(fakeText);

      return {
        id: `batch-custom-${Date.now()}-${idx}`,
        name: file.name,
        brand: "Uploaded Batch Package",
        category: "General Commodity",
        imageUrl: URL.createObjectURL(file),
        status: analysis.status,
        score: analysis.score,
        violationsCount: analysis.violations.length,
        warningsCount: analysis.warnings.length,
        declarations: analysis.declarations,
        violations: analysis.violations
      };
    });

    const saved = await saveBatchScans(newItems);
    setBatchItems(prev => [...saved, ...prev]);
  };

  const filteredItems = batchItems.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const compliantCount = batchItems.filter(i => i.status === "COMPLIANT").length;
  const nonCompliantCount = batchItems.filter(i => i.status !== "COMPLIANT").length;

  const handleExportCsv = () => {
    const headers = "ID,Name,Brand,Category,Status,Score,ViolationsCount\n";
    const rows = batchItems.map(i => `"${i.id}","${i.name}","${i.brand}","${i.category}","${i.status}",${i.score},${i.violationsCount || 0}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Batch_Legal_Metrology_Audit_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-lg">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white font-heading">Bulk Package Compliance Inspector</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-700 dark:text-cyan-300 border border-indigo-500/20 dark:border-cyan-500/30">
                Enterprise Batch
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-slate-400 mt-0.5">
              Audit large batches of packaged commodity labels for warehouse, retail catalog, and e-commerce enforcement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="btn btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 border-stone-300 dark:border-slate-700 hover:border-indigo-400 flex-1 md:flex-initial"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Export CSV Report
          </button>

          <label className="btn btn-primary text-xs py-2.5 px-4 cursor-pointer flex items-center gap-2 flex-1 md:flex-initial shadow-lg font-bold">
            <Upload className="w-4 h-4" /> Upload Batch Images
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 flex items-center justify-between border-stone-200 dark:border-slate-800">
          <div>
            <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block mb-1">Total Packages Audited</span>
            <span className="text-3xl font-extrabold text-stone-900 dark:text-white font-mono">{batchItems.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10">
          <div>
            <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block mb-1">Compliant Packages</span>
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{compliantCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10">
          <div>
            <span className="text-xs text-stone-600 dark:text-slate-400 font-semibold block mb-1">Non-Compliance Offence Rate</span>
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
              {Math.round((nonCompliantCount / (batchItems.length || 1)) * 100)}%
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-200 dark:border-slate-800">
          <h3 className="font-bold text-stone-900 dark:text-white text-base font-heading">Batch Inspection Log Matrix</h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by commodity name..."
                className="w-full bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-stone-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="NON_COMPLIANT">Non-Compliant Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="sm-data-table">
            <thead>
              <tr>
                <th>Package Image</th>
                <th>Commodity / File Name</th>
                <th>Brand & Sector</th>
                <th>Compliance Rating</th>
                <th>Status</th>
                <th>Offences</th>
                <th className="text-right">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-10 object-cover rounded-lg bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 shadow-sm" />
                  </td>
                  <td className="font-bold text-stone-900 dark:text-white">{item.name}</td>
                  <td className="text-stone-600 dark:text-slate-400">{item.brand} <span className="text-stone-400 dark:text-slate-500 font-mono">({item.category})</span></td>
                  <td className="font-mono font-extrabold text-indigo-600 dark:text-cyan-400 text-sm">{item.score}%</td>
                  <td>
                    {item.status === "COMPLIANT" ? (
                      <span className="badge badge-pass text-[10px]">COMPLIANT</span>
                    ) : (
                      <span className="badge badge-fail text-[10px]">NON-COMPLIANT</span>
                    )}
                  </td>
                  <td className="text-rose-600 dark:text-rose-400 font-bold font-mono text-xs">{item.violationsCount || 0} Breach(es)</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedBatchItem(item)}
                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 hover:border-indigo-400 text-stone-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors"
                      title="View batch item detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Item Details Modal */}
      {selectedBatchItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedBatchItem(null)}>
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-stone-900 dark:text-white text-base">{selectedBatchItem.name}</h3>
              <button type="button" onClick={() => setSelectedBatchItem(null)} className="p-1 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-4 items-center bg-stone-50 dark:bg-slate-950 p-3.5 rounded-xl border border-stone-200 dark:border-slate-800">
              <img src={selectedBatchItem.imageUrl} alt={selectedBatchItem.name} className="w-20 h-20 object-cover rounded-lg border border-stone-200 dark:border-slate-700" />
              <div className="space-y-1">
                <p className="text-xs text-stone-600 dark:text-slate-400">Compliance Score: <strong className="text-indigo-600 dark:text-cyan-400 font-mono text-sm">{selectedBatchItem.score}%</strong></p>
                <p className="text-xs text-stone-600 dark:text-slate-400">Status: <strong className={selectedBatchItem.status === 'COMPLIANT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{selectedBatchItem.status}</strong></p>
                <p className="text-xs text-stone-600 dark:text-slate-400">Brand: <span className="text-stone-900 dark:text-white font-semibold">{selectedBatchItem.brand}</span></p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-800 dark:text-slate-300 mb-2">Rule Violations Breakdown:</h4>
              {selectedBatchItem.violations && selectedBatchItem.violations.length > 0 ? (
                <div className="space-y-2">
                  {selectedBatchItem.violations.map((v, i) => (
                    <div key={i} className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 rounded-lg text-xs text-rose-800 dark:text-rose-300 font-mono">
                      • {v.ruleNo}: {v.message}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" /> No statutory violations detected for this package.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
