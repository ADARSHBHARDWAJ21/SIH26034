import React from 'react';
import { AlertOctagon, AlertTriangle, Scale, ShieldAlert, BookOpen, CheckCircle, Info } from 'lucide-react';

export default function ViolationList({ violations = [], warnings = [], penaltyEstimate }) {
  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-heading">Offence Assessment & Statutory Penalties</h3>
            <p className="text-xs text-slate-400">Statutory breaches under Legal Metrology Act 2009 & Packaged Commodities Rules 2011</p>
          </div>
        </div>

        <span className="badge badge-fail text-xs py-1 px-3">
          Section 36 & 37 Enforceable
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Violations & Warnings List (2 cols) */}
        <div className="lg:col-span-2 space-y-3.5">
          {violations.length === 0 && warnings.length === 0 ? (
            <div className="p-8 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl text-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">100% Compliant Packaging Label!</h4>
              <p className="text-xs text-emerald-300 max-w-md mx-auto">
                No statutory offences or rule breaches detected. Package strictly complies with mandatory declarations of Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          ) : (
            <>
              {/* Critical & Major Violations */}
              {violations.map((v, idx) => (
                <div key={idx} className="p-4.5 bg-rose-950/30 border border-rose-500/40 rounded-2xl flex items-start gap-3.5 shadow-md">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5 border border-rose-500/30">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs font-mono text-rose-300 px-2.5 py-0.5 rounded-md bg-rose-950 border border-rose-800">
                          {v.ruleNo || "Rule Breach"}
                        </span>
                        <h4 className="font-bold text-sm text-white">{v.field}</h4>
                      </div>
                      <span className="badge badge-fail text-[10px]">
                        {v.severity || "CRITICAL"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{v.message}</p>

                    {v.legalRef && (
                      <div className="pt-2 mt-2 border-t border-rose-500/20 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">
                          <strong>Penalty Section:</strong> {v.legalRef}
                        </span>
                        <span className="text-rose-400 font-semibold font-mono">
                          Fine up to ₹ 25,000
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Warnings */}
              {warnings.map((w, idx) => (
                <div key={idx} className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                          {w.ruleNo || "Warning"}
                        </span>
                        <h4 className="font-bold text-xs text-white">{w.field}</h4>
                      </div>
                      <span className="badge badge-warn text-[10px]">
                        MINOR WARNING
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{w.message}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Penalty Estimator Box (1 col) */}
        <div className="glass-panel p-5 border-rose-500/30 bg-slate-900/90 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Scale className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-sm font-heading">Statutory Penalty Calculator</h4>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1.5 font-medium">First Offence (Section 36(1)):</span>
                <p className={`font-extrabold text-sm font-mono p-3 rounded-xl border shadow-inner ${violations.length === 0 ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30' : 'text-rose-400 bg-slate-950 border-rose-500/30'}`}>
                  {violations.length === 0 
                    ? "₹ 0 (Fully Compliant)" 
                    : `Up to ₹ ${(violations.length * 25000).toLocaleString('en-IN')} (${violations.length} breach${violations.length > 1 ? 'es' : ''})`
                  }
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1.5 font-medium">Second & Subsequent Offence (Sec 36(2)):</span>
                <p className={`font-extrabold text-sm font-mono p-3 rounded-xl border shadow-inner ${violations.length === 0 ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30' : 'text-rose-400 bg-slate-950 border-rose-500/30'}`}>
                  {violations.length === 0 
                    ? "₹ 0 (Fully Compliant)" 
                    : `Up to ₹ ${(violations.length * 50000).toLocaleString('en-IN')} or Imprisonment`
                  }
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Offence Compounding (Sec 48):
                </p>
                <p className="leading-relaxed">
                  Offences under Section 36 may be compounded by authorized Legal Metrology officers prior to or after institution of prosecution.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
            Enforced under Legal Metrology Act, 2009 (Govt. of India)
          </div>
        </div>

      </div>
    </div>
  );
}
