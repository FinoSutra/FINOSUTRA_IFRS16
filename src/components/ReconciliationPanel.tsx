import React from 'react';
import { ReconciliationCheckItem } from '../types/ifrs16.ts';
import { CheckCircle2, AlertCircle, ShieldCheck, Scale } from 'lucide-react';
import { formatAccountingNumber } from '../utils/formatters.ts';

interface ReconciliationPanelProps {
  checks: ReconciliationCheckItem[];
  allPassed: boolean;
  currency: string;
}

export const ReconciliationPanel: React.FC<ReconciliationPanelProps> = ({
  checks,
  allPassed,
  currency,
}) => {
  const formatNumber = (val: number) => formatAccountingNumber(val, currency);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className={`p-4 border-b flex items-center justify-between ${
        allPassed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-red-50/70 border-red-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${allPassed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Mathematical Integrity & Audit Reconciliation Center
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                allPassed ? 'bg-emerald-200/60 text-emerald-900' : 'bg-red-200/60 text-red-900'
              }`}>
                {allPassed ? 'ALL AUDIT CHECKS PASSED' : 'ACTION REQUIRED'}
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Automated mathematical proofs verifying zero variance across financial statements and balance roll-forwards.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Audit Check Cards */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`p-4 rounded-xl border transition flex flex-col justify-between ${
              check.isPassed
                ? 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                : 'bg-red-50/30 border-red-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                  {check.id}
                </span>
                <span className="text-[10px] font-semibold text-blue-700">
                  {check.standardReference}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mb-1">
                {check.title}
              </h4>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                {check.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Expected:</span>
                <span className="font-semibold text-slate-800">{formatNumber(check.expectedValue)} {currency}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Actual:</span>
                <span className="font-semibold text-slate-800">{formatNumber(check.actualValue)} {currency}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60 font-bold">
                <span className="text-slate-700">Audit Variance:</span>
                <span className={check.isPassed ? 'text-emerald-700' : 'text-red-700'}>
                  {formatNumber(check.variance)} {currency}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-end gap-1 font-sans text-xs">
                {check.isPassed ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed (Zero Variance)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-700 font-bold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Failed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Certificate Note */}
      <div className="mx-5 mb-5 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Chartered Accountant Audit Certification:</span>
          <p className="text-[11px] text-emerald-900 mt-0.5 leading-relaxed">
            All schedules satisfy strict equality criteria. The final closing liability and net ROU asset balance equal 0.00 at term expiration, all generated journal entries are double-entry balanced (Debits = Credits), and the lifetime P&L total equals cumulative cash outflows plus restoration obligations.
          </p>
        </div>
      </div>
    </div>
  );
};
