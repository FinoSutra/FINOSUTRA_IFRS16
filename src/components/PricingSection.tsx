import React, { useState } from 'react';
import { Check, ShieldCheck, HelpCircle, ArrowRight, Building2, Sparkles, Zap } from 'lucide-react';
import { SubscriptionPlanId } from '../types/portfolio.ts';

interface PricingSectionProps {
  onSelectPlan: (planId: SubscriptionPlanId) => void;
  activePlanId?: SubscriptionPlanId;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  onSelectPlan,
  activePlanId = 'CORPORATE'
}) => {
  const [billingCycle, setBillingCycle] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');

  const isAnnual = billingCycle === 'ANNUAL';

  const plans: {
    id: SubscriptionPlanId;
    name: string;
    target: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    cta: string;
    popular: boolean;
    badge?: string;
  }[] = [
    {
      id: 'FREEMIUM',
      name: 'Freemium Starter',
      target: 'For individual accountants, students, and entities evaluating IFRS 16.',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 3 Active Lease Contracts',
        '1 Legal Entity Workspace',
        '1 Finance User Seat',
        'Full IFRS 16 Amortisation Schedule',
        'Straight-Line ROU Depreciation Engine',
        'Double-Entry Journal Entry Generator',
        'Balance Sheet IAS 1 Split',
        'Standard Excel Export (.xlsx)',
        'Free Forever · No Card Required',
      ],
      cta: 'Start Free Forever',
      popular: false,
      badge: '100% Free'
    },
    {
      id: 'PRACTITIONER',
      name: 'Practitioner',
      target: 'For solo accounting practitioners, reporting managers, and single-entity firms.',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        'Up to 15 Active Lease Contracts',
        '3 Corporate Legal Entities',
        '3 Finance Team User Seats',
        'Rent-Free Periods & Fit-Out Incentives',
        'Batch CSV Lease Importer',
        'Double-Entry Journal Vouchers',
        'IFRS 16.58 Maturity Analysis Disclosures',
        'Standard Excel Export (.xlsx) & JSON Save',
        'CA Email Technical Support',
      ],
      cta: 'Choose Practitioner',
      popular: false,
      badge: 'Independent CPAs'
    },
    {
      id: 'CORPORATE',
      name: 'Corporate Finance',
      target: 'For mid-market finance teams, group controllers, and corporate accountants.',
      monthlyPrice: 149,
      annualPrice: 119,
      features: [
        'Up to 75 Active Lease Contracts',
        '15 Multi-Tenant Subsidiaries',
        '10 Finance Team User Seats',
        'Multi-Currency Support (ISO 4217)',
        'Stepped Contractual Rental Escalations',
        'Statutory Financial Note Disclosures (IFRS 16.47-60)',
        '6-Sheet Big 4 Audit Workbook (.xlsx)',
        'Role-Based Approval Workflow',
        'Priority CA Technical Support',
      ],
      cta: 'Choose Corporate',
      popular: true,
      badge: 'Most Popular'
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise & Practice',
      target: 'For CPA/CA firms, audit practices, and multinational enterprise groups.',
      monthlyPrice: 399,
      annualPrice: 319,
      features: [
        'Unlimited Active Lease Contracts',
        'Unlimited Multi-Tenant Workspaces',
        'Unlimited User Seats & Auditor Viewers',
        'Custom ERP Chart of Accounts (SAP, Oracle)',
        'Upcoming IFRS 16 Modifications (Phase 6)',
        'Enterprise SSO (SAML 2.0 / Okta / Azure AD)',
        'Role-Based Governance & Full Audit Log',
        'Dedicated CA Accounting Specialist',
      ],
      cta: 'Choose Enterprise',
      popular: false,
      badge: 'Multinational'
    },
  ];

  const faqs = [
    {
      q: 'How does the Freemium model work?',
      a: 'The Freemium Starter tier is 100% free forever without requiring a credit card. It allows you to model up to 3 active lease contracts, generate complete amortisation schedules, calculate depreciation, export standard Excel workbooks, and create balanced double-entry journal entries. When your portfolio grows or requires statutory group disclosures, you can upgrade seamlessly.',
    },
    {
      q: 'Does Finosutra comply strictly with IFRS 16 and IAS 1?',
      a: 'Yes. The calculation engine was architected specifically for IFRS 16 (Leases) and IAS 1 (Presentation of Financial Statements). It calculates present values using effective interest rates, separates current and non-current liabilities based on the next 12 months capital reduction, and outputs fully balanced double-entry journal vouchers.',
    },
    {
      q: 'Can I export schedules directly to Microsoft Excel?',
      a: 'Yes. Finosutra generates a multi-sheet audit-ready Excel workbook (.xlsx) containing Contract Assumptions, the Liability Amortisation Schedule, the ROU Depreciation Schedule, General Ledger Journal Vouchers, the IFRS 16.58 Maturity Analysis, and the Mathematical Reconciliation Certificate.',
    },
    {
      q: 'How does Finosutra prevent decimal rounding errors?',
      a: 'Unlike standard spreadsheet formulas or basic JavaScript applications, Finosutra runs arbitrary-precision decimal mathematics (configured to 28 digits of internal precision) to prevent IEEE 754 floating-point inaccuracies.',
    },
    {
      q: 'Can multiple team members and external auditors access the account?',
      a: 'Yes. Finosutra features Role-Based Access Control (RBAC) with dedicated roles: Preparers (draft and calculate), Reviewers (financial controllers who approve), External Auditors (read-only audit access), and Admins (organization and billing governance).',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* 1. Header & Billing Cycle Toggle */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Transparent Freemium &amp; Enterprise SaaS Pricing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Start Free, Scale as Your Lease Portfolio Expands
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Zero commitment. Start on the Freemium Starter plan to test the calculation engine, or choose a Corporate tier for multi-currency groups and group statutory disclosures.
        </p>

        {/* Billing Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setBillingCycle(isAnnual ? 'MONTHLY' : 'ANNUAL')}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isAnnual ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual Billing
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pricing Cards Grid (4 Tiers including Freemium) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const price = plan.monthlyPrice === 0 ? 0 : (isAnnual ? plan.annualPrice : plan.monthlyPrice);
          const isCurrentActive = activePlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-5 transition flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-white border-2 border-blue-600 shadow-md ring-1 ring-blue-600/20'
                  : plan.id === 'FREEMIUM'
                  ? 'bg-white border-2 border-emerald-500/70 shadow-2xs hover:border-emerald-600'
                  : 'bg-white border border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  Most Popular for Corporate Teams
                </div>
              )}

              {plan.id === 'FREEMIUM' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  Free Forever · Instant Setup
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  {plan.badge && !plan.popular && plan.id !== 'FREEMIUM' && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 min-h-[34px] mb-3 leading-relaxed">
                  {plan.target}
                </p>

                <div className="mb-5 pb-3 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {plan.monthlyPrice === 0
                      ? 'Free forever without expiration'
                      : isAnnual
                      ? 'Billed annually in advance'
                      : 'Billed monthly, cancel anytime'}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                    Included Capabilities:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isCurrentActive && (
                  <div className="mb-2 text-center text-[11px] font-bold text-emerald-600 bg-emerald-50 py-1 rounded-md border border-emerald-200">
                    ✓ Currently Active Plan
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrentActive
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : plan.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : plan.id === 'FREEMIUM'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{isCurrentActive ? 'Active Plan' : plan.cta}</span>
                  {!isCurrentActive && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Frequently Asked Questions */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Frequently Asked SaaS Questions</span>
          </h3>
          <p className="text-xs text-slate-500">
            Common questions from finance directors, audit partners, and corporate controllers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 divide-y md:divide-y-0 divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-1.5 pt-3 md:pt-0">
              <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
