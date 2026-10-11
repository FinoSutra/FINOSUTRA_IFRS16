/**
 * Finosutra IFRS 16 SaaS — Design Style Themes
 * Enterprise financial visual languages adhering to the frontend-design constitution
 */

export type DesignThemeId = 
  | 'CORPORATE_NAVY' 
  | 'SWISS_EDITORIAL' 
  | 'OBSIDIAN_FINTECH' 
  | 'NORDIC_MINIMAL';

export interface DesignTheme {
  id: DesignThemeId;
  name: string;
  tagline: string;
  description: string;
  targetAudience: string;
  palette: {
    primaryBg: string;
    surfaceBg: string;
    headerBg: string;
    border: string;
    primaryText: string;
    secondaryText: string;
    accent: string;
    accentBg: string;
    success: string;
    warning: string;
  };
  fontDisplay: string;
  tableDensity: 'compact' | 'relaxed';
}

export const DESIGN_THEMES: Record<DesignThemeId, DesignTheme> = {
  CORPORATE_NAVY: {
    id: 'CORPORATE_NAVY',
    name: '1. Big 4 Audit Trust',
    tagline: 'Deep Navy & Crisp Slate with Cobalt Accent',
    description: 'The global standard for Big 4 audit and corporate financial reporting (PwC, EY, Deloitte, KPMG). Clean slate canvas, authoritative deep navy headers, and sharp hairline data boundaries.',
    targetAudience: 'Financial Controllers, Group Reporting Directors, External Auditors',
    palette: {
      primaryBg: 'bg-slate-100/80',
      surfaceBg: 'bg-white',
      headerBg: 'bg-slate-900',
      border: 'border-slate-200',
      primaryText: 'text-slate-900',
      secondaryText: 'text-slate-500',
      accent: 'text-blue-600',
      accentBg: 'bg-blue-600',
      success: 'text-emerald-700',
      warning: 'text-amber-700',
    },
    fontDisplay: 'sans',
    tableDensity: 'compact',
  },
  SWISS_EDITORIAL: {
    id: 'SWISS_EDITORIAL',
    name: '2. Swiss Institutional & Private Banking',
    tagline: 'Warm Parchment, Deep Charcoal & Forest Emerald',
    description: 'Inspired by Zurich private wealth institutions and the Financial Times. Warm off-white canvas, deep charcoal serif accents, and conservative British racing green accents for balanced ledgers.',
    targetAudience: 'Family Offices, Asset Management Firms, European Financial Institutions',
    palette: {
      primaryBg: 'bg-[#F9F8F6]',
      surfaceBg: 'bg-white',
      headerBg: 'bg-[#1C1917]',
      border: 'border-[#E7E5E4]',
      primaryText: 'text-[#1C1917]',
      secondaryText: 'text-[#78716C]',
      accent: 'text-[#047857]',
      accentBg: 'bg-[#047857]',
      success: 'text-[#065F46]',
      warning: 'text-[#B45309]',
    },
    fontDisplay: 'serif',
    tableDensity: 'compact',
  },
  OBSIDIAN_FINTECH: {
    id: 'OBSIDIAN_FINTECH',
    name: '3. Treasury Terminal / Dark Obsidian',
    tagline: 'Deep Midnight Slate & High-Contrast Monospace',
    description: 'Designed for high-volume treasury analysts and financial engineers (Bloomberg Terminal / FactSet / Linear modern dark mode). Deep dark canvas preventing eye fatigue during extensive reporting cycles.',
    targetAudience: 'Corporate Treasurers, Financial Modelers, Quantitative Analysts',
    palette: {
      primaryBg: 'bg-[#090D16]',
      surfaceBg: 'bg-[#111827]',
      headerBg: 'bg-[#030712]',
      border: 'border-slate-800',
      primaryText: 'text-slate-100',
      secondaryText: 'text-slate-400',
      accent: 'text-sky-400',
      accentBg: 'bg-sky-500',
      success: 'text-emerald-400',
      warning: 'text-amber-400',
    },
    fontDisplay: 'mono',
    tableDensity: 'compact',
  },
  NORDIC_MINIMAL: {
    id: 'NORDIC_MINIMAL',
    name: '4. Nordic Clean Cloud SaaS',
    tagline: 'Pure White, Soft Mist & Ultra-Clean Typography',
    description: 'Clean Scandinavian enterprise aesthetic (similar to Carta, Pleo, or Workday Financials). Generous breathable margins, gentle flat borders, and ultramarine primary highlights.',
    targetAudience: 'Modern Tech CFOs, Scale-up Finance Teams, Modern SaaS Accounting',
    palette: {
      primaryBg: 'bg-[#F8FAFC]',
      surfaceBg: 'bg-white',
      headerBg: 'bg-white',
      border: 'border-slate-200',
      primaryText: 'text-slate-900',
      secondaryText: 'text-slate-500',
      accent: 'text-indigo-600',
      accentBg: 'bg-indigo-600',
      success: 'text-teal-700',
      warning: 'text-orange-700',
    },
    fontDisplay: 'sans',
    tableDensity: 'relaxed',
  },
};
