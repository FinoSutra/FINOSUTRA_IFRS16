import React, { useRef, useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Printer, 
  Building2,
  ArrowRight,
  ShieldCheck,
  Layers,
  BookOpen,
  Settings,
  CreditCard,
  Calculator,
  UserCheck,
  Check,
  Globe,
  ExternalLink
} from 'lucide-react';
import { GOLDEN_TEST_PRESETS, TestPreset } from '../engine/testPresets.ts';
import { LeaseContractInput, IFRS16CalculationResult } from '../types/ifrs16.ts';
import { SaaSUser, OrganizationEntity, SubscriptionStatus } from '../types/portfolio.ts';
import { exportCalculationToExcel, exportCalculationToJSON } from '../services/exportService.ts';

export type MainNavPage = 
  | 'PORTFOLIO' 
  | 'ENGINE' 
  | 'DISCLOSURES' 
  | 'SETTINGS' 
  | 'PRICING' 
  | 'PRODUCT' 
  | 'PROFILE';

interface HeaderProps {
  activePage: MainNavPage;
  onNavigate: (page: MainNavPage) => void;
  currentInput: LeaseContractInput;
  calcResult: IFRS16CalculationResult | null;
  onSelectPreset: (preset: TestPreset) => void;
  onImportJSON: (input: LeaseContractInput) => void;
  onOpenHelp: () => void;
  currentUser?: SaaSUser;
  activeEntity?: OrganizationEntity;
  subscription?: SubscriptionStatus;
  onOpenAuth: () => void;
  onOpenMultiLeaseUploader?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  currentInput,
  calcResult,
  onSelectPreset,
  onImportJSON,
  onOpenHelp,
  currentUser,
  activeEntity,
  subscription,
  onOpenAuth,
  onOpenMultiLeaseUploader,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.input) {
          onImportJSON(parsed.input);
        } else if (parsed.leaseReference) {
          onImportJSON(parsed as LeaseContractInput);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onNavigate('PORTFOLIO')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-500 transition">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                FINOSUTRA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 hidden sm:inline">
                SaaS
              </span>
            </div>
          </button>

          {/* Zone 2: Primary Enterprise SaaS Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onNavigate('PORTFOLIO')}
              className={`hover:text-white transition whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
                activePage === 'PORTFOLIO'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Portfolio Hub</span>
            </button>

            <button
              onClick={() => onNavigate('ENGINE')}
              className={`hover:text-white transition whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
                activePage === 'ENGINE'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'text-slate-300'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Single Lease Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            <button
              onClick={() => onNavigate('DISCLOSURES')}
              className={`hover:text-white transition whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
                activePage === 'DISCLOSURES'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Notes Disclosures</span>
            </button>

            <button
              onClick={() => onNavigate('SETTINGS')}
              className={`hover:text-white transition whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
                activePage === 'SETTINGS'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'text-slate-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Workspace &amp; Billing</span>
            </button>

            <button
              onClick={() => onNavigate('PRICING')}
              className={`hover:text-white transition whitespace-nowrap py-1 cursor-pointer ${
                activePage === 'PRICING'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'text-slate-400'
              }`}
            >
              Plans
            </button>

            <button
              onClick={() => onNavigate('PRODUCT')}
              className={`hover:text-white transition whitespace-nowrap py-1 cursor-pointer ${
                activePage === 'PRODUCT'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'text-slate-400'
              }`}
            >
              Overview
            </button>

            <button
              onClick={onOpenHelp}
              className="text-slate-400 hover:text-slate-200 transition whitespace-nowrap py-1 cursor-pointer"
            >
              IFRS 16 Rules
            </button>
          </nav>

          {/* Zone 3: Actions & User Capsule */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Indicator & Share Live URL */}
            <button
              onClick={() => {
                const liveUrl = window.location.href;
                navigator.clipboard?.writeText(liveUrl).catch(() => {});
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition cursor-pointer"
              title="Click to copy your live app URL"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Site is Live</span>
                  <span className="text-[10px] text-slate-400 border-l border-emerald-500/30 pl-1.5 font-mono">Copy Link</span>
                </>
              )}
            </button>

            {/* GitHub Repository Link */}
            <a
              href="https://github.com/FinoSutra/IFRS16"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
              title="View source code on GitHub (FinoSutra/IFRS16)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* Quick Multi-Lease Uploader Action */}
            {onOpenMultiLeaseUploader && (
              <button
                onClick={onOpenMultiLeaseUploader}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 border border-blue-500/30 text-xs font-semibold transition cursor-pointer shadow-2xs"
                title="Upload multiple lease contracts at once (CSV / Spreadsheet)"
              >
                <Upload className="w-3.5 h-3.5 text-blue-300" />
                <span>Multi-Lease Uploader</span>
              </button>
            )}

            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs transition cursor-pointer"
                title="Manage Account, Profile & Authentication"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${currentUser.avatarColor}`}>
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-slate-200 font-medium">{currentUser.name.split(',')[0]}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                  subscription?.planId === 'FREEMIUM'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {subscription?.planId === 'FREEMIUM' ? 'FREE' : subscription?.planId || 'PRO'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

            {activePage === 'ENGINE' && (
              <>
                {/* Scenario Selector */}
                <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 mr-1">
                  <span className="text-slate-400 font-medium">Test Case:</span>
                  <select
                    className="bg-slate-800/90 border border-slate-700 text-xs rounded-md px-2 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                    onChange={(e) => {
                      const found = GOLDEN_TEST_PRESETS.find((p) => p.id === e.target.value);
                      if (found) onSelectPreset(found);
                    }}
                    defaultValue="TC-01"
                  >
                    {GOLDEN_TEST_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {calcResult && (
                  <>
                    <button
                      onClick={() => exportCalculationToExcel(calcResult)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-xs whitespace-nowrap cursor-pointer"
                      title="Export complete 6-sheet audit model to Excel (.xlsx)"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span className="hidden sm:inline">Export Excel</span>
                    </button>

                    <button
                      onClick={() => exportCalculationToJSON(calcResult)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition border border-slate-700 whitespace-nowrap cursor-pointer"
                      title="Save calculation snapshot as JSON"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden xl:inline">Save</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition border border-slate-700 whitespace-nowrap cursor-pointer"
                  title="Import calculation snapshot JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden xl:inline">Load</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />

                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer"
                  title="Print report / Save to PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}

            {activePage !== 'ENGINE' && activePage !== 'PORTFOLIO' && (
              <button
                onClick={() => onNavigate('PORTFOLIO')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-xs whitespace-nowrap cursor-pointer"
              >
                <span>Open Portfolio Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
