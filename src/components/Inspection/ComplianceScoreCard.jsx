import React from 'react';
import { ShieldCheck, Download, AlertOctagon, AlertTriangle, CheckCircle, FileSpreadsheet, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCompliancePdf } from '../../engine/reportGenerator';

export default function ComplianceScoreCard({ productData, onExportPdf }) {
  const score = productData?.score ?? 0;
  const status = productData?.status || "NON_COMPLIANT";
  const violations = productData?.violationsCount ?? (productData?.analysis?.violations?.length || 0);
  const warnings = productData?.warningsCount ?? (productData?.analysis?.warnings?.length || 0);

  const handleDownloadPdf = () => {
    if (score > 85) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    generateCompliancePdf(productData);
  };

  const getStatusBadge = () => {
    if (status === "COMPLIANT") {
      return (
        <span className="badge badge-pass text-xs py-1 px-3 shadow-md">
          <CheckCircle className="w-4 h-4" /> Fully Compliant
        </span>
      );
    }
    if (status === "PARTIALLY_COMPLIANT") {
      return (
        <span className="badge badge-warn text-xs py-1 px-3 shadow-md">
          <AlertTriangle className="w-4 h-4" /> Under Review
        </span>
      );
    }
    return (
      <span className="badge badge-fail text-xs py-1 px-3 shadow-md">
        <AlertOctagon className="w-4 h-4" /> Non-Compliant Offence
      </span>
    );
  };

  return (
    <div className="glass-panel p-6 mb-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none ${
        status === "COMPLIANT" ? "bg-emerald-500" : status === "PARTIALLY_COMPLIANT" ? "bg-amber-500" : "bg-rose-500"
      }`} />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Commodity Info */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {getStatusBadge()}
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              Rules 2011 Verified
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight font-heading">
            {productData?.name || "Scanned Commodity Package"}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            {productData?.brand ? `${productData.brand} • ` : ''}
            Legal Metrology (Packaged Commodities) Rules, 2011 Automated Audit Assessment
          </p>

          <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span className="text-xs text-slate-300 font-semibold">{violations} Critical Violations</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-semibold">{warnings} Warnings</span>
            </div>
          </div>
        </div>

        {/* Score Radial Meter */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ease-out ${
                  status === "COMPLIANT" ? "text-emerald-400" : status === "PARTIALLY_COMPLIANT" ? "text-amber-400" : "text-rose-500"
                }`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">{score}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Score</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="btn btn-primary text-xs py-2 px-4 shadow-lg flex items-center gap-2 font-semibold"
          >
            <Download className="w-4 h-4" /> Download Official Notice (PDF)
          </button>
        </div>

      </div>
    </div>
  );
}
