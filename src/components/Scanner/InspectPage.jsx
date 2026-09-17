import React, { useMemo, useRef, useState } from 'react';
import {
  Home, ChevronRight, BookOpen, ArrowRight, UploadCloud, Camera, Link2,
  Eye, Download, Pencil, Package, IndianRupee, Calendar, Hash, Factory, MapPin,
  AlertTriangle, CheckCircle2, XCircle, Scale, FileText, ChevronDown, X, Sparkles,
  Layers, Check, Copy, AlertOctagon, ShieldAlert
} from 'lucide-react';
import { BENCHMARK_SAMPLES } from '../../engine/sampleData';
import { generateCompliancePdf } from '../../engine/reportGenerator';
import BoundingBoxViewer from '../Inspection/BoundingBoxViewer';

const CATEGORY_LABEL = {
  'Snack Foods': 'Snacks & Food Products',
  Beverages: 'Dairy & Beverages',
  'Personal Care / Cosmetics': 'Personal Care & Cosmetics',
  Electronics: 'Consumer Electronics'
};

function isFieldPass(d) {
  if (!d?.found) return false;
  if (d.isValidUnit === false) return false;
  if (d.taxClauseFound === false) return false;
  if (d.emailFound === false) return false;
  if (d.formatValid === false) return false;
  return true;
}

function extractBatch(product) {
  const fromOcr = (product?.rawOcrText || '').match(/Batch(?:\s*No\.?)?\s*[:.]?\s*([A-Z0-9-]+)/i);
  if (fromOcr?.[1]) return fromOcr[1];
  return '—';
}

function splitManufacturer(text) {
  const raw = typeof text === 'string' ? text : '';
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  return {
    name: parts[0] || '—',
    address: parts.slice(1).join(', ') || raw || '—'
  };
}

export default function InspectPage({
  selectedSampleId,
  onSelectSample,
  productData,
  activeBoxId,
  setActiveBoxId,
  onImageSelected,
  onOpenCamera,
  onOpenEcom,
  isScanning,
  scanProgress,
  onOpenRegulations,
  onGoHome
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [warningsOpen, setWarningsOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const product = productData;
  const declarations = product?.declarations || {};
  const violations = product?.violations || product?.analysis?.violations || [];
  const warnings = product?.warnings || product?.analysis?.warnings || [];
  const samples = showAll ? BENCHMARK_SAMPLES : BENCHMARK_SAMPLES.slice(0, 4);

  const passedCount = useMemo(() => {
    return Object.values(declarations).filter(isFieldPass).length;
  }, [declarations]);

  const buckets = useMemo(() => {
    const d = declarations;
    const mandatoryKeys = ['manufacturer', 'commodity', 'netQuantity', 'mfgDate', 'mrp', 'consumerCare'];
    const mandatoryPass = mandatoryKeys.filter((k) => d[k]?.found).length;
    const formatKeys = [
      d.netQuantity?.isValidUnit !== false && d.netQuantity?.found,
      d.mrp?.currencyFound !== false && d.mrp?.found,
      d.mfgDate?.formatValid !== false && d.mfgDate?.found,
      d.countryOfOrigin?.found
    ];
    const formatPass = formatKeys.filter(Boolean).length;
    const fontPass = warnings.length ? 1 : 2;
    const nqPass = d.netQuantity?.found && d.netQuantity?.isValidUnit !== false ? 1 : 0;
    const mrpPass = [d.mrp?.found, d.mrp?.taxClauseFound !== false && d.mrp?.found].filter(Boolean).length;
    const mfgPass = [d.manufacturer?.found, (d.manufacturer?.text || '').length > 20].filter(Boolean).length;
    return [
      { label: 'Mandatory Declarations', pass: mandatoryPass, total: 6, tone: mandatoryPass === 6 ? 'ok' : 'bad' },
      { label: 'Format & Presentation', pass: formatPass, total: 4, tone: formatPass === 4 ? 'ok' : formatPass >= 2 ? 'warn' : 'bad' },
      { label: 'Font & Readability', pass: fontPass, total: 2, tone: fontPass === 2 ? 'ok' : 'warn' },
      { label: 'Net Quantity Metric', pass: nqPass, total: 1, tone: nqPass ? 'ok' : 'bad' },
      { label: 'MRP & Tax Inclusion', pass: mrpPass, total: 2, tone: mrpPass === 2 ? 'ok' : 'bad' },
      { label: 'Manufacturer & Address', pass: mfgPass, total: 2, tone: mfgPass === 2 ? 'ok' : 'bad' }
    ];
  }, [declarations, warnings.length]);

  const checkedTotal = buckets.reduce((s, b) => s + b.total, 0);
  const checkedPass = buckets.reduce((s, b) => s + b.pass, 0);
  const score = product?.score ?? 0;
  const status = product?.status || 'NON_COMPLIANT';
  const mfg = splitManufacturer(declarations.manufacturer?.text);
  const inspectionId = `#INS-${String(product?.id || '000').replace(/\D/g, '').slice(-6).padStart(6, '0') || Date.now().toString().slice(-6)}`;

  const statusMeta = status === 'COMPLIANT'
    ? { label: 'FULLY COMPLIANT', badgeClass: 'badge-pass', textClass: 'text-emerald-600 dark:text-emerald-400', stroke: '#10b981' }
    : status === 'PARTIALLY_COMPLIANT'
      ? { label: 'UNDER REVIEW', badgeClass: 'badge-warn', textClass: 'text-amber-600 dark:text-amber-400', stroke: '#f59e0b' }
      : { label: 'NON-COMPLIANT OFFENCE', badgeClass: 'badge-fail', textClass: 'text-rose-600 dark:text-rose-400', stroke: '#f43f5e' };

  const handleFile = (file) => {
    if (file) onImageSelected(file);
  };

  const handleCopy = (text, key) => {
    if (!text || text === '—') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div id="packaging-scanner" className="insp-page space-y-6">
      <div className="insp-wrap space-y-6">
        
        {/* Header Breadcrumbs */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400 mb-1">
              <button type="button" onClick={onGoHome} className="hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center gap-1 font-semibold">
                <Home className="w-3.5 h-3.5" /> Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-slate-600" />
              <span className="text-stone-900 dark:text-white font-semibold">Inspection Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white font-heading">
              Packaged Commodity Compliance Studio
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
              Upload packaging artwork, run automated spatial OCR extraction, and evaluate against Legal Metrology Rules, 2011.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenRegulations}
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2 border-stone-300 dark:border-slate-700"
            >
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Rulebook 2011 Reference
            </button>
          </div>
        </header>

        {/* Benchmark Samples Suite */}
        <section className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white font-heading">Benchmark Product Test Suite</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400">Click any commodity package to load instant OCR evidence and rule evaluations</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-indigo-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              {showAll ? 'Show Fewer' : 'View All Test Samples'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="insp-samples-grid">
            {samples.map((sample) => {
              const offences = sample.violationsCount || sample.violations?.length || 0;
              const isOk = sample.status === 'COMPLIANT';
              const isSelected = selectedSampleId === sample.id;

              return (
                <article
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className={`insp-sample-card ${isSelected ? 'is-active ring-2 ring-indigo-500 dark:ring-cyan-500' : ''}`}
                >
                  <div className="insp-sample-thumb">
                    <img src={sample.imageUrl} alt={sample.name} />
                    <div className="absolute top-2 right-2">
                      <span className={`badge ${isOk ? 'badge-pass' : 'badge-fail'} text-[9px] shadow-lg`}>
                        {isOk ? 'COMPLIANT' : `${offences} OFFENCE${offences === 1 ? '' : 'S'}`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{sample.name}</h3>
                    <p className="text-xs text-stone-500 dark:text-slate-400 font-mono line-clamp-1">
                      {CATEGORY_LABEL[sample.category] || sample.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-200 dark:border-slate-800 text-xs">
                    <span className="text-stone-500 dark:text-slate-400 font-semibold font-mono">Score:</span>
                    <span className={`font-mono font-bold ${isOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {sample.score}%
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Upload & Scanner Dropzone */}
        <section
          className={`insp-dropzone ${isDragOver ? 'is-dragover' : ''}`}
          onClick={() => { if (!isScanning) fileInputRef.current?.click(); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
        >
          {isScanning && <div className="scanner-laser" />}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
          />

          <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-cyan-400 shadow-lg">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white font-heading">
                Upload Custom Packaging Label or <span className="text-indigo-600 dark:text-cyan-400 underline underline-offset-4">Browse Files</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Supports front/back label photos, pouches, bottles, cartons, or e-commerce listing crops (PNG, JPG, WEBP).
              </p>
            </div>

            {isScanning ? (
              <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 p-4 rounded-xl border border-indigo-500/40 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-indigo-600 dark:text-cyan-400 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-600 dark:text-cyan-400" />
                    {scanProgress?.status || 'Analyzing packaging declarations...'}
                  </span>
                  <strong className="text-indigo-600 dark:text-cyan-400 font-mono">{Math.round((scanProgress?.progress || 0.15) * 100)}%</strong>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(scanProgress?.progress || 0.15) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onOpenCamera(); }}
                  className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2 border-stone-300 dark:border-slate-700 hover:border-indigo-400"
                >
                  <Camera className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Live Camera Scanner
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onOpenEcom(); }}
                  className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2 border-stone-300 dark:border-slate-700 hover:border-indigo-400"
                >
                  <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> E-Commerce Product URL
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Active Inspection Result Dossier */}
        {product && (
          <div className="space-y-6">
            
            {/* Header Verdict Card */}
            <section className="insp-result-card">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${statusMeta.badgeClass} text-xs py-1 px-3`}>
                    {statusMeta.label}
                  </span>
                  <span className="text-xs font-mono text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-stone-200 dark:border-slate-800">
                    Rule 6(1) Enforced
                  </span>
                  <span className="text-xs font-mono text-indigo-700 dark:text-cyan-300 bg-indigo-50 dark:bg-cyan-950/40 px-2.5 py-1 rounded border border-indigo-200 dark:border-cyan-500/30 font-bold">
                    Dossier {inspectionId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImage(true)}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2 border-stone-300 dark:border-slate-700"
                  >
                    <Eye className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> View OCR Bounding Boxes
                  </button>

                  <button
                    type="button"
                    onClick={() => generateCompliancePdf(product)}
                    className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Official Notice (PDF)
                  </button>
                </div>
              </div>

              {/* Dossier Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Packaging Photo */}
                <div className="lg:col-span-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-950 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 shadow-inner group">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={() => setShowImage(true)}
                      className="absolute bottom-3 left-3 right-3 btn btn-secondary text-xs py-1.5 backdrop-blur-md bg-stone-900/80 border-stone-700 text-cyan-300 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Spatial Overlay
                    </button>
                  </div>
                </div>

                {/* Score Gauge & Verdict */}
                <div className="lg:col-span-3 glass-card p-5 flex flex-col items-center justify-between text-center bg-stone-50/50 dark:bg-slate-950/50 border-stone-200 dark:border-slate-800">
                  <div className="w-full">
                    <span className="text-xs text-stone-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-3 font-mono">
                      Compliance Rating
                    </span>

                    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-stone-200 dark:text-slate-800"
                          strokeWidth="3.2"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          style={{ stroke: statusMeta.stroke }}
                          strokeDasharray={`${score}, 100`}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <strong className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white">{score}%</strong>
                        <span className="text-[10px] text-stone-500 dark:text-slate-400 uppercase font-semibold">Audit Index</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-stone-200 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Offences:</span>
                      <strong className="font-mono text-rose-600 dark:text-rose-400">{violations.length} Breaches</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Warnings:</span>
                      <strong className="font-mono text-amber-600 dark:text-amber-400">{warnings.length} Notes</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passed:</span>
                      <strong className="font-mono text-emerald-600 dark:text-emerald-400">{passedCount} Rules</strong>
                    </div>
                  </div>
                </div>

                {/* Extracted Details Grid */}
                <div className="lg:col-span-6 glass-card p-5 flex flex-col justify-between bg-stone-50/50 dark:bg-slate-950/50 border-stone-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white font-heading">
                        Extracted Packaging Declarations <small className="text-stone-500 dark:text-slate-400 font-normal font-sans">(OCR Extracted)</small>
                      </h3>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-cyan-300 font-bold">Click to copy</span>
                    </div>

                    <ul className="space-y-2 text-xs">
                      <li
                        onClick={() => handleCopy(declarations.commodity?.text || product.name, 'name')}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900/70 border border-stone-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="text-stone-500 dark:text-slate-400">Commodity:</span>
                          <strong className="text-stone-900 dark:text-white font-mono">{declarations.commodity?.text || product.name}</strong>
                        </div>
                        {copiedKey === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                      </li>

                      <li
                        onClick={() => handleCopy(declarations.netQuantity?.text, 'netQty')}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900/70 border border-stone-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                          <span className="text-stone-500 dark:text-slate-400">Net Quantity:</span>
                          <strong className="text-stone-900 dark:text-white font-mono">{declarations.netQuantity?.text || '—'}</strong>
                        </div>
                        {copiedKey === 'netQty' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                      </li>

                      <li
                        onClick={() => handleCopy(declarations.mrp?.text, 'mrp')}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900/70 border border-stone-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-stone-500 dark:text-slate-400">MRP & Tax:</span>
                          <strong className="text-stone-900 dark:text-white font-mono">{declarations.mrp?.text || '—'}</strong>
                        </div>
                        {copiedKey === 'mrp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                      </li>

                      <li
                        onClick={() => handleCopy(declarations.mfgDate?.text, 'mfgDate')}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900/70 border border-stone-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="text-stone-500 dark:text-slate-400">Month/Year:</span>
                          <strong className="text-stone-900 dark:text-white font-mono">{declarations.mfgDate?.text || '—'}</strong>
                        </div>
                        {copiedKey === 'mfgDate' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                      </li>

                      <li
                        onClick={() => handleCopy(mfg.name, 'mfgName')}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900/70 border border-stone-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Factory className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span className="text-stone-500 dark:text-slate-400">Manufacturer:</span>
                          <strong className="text-stone-900 dark:text-white truncate max-w-[240px] font-mono">{mfg.name}</strong>
                        </div>
                        {copiedKey === 'mfgName' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                      </li>
                    </ul>
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-slate-500 italic pt-2 mt-2 border-t border-stone-200 dark:border-slate-800/60 text-center">
                    Extracted via Tesseract Neural OCR with Adaptive Bounding Box Geometries
                  </p>
                </div>

              </div>

            </section>

            {/* 6-Category Compliance Check Buckets */}
            <section className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-base font-bold text-stone-900 dark:text-white font-heading">
                    Compliance Verification Parameters
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-stone-500 dark:text-slate-400">{checkedTotal} Parameters Checked</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{checkedPass} Passed</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{buckets.filter(b => b.tone === 'bad').length} Breaches</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {buckets.map((b) => {
                  const isOk = b.tone === 'ok';
                  const isWarn = b.tone === 'warn';
                  return (
                    <div
                      key={b.label}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isOk
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : isWarn
                            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isOk ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : isWarn ? <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                        <span className="font-semibold text-xs text-stone-900 dark:text-white">{b.label}</span>
                      </div>
                      <strong className="font-mono font-extrabold text-sm">{b.pass}/{b.total}</strong>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Violations & Statutory Penalties Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Detected Violations (8 cols) */}
              <section className="lg:col-span-8 glass-panel p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <h2 className="text-base font-bold text-stone-900 dark:text-white font-heading">
                      Detected Offence Citations ({violations.length})
                    </h2>
                  </div>
                  <span className="badge badge-fail text-[10px]">LEGAL METROLOGY ACT 2009</span>
                </div>

                {violations.length === 0 ? (
                  <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">100% Fully Compliant Label!</h4>
                    <p className="text-xs text-stone-600 dark:text-slate-300 max-w-sm mx-auto">
                      No statutory offences detected. All mandatory declarations under Rule 6(1) are strictly fulfilled.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {violations.map((v, i) => (
                      <div key={i} className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-xs text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
                              {v.ruleNo || `Breach #${i + 1}`}
                            </span>
                            <strong className="text-xs text-stone-900 dark:text-white">{v.field}</strong>
                          </div>
                          <span className="badge badge-fail text-[9px]">{v.severity || 'CRITICAL'}</span>
                        </div>
                        <p className="text-xs text-stone-700 dark:text-slate-200 leading-relaxed">{v.message}</p>
                        {v.legalRef && (
                          <div className="pt-2 border-t border-rose-200 dark:border-rose-500/20 text-[11px] font-mono text-stone-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Statutory Clause: {v.legalRef}</span>
                            <span className="text-rose-600 dark:text-rose-400 font-bold">Fine up to ₹ 25,000</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Collapsible Warnings Toggle */}
                {warnings.length > 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setWarningsOpen(!warningsOpen)}
                      className="w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        Minor Warnings & Font Discrepancies ({warnings.length})
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${warningsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {warningsOpen && (
                      <div className="mt-2 space-y-2 p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-stone-200 dark:border-slate-800 text-xs shadow-sm">
                        {warnings.map((w, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-stone-700 dark:text-slate-300">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                            <span><strong>{w.field}:</strong> {w.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Statutory Penalties & Actions (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Penalty Calculator */}
                <section className="glass-panel p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-200 dark:border-slate-800">
                    <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white font-heading">Applicable Penalties</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
                      <span className="text-stone-500 dark:text-slate-400 block font-medium">First Offence (Sec 36(1)):</span>
                      <strong className="text-base font-extrabold font-mono text-rose-600 dark:text-rose-400 block">
                        Up to ₹ {violations.length > 0 ? (violations.length * 25000).toLocaleString('en-IN') : '0'}
                      </strong>
                      <span className="text-[10px] text-stone-400 dark:text-slate-500">Fine up to ₹ 25,000 per violation</span>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
                      <span className="text-stone-500 dark:text-slate-400 block font-medium">Second Offence (Sec 36(2)):</span>
                      <strong className="text-base font-extrabold font-mono text-rose-600 dark:text-rose-400 block">
                        Up to ₹ {violations.length > 0 ? (violations.length * 50000).toLocaleString('en-IN') : '0'}
                      </strong>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">+ Mandatory Imprisonment Up to 1 Year</span>
                    </div>
                  </div>
                </section>

                {/* Direct Action Card */}
                <section className="glass-panel p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-slate-800">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white font-heading">Official Action</h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                    Generate an official statutory inspection report with spatial bounding box evidence, rule citations, and penalty notices.
                  </p>
                  <button
                    type="button"
                    onClick={() => generateCompliancePdf(product)}
                    className="btn btn-primary text-xs w-full py-2.5 font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export Official Notice (PDF)
                  </button>
                </section>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Spatial Bounding Box Fullscreen Modal */}
      {showImage && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowImage(false)}>
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <h3 className="font-bold text-stone-900 dark:text-white text-base font-heading">Spatial Label OCR Bounding Box Inspector</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImage(false)}
                className="p-1.5 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-[520px]">
              <BoundingBoxViewer
                imageUrl={product.imageUrl}
                boundingBoxes={product.boundingBoxes || []}
                activeBoxId={activeBoxId}
                setActiveBoxId={setActiveBoxId}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
