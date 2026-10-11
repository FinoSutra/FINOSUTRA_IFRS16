import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Cpu, Headphones, Search } from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'COMPLIANCE' | 'FEATURES' | 'IMPLEMENTATION';
  question: string;
  answer: string;
  standardReference?: string;
}

export const ProductFaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('comp-01');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'COMPLIANCE' | 'FEATURES' | 'IMPLEMENTATION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FaqItem[] = [
    // Category 1: IFRS 16 Compliance
    {
      id: 'comp-01',
      category: 'COMPLIANCE',
      question: 'How does Finosutra calculate the Initial Lease Liability and ROU Asset?',
      standardReference: 'IFRS 16.24 & IFRS 16.26',
      answer: 'At commencement date, the Lease Liability is measured at the present value of future unpaid lease payments, discounted using the incremental borrowing rate (IBR) or the rate implicit in the lease. The Right-of-Use (ROU) Asset is measured at cost, comprising: (a) initial lease liability; (b) lease prepayments made at or before commencement; (c) initial direct costs incurred (e.g. legal fees); and (d) estimated restoration/dismantling obligations under IAS 37; less (e) any lease incentives received from the lessor.',
    },
    {
      id: 'comp-02',
      category: 'COMPLIANCE',
      question: 'How does the engine handle payments in advance versus payments in arrears?',
      standardReference: 'IFRS 16.27 & Educational Material',
      answer: 'For payments in arrears, interest accrues across each complete compounding period prior to payment settlement. For payments in advance (annuity due), the Day-1 payment occurs immediately on the commencement date; the engine incurs zero interest on Day 1 and immediately reduces the opening liability before subsequent periodic interest accrues on the remaining net capital balance.',
    },
    {
      id: 'comp-03',
      category: 'COMPLIANCE',
      question: 'What methodology does Finosutra use to classify Current vs. Non-Current liabilities?',
      standardReference: 'IAS 1.69 & IFRS 16 Financial Practice',
      answer: 'In strict compliance with IAS 1.69, Finosutra applies the audited Principal Reduction Method. At any balance sheet reporting cut-off date, Current Lease Liability equals the contractual cash payments due over the next 12 months minus the future interest to be accreted over those next 12 months (i.e. the net capital/principal reduction due within one year). Non-Current Liability represents the remaining capital balance due beyond 12 months.',
    },
    {
      id: 'comp-04',
      category: 'COMPLIANCE',
      question: 'How are the mandatory IFRS 16.58 / IFRS 7.39 maturity analysis disclosures generated?',
      standardReference: 'IFRS 16.58 & IFRS 7.39',
      answer: 'Finosutra categorises remaining contractual undiscounted lease commitments into annual horizons: (1) Not later than 1 year; (2) 1 to 2 years; (3) 2 to 3 years; (4) 3 to 4 years; (5) 4 to 5 years; and (6) Thereafter. The total undiscounted cash flows are explicitly reconciled to the balance sheet carrying amount by deducting future unearned finance costs.',
    },
    {
      id: 'comp-05',
      category: 'COMPLIANCE',
      question: 'How are short-term leases and low-value asset exemptions handled?',
      standardReference: 'IFRS 16.5(a) & IFRS 16.5(b)',
      answer: 'Lessees can elect not to recognize assets and liabilities for leases with terms of 12 months or less with no purchase option (short-term), or leases of low-value assets (underlying value when new <= ~$5,000, such as laptops or office furniture). When elected, Finosutra provides audit documentation flags and expenses payments straight-line in P&L without balance sheet capitalisation.',
    },

    // Category 2: System Features
    {
      id: 'feat-01',
      category: 'FEATURES',
      question: 'How does Finosutra prevent decimal rounding errors and floating-point drift?',
      standardReference: 'Arbitrary-Precision Mathematics',
      answer: 'Standard spreadsheets and basic web applications rely on IEEE 754 binary floating-point numbers, which accumulate fractional inaccuracies across hundreds of discounting iterations. Finosutra implements an independent, headless calculation engine using Decimal.js with 28 digits of internal precision, guaranteeing exact balance zeroing at lease maturity.',
    },
    {
      id: 'feat-02',
      category: 'FEATURES',
      question: 'Does the system support rent-free periods and stepped rental escalations?',
      standardReference: 'IFRS 16.27(a)',
      answer: 'Yes. The engine natively supports rent-free fit-out windows (where accrued interest capitalises onto the liability before repayments begin) and contractual stepped escalations (such as fixed 3% annual rental increases). All fixed contractual increases are discounted into the initial measurement at commencement date.',
    },
    {
      id: 'feat-03',
      category: 'FEATURES',
      question: 'What audit reports and export formats does Finosutra produce?',
      standardReference: 'Big 4 Deliverable Standards',
      answer: 'Finosutra generates: (1) Big 4-formatted Excel workbooks (.xlsx) with custom column widths across 6 audit sheets (Exec Summary, Liability Amortisation, ROU Depreciation, Journal Vouchers, Maturity Disclosures, and Audit Proofs); (2) Executive Technical Accounting Memorandums formatted for PDF and Board review; and (3) JSON snapshot files for instant state backup.',
    },
    {
      id: 'feat-04',
      category: 'FEATURES',
      question: 'Are double-entry accounting journal vouchers automatically balanced?',
      standardReference: 'IAS 1 Double-Entry General Ledger',
      answer: 'Yes. Every journal entry generated by Finosutra (Day-1 Initial Recognition, Monthly Subsequent Measurement, and Cumulative Annual Summary) includes standard account codes, descriptive narrations, and automated debit-credit equality checks proving zero variance.',
    },

    // Category 3: Implementation & Support
    {
      id: 'impl-01',
      category: 'IMPLEMENTATION',
      question: 'Can external auditors easily audit and verify Finosutra calculations?',
      standardReference: 'Auditability & Traceability',
      answer: 'Yes. All outputs are designed specifically for external audit inspection (PwC, EY, Deloitte, KPMG, BDO, Grant Thornton). Every line item in the balance sheet extract, maturity analysis, and schedule includes its underlying mathematical formula, effective discount rate, and standard paragraph citations.',
    },
    {
      id: 'impl-02',
      category: 'IMPLEMENTATION',
      question: 'What level of technical accounting support is available for complex contracts?',
      standardReference: 'Chartered Accountant Advisory',
      answer: 'Finosutra was founded and is maintained by senior Chartered Accountants in financial reporting. Enterprise and Corporate subscribers receive direct technical support from financial reporting specialists for complex contract evaluations, renewal judgements, and transition accounting.',
    },
    {
      id: 'impl-03',
      category: 'IMPLEMENTATION',
      question: 'Can I test the calculation engine right now before purchasing?',
      standardReference: 'Interactive Evaluation',
      answer: 'Yes. The calculation engine is fully interactive in the platform right now. You can load pre-built commercial office, retail store, and heavy machinery golden test presets, adjust assumptions, inspect schedules, and download Excel models without entering payment details.',
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.standardReference && faq.standardReference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-2xs space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Technical Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Authoritative answers to common questions regarding IFRS 16 compliance, mathematical calculation mechanics, and audit reporting.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
        {/* Category Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Questions ({faqs.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('COMPLIANCE')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeCategory === 'COMPLIANCE'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>IFRS 16 Compliance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('FEATURES')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeCategory === 'FEATURES'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Calculation Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('IMPLEMENTATION')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeCategory === 'IMPLEMENTATION'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit & Support</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queries or standards..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            No questions found matching "{searchQuery}". Try searching for terms like "IBR", "Current", or "Depreciation".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  isOpen
                    ? 'border-blue-300 bg-blue-50/15 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4.5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {faq.category}
                      </span>
                      {faq.standardReference && (
                        <span className="text-[11px] font-semibold text-blue-700">
                          {faq.standardReference}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`p-1 rounded-md text-slate-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-600 bg-blue-100' : 'text-slate-400 bg-slate-100'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80 text-slate-700 leading-normal">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Helpful Contact Banner */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800">
            Have a bespoke technical accounting scenario?
          </span>
          <p className="text-slate-500 text-[11px]">
            Our Chartered Accountant advisory team provides guidance on complex lease agreements, modifications, and remeasurements.
          </p>
        </div>

        <a
          href="mailto:contact@finosutra.com"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition shrink-0 whitespace-nowrap"
        >
          <span>Ask Accounting Specialist</span>
        </a>
      </div>
    </section>
  );
};
