import React from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Building2, 
  FileSpreadsheet, 
  Users 
} from 'lucide-react';
import { SubscriptionPlanId, SubscriptionStatus } from '../types/portfolio.ts';
import { SUBSCRIPTION_PLANS } from '../services/portfolioService.ts';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: SubscriptionStatus;
  currentLeaseCount: number;
  onSelectPlan: (planId: SubscriptionPlanId) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  currentLeaseCount,
  onSelectPlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>SaaS Subscription Upgrade</span>
              <span>·</span>
              <span className="text-slate-400">Scale Your Portfolio</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Unlock Full IFRS 16 Enterprise Capabilities
            </h2>
            <p className="text-xs text-slate-300">
              You currently have <span className="font-bold text-white font-mono">{currentLeaseCount}</span> active lease contracts under the <span className="font-bold text-blue-400">{currentSubscription.planName}</span> (Limit: {currentSubscription.leasesMax === -1 ? 'Unlimited' : `${currentSubscription.leasesMax} leases`}).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Practitioner Tier */}
            <div className="border border-slate-200 hover:border-blue-400 rounded-xl p-5 bg-white shadow-2xs space-y-4 flex flex-col justify-between transition">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Individual CPAs
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    15 Contracts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Practitioner</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">$49</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500">
                  Ideal for solo accounting practitioners and reporting managers.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Up to 15 active lease contracts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>3 Legal entities &amp; 3 team seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Batch CSV Lease Importer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full Excel &amp; JSON model export</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  onSelectPlan('PRACTITIONER');
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Upgrade to Practitioner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Corporate Tier */}
            <div className="border-2 border-blue-600 rounded-xl p-5 bg-white shadow-md space-y-4 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                Recommended for Corporate Teams
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Finance Teams
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    75 Contracts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Corporate Finance</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">$149</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500">
                  Built for mid-market controllers, multi-entity groups, and CA review.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Up to 75 active lease contracts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>15 Legal entities &amp; 10 team seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Statutory Note Disclosures (IFRS 16.47-60)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>6-Sheet Big 4 Excel Audit Workbook</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Multi-currency &amp; stepped rent escalations</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  onSelectPlan('CORPORATE');
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Upgrade to Corporate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Need <strong>Unlimited Leases</strong>, SAP / Oracle ERP sync, or custom SSO? Explore <strong>Enterprise Plan</strong>.
              </span>
            </div>
            <button
              onClick={() => {
                onSelectPlan('ENTERPRISE');
                onClose();
              }}
              className="font-bold text-blue-600 hover:underline shrink-0"
            >
              Select Enterprise ($399/mo) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
