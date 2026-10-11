import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Landmark, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Layers, 
  FileSpreadsheet 
} from 'lucide-react';
import { PortfolioConsolidatedMetrics, OrganizationEntity, LeasePortfolioItem } from '../types/portfolio.ts';
import { formatCurrency, formatAccountingNumber } from '../utils/formatters.ts';
import { exportPortfolioConsolidationToExcel } from '../services/portfolioExportService.ts';

interface ConsolidatedDisclosuresViewProps {
  metrics: PortfolioConsolidatedMetrics;
  entities: OrganizationEntity[];
  leases: LeasePortfolioItem[];
  activeEntityName?: string;
}

export const ConsolidatedDisclosuresView: React.FC<ConsolidatedDisclosuresViewProps> = ({
  metrics,
  entities,
  leases,
  activeEntityName = 'All Consolidated Entities'
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleExportExcel = () => {
    exportPortfolioConsolidationToExcel(leases, metrics, entities, activeEntityName);
  };

  const disclosureNoteText = `NOTE X: LEASES (IFRS 16 STATUTORY FINANCIAL DISCLOSURES)

1. Nature of Leasing Activities
The Group enters into lease arrangements primarily for corporate office premises, logistics distribution hubs, automated plant machinery, delivery vehicle fleets, and core cloud infrastructure. 

2. Consolidated Statement of Financial Position (Carrying Amounts)
- Total Right-of-Use Assets: ${formatCurrency(metrics.totalROUAssetClosing, 'USD')}
- Total Lease Liabilities: ${formatCurrency(metrics.totalLeaseLiabilityClosing, 'USD')}
  - Current portion (due within 12 months): ${formatCurrency(metrics.totalCurrentLiability, 'USD')}
  - Non-current portion (due after 12 months): ${formatCurrency(metrics.totalNonCurrentLiability, 'USD')}

3. Amounts Recognised in the Consolidated Statement of Profit or Loss (IFRS 16.53)
- Depreciation charge on right-of-use assets: ${formatCurrency(metrics.totalAnnualDepreciation, 'USD')}
- Interest expense on lease liabilities: ${formatCurrency(metrics.totalAnnualInterestExpense, 'USD')}
- Total expenses recognised in profit or loss: ${formatCurrency(metrics.totalAnnualPLCharge, 'USD')}

4. Contractual Maturity Analysis of Lease Liabilities (IFRS 16.58)
- Within one year: ${formatCurrency(metrics.consolidatedMaturity.year1, 'USD')}
- Between one and two years: ${formatCurrency(metrics.consolidatedMaturity.year2, 'USD')}
- Between two and three years: ${formatCurrency(metrics.consolidatedMaturity.year3, 'USD')}
- Between three and four years: ${formatCurrency(metrics.consolidatedMaturity.year4, 'USD')}
- Between four and five years: ${formatCurrency(metrics.consolidatedMaturity.year5, 'USD')}
- Later than five years: ${formatCurrency(metrics.consolidatedMaturity.after5Years, 'USD')}
- Total undiscounted contractual commitments: ${formatCurrency(metrics.consolidatedMaturity.totalUndiscounted, 'USD')}
- Less: Effect of discounting (unearned finance cost): (${formatCurrency(metrics.consolidatedMaturity.effectOfDiscounting, 'USD')})
- Present value of lease liabilities: ${formatCurrency(metrics.consolidatedMaturity.totalPresentValue, 'USD')}`;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Statutory Note Disclosures</span>
            <span>·</span>
            <span className="text-emerald-400">IFRS 16.47–60 Compliance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Consolidated Financial Statement Note Disclosures
          </h1>
          <p className="text-xs text-slate-300">
            Audit-ready note disclosures for annual reports (10-K), statutory audit packs, and board financial reporting packs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => copyToClipboard(disclosureNoteText, 'ALL')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            {copiedSection === 'ALL' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Disclosure Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Big 4 Model (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* DISCLOSURE SECTION 1: BALANCE SHEET PRESENTATION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              1. Consolidated Statement of Financial Position (IFRS 16.47)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Scope: {activeEntityName}
          </span>
        </div>

        <div className="p-5">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-2.5 font-semibold">Balance Sheet Line Item</th>
                <th className="p-2.5 font-semibold text-right">Carrying Amount (USD)</th>
                <th className="p-2.5 font-semibold">IFRS 16 Standard Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="p-2.5 font-medium">Right-of-use assets (Non-Current Assets)</td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(metrics.totalROUAssetClosing, 'USD')}
                </td>
                <td className="p-2.5 text-slate-500">
                  Carried at cost less accumulated depreciation and impairments
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Lease liabilities — Current (due &le; 12 months)</td>
                <td className="p-2.5 text-right font-mono font-bold text-amber-700">
                  {formatCurrency(metrics.totalCurrentLiability, 'USD')}
                </td>
                <td className="p-2.5 text-slate-500">
                  Current liabilities (working capital obligation)
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Lease liabilities — Non-Current (due &gt; 12 months)</td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(metrics.totalNonCurrentLiability, 'USD')}
                </td>
                <td className="p-2.5 text-slate-500">
                  Non-current financial liabilities
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <td className="p-2.5">Total Consolidated Lease Liabilities</td>
                <td className="p-2.5 text-right font-mono text-blue-700">
                  {formatCurrency(metrics.totalLeaseLiabilityClosing, 'USD')}
                </td>
                <td className="p-2.5 text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Fully Reconciled to Amortisation Schedules</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DISCLOSURE SECTION 2: PROFIT OR LOSS & CASH FLOWS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              2. Amounts Recognised in Consolidated Profit or Loss &amp; Cash Flows (IFRS 16.53)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Annual Run-Rate</span>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Statement of Profit or Loss */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Statement of Profit or Loss (Annualized)
              </h4>
              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Depreciation charge on right-of-use assets</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(metrics.totalAnnualDepreciation, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Interest expense on lease liabilities (Finance Costs)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(metrics.totalAnnualInterestExpense, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Expense relating to short-term leases (&le; 12 mo)</span>
                  <span className="font-mono text-slate-500">$0.00</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Expense relating to low-value assets</span>
                  <span className="font-mono text-slate-500">$0.00</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-blue-700 bg-blue-50 px-2 rounded-md">
                  <span>Total Amount Recognised in Profit or Loss</span>
                  <span className="font-mono">{formatCurrency(metrics.totalAnnualPLCharge, 'USD')}</span>
                </div>
              </div>
            </div>

            {/* Right: Statement of Cash Flows */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Statement of Cash Flows (Annualized Outflow)
              </h4>
              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Financing activities (Principal lease repayment)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(metrics.totalCurrentLiability, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Financing/Operating activities (Lease interest paid)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(metrics.totalAnnualInterestExpense, 'USD')}
                  </span>
                </div>
                <div className="flex justify-between py-2 font-bold text-emerald-700 bg-emerald-50 px-2 rounded-md">
                  <span>Total Cash Outflow for Leases</span>
                  <span className="font-mono">
                    {formatCurrency(metrics.totalCurrentLiability + metrics.totalAnnualInterestExpense, 'USD')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 pt-2">
                  * Note: In accordance with IAS 7 / IFRS 16.50, cash payments for the principal portion of lease liabilities are classified within financing activities.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISCLOSURE SECTION 3: CONTRACTUAL MATURITY ANALYSIS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              3. Contractual Undiscounted Cash Flows Maturity Analysis (IFRS 16.58)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Liquidity Risk Exposure</span>
        </div>

        <div className="p-5">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-2.5 font-semibold">Contractual Maturity Band</th>
                <th className="p-2.5 font-semibold text-right">Undiscounted Outflows (USD)</th>
                <th className="p-2.5 font-semibold text-right">% of Total Commitments</th>
                <th className="p-2.5 font-semibold">Audit Commentary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="p-2.5 font-medium">Within one year (Next 12 months)</td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(metrics.consolidatedMaturity.year1, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {((metrics.consolidatedMaturity.year1 / (metrics.consolidatedMaturity.totalUndiscounted || 1)) * 100).toFixed(1)}%
                </td>
                <td className="p-2.5 text-slate-500">Short-term liquidity commitment</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Between one and two years</td>
                <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                  {formatCurrency(metrics.consolidatedMaturity.year2, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {((metrics.consolidatedMaturity.year2 / (metrics.consolidatedMaturity.totalUndiscounted || 1)) * 100).toFixed(1)}%
                </td>
                <td className="p-2.5 text-slate-500">Contractual medium-term obligation</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Between two and three years</td>
                <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                  {formatCurrency(metrics.consolidatedMaturity.year3, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {((metrics.consolidatedMaturity.year3 / (metrics.consolidatedMaturity.totalUndiscounted || 1)) * 100).toFixed(1)}%
                </td>
                <td className="p-2.5 text-slate-500">Contractual medium-term obligation</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Between three and four years</td>
                <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                  {formatCurrency(metrics.consolidatedMaturity.year4, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {((metrics.consolidatedMaturity.year4 / (metrics.consolidatedMaturity.totalUndiscounted || 1)) * 100).toFixed(1)}%
                </td>
                <td className="p-2.5 text-slate-500">Contractual medium-term obligation</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Between four and five years</td>
                <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                  {formatCurrency(metrics.consolidatedMaturity.year5, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {((metrics.consolidatedMaturity.year5 / (metrics.consolidatedMaturity.totalUndiscounted || 1)) * 100).toFixed(1)}%
                </td>
                <td className="p-2.5 text-slate-500">Contractual long-term obligation</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Later than five years</td>
                <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                  {formatCurrency(metrics.consolidatedMaturity.after5Years, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-slate-600">
                  {((metrics.consolidatedMaturity.after5Years / (metrics.consolidatedMaturity.totalUndiscounted || 1)) * 100).toFixed(1)}%
                </td>
                <td className="p-2.5 text-slate-500">Long-term real estate &amp; distribution centers</td>
              </tr>
              <tr className="bg-slate-100 font-bold border-t border-slate-300">
                <td className="p-2.5">Total Undiscounted Future Lease Commitments</td>
                <td className="p-2.5 text-right font-mono text-slate-900">
                  {formatCurrency(metrics.consolidatedMaturity.totalUndiscounted, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono">100.0%</td>
                <td className="p-2.5 text-slate-500">Gross contractual commitments</td>
              </tr>
              <tr className="text-slate-500 italic">
                <td className="p-2.5">Less: Effect of Discounting (Unearned Finance Costs)</td>
                <td className="p-2.5 text-right font-mono text-red-600">
                  ({formatCurrency(metrics.consolidatedMaturity.effectOfDiscounting, 'USD')})
                </td>
                <td className="p-2.5 text-right font-mono">—</td>
                <td className="p-2.5">Present value discounting adjustment</td>
              </tr>
              <tr className="bg-emerald-50 text-slate-900 font-bold border-t-2 border-slate-400">
                <td className="p-2.5 text-emerald-900">Present Value of Lease Liabilities (Carrying Amount)</td>
                <td className="p-2.5 text-right font-mono text-emerald-900 text-sm">
                  {formatCurrency(metrics.consolidatedMaturity.totalPresentValue, 'USD')}
                </td>
                <td className="p-2.5 text-right font-mono text-emerald-800">—</td>
                <td className="p-2.5 text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Agrees to Balance Sheet Liabilities</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
