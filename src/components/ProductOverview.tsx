import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Calculator, 
  Table, 
  BookMarked, 
  Landmark, 
  Scale, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Coins, 
  FileText 
} from 'lucide-react';
import { ProductFaqAccordion } from './ProductFaqAccordion.tsx';

interface ProductOverviewProps {
  onLaunchEngine: () => void;
  onViewPricing: () => void;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({
  onLaunchEngine,
  onViewPricing,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* 1. Hero Section */}
      <section className="bg-[#0F172A] text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wide uppercase">
            <span>Finosutra SaaS Platform</span>
            <span>·</span>
            <span className="text-emerald-400">Audited Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Institutional IFRS 16 Lease Accounting Software
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Engineered by Chartered Accountants in financial reporting. Eliminate spreadsheet formula errors, automate initial measurement, generate double-entry journal vouchers, and extract audit-ready balance sheet disclosures in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchEngine}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Live Calculation Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewPricing}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              <span>Explore Subscription Plans</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IFRS 16 & IAS 1 Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Arbitrary-Precision Decimal Math</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Audit Workbook Export (.xlsx)</span>
            </div>
          </div>
        </div>

        {/* Decorative background grid element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none hidden lg:block" />
      </section>

      {/* 2. Core Product Modules */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Product Capabilities
          </h2>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            Complete Financial Accounting & Disclosure Lifecycle
          </h3>
          <p className="text-xs text-slate-500">
            From initial contract onboarding to statutory notes disclosure, Finosutra enforces strict accounting rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Module 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Initial PV & ROU Measurement
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discounts contractual cash flows using lessee IBR or implicit rate. Capitalises initial direct costs, prepayments, and IAS 37 restoration provisions while deducting incentives received.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 border-t pt-2">
              IFRS 16.24 & IFRS 16.26
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Table className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Amortisation & Depreciation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full period-by-period liability amortisation schedule and straight-line ROU asset depreciation schedules. Supports both in-arrears and in-advance payment timing.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 border-t pt-2">
              IFRS 16.31 & IFRS 16.36
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <BookMarked className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                General Ledger Journals
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated voucher generator for Day-1 initial recognition, monthly interest accrual, lease settlement payments, and depreciation charges with verified debit/credit balance.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 border-t pt-2">
              IAS 1 Double-Entry Standard
            </div>
          </div>

          {/* Module 4 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Landmark className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Maturity Notes & Disclosures
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Separates Current (next 12m capital reduction) and Non-Current liabilities. Generates structured 5-year and thereafter contractual undiscounted cash flow maturity disclosures.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 border-t pt-2">
              IFRS 16.58 & IFRS 7.39
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mechanism-to-Outcome Comparison Matrix */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Why Finance Teams Replace Spreadsheets with Finosutra
          </h3>
          <p className="text-xs text-slate-500">
            Evaluating the risks of bespoke Excel templates against institutional SaaS standards.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4 w-1/4">Accounting Requirement</th>
                <th className="py-2.5 px-4 w-3/8 text-red-700 bg-red-50/30">Manual Spreadsheets</th>
                <th className="py-2.5 px-4 w-3/8 text-blue-800 bg-blue-50/30">Finosutra IFRS 16 Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-900">Payment Timing (Advance vs Arrears)</td>
                <td className="py-2.5 px-4 bg-red-50/10 text-slate-600">Formula errors when shifting discounting by 1 period; day-1 interest over-accrual.</td>
                <td className="py-2.5 px-4 bg-blue-50/10 font-medium text-slate-900">Actuarially exact Day-1 principal reduction with zero interest in period 1.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-900">Current vs Non-Current Split</td>
                <td className="py-2.5 px-4 bg-red-50/10 text-slate-600">Inconsistent across team members; often confuses gross payments with capital principal.</td>
                <td className="py-2.5 px-4 bg-blue-50/10 font-medium text-slate-900">Automated Principal Reduction Method per IAS 1.69 (Next 12m cash less future interest).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-900">Double-Entry Journals</td>
                <td className="py-2.5 px-4 bg-red-50/10 text-slate-600">Manual re-keying into ERP, risking unbalanced journal vouchers.</td>
                <td className="py-2.5 px-4 bg-blue-50/10 font-medium text-slate-900">Automated balanced journal generator for Day-1, monthly subsequent, and summary periods.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-900">Audit Documentation</td>
                <td className="py-2.5 px-4 bg-red-50/10 text-slate-600">Fragile cell links break during external audit review.</td>
                <td className="py-2.5 px-4 bg-blue-50/10 font-medium text-slate-900">One-click 6-tab audit-certified Excel workbook export with zero variance checks.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Frequently Asked Questions Accordion */}
      <ProductFaqAccordion />

      {/* 5. Bottom CTA Strip */}
      <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">
            Ready to calculate your IFRS 16 lease schedules?
          </h3>
          <p className="text-xs text-slate-400">
            Test the live calculation engine right now with pre-built commercial office, retail, and plant lease scenarios.
          </p>
        </div>

        <button
          onClick={onLaunchEngine}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm whitespace-nowrap inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Open Interactive Calculator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
