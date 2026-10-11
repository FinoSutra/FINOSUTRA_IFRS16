import React from 'react';
import { Building2, Sparkles, FileSpreadsheet, ArrowRight, ShieldCheck } from 'lucide-react';
import { IFRS16CalculationResult } from '../types/ifrs16.ts';
import { exportCalculationToExcel } from '../services/exportService.ts';

export type MainNavPage = 'ENGINE' | 'PRODUCT' | 'PRICING' | 'PROFILE';

interface NavbarProps {
  activePage: MainNavPage;
  onNavigate: (page: MainNavPage) => void;
  calcResult: IFRS16CalculationResult | null;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  calcResult,
  onOpenHelp,
}) => {
  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single element wordmark */}
          <button
            onClick={() => onNavigate('PRODUCT')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-500 transition">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                FINOSUTRA
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline whitespace-nowrap">
                IFRS 16 SaaS
              </span>
            </div>
          </button>

          {/* Zone 2: 4 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <button
              onClick={() => onNavigate('PRODUCT')}
              className={`hover:text-white transition whitespace-nowrap py-1 ${
                activePage === 'PRODUCT'
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Product
            </button>

            <button
              onClick={() => onNavigate('ENGINE')}
              className={`hover:text-white transition whitespace-nowrap py-1 flex items-center gap-1.5 ${
                activePage === 'ENGINE'
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              <span>Live Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            <button
              onClick={() => onNavigate('PRICING')}
              className={`hover:text-white transition whitespace-nowrap py-1 ${
                activePage === 'PRICING'
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => onNavigate('PROFILE')}
              className={`hover:text-white transition whitespace-nowrap py-1 ${
                activePage === 'PROFILE'
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              Company Profile
            </button>

            <button
              onClick={onOpenHelp}
              className="text-slate-400 hover:text-slate-200 transition whitespace-nowrap py-1"
            >
              IFRS 16 Standard
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {activePage !== 'ENGINE' ? (
              <button
                onClick={() => onNavigate('ENGINE')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-xs whitespace-nowrap"
              >
                <span>Launch Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : calcResult ? (
              <button
                onClick={() => exportCalculationToExcel(calcResult)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-xs whitespace-nowrap"
                title="Export complete 6-sheet audit model to Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel (.xlsx)</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
