import React, { useState } from 'react';
import { IFRS16CalculationResult, MaturityBandRow } from '../types/ifrs16.ts';
import { 
  Landmark, 
  ShieldCheck, 
  FileSpreadsheet, 
  Calendar, 
  Clock, 
  TrendingDown, 
  CheckCircle2, 
  Copy, 
  Check,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatAccountingNumber, formatAccountingWithBrackets } from '../utils/formatters.ts';

interface BalanceSheetPresentationProps {
  result: IFRS16CalculationResult;
}

export const BalanceSheetPresentation: React.FC<BalanceSheetPresentationProps> = ({
  result,
}) => {
  const { input, reportingBalances, maturityAnalysis, amortisationSchedule } = result;

  // Toggle between Reporting Date view (remaining commitments) vs Lifetime inception view
  const [maturityPerspective, setMaturityPerspective] = useState<'REPORTING_DATE' | 'LIFETIME'>(
    'REPORTING_DATE'
  );

  const [copiedDisclosure, setCopiedDisclosure] = useState(false);

  const formatNumber = (val: number) => formatCurrency(val, input.currency);

  const isReportingView = maturityPerspective === 'REPORTING_DATE';
  const activeBands: MaturityBandRow[] = isReportingView
    ? maturityAnalysis.reportingDateBands
    : maturityAnalysis.lifetimeBands;

  const totalUndiscounted = isReportingView
    ? maturityAnalysis.reportingDateTotalUndiscounted
    : maturityAnalysis.lifetimeTotalUndiscounted;

  const totalFinanceCost = isReportingView
    ? maturityAnalysis.reportingDateUnearnedFinanceCost
    : maturityAnalysis.lifetimeUnearnedFinanceCost;

  const presentValue = isReportingView
    ? maturityAnalysis.reportingDatePresentValue
    : maturityAnalysis.lifetimePresentValue;

  // Comparison to balance sheet liability
  const targetLiability = isReportingView
    ? reportingBalances.totalLeaseLiability
    : result.initialLeaseLiability;

  const isFullyReconciled = Math.abs(presentValue - targetLiability) <= 0.02;

  // Copy formal audit disclosure text for annual report
  const handleCopyDisclosure = () => {
    const text = `IFRS 16 & IFRS 7 LEASE LIABILITY MATURITY DISCLOSURE (As of ${reportingBalances.reportingDate}):
- Not later than 1 year: ${formatNumber(activeBands[0]?.undiscountedCashFlow || 0)}
- Later than 1 year and not later than 2 years: ${formatNumber(activeBands[1]?.undiscountedCashFlow || 0)}
- Later than 2 years and not later than 3 years: ${formatNumber(activeBands[2]?.undiscountedCashFlow || 0)}
- Later than 3 years and not later than 4 years: ${formatNumber(activeBands[3]?.undiscountedCashFlow || 0)}
- Later than 4 years and not later than 5 years: ${formatNumber(activeBands[4]?.undiscountedCashFlow || 0)}
- Later than 5 years: ${formatNumber(activeBands[5]?.undiscountedCashFlow || 0)}
Total undiscounted lease payments: ${formatNumber(totalUndiscounted)}
Less: Unearned finance cost: (${formatNumber(totalFinanceCost)})
Present value of lease liabilities: ${formatNumber(presentValue)} (Carrying amount on Balance Sheet)`;

    navigator.clipboard.writeText(text);
    setCopiedDisclosure(true);
    setTimeout(() => setCopiedDisclosure(false), 2500);
  };

  // Check if IFRS 16.5 exemption is elected
  const isExemptionElected = input.shortTermElection || input.lowValueElection;

  // Straight-line P&L expense per period for exemption
  const totalCashOutflows = amortisationSchedule.reduce((s, r) => s + r.paymentAmount, 0);
  const straightLineExpensePerPeriod = amortisationSchedule.length > 0
    ? totalCashOutflows / amortisationSchedule.length
    : 0;

  return (
    <div className="space-y-6">
      {/* EXEMPTION CALLOUT & STRAIGHT-LINE P&L SCHEDULE (IFRS 16.5 & IFRS 16.6) */}
      {isExemptionElected && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500 text-white shadow-xs">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                  IFRS 16.5 Recognition Exemption Active — Balance Sheet Recognition Suppressed
                </h3>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-200 text-amber-900 border border-amber-400">
                  {input.shortTermElection ? 'Short-Term Lease (≤12 Months)' : 'Low-Value Asset (≤$5,000)'}
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Under IFRS 16 paragraph 6, the lessee has elected not to apply the capitalization requirements of paragraphs 22–49. 
                <strong> No Right-of-Use Asset or Lease Liability is recognized on the Balance Sheet.</strong> Lease payments are recognized as an operating expense in Profit or Loss on a straight-line basis over the lease term.
              </p>
            </div>
          </div>

          {/* Straight-line P&L Schedule Card */}
          <div className="bg-white rounded-lg border border-amber-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b pb-2">
              <span>Straight-Line P&L Expense Schedule (IFRS 16.6)</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Operating Lease Treatment
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Total Contractual Payments:</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{formatNumber(totalCashOutflows)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Lease Term Periods:</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{amortisationSchedule.length} {input.paymentFrequency.toLowerCase()} periods</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-amber-800 text-[11px] font-semibold">Straight-Line Periodic P&L Charge:</span>
                <p className="text-base font-bold font-mono text-amber-950 mt-0.5">{formatNumber(straightLineExpensePerPeriod)}</p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-60 overflow-y-auto mt-2 border rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 sticky top-0 font-semibold text-slate-700 border-b">
                  <tr>
                    <th className="py-2 px-3">Period</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-right">Cash Paid</th>
                    <th className="py-2 px-3 text-right">Straight-Line P&L Expense</th>
                    <th className="py-2 px-3 text-right">Accrued / Prepaid Rent Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {amortisationSchedule.map((line, idx) => {
                    const cumulativeExpense = straightLineExpensePerPeriod * (idx + 1);
                    const cumulativePaid = amortisationSchedule.slice(0, idx + 1).reduce((s, l) => s + l.paymentAmount, 0);
                    const accruedOrPrepaid = cumulativeExpense - cumulativePaid;

                    return (
                      <tr key={line.periodIndex} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-600">#{line.periodIndex}</td>
                        <td className="py-1.5 px-3 font-sans text-slate-700">{line.periodDate}</td>
                        <td className="py-1.5 px-3 text-right text-slate-900">{formatNumber(line.paymentAmount)}</td>
                        <td className="py-1.5 px-3 text-right text-amber-900 font-medium">{formatNumber(straightLineExpensePerPeriod)}</td>
                        <td className="py-1.5 px-3 text-right text-slate-700">
                          {accruedOrPrepaid === 0 ? '—' : formatAccountingWithBrackets(accruedOrPrepaid, input.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 1. Statement of Financial Position (Balance Sheet Presentation) — Hidden if Exemption Elected */}
      {!isExemptionElected && (
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Statement of Financial Position (Balance Sheet Presentation)
              </h3>
              <p className="text-xs text-slate-500">
                Reporting Cut-off Date: <strong>{reportingBalances.reportingDate}</strong> (Accounting Period #{reportingBalances.activePeriodIndex})
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
            IAS 1.69 Compliant
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Non-Current Assets */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
              Non-Current Assets
            </h4>
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate-600">Right-of-Use Asset Gross Capitalised Cost</span>
              <span className="font-mono font-medium text-slate-900">{formatNumber(reportingBalances.rouAssetGrossCost)}</span>
            </div>
            <div className="flex justify-between text-xs py-1 text-slate-600">
              <span>Less: Accumulated Depreciation to Date</span>
              <span className="font-mono text-red-600">({formatNumber(reportingBalances.accumulatedDepreciation)})</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-t font-bold bg-white px-2 rounded">
              <span className="text-slate-900">Carrying Amount (Net Book Value)</span>
              <span className="font-mono text-slate-950">{formatNumber(reportingBalances.rouAssetNetBookValue)}</span>
            </div>
          </div>

          {/* Liabilities: Current vs Non-Current */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
              Lease Liabilities (Current vs. Non-Current Split)
            </h4>
            <div className="flex justify-between text-xs py-1">
              <div>
                <span className="font-semibold text-slate-800">Current Lease Liability</span>
                <p className="text-[10px] text-slate-500">Principal repayment due within next 12 months</p>
              </div>
              <span className="font-mono font-bold text-amber-900">{formatNumber(reportingBalances.currentLeaseLiability)}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <div>
                <span className="font-semibold text-slate-800">Non-Current Lease Liability</span>
                <p className="text-[10px] text-slate-500">Remaining liability due beyond 12 months</p>
              </div>
              <span className="font-mono font-bold text-blue-900">{formatNumber(reportingBalances.nonCurrentLeaseLiability)}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-t font-bold bg-white px-2 rounded">
              <span className="text-slate-900">Total Closing Lease Liability</span>
              <span className="font-mono text-slate-950">{formatNumber(reportingBalances.totalLeaseLiability)}</span>
            </div>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="mx-5 mb-5 p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-950">
          <p className="font-semibold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            Approved Current Liability Methodology (Principal Reduction Method):
          </p>
          <p className="text-[11px] text-blue-900 leading-relaxed">
            In accordance with IAS 1.69 and IFRS 16 financial reporting practice, current liability represents contractual cash payments due in the next 12 months ({formatNumber(reportingBalances.next12MonthsPayments)}) minus interest to be recognized over those next 12 months ({formatNumber(reportingBalances.next12MonthsInterest)}), yielding a net capital reduction of {formatNumber(reportingBalances.currentLeaseLiability)}.
          </p>
        </div>
      </div>
      )}

      {/* 2. Statement of Profit or Loss & Cash Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* P&L Statement */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
            <span>Statement of Profit or Loss (P&L Impact)</span>
            <span className="text-[10px] text-slate-500 font-normal">Cumulative to Date</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Finance Cost — Interest Expense on Lease Liability</span>
              <span className="font-mono font-medium text-amber-800">{formatNumber(reportingBalances.totalInterestExpensedToDate)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Depreciation Expense — Right-of-Use Asset</span>
              <span className="font-mono font-medium text-indigo-800">{formatNumber(reportingBalances.totalDepreciationExpensedToDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-t font-bold bg-slate-50 px-2 rounded">
              <span className="text-slate-900">Total P&L Charge Recognised</span>
              <span className="font-mono text-slate-900">
                {formatNumber(reportingBalances.totalInterestExpensedToDate + reportingBalances.totalDepreciationExpensedToDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Cash Flows Statement */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
            <span>Statement of Cash Flows (IAS 7 & IFRS 16.50)</span>
            <span className="text-[10px] text-slate-500 font-normal">Cumulative Outflows</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Financing Activities: Principal Lease Payments</span>
              <span className="font-mono font-medium text-blue-800">
                {formatNumber(reportingBalances.totalPaymentsMadeToDate - reportingBalances.totalInterestExpensedToDate)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Operating Activities: Interest Paid</span>
              <span className="font-mono font-medium text-slate-800">{formatNumber(reportingBalances.totalInterestExpensedToDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-t font-bold bg-slate-50 px-2 rounded">
              <span className="text-slate-900">Total Lease Cash Outflow Paid</span>
              <span className="font-mono text-slate-900">{formatNumber(reportingBalances.totalPaymentsMadeToDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STRUCTURED IFRS 16.58 & IFRS 7.39 MATURITY ANALYSIS TABLE */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  IFRS 16.58 & IFRS 7.39 Contractual Maturity Analysis
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Audited Note Disclosure
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Undiscounted contractual lease payment obligations categorised into annual bands for the next five years and thereafter.
              </p>
            </div>
          </div>

          {/* Perspective Selector & Copy Action */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-200/80 p-0.5 rounded-lg flex text-xs font-semibold">
              <button
                onClick={() => setMaturityPerspective('REPORTING_DATE')}
                className={`px-3 py-1.5 rounded-md transition ${
                  isReportingView
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                From Reporting Date ({reportingBalances.reportingDate})
              </button>
              <button
                onClick={() => setMaturityPerspective('LIFETIME')}
                className={`px-3 py-1.5 rounded-md transition ${
                  !isReportingView
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                From Commencement
              </button>
            </div>

            <button
              onClick={handleCopyDisclosure}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition shadow-2xs"
              title="Copy formal note disclosure text to clipboard"
            >
              {copiedDisclosure ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Maturity Band / Horizon</th>
                <th className="py-2.5 px-3">Payment Dates Window</th>
                <th className="py-2.5 px-3 text-center">Periods</th>
                <th className="py-2.5 px-3 text-right">Undiscounted Lease Payments ({input.currency})</th>
                <th className="py-2.5 px-3 text-right">Future Finance Cost ({input.currency})</th>
                <th className="py-2.5 px-3 text-right">Present Value (Principal) ({input.currency})</th>
                <th className="py-2.5 px-3 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {activeBands.map((band, idx) => (
                <tr 
                  key={band.bandId} 
                  className={`hover:bg-blue-50/30 transition ${
                    idx === 0 ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-bold text-slate-900">{band.label}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{band.subLabel}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 text-[11px]">
                    {band.dateRange}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600 font-sans">
                    {band.periodCount > 0 ? `${band.periodCount} pmts` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {band.undiscountedCashFlow > 0 ? formatNumber(band.undiscountedCashFlow) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-700 font-medium">
                    {band.financeCostPortion > 0 ? formatNumber(band.financeCostPortion) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-700 font-semibold">
                    {band.principalPortion > 0 ? formatNumber(band.principalPortion) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans text-slate-500 text-[11px]">
                    {band.percentageOfTotal > 0 ? `${band.percentageOfTotal.toFixed(1)}%` : '0.0%'}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Reconciliation Totals Footer */}
            <tfoot>
              {/* Row 1: Total Undiscounted Payments */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 font-mono text-xs">
                <td colSpan={3} className="py-2.5 px-3 font-sans">
                  TOTAL CONTRACTUAL UNDISCOUNTED LEASE PAYMENTS:
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-950">
                  {formatNumber(totalUndiscounted)}
                </td>
                <td className="py-2.5 px-3 text-right text-amber-800 font-bold">
                  {formatNumber(totalFinanceCost)}
                </td>
                <td className="py-2.5 px-3 text-right text-blue-900 font-bold">
                  {formatNumber(presentValue)}
                </td>
                <td className="py-2.5 px-3 text-right font-sans">100.0%</td>
              </tr>

              {/* Row 2: Less Unearned Finance Cost */}
              <tr className="bg-slate-50 font-medium text-amber-900 border-t border-slate-200 font-mono text-xs">
                <td colSpan={3} className="py-2 px-3 font-sans text-slate-700">
                  Less: Future Unearned Finance Cost (Interest Accretion):
                </td>
                <td className="py-2 px-3 text-right text-amber-800">
                  ({formatNumber(totalFinanceCost)})
                </td>
                <td colSpan={3} className="py-2 px-3 text-[11px] font-sans text-slate-500">
                  Accreting to P&L over remaining lease terms
                </td>
              </tr>

              {/* Row 3: Present Value Reconciled to Balance Sheet */}
              <tr className="bg-blue-50/70 font-bold text-blue-950 border-t border-blue-200 font-mono text-xs">
                <td colSpan={3} className="py-2.5 px-3 font-sans flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PRESENT VALUE OF LEASE LIABILITIES (CARRYING AMOUNT):</span>
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-blue-950">
                  {formatNumber(presentValue)}
                </td>
                <td colSpan={3} className="py-2.5 px-3 text-[11px] font-sans text-emerald-800 font-semibold">
                  {isFullyReconciled 
                    ? `✓ 100% Reconciled to Balance Sheet Closing Liability (${formatNumber(targetLiability)})` 
                    : `Variance: ${formatNumber(presentValue - targetLiability)}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Audit Context Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Standard Note Disclosure Requirements (IFRS 16.58 & IFRS 7.39):</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            IFRS 16 paragraph 58 requires lessees to disclose a maturity analysis of lease liabilities applying paragraphs 39 and B11 of IFRS 7 separately from other financial liabilities. Undiscounted contractual payments due within each annual time band are explicitly reconciled above to the total lease liability recognized on the statement of financial position.
          </p>
        </div>
      </div>
    </div>
  );
};
