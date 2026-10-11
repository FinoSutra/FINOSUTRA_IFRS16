/**
 * Finosutra IFRS 16 SaaS — Consolidated Portfolio Big 4 Excel Export Service
 * Produces an institutional-grade multi-sheet consolidated group audit model (.xlsx)
 * covering portfolio registers, entity breakdowns, asset class roll-forwards, and IFRS 16 note disclosures.
 */

import ExcelJS from 'exceljs';
import { LeasePortfolioItem, PortfolioConsolidatedMetrics, OrganizationEntity } from '../types/portfolio.ts';

const COLORS = {
  NAVY_HEADER: '0F2942',
  NAVY_SUBHEADER: '1E293B',
  BLUE_ACCENT: '1E3A8A',
  BLUE_LIGHT: 'EFF6FF',
  SLATE_ZEBRA: 'F8FAFC',
  BORDER_GRAY: 'CBD5E1',
  BORDER_DARK: '64748B',
  TOTAL_BG: 'F1F5F9',
  EMERALD_BG: 'ECFDF5',
  EMERALD_TEXT: '065F46',
  AMBER_BG: 'FEF3C7',
  AMBER_TEXT: '92400E',
  WHITE_TEXT: 'FFFFFF',
  DARK_TEXT: '0F172A',
  MUTED_TEXT: '64748B'
};

const FONT_FAMILY = 'Segoe UI';

export async function exportPortfolioConsolidationToExcel(
  leases: LeasePortfolioItem[],
  metrics: PortfolioConsolidatedMetrics,
  entities: OrganizationEntity[],
  activeEntityName: string = 'All Consolidated Entities'
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Finosutra IFRS 16 SaaS Platform';
  workbook.lastModifiedBy = 'Group Financial Controller';
  workbook.created = new Date();
  workbook.properties.date1904 = false;

  const currentDate = new Date().toISOString().split('T')[0];
  const numFmt = `#,##0.00;(#,##0.00);"-"`;

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: COLORS.BORDER_GRAY } },
    bottom: { style: 'thin', color: { argb: COLORS.BORDER_GRAY } },
    left: { style: 'thin', color: { argb: COLORS.BORDER_GRAY } },
    right: { style: 'thin', color: { argb: COLORS.BORDER_GRAY } }
  };

  const doubleBottomBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: COLORS.BORDER_DARK } },
    bottom: { style: 'double', color: { argb: COLORS.NAVY_HEADER } },
    left: { style: 'thin', color: { argb: COLORS.BORDER_GRAY } },
    right: { style: 'thin', color: { argb: COLORS.BORDER_GRAY } }
  };

  // ==========================================
  // SHEET 1: EXECUTIVE PORTFOLIO SUMMARY
  // ==========================================
  const wsSummary = workbook.addWorksheet('Portfolio Summary', {
    views: [{ showGridLines: true }]
  });
  wsSummary.columns = [
    { width: 5 },
    { width: 36 },
    { width: 22 },
    { width: 22 },
    { width: 32 }
  ];

  // Header Banner
  wsSummary.mergeCells('B2:E2');
  const titleCell = wsSummary.getCell('B2');
  titleCell.value = 'FINOSUTRA IFRS 16 LEASE ACCOUNTING — CONSOLIDATED PORTFOLIO WORKPAPER';
  titleCell.font = { name: FONT_FAMILY, size: 14, bold: true, color: { argb: COLORS.WHITE_TEXT } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_HEADER } };
  titleCell.alignment = { vertical: 'middle', indent: 1 };
  wsSummary.getRow(2).height = 36;

  // Metadata block
  const metaRows = [
    ['Reporting Entity / Group Scope:', activeEntityName],
    ['Standard Basis of Preparation:', 'IFRS 16 (Leases) & IAS 1 Presentation of Financial Statements'],
    ['Consolidation Currency:', 'USD (Arbitrary Precision Decimal Engine)'],
    ['Total Lease Contracts in Scope:', `${metrics.totalLeasesCount} Contracts (${metrics.activeLeasesCount} Active/Approved)`],
    ['Audit Reconciliation Integrity:', metrics.allAuditsPassed ? '100% MATHEMATICALLY RECONCILED (NO EXCEPTIONS)' : 'ATTENTION: EXCEPTIONS NOTED'],
    ['Workpaper Generation Date:', currentDate]
  ];

  let curRow = 4;
  metaRows.forEach(([lbl, val]) => {
    wsSummary.getCell(`B${curRow}`).value = lbl;
    wsSummary.getCell(`B${curRow}`).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_SUBHEADER } };
    wsSummary.mergeCells(`C${curRow}:E${curRow}`);
    const vCell = wsSummary.getCell(`C${curRow}`);
    vCell.value = val;
    vCell.font = { name: FONT_FAMILY, size: 10, color: { argb: COLORS.DARK_TEXT } };
    curRow++;
  });

  curRow += 1;

  // Key Balance Sheet Metrics Table
  wsSummary.mergeCells(`B${curRow}:E${curRow}`);
  const kpiH = wsSummary.getCell(`B${curRow}`);
  kpiH.value = '1. CONSOLIDATED STATEMENT OF FINANCIAL POSITION (LEASES)';
  kpiH.font = { name: FONT_FAMILY, size: 11, bold: true, color: { argb: COLORS.WHITE_TEXT } };
  kpiH.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_SUBHEADER } };
  curRow++;

  const kpiItems = [
    ['Total Consolidated Right-of-Use (ROU) Assets (Carrying Amount)', metrics.totalROUAssetClosing],
    ['Total Consolidated Lease Liabilities (Carrying Amount)', metrics.totalLeaseLiabilityClosing],
    ['  - Current Portion of Lease Liabilities (Due within 12 Months)', metrics.totalCurrentLiability],
    ['  - Non-Current Portion of Lease Liabilities (Due after 12 Months)', metrics.totalNonCurrentLiability],
    ['Consolidated Net Working Capital Impact (Current Liabilities)', -metrics.totalCurrentLiability],
    ['Total Undiscounted Future Contractual Lease Commitments', metrics.totalUndiscountedFutureCashFlows],
    ['Consolidated Unearned Finance Cost (Effect of Discounting)', metrics.totalUndiscountedFutureCashFlows - metrics.totalLeaseLiabilityClosing]
  ];

  kpiItems.forEach(([label, val]) => {
    const isSub = String(label).startsWith('  -');
    wsSummary.mergeCells(`B${curRow}:C${curRow}`);
    const lCell = wsSummary.getCell(`B${curRow}`);
    lCell.value = String(label);
    lCell.font = { name: FONT_FAMILY, size: 10, bold: !isSub, color: { argb: COLORS.DARK_TEXT } };
    lCell.border = thinBorder;

    wsSummary.mergeCells(`D${curRow}:E${curRow}`);
    const valCell = wsSummary.getCell(`D${curRow}`);
    valCell.value = val;
    valCell.numFmt = numFmt;
    valCell.font = { name: FONT_FAMILY, size: 10, bold: !isSub, color: { argb: COLORS.DARK_TEXT } };
    valCell.border = thinBorder;
    valCell.alignment = { horizontal: 'right' };
    curRow++;
  });

  curRow += 1;

  // P&L & Cash Flow Metrics Table
  wsSummary.mergeCells(`B${curRow}:E${curRow}`);
  const plH = wsSummary.getCell(`B${curRow}`);
  plH.value = '2. ANNUAL CONSOLIDATED PROFIT OR LOSS & CASH FLOW IMPACT';
  plH.font = { name: FONT_FAMILY, size: 11, bold: true, color: { argb: COLORS.WHITE_TEXT } };
  plH.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_SUBHEADER } };
  curRow++;

  const plItems = [
    ['Annual Depreciation Charge on ROU Assets (Operating Expense)', metrics.totalAnnualDepreciation],
    ['Annual Interest Expense on Lease Liabilities (Finance Cost)', metrics.totalAnnualInterestExpense],
    ['Total Annual IFRS 16 Expense Recognized in Profit or Loss', metrics.totalAnnualPLCharge],
    ['Weighted Average Incremental Borrowing Rate (IBR)', `${metrics.weightedAverageIBR.toFixed(2)}% per annum`]
  ];

  plItems.forEach(([lbl, val]) => {
    wsSummary.mergeCells(`B${curRow}:C${curRow}`);
    const lCell = wsSummary.getCell(`B${curRow}`);
    lCell.value = lbl;
    lCell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.DARK_TEXT } };
    lCell.border = thinBorder;

    wsSummary.mergeCells(`D${curRow}:E${curRow}`);
    const valCell = wsSummary.getCell(`D${curRow}`);
    if (typeof val === 'number') {
      valCell.value = val;
      valCell.numFmt = numFmt;
    } else {
      valCell.value = val;
    }
    valCell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.DARK_TEXT } };
    valCell.border = thinBorder;
    valCell.alignment = { horizontal: 'right' };
    curRow++;
  });

  // ==========================================
  // SHEET 2: CONSOLIDATED LEASE REGISTER
  // ==========================================
  const wsRegister = workbook.addWorksheet('Lease Register', {
    views: [{ showGridLines: true }]
  });
  wsRegister.columns = [
    { width: 4 },
    { width: 16 }, // Ref
    { width: 34 }, // Desc
    { width: 26 }, // Entity
    { width: 22 }, // Asset Class
    { width: 14 }, // Start
    { width: 14 }, // End
    { width: 12 }, // Freq
    { width: 12 }, // Rate %
    { width: 18 }, // ROU Asset
    { width: 18 }, // Lease Liab
    { width: 18 }, // Current Liab
    { width: 18 }, // Non-Current
    { width: 14 }  // Status
  ];

  // Title
  wsRegister.mergeCells('B2:N2');
  const regTitle = wsRegister.getCell('B2');
  regTitle.value = 'CONSOLIDATED LEASE REGISTER & BALANCE SHEET SCHEDULE (ALL IN-SCOPE CONTRACTS)';
  regTitle.font = { name: FONT_FAMILY, size: 13, bold: true, color: { argb: COLORS.WHITE_TEXT } };
  regTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_HEADER } };
  regTitle.alignment = { vertical: 'middle', indent: 1 };
  wsRegister.getRow(2).height = 30;

  // Header row
  const regHeaders = [
    'Lease Ref',
    'Contract Description',
    'Reporting Entity',
    'Asset Class',
    'Commencement',
    'End Date',
    'Frequency',
    'IBR (%)',
    'ROU Asset (Closing)',
    'Lease Liability',
    'Current Portion',
    'Non-Current',
    'Lifecycle Status'
  ];

  const hRow = wsRegister.getRow(4);
  hRow.height = 24;
  regHeaders.forEach((txt, idx) => {
    const cell = hRow.getCell(idx + 2);
    cell.value = txt;
    cell.font = { name: FONT_FAMILY, size: 9.5, bold: true, color: { argb: COLORS.WHITE_TEXT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_SUBHEADER } };
    cell.alignment = { vertical: 'middle', horizontal: idx >= 7 && idx <= 11 ? 'right' : 'left' };
    cell.border = thinBorder;
  });

  let rRow = 5;
  leases.forEach((lease, i) => {
    const res = lease.calcResult;
    const row = wsRegister.getRow(rRow);
    row.height = 20;
    const isZebra = i % 2 === 1;

    const values = [
      lease.leaseReference,
      lease.leaseDescription,
      lease.entityName,
      lease.assetClass.replace(/_/g, ' '),
      lease.input.commencementDate,
      lease.input.contractEndDate,
      lease.input.paymentFrequency,
      lease.input.annualDiscountRate / 100,
      res?.reportingBalances.rouAssetNetBookValue || 0,
      res?.reportingBalances.totalLeaseLiability || 0,
      res?.reportingBalances.currentLeaseLiability || 0,
      res?.reportingBalances.nonCurrentLeaseLiability || 0,
      lease.status
    ];

    values.forEach((v, idx) => {
      const cell = row.getCell(idx + 2);
      cell.value = v;
      cell.font = { name: FONT_FAMILY, size: 9.5, color: { argb: COLORS.DARK_TEXT } };
      cell.border = thinBorder;
      if (isZebra) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_ZEBRA } };
      }

      if (idx === 7) {
        cell.numFmt = '0.00%';
        cell.alignment = { horizontal: 'right' };
      } else if (idx >= 8 && idx <= 11) {
        cell.numFmt = numFmt;
        cell.alignment = { horizontal: 'right' };
      }
    });

    rRow++;
  });

  // Total Row
  const totRow = wsRegister.getRow(rRow);
  totRow.height = 24;
  totRow.getCell(2).value = 'CONSOLIDATED TOTAL';
  totRow.getCell(2).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
  for (let c = 2; c <= 9; c++) {
    totRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.TOTAL_BG } };
    totRow.getCell(c).border = doubleBottomBorder;
  }

  const sumCols = [10, 11, 12, 13];
  sumCols.forEach((colIdx) => {
    const colLetter = String.fromCharCode(64 + colIdx);
    const cell = totRow.getCell(colIdx);
    cell.value = { formula: `SUM(${colLetter}5:${colLetter}${rRow - 1})` };
    cell.numFmt = numFmt;
    cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.TOTAL_BG } };
    cell.border = doubleBottomBorder;
    cell.alignment = { horizontal: 'right' };
  });

  // ==========================================
  // SHEET 3: ASSET CLASS ROLL-FORWARD
  // ==========================================
  const wsAsset = workbook.addWorksheet('Asset Class Disclosures', {
    views: [{ showGridLines: true }]
  });
  wsAsset.columns = [
    { width: 5 },
    { width: 28 },
    { width: 14 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 }
  ];

  wsAsset.mergeCells('B2:H2');
  const aTitle = wsAsset.getCell('B2');
  aTitle.value = 'IFRS 16.53 DISCLOSURE — RIGHT-OF-USE ASSETS & LIABILITIES BY UNDERLYING CLASS';
  aTitle.font = { name: FONT_FAMILY, size: 13, bold: true, color: { argb: COLORS.WHITE_TEXT } };
  aTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_HEADER } };
  wsAsset.getRow(2).height = 30;

  const aHeaders = [
    'Underlying Asset Class',
    'Contracts',
    'ROU Carrying Amount',
    'Lease Liability',
    'Current Portion',
    'Non-Current Portion',
    'Annual Depreciation'
  ];

  const ahRow = wsAsset.getRow(4);
  ahRow.height = 22;
  aHeaders.forEach((t, i) => {
    const cell = ahRow.getCell(i + 2);
    cell.value = t;
    cell.font = { name: FONT_FAMILY, size: 9.5, bold: true, color: { argb: COLORS.WHITE_TEXT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_SUBHEADER } };
    cell.border = thinBorder;
    cell.alignment = { horizontal: i >= 2 ? 'right' : 'left' };
  });

  let aRow = 5;
  Object.entries(metrics.byAssetClass).forEach(([k, v]) => {
    if (v.count === 0) return;
    const row = wsAsset.getRow(aRow);
    row.height = 20;
    const vals = [
      k.replace(/_/g, ' '),
      v.count,
      v.rouAsset,
      v.leaseLiability,
      v.currentLiability,
      v.nonCurrentLiability,
      v.annualDepreciation
    ];
    vals.forEach((x, i) => {
      const cell = row.getCell(i + 2);
      cell.value = x;
      cell.font = { name: FONT_FAMILY, size: 9.5, color: { argb: COLORS.DARK_TEXT } };
      cell.border = thinBorder;
      if (i >= 2) {
        cell.numFmt = numFmt;
        cell.alignment = { horizontal: 'right' };
      }
    });
    aRow++;
  });

  // Total
  const aTot = wsAsset.getRow(aRow);
  aTot.height = 24;
  aTot.getCell(2).value = 'TOTAL ASSET DISCLOSURE';
  aTot.getCell(2).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
  for (let c = 2; c <= 8; c++) {
    aTot.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.TOTAL_BG } };
    aTot.getCell(c).border = doubleBottomBorder;
  }
  [4, 5, 6, 7, 8].forEach((cIdx) => {
    const colL = String.fromCharCode(64 + cIdx);
    const cell = aTot.getCell(cIdx);
    cell.value = { formula: `SUM(${colL}5:${colL}${aRow - 1})` };
    cell.numFmt = numFmt;
    cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
    cell.alignment = { horizontal: 'right' };
  });

  // ==========================================
  // SHEET 4: CONSOLIDATED MATURITY ANALYSIS
  // ==========================================
  const wsMaturity = workbook.addWorksheet('Maturity Analysis', {
    views: [{ showGridLines: true }]
  });
  wsMaturity.columns = [
    { width: 5 },
    { width: 34 },
    { width: 24 },
    { width: 24 },
    { width: 30 }
  ];

  wsMaturity.mergeCells('B2:E2');
  const mTitle = wsMaturity.getCell('B2');
  mTitle.value = 'IFRS 16.58 MATURITY ANALYSIS — UNDISCOUNTED CONTRACTUAL LEASE COMMITMENTS';
  mTitle.font = { name: FONT_FAMILY, size: 13, bold: true, color: { argb: COLORS.WHITE_TEXT } };
  mTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_HEADER } };
  wsMaturity.getRow(2).height = 30;

  const mHeaders = ['Contractual Maturity Time Band', 'Undiscounted Cash Outflow', '% of Total Outflows', 'Accounting Notes'];
  const mhRow = wsMaturity.getRow(4);
  mhRow.height = 22;
  mHeaders.forEach((h, i) => {
    const cell = mhRow.getCell(i + 2);
    cell.value = h;
    cell.font = { name: FONT_FAMILY, size: 9.5, bold: true, color: { argb: COLORS.WHITE_TEXT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_SUBHEADER } };
    cell.border = thinBorder;
    cell.alignment = { horizontal: i === 1 || i === 2 ? 'right' : 'left' };
  });

  const totM = metrics.consolidatedMaturity.totalUndiscounted || 1;
  const mRows = [
    ['Within 1 Year (Next 12 Months)', metrics.consolidatedMaturity.year1, 'Current liquidity commitment'],
    ['Between 1 and 2 Years', metrics.consolidatedMaturity.year2, 'Medium-term commitment'],
    ['Between 2 and 3 Years', metrics.consolidatedMaturity.year3, 'Medium-term commitment'],
    ['Between 3 and 4 Years', metrics.consolidatedMaturity.year4, 'Medium-term commitment'],
    ['Between 4 and 5 Years', metrics.consolidatedMaturity.year5, 'Long-term commitment'],
    ['Later than 5 Years', metrics.consolidatedMaturity.after5Years, 'Long-term property & warehouse contracts']
  ];

  let mRowIdx = 5;
  mRows.forEach(([band, val, note]) => {
    const row = wsMaturity.getRow(mRowIdx);
    row.height = 20;

    row.getCell(2).value = band;
    row.getCell(2).font = { name: FONT_FAMILY, size: 9.5, color: { argb: COLORS.DARK_TEXT } };
    row.getCell(2).border = thinBorder;

    const valCell = row.getCell(3);
    valCell.value = val;
    valCell.numFmt = numFmt;
    valCell.font = { name: FONT_FAMILY, size: 9.5, color: { argb: COLORS.DARK_TEXT } };
    valCell.border = thinBorder;
    valCell.alignment = { horizontal: 'right' };

    const pctCell = row.getCell(4);
    pctCell.value = (val as number) / totM;
    pctCell.numFmt = '0.0%';
    pctCell.font = { name: FONT_FAMILY, size: 9.5, color: { argb: COLORS.DARK_TEXT } };
    pctCell.border = thinBorder;
    pctCell.alignment = { horizontal: 'right' };

    row.getCell(5).value = note;
    row.getCell(5).font = { name: FONT_FAMILY, size: 9, color: { argb: COLORS.MUTED_TEXT } };
    row.getCell(5).border = thinBorder;

    mRowIdx++;
  });

  // Reconciliation Block at bottom of Maturity
  const mTotRow = wsMaturity.getRow(mRowIdx);
  mTotRow.height = 24;
  mTotRow.getCell(2).value = 'Total Undiscounted Contractual Cash Flows';
  mTotRow.getCell(2).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
  mTotRow.getCell(3).value = metrics.consolidatedMaturity.totalUndiscounted;
  mTotRow.getCell(3).numFmt = numFmt;
  mTotRow.getCell(3).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
  mTotRow.getCell(3).alignment = { horizontal: 'right' };
  mTotRow.getCell(4).value = 1;
  mTotRow.getCell(4).numFmt = '0.0%';
  mTotRow.getCell(4).font = { name: FONT_FAMILY, size: 10, bold: true };
  mTotRow.getCell(4).alignment = { horizontal: 'right' };
  for (let c = 2; c <= 5; c++) {
    mTotRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.TOTAL_BG } };
    mTotRow.getCell(c).border = thinBorder;
  }
  mRowIdx++;

  const discRow = wsMaturity.getRow(mRowIdx);
  discRow.getCell(2).value = 'Less: Effect of Discounting (Unearned Interest)';
  discRow.getCell(2).font = { name: FONT_FAMILY, size: 9.5, italic: true };
  discRow.getCell(3).value = -metrics.consolidatedMaturity.effectOfDiscounting;
  discRow.getCell(3).numFmt = numFmt;
  discRow.getCell(3).font = { name: FONT_FAMILY, size: 9.5, italic: true };
  discRow.getCell(3).alignment = { horizontal: 'right' };
  for (let c = 2; c <= 5; c++) {
    discRow.getCell(c).border = thinBorder;
  }
  mRowIdx++;

  const pvRow = wsMaturity.getRow(mRowIdx);
  pvRow.height = 24;
  pvRow.getCell(2).value = 'CONSOLIDATED LEASE LIABILITY CARRYING AMOUNT';
  pvRow.getCell(2).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
  pvRow.getCell(3).value = metrics.consolidatedMaturity.totalPresentValue;
  pvRow.getCell(3).numFmt = numFmt;
  pvRow.getCell(3).font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.NAVY_HEADER } };
  pvRow.getCell(3).alignment = { horizontal: 'right' };
  for (let c = 2; c <= 5; c++) {
    pvRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.EMERALD_BG } };
    pvRow.getCell(c).border = doubleBottomBorder;
  }

  // Trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `FINOSUTRA_Consolidated_IFRS16_Portfolio_${currentDate}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
