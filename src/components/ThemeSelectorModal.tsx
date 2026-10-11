import React from 'react';
import { X, Palette, Check, Sparkles, Building, Landmark, Terminal, Cloud } from 'lucide-react';
import { DesignThemeId, DESIGN_THEMES } from '../types/theme.ts';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: DesignThemeId;
  onSelectTheme: (themeId: DesignThemeId) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const getThemeIcon = (id: DesignThemeId) => {
    switch (id) {
      case 'CORPORATE_NAVY':
        return <Building className="w-5 h-5 text-blue-500" />;
      case 'SWISS_EDITORIAL':
        return <Landmark className="w-5 h-5 text-emerald-600" />;
      case 'OBSIDIAN_FINTECH':
        return <Terminal className="w-5 h-5 text-sky-400" />;
      case 'NORDIC_MINIMAL':
        return <Cloud className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Enterprise Design & Color Style Options</h3>
              <p className="text-xs text-slate-400">
                Choose the visual language and typography for your IFRS 16 financial reporting workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Cards for each style option */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Below are four distinct, production-grade enterprise design styles tailored for institutional accounting. Click any option to instantly preview the live application in that style:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(DESIGN_THEMES) as DesignThemeId[]).map((themeKey) => {
              const theme = DESIGN_THEMES[themeKey];
              const isSelected = activeThemeId === themeKey;

              return (
                <div
                  key={themeKey}
                  onClick={() => onSelectTheme(themeKey)}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer text-left relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                      Active Style
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getThemeIcon(themeKey)}
                      <h4 className="text-sm font-bold text-slate-900">{theme.name}</h4>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 mb-1.5">
                      {theme.tagline}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {theme.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Target Audience:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[200px]">
                        {theme.targetAudience}
                      </span>
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">Palette:</span>
                      <div className="flex gap-1 items-center">
                        {themeKey === 'CORPORATE_NAVY' && (
                          <>
                            <span className="w-4 h-4 rounded-full bg-[#0F172A] border border-slate-300" title="Deep Navy" />
                            <span className="w-4 h-4 rounded-full bg-[#2563EB]" title="Cobalt Accent" />
                            <span className="w-4 h-4 rounded-full bg-[#059669]" title="Emerald Proof" />
                            <span className="w-4 h-4 rounded-full bg-[#F1F5F9] border border-slate-300" title="Slate 100 Canvas" />
                          </>
                        )}
                        {themeKey === 'SWISS_EDITORIAL' && (
                          <>
                            <span className="w-4 h-4 rounded-full bg-[#1C1917]" title="Deep Charcoal" />
                            <span className="w-4 h-4 rounded-full bg-[#047857]" title="Forest Emerald" />
                            <span className="w-4 h-4 rounded-full bg-[#B45309]" title="Warm Amber" />
                            <span className="w-4 h-4 rounded-full bg-[#F9F8F6] border border-slate-300" title="Warm Parchment" />
                          </>
                        )}
                        {themeKey === 'OBSIDIAN_FINTECH' && (
                          <>
                            <span className="w-4 h-4 rounded-full bg-[#090D16] border border-slate-600" title="Obsidian Canvas" />
                            <span className="w-4 h-4 rounded-full bg-[#111827] border border-slate-600" title="Dark Card" />
                            <span className="w-4 h-4 rounded-full bg-[#38BDF8]" title="Ice Cyan" />
                            <span className="w-4 h-4 rounded-full bg-[#34D399]" title="Mint Green" />
                          </>
                        )}
                        {themeKey === 'NORDIC_MINIMAL' && (
                          <>
                            <span className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-slate-300" title="Pure White" />
                            <span className="w-4 h-4 rounded-full bg-[#4F46E5]" title="Indigo 600" />
                            <span className="w-4 h-4 rounded-full bg-[#0D9488]" title="Teal Accent" />
                            <span className="w-4 h-4 rounded-full bg-[#F8FAFC] border border-slate-300" title="Soft Mist" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Selected Style: <strong>{DESIGN_THEMES[activeThemeId].name}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
