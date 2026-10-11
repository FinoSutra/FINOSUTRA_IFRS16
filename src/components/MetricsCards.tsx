import React from 'react';
import { 
  DollarSign, 
  Layers, 
  Coins, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { IFRS16CalculationResult } from '../types/ifrs16.ts';
import { formatCurrency as formatCcy } from '../utils/formatters.ts';

interface MetricsCardsProps {
  result: IFRS16CalculationResult;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ result }) => {
  const { input } = result;

  const formatCurrency = (val: number) => formatCcy(val, input.currency);

  const oldIAS17StraightLineRentPerYear = result.effectiveTermMonths > 0
    ? (result.totalUndiscountedCashFlows / (result.effectiveTermMonths / 12))
    : 0;

  const ifrs16Year1Expense = (result.maturityAnalysis.year1 > 0)
    ? (result.totalDepreciationCost / (result.effectiveTermMonths / 12)) + (result.reportingBalances.next12MonthsInterest || 0)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Initial Lease Liability */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Initial Liability</span>
          <DollarSign className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-base font-bold text-slate-900 tracking-tight">
            {formatCurrency(result.initialLeaseLiability)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            PV @ {input.annualDiscountRate}% APR
          </span>
        </div>
      </div>

      {/* 2. Initial ROU Asset */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Initial ROU Asset</span>
          <Layers className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <div className="text-base font-bold text-indigo-950 tracking-tight">
            {formatCurrency(result.initialRouAsset)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            IFRS 16.24 Gross Capitalized
          </span>
        </div>
      </div>

      {/* 3. Total Cash Payments */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Cash Outflow</span>
          <Coins className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <div className="text-base font-bold text-slate-900 tracking-tight">
            {formatCurrency(result.totalUndiscountedCashFlows)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {result.totalPeriods} contractual periods
          </span>
        </div>
      </div>

      {/* 4. Total Finance Cost (Interest) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Finance Cost</span>
          <TrendingDown className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <div className="text-base font-bold text-amber-900 tracking-tight">
            {formatCurrency(result.totalFinanceCost)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Accreted over lease term
          </span>
        </div>
      </div>

      {/* 5. Reporting Cut-Off Closing Liability */}
      <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">Liability @ Cut-Off</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
            {input.reportingDate}
          </span>
        </div>
        <div>
          <div className="text-base font-bold text-blue-950 tracking-tight">
            {formatCurrency(result.reportingBalances.totalLeaseLiability)}
          </div>
          <div className="text-[10px] text-slate-600 flex justify-between">
            <span>Cur: {formatCurrency(result.reportingBalances.currentLeaseLiability)}</span>
          </div>
        </div>
      </div>

      {/* 6. Reconciliation Status Indicator */}
      <div className={`p-3.5 rounded-xl border shadow-xs flex flex-col justify-between ${
        result.allChecksPassed
          ? 'bg-emerald-50/40 border-emerald-200'
          : 'bg-red-50/40 border-red-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Audit Proofs</span>
          {result.allChecksPassed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div>
          <div className={`text-sm font-bold tracking-tight ${
            result.allChecksPassed ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {result.allChecksPassed ? '100% Balanced' : 'Variance Detected'}
          </div>
          <span className="text-[10px] text-slate-600 font-medium">
            {result.reconciliationChecks.length} checks verified
          </span>
        </div>
      </div>
    </div>
  );
};
