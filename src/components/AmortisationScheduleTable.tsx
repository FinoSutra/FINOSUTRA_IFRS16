import React, { useState } from 'react';
import { AmortisationLine } from '../types/ifrs16.ts';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

import { formatAccountingNumber } from '../utils/formatters.ts';

interface AmortisationScheduleTableProps {
  schedule: AmortisationLine[];
  currency: string;
}

export const AmortisationScheduleTable: React.FC<AmortisationScheduleTableProps> = ({
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

  const totalInterest = schedule.reduce((s, r) => s + r.interestExpense, 0);
  const totalPayments = schedule.reduce((s, r) => s + r.paymentAmount, 0);
  const totalPrincipal = schedule.reduce((s, r) => s + r.principalRepayment, 0);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Lease Liability Amortisation Schedule (IFRS 16.36)
          </h3>
          <p className="text-xs text-slate-500">
            Subsequent measurement at amortised cost using effective interest rate.
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
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
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
              <th className="py-2.5 px-3 w-28">Payment Date</th>
              <th className="py-2.5 px-3 text-right">Opening Liability ({currency})</th>
              <th className="py-2.5 px-3 text-right">Interest Expense ({currency})</th>
              <th className="py-2.5 px-3 text-right">Cash Payment ({currency})</th>
              <th className="py-2.5 px-3 text-right">Principal Reduction ({currency})</th>
              <th className="py-2.5 px-3 text-right">Closing Liability ({currency})</th>
              <th className="py-2.5 px-3 text-center">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {paginated.map((row) => (
              <tr 
                key={row.periodIndex} 
                className={`hover:bg-blue-50/30 transition ${
                  row.isRentFree ? 'bg-amber-50/30' : row.isAdvancePeriod1 ? 'bg-indigo-50/20' : ''
                }`}
              >
                <td className="py-2 px-3 text-center font-sans font-medium text-slate-600">
                  #{row.periodIndex}
                </td>
                <td className="py-2 px-3 text-slate-700 font-sans">
                  {row.periodDate}
                </td>
                <td className="py-2 px-3 text-right text-slate-800">
                  {formatNumber(row.openingLiability)}
                </td>
                <td className="py-2 px-3 text-right text-amber-700 font-medium">
                  {formatNumber(row.interestExpense)}
                </td>
                <td className="py-2 px-3 text-right text-slate-900 font-semibold">
                  {formatNumber(row.paymentAmount)}
                </td>
                <td className="py-2 px-3 text-right text-blue-700">
                  {formatNumber(row.principalRepayment)}
                </td>
                <td className="py-2 px-3 text-right font-bold text-slate-900">
                  {formatNumber(row.closingLiability)}
                </td>
                <td className="py-2 px-3 text-center font-sans">
                  {row.isRentFree && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                      Rent-Free
                    </span>
                  )}
                  {row.isAdvancePeriod1 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium">
                      Day-1 Advance
                    </span>
                  )}
                  {row.closingLiability === 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Fully Amortised
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Table Summary Footer */}
          <tfoot>
            <tr className="bg-slate-100 font-semibold text-slate-900 border-t-2 border-slate-300 font-mono text-xs">
              <td colSpan={3} className="py-2.5 px-3 font-sans text-right">
                SCHEDULE TOTALS:
              </td>
              <td className="py-2.5 px-3 text-right text-amber-800 font-bold">
                {formatNumber(totalInterest)}
              </td>
              <td className="py-2.5 px-3 text-right text-slate-900 font-bold">
                {formatNumber(totalPayments)}
              </td>
              <td className="py-2.5 px-3 text-right text-blue-800 font-bold">
                {formatNumber(totalPrincipal)}
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                {formatNumber(0.00)}
              </td>
              <td></td>
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
