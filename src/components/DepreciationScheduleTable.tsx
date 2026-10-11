import React, { useState } from 'react';
import { DepreciationLine } from '../types/ifrs16.ts';
import { Search } from 'lucide-react';

import { formatAccountingNumber } from '../utils/formatters.ts';

interface DepreciationScheduleTableProps {
  schedule: DepreciationLine[];
  currency: string;
}

export const DepreciationScheduleTable: React.FC<DepreciationScheduleTableProps> = ({
  schedule,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const formatNumber = (val: number) => formatAccountingNumber(val, currency);

  const filtered = schedule.filter(
    (line) =>
      line.periodIndex.toString().includes(searchTerm) ||
      line.periodDate.includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalDepreciation = schedule.reduce((s, r) => s + r.depreciationCharge, 0);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Right-of-Use Asset Depreciation Schedule (IFRS 16.31–32)
          </h3>
          <p className="text-xs text-slate-500">
            Straight-line depreciation of capitalised ROU asset over the effective lease term.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search period or date..."
              className="text-xs pl-8 pr-3 py-1.5 border rounded-md border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
            {schedule.length} Periods Total
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold">
              <th className="py-2.5 px-3 w-16 text-center">Period</th>
              <th className="py-2.5 px-3 w-28">Date</th>
              <th className="py-2.5 px-3 text-right">Gross Cost ({currency})</th>
              <th className="py-2.5 px-3 text-right">Opening Acc. Dep. ({currency})</th>
              <th className="py-2.5 px-3 text-right">Opening NBV ({currency})</th>
              <th className="py-2.5 px-3 text-right">Depreciation Charge ({currency})</th>
              <th className="py-2.5 px-3 text-right">Closing Acc. Dep. ({currency})</th>
              <th className="py-2.5 px-3 text-right">Closing Net Book Value ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {paginated.map((row) => (
              <tr key={row.periodIndex} className="hover:bg-blue-50/30 transition">
                <td className="py-2 px-3 text-center font-sans font-medium text-slate-600">
                  #{row.periodIndex}
                </td>
                <td className="py-2 px-3 text-slate-700 font-sans">
                  {row.periodDate}
                </td>
                <td className="py-2 px-3 text-right text-slate-800">
                  {formatNumber(row.openingCost)}
                </td>
                <td className="py-2 px-3 text-right text-slate-600">
                  {formatNumber(row.openingAccumulatedDepreciation)}
                </td>
                <td className="py-2 px-3 text-right text-slate-800">
                  {formatNumber(row.openingNetBookValue)}
                </td>
                <td className="py-2 px-3 text-right text-indigo-700 font-medium">
                  {formatNumber(row.depreciationCharge)}
                </td>
                <td className="py-2 px-3 text-right text-slate-700">
                  {formatNumber(row.closingAccumulatedDepreciation)}
                </td>
                <td className="py-2 px-3 text-right font-bold text-slate-900">
                  {formatNumber(row.closingNetBookValue)}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Table Summary Footer */}
          <tfoot>
            <tr className="bg-slate-100 font-semibold text-slate-900 border-t-2 border-slate-300 font-mono text-xs">
              <td colSpan={5} className="py-2.5 px-3 font-sans text-right">
                TOTAL DEPRECIATION EXPENSE:
              </td>
              <td className="py-2.5 px-3 text-right text-indigo-800 font-bold">
                {formatNumber(totalDepreciation)}
              </td>
              <td colSpan={2} className="py-2.5 px-3 text-right text-emerald-700 font-bold font-sans">
                Fully Depreciated at Expiry ($0.00 NBV)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} periods
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 py-1 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
