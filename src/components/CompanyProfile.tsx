import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Scale, 
  Globe, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* 1. Company Profile Hero Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Finosutra Financial Technologies
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Chartered Accountant-Founded Financial Reporting Software Firm
              </p>
            </div>
          </div>

          <a
            href="https://www.finosutra.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs whitespace-nowrap self-start sm:self-auto"
          >
            <span>Visit finosutra.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="text-sm font-semibold text-slate-800 leading-normal">
            Finosutra was founded by senior Chartered Accountants working in financial reporting and corporate audit. Our primary mission is to eliminate spreadsheet risk in statutory accounting compliance.
          </p>
          <p>
            Following the mandatory adoption of <strong>IFRS 16 (Leases)</strong>, millions of businesses worldwide transitioned from operating lease expensing to recognizing complex Right-of-Use (ROU) assets and financial liabilities on balance sheets. Finance departments and audit firms have largely relied on custom Excel models that frequently suffer from unverified discount rate compounding, broken period dates, and unaligned current/non-current splits.
          </p>
          <p>
            Finosutra delivers a commercially viable, globally scalable financial reporting platform that computes present values, amortisation schedules, straight-line depreciation, double-entry journal vouchers, and mandatory liquidity maturity disclosures with zero floating-point rounding errors.
          </p>
        </div>
      </section>

      {/* 2. Core Operational Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Chartered Accountant Rigor
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every technical accounting treatment, effective interest formula, and IAS 1 presentation convention is verified by financial reporting practitioners.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Arbitrary Decimal Precision
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard software loses precision over 120+ compounding cycles. Finosutra operates on arbitrary-precision decimal mathematics to guarantee exact balance zeroing.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Global Jurisdiction Ready
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered with ISO 4217 multi-currency support, customizable accounting cut-off dates, and standard IFRS / IAS 1 terminology for international reporting.
          </p>
        </div>
      </section>

      {/* 3. Product Roadmap & Strategic Vision */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Strategic Platform Roadmap (Phases 0 through 7)
        </h3>
        <p className="text-xs text-slate-500">
          The development of Finosutra follows an audit-approved, phase-gated engineering architecture.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">Phase 0–3: Core Single-Lease Engine & Disclosures [ACTIVE]</span>
              <p className="text-slate-600 mt-0.5">
                Full Decimal.js calculation engine, amortisation schedules, ROU depreciation, journal entry generator, IFRS 16.58 maturity analysis, and 6-tab Excel exports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">Phase 4: Cloud Persistence & Multi-Tenant Database</span>
              <p className="text-slate-600 mt-0.5">
                Relational PostgreSQL database, Row-Level Security (RLS) tenant isolation, secure user authentication, and multi-organisation workspaces.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">Phase 5–6: Portfolio Aggregations & Lease Modifications</span>
              <p className="text-slate-600 mt-0.5">
                Multi-lease portfolio consolidation, bulk data ingestion, contract modifications (IFRS 16.39–46), and CPI/index-linked escalations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Corporate Contact & Support */}
      <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
            <Mail className="w-4 h-4" />
            <span>Corporate Inquiries & Accounting Advisory</span>
          </div>
          <h4 className="text-base font-bold text-white">
            Have questions regarding IFRS 16 compliance for your organisation?
          </h4>
          <p className="text-xs text-slate-400">
            Our accounting product team reviews custom contract provisions, transition accounting, and enterprise migrations.
          </p>
        </div>

        <a
          href="mailto:contact@finosutra.com"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          Contact Accounting Team
        </a>
      </section>
    </div>
  );
};
