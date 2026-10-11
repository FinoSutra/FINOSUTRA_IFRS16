import React, { useState } from 'react';
import { JournalEntry } from '../types/ifrs16.ts';
import { BookMarked, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

import { formatAccountingNumber } from '../utils/formatters.ts';

interface JournalEntriesViewProps {
  entries: JournalEntry[];
  currency: string;
}

export const JournalEntriesView: React.FC<JournalEntriesViewProps> = ({
  entries,
  currency,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    entries[0]?.entryId || 'JRN-001'
  );

  const activeEntry = entries.find((e) => e.entryId === selectedEntryId) || entries[0];

  const formatNumber = (val: number) => formatAccountingNumber(val, currency);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-blue-600" />
            General Ledger Double-Entry Journals (IAS 1 & IFRS 16)
          </h3>
          <p className="text-xs text-slate-500">
            Audit-ready journal vouchers with posting dates, standard chart of accounts, and narrations.
          </p>
        </div>

        {/* Entry Selector Tabs */}
        <div className="flex gap-1.5 bg-slate-200/70 p-1 rounded-lg">
          {entries.map((entry) => (
            <button
              key={entry.entryId}
              onClick={() => setSelectedEntryId(entry.entryId)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                selectedEntryId === entry.entryId
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {entry.entryType === 'INITIAL_RECOGNITION' && 'Day-1 Initial'}
              {entry.entryType === 'SUBSEQUENT_MEASUREMENT' && 'Period Subsequent'}
              {entry.entryType === 'ANNUAL_SUMMARY' && 'Cumulative Summary'}
            </button>
          ))}
        </div>
      </div>

      {/* Active Entry Detail Card */}
      {activeEntry && (
        <div className="p-5">
          {/* Metadata Card */}
          <div className="mb-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 font-mono bg-slate-200 px-2 py-0.5 rounded">
                  {activeEntry.entryId}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  Posting Date: <strong>{activeEntry.postingDate}</strong>
                </span>
                {activeEntry.periodIndex && (
                  <span className="text-xs text-blue-700 font-medium">
                    (Period #{activeEntry.periodIndex})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 italic">
                {activeEntry.narration}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${
                  activeEntry.isBalanced
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {activeEntry.isBalanced ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Double-Entry Balanced
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    Unbalanced Entry
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-24">Account Code</th>
                  <th className="py-2.5 px-3">Account Name & Description</th>
                  <th className="py-2.5 px-3 text-right w-36">Debit ({currency})</th>
                  <th className="py-2.5 px-3 text-right w-36">Credit ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeEntry.lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                      {line.accountCode}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{line.accountName}</div>
                      <div className="text-[11px] text-slate-500">{line.description}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {line.debit > 0 ? formatNumber(line.debit) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {line.credit > 0 ? formatNumber(line.credit) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 font-mono text-xs">
                  <td colSpan={2} className="py-2.5 px-3 font-sans text-right">
                    TOTAL DEBIT & CREDIT:
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-900 font-bold">
                    {formatNumber(activeEntry.totalDebit)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-900 font-bold">
                    {formatNumber(activeEntry.totalCredit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
