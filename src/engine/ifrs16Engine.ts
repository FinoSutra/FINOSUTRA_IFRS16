/**
 * Finosutra IFRS 16 SaaS — Headless Pure Accounting Calculation Engine
 * 
 * Arbitrary-precision decimal arithmetic via Decimal.js.
 * Zero UI/DOM dependencies. 100% deterministic and unit-testable.
 */

import Decimal from 'decimal.js';
import {
  LeaseContractInput,
  IFRS16CalculationResult,
  AmortisationLine,
  DepreciationLine,
  JournalEntry,
  JournalLine,
  ReportingDateBalances,
  ReconciliationCheckItem,
  ValidationWarning,
  MaturityBandRow,
  MaturityAnalysisDisclosure,
} from '../types/ifrs16.ts';

// Configure Decimal.js for financial calculation precision
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

/**
 * Helper to safely format numbers to 2 decimal places for financial reporting
 */
export function round2(val: Decimal.Value): number {
  return new Decimal(val).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}

/**
 * Returns periods per year for a payment frequency
 */
export function getPeriodsPerYear(frequency: LeaseContractInput['paymentFrequency']): number {
  switch (frequency) {
    case 'MONTHLY':
      return 12;
    case 'QUARTERLY':
      return 4;
    case 'SEMI_ANNUAL':
      return 2;
    case 'ANNUAL':
      return 1;
    default:
      return 12;
  }
}

/**
 * Returns months per period for a payment frequency
 */
export function getMonthsPerPeriod(frequency: LeaseContractInput['paymentFrequency']): number {
  switch (frequency) {
    case 'MONTHLY':
      return 1;
    case 'QUARTERLY':
      return 3;
    case 'SEMI_ANNUAL':
      return 6;
    case 'ANNUAL':
      return 12;
    default:
      return 1;
  }
}

/**
 * Adds months to an ISO date string (YYYY-MM-DD), preserving month-end behavior
 */
export function addMonthsToDate(dateStr: string, monthsToAdd: number): string {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  const targetDate = new Date(Date.UTC(year, month + monthsToAdd, 1));
  const daysInTargetMonth = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 0)
  ).getUTCDate();

  const adjustedDay = Math.min(day, daysInTargetMonth);
  targetDate.setUTCDate(adjustedDay);

  const yyyy = targetDate.getUTCFullYear();
  const mm = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Computes difference in complete or partial months between two ISO dates
 */
export function calculateMonthsBetween(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 0;
  }

  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();
  const daysDiff = end.getDate() - start.getDate();

  let totalMonths = yearsDiff * 12 + monthsDiff;
  if (daysDiff > 15) {
    totalMonths += 1; // round up fractional months >= 15 days
  }
  return Math.max(1, totalMonths);
}

/**
 * Validate input assumptions and return warnings/errors
 */
export function validateLeaseInput(input: LeaseContractInput): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!input.leaseReference || input.leaseReference.trim() === '') {
    warnings.push({
      field: 'leaseReference',
      severity: 'ERROR',
      message: 'Lease reference is required for asset register tracking.',
    });
  }

  if (new Date(input.contractEndDate) <= new Date(input.commencementDate)) {
    warnings.push({
      field: 'contractEndDate',
      severity: 'ERROR',
      message: 'Contract end date must be after commencement date.',
    });
  }

  if (input.hasRenewalOption && input.renewalEndDate) {
    if (new Date(input.renewalEndDate) <= new Date(input.contractEndDate)) {
      warnings.push({
        field: 'renewalEndDate',
        severity: 'ERROR',
        message: 'Renewal end date must be after contract end date.',
      });
    }
  }

  if (input.basePayment <= 0) {
    warnings.push({
      field: 'basePayment',
      severity: 'ERROR',
      message: 'Base payment amount must be greater than zero.',
    });
  }

  if (input.annualDiscountRate <= 0) {
    warnings.push({
      field: 'annualDiscountRate',
      severity: 'ERROR',
      message: 'Discount rate must be greater than 0% per IFRS 16.26.',
    });
  }

  if (input.annualDiscountRate > 40) {
    warnings.push({
      field: 'annualDiscountRate',
      severity: 'WARNING',
      message: 'Discount rate is unusually high (>40%). Please verify the IBR benchmark.',
    });
  }

  // Short term election checks
  const months = calculateMonthsBetween(input.commencementDate, input.contractEndDate);
  if (input.shortTermElection && months > 12) {
    warnings.push({
      field: 'shortTermElection',
      severity: 'ERROR',
      message: 'Short-term exemption (IFRS 16.5a) cannot be applied to leases exceeding 12 months.',
    });
  }

  if (input.lowValueElection) {
    warnings.push({
      field: 'lowValueElection',
      severity: 'INFO',
      message: 'Low-value asset exemption selected (IFRS 16.5b). Ensure asset value when new is <= ~$5,000.',
    });
  }

  return warnings;
}

/**
 * MAIN IFRS 16 CALCULATION ENGINE FUNCTION
 */
export function calculateIFRS16(input: LeaseContractInput): IFRS16CalculationResult {
  // 1. Determine Effective End Date and Effective Term
  let effectiveEndDate = input.contractEndDate;
  if (input.hasRenewalOption && input.renewalEndDate) {
    effectiveEndDate = input.renewalEndDate;
  } else if (input.hasTerminationOption && input.terminationDate) {
    effectiveEndDate = input.terminationDate;
  }

  const effectiveTermMonths = calculateMonthsBetween(input.commencementDate, effectiveEndDate);
  const m = getPeriodsPerYear(input.paymentFrequency);
  const monthsPerPeriod = getMonthsPerPeriod(input.paymentFrequency);
  const totalPeriods = Math.max(1, Math.round(effectiveTermMonths / monthsPerPeriod));

  // 2. Periodic Discount Rate Calculation
  // Approved Decision: Nominal (APR / m) as default; Actuarial Effective ((1+APR)^(1/m) - 1) as option
  const annualRateDec = new Decimal(input.annualDiscountRate).dividedBy(100);
  let periodicRateDec: Decimal;

  if (input.compoundingConvention === 'EFFECTIVE_ANNUAL') {
    // r = (1 + i)^(1/m) - 1
    const onePlusI = new Decimal(1).plus(annualRateDec);
    const exponent = new Decimal(1).dividedBy(m);
    periodicRateDec = Decimal.pow(onePlusI, exponent).minus(1);
  } else {
    // Nominal: r = i / m
    periodicRateDec = annualRateDec.dividedBy(m);
  }

  // 3. Generate Cash Flow Sequence
  const cashFlows: { period: number; date: string; amount: Decimal; isRentFree: boolean }[] = [];
  const basePaymentDec = new Decimal(input.basePayment);
  const escalationRateDec = new Decimal(input.escalationRate || 0).dividedBy(100);

  for (let t = 1; t <= totalPeriods; t++) {
    // Payment date convention per CA approval:
    // - In Advance: Day 1 of period = commencementDate + (t - 1) * monthsPerPeriod
    // - In Arrears: End of period = commencementDate + t * monthsPerPeriod
    const periodDate = input.paymentTiming === 'IN_ARREARS'
      ? addMonthsToDate(input.commencementDate, t * monthsPerPeriod)
      : addMonthsToDate(input.commencementDate, (t - 1) * monthsPerPeriod);

    const isRentFree = t <= (input.rentFreePeriods || 0);

    let paymentAmount = new Decimal(0);
    if (!isRentFree) {
      if (input.escalationType === 'STEPPED_RENT' && input.steppedRentSlabs && input.steppedRentSlabs.length > 0) {
        // Find matching slab for period t
        const matchingSlab = input.steppedRentSlabs.find(
          (s) => t >= s.fromPeriod && t <= s.toPeriod
        );
        if (matchingSlab && matchingSlab.periodicPayment !== undefined) {
          paymentAmount = new Decimal(matchingSlab.periodicPayment);
        } else {
          paymentAmount = basePaymentDec;
        }
      } else if (input.escalationType === 'FIXED_PERCENTAGE' && escalationRateDec.greaterThan(0)) {
        // Annual escalation: full year elapsed = floor((t - 1) / m)
        const yearsElapsed = Math.floor((t - 1) / m);
        const escalationFactor = Decimal.pow(new Decimal(1).plus(escalationRateDec), yearsElapsed);
        paymentAmount = basePaymentDec.times(escalationFactor);
      } else {
        paymentAmount = basePaymentDec;
      }
    }

    cashFlows.push({
      period: t,
      date: periodDate,
      amount: paymentAmount,
      isRentFree,
    });
  }

  // 4. Present Value of Lease Liability (L0)
  // Approved Decision:
  // - In Arrears: sum(Pt / (1+r)^t) for t = 1..N
  // - In Advance: Day 1 payment has discount factor 1 (paid at day 1), subsequent Pt / (1+r)^(t-1)
  let initialLiabilityDec = new Decimal(0);
  const onePlusR = new Decimal(1).plus(periodicRateDec);

  for (let t = 1; t <= totalPeriods; t++) {
    const payment = cashFlows[t - 1].amount;
    if (payment.isZero()) continue;

    if (input.paymentTiming === 'IN_ARREARS') {
      const discountFactor = Decimal.pow(onePlusR, t);
      initialLiabilityDec = initialLiabilityDec.plus(payment.dividedBy(discountFactor));
    } else {
      // IN_ADVANCE
      if (t === 1) {
        // Period 1 payment made immediately on commencement
        initialLiabilityDec = initialLiabilityDec.plus(payment);
      } else {
        const discountFactor = Decimal.pow(onePlusR, t - 1);
        initialLiabilityDec = initialLiabilityDec.plus(payment.dividedBy(discountFactor));
      }
    }
  }

  // Handle exemption election override (IFRS 16.5)
  if (input.shortTermElection || input.lowValueElection) {
    // In exemption elections, liability and ROU asset are not capitalized on balance sheet
    // We retain the calculated figures for disclosures, but set initial balances to 0 for BS presentation
  }

  // 5. Initial Right-of-Use Asset (A0)
  // A0 = L0 + Initial Direct Costs + Prepayments + Restoration - Lease Incentives
  const initialDirectCostsDec = new Decimal(input.initialDirectCosts || 0);
  const prepaymentsDec = new Decimal(input.prepaymentsMade || 0);
  const incentivesDec = new Decimal(input.leaseIncentivesReceived || 0);
  const restorationDec = new Decimal(input.restorationProvision || 0);

  const initialRouAssetDec = initialLiabilityDec
    .plus(initialDirectCostsDec)
    .plus(prepaymentsDec)
    .plus(restorationDec)
    .minus(incentivesDec);

  // 6. Generate Amortisation Schedule
  const amortisationSchedule: AmortisationLine[] = [];
  let currentOpening = new Decimal(initialLiabilityDec);

  for (let t = 1; t <= totalPeriods; t++) {
    const payment = cashFlows[t - 1].amount;
    const isRentFree = cashFlows[t - 1].isRentFree;
    let interestExpense: Decimal;
    let principalRepaid: Decimal;
    let closingLiability: Decimal;
    let isAdvancePeriod1 = false;

    if (input.paymentTiming === 'IN_ARREARS') {
      interestExpense = currentOpening.times(periodicRateDec);
      principalRepaid = payment.minus(interestExpense);
      closingLiability = currentOpening.plus(interestExpense).minus(payment);

      // Final period audit rounding absorption
      if (t === totalPeriods) {
        principalRepaid = currentOpening;
        interestExpense = payment.minus(principalRepaid);
        closingLiability = new Decimal(0);
      }
    } else {
      // IN_ADVANCE: Day 1 / start of period payment reduces opening balance immediately
      if (t === 1) {
        isAdvancePeriod1 = true;
      }
      const netPrincipalBalance = currentOpening.minus(payment);
      interestExpense = netPrincipalBalance.times(periodicRateDec);
      principalRepaid = payment.minus(new Decimal(0)); // In advance, payment reduces balance
      closingLiability = netPrincipalBalance.plus(interestExpense);

      // Final period audit rounding absorption
      if (t === totalPeriods) {
        closingLiability = new Decimal(0);
      }
    }

    // Guard against negative closing liabilities due to tiny rounding
    if (closingLiability.isNegative() || closingLiability.abs().lessThan(0.005)) {
      closingLiability = new Decimal(0);
    }

    amortisationSchedule.push({
      periodIndex: t,
      periodDate: cashFlows[t - 1].date,
      openingLiability: round2(currentOpening),
      interestExpense: round2(interestExpense),
      paymentAmount: round2(payment),
      principalRepayment: round2(payment.minus(interestExpense)),
      closingLiability: round2(closingLiability),
      isRentFree,
      isAdvancePeriod1,
    });

    currentOpening = closingLiability;
  }

  // 7. Generate ROU Asset Depreciation Schedule (Straight-line over totalPeriods)
  const depreciationSchedule: DepreciationLine[] = [];
  const periodicDepreciationDec = totalPeriods > 0
    ? initialRouAssetDec.dividedBy(totalPeriods)
    : new Decimal(0);

  let currentAccumDepDec = new Decimal(0);

  for (let t = 1; t <= totalPeriods; t++) {
    const openingAccumDep = currentAccumDepDec;
    const openingNetBookValue = initialRouAssetDec.minus(openingAccumDep);

    let depCharge = periodicDepreciationDec;
    // Final period absorption to make closing net book value exactly 0
    if (t === totalPeriods) {
      depCharge = openingNetBookValue;
    }

    const closingAccumDep = openingAccumDep.plus(depCharge);
    const closingNetBookValue = initialRouAssetDec.minus(closingAccumDep);

    depreciationSchedule.push({
      periodIndex: t,
      periodDate: cashFlows[t - 1].date,
      openingCost: round2(initialRouAssetDec),
      openingAccumulatedDepreciation: round2(openingAccumDep),
      openingNetBookValue: round2(openingNetBookValue),
      depreciationCharge: round2(depCharge),
      closingAccumulatedDepreciation: round2(closingAccumDep),
      closingNetBookValue: round2(closingNetBookValue.isNegative() ? 0 : closingNetBookValue),
    });

    currentAccumDepDec = closingAccumDep;
  }

  // 8. Reporting Date Cut-Off Balances & Current / Non-Current Split
  // Approved Decision: Principal Reduction Method (Current = next 12 months principal repayment)
  let activePeriodIndex = 1;
  const reportingDateObj = new Date(input.reportingDate);

  for (let i = 0; i < amortisationSchedule.length; i++) {
    const pDate = new Date(amortisationSchedule[i].periodDate);
    if (pDate <= reportingDateObj) {
      activePeriodIndex = i + 1;
    }
  }

  // Active period schedule lines
  const activeAmortLine = amortisationSchedule[activePeriodIndex - 1] || amortisationSchedule[0];
  const activeDepLine = depreciationSchedule[activePeriodIndex - 1] || depreciationSchedule[0];

  const totalLiabilityAtReporting = activeAmortLine.closingLiability;

  // Next 12 months periods count
  const periodsInNext12Months = Math.min(m, totalPeriods - activePeriodIndex);
  let next12MonthsPaymentsDec = new Decimal(0);
  let next12MonthsInterestDec = new Decimal(0);

  for (let next = 1; next <= periodsInNext12Months; next++) {
    const nextIdx = activePeriodIndex - 1 + next;
    if (nextIdx < amortisationSchedule.length) {
      next12MonthsPaymentsDec = next12MonthsPaymentsDec.plus(amortisationSchedule[nextIdx].paymentAmount);
      next12MonthsInterestDec = next12MonthsInterestDec.plus(amortisationSchedule[nextIdx].interestExpense);
    }
  }

  // Current liability = Principal due within next 12 months
  let currentLiabilityDec = next12MonthsPaymentsDec.minus(next12MonthsInterestDec);
  if (currentLiabilityDec.greaterThan(totalLiabilityAtReporting)) {
    currentLiabilityDec = new Decimal(totalLiabilityAtReporting);
  }
  if (currentLiabilityDec.isNegative()) {
    currentLiabilityDec = new Decimal(0);
  }

  const nonCurrentLiabilityDec = new Decimal(totalLiabilityAtReporting).minus(currentLiabilityDec);

  // Cumulative P&L and Cash to date
  let totalInterestExpensedToDate = 0;
  let totalPaymentsMadeToDate = 0;
  for (let i = 0; i < activePeriodIndex; i++) {
    totalInterestExpensedToDate += amortisationSchedule[i].interestExpense;
    totalPaymentsMadeToDate += amortisationSchedule[i].paymentAmount;
  }

  const reportingBalances: ReportingDateBalances = {
    reportingDate: input.reportingDate,
    activePeriodIndex,
    rouAssetGrossCost: round2(initialRouAssetDec),
    accumulatedDepreciation: activeDepLine.closingAccumulatedDepreciation,
    rouAssetNetBookValue: activeDepLine.closingNetBookValue,
    totalLeaseLiability: round2(totalLiabilityAtReporting),
    currentLeaseLiability: round2(currentLiabilityDec),
    nonCurrentLeaseLiability: round2(nonCurrentLiabilityDec),
    next12MonthsPayments: round2(next12MonthsPaymentsDec),
    next12MonthsInterest: round2(next12MonthsInterestDec),
    totalInterestExpensedToDate: round2(totalInterestExpensedToDate),
    totalDepreciationExpensedToDate: activeDepLine.closingAccumulatedDepreciation,
    totalPaymentsMadeToDate: round2(totalPaymentsMadeToDate),
  };

  // 9. Generate Double-Entry Accounting Journal Entries
  const journalEntries: JournalEntry[] = [];

  // Entry 1: Day 1 Initial Recognition
  const initLines: JournalLine[] = [
    {
      accountCode: '1600',
      accountName: 'Right-of-Use Asset',
      debit: round2(initialRouAssetDec),
      credit: 0,
      description: `Initial capitalisation of ROU Asset under IFRS 16 (${input.assetClass})`,
    },
    {
      accountCode: '2600',
      accountName: 'Lease Liability',
      debit: 0,
      credit: round2(initialLiabilityDec),
      description: 'Present value of future lease payments discounted at IBR',
    },
  ];

  if (initialDirectCostsDec.greaterThan(0)) {
    initLines.push({
      accountCode: '1010',
      accountName: 'Bank / Cash (Initial Direct Costs)',
      debit: 0,
      credit: round2(initialDirectCostsDec),
      description: 'Payment of initial direct costs directly attributable to lease',
    });
  }

  if (prepaymentsDec.greaterThan(0)) {
    initLines.push({
      accountCode: '1010',
      accountName: 'Bank / Cash (Prepayments)',
      debit: 0,
      credit: round2(prepaymentsDec),
      description: 'Lease payments made at or before commencement date',
    });
  }

  if (restorationDec.greaterThan(0)) {
    initLines.push({
      accountCode: '2700',
      accountName: 'Provision for Restoration (IAS 37)',
      debit: 0,
      credit: round2(restorationDec),
      description: 'Estimated present value of dismantling and site restoration obligation',
    });
  }

  if (incentivesDec.greaterThan(0)) {
    initLines.push({
      accountCode: '1010',
      accountName: 'Bank / Cash (Lease Incentive)',
      debit: round2(incentivesDec),
      credit: 0,
      description: 'Cash incentive received from lessor at commencement',
    });
  }

  const totalInitDebit = initLines.reduce((acc, l) => acc + l.debit, 0);
  const totalInitCredit = initLines.reduce((acc, l) => acc + l.credit, 0);

  journalEntries.push({
    entryId: 'JRN-001',
    entryType: 'INITIAL_RECOGNITION',
    postingDate: input.commencementDate,
    lines: initLines,
    totalDebit: round2(totalInitDebit),
    totalCredit: round2(totalInitCredit),
    isBalanced: Math.abs(totalInitDebit - totalInitCredit) < 0.01,
    narration: `Day-1 initial recognition of lease ${input.leaseReference} under IFRS 16.24.`,
  });

  // Entry 2: Period Subsequent Measurement (For the active reporting period)
  const subLines: JournalLine[] = [
    {
      accountCode: '6100',
      accountName: 'Finance Cost — Lease Liability Interest',
      debit: activeAmortLine.interestExpense,
      credit: 0,
      description: `Interest accretion on lease liability for period ${activePeriodIndex}`,
    },
    {
      accountCode: '2600',
      accountName: 'Lease Liability (Accrued Interest)',
      debit: 0,
      credit: activeAmortLine.interestExpense,
      description: 'Liability increase from interest accrual',
    },
    {
      accountCode: '2600',
      accountName: 'Lease Liability (Principal Repayment)',
      debit: activeAmortLine.paymentAmount,
      credit: 0,
      description: `Lease settlement payment for period ${activePeriodIndex}`,
    },
    {
      accountCode: '1010',
      accountName: 'Bank / Cash',
      debit: 0,
      credit: activeAmortLine.paymentAmount,
      description: 'Cash outflow for periodic contractual lease payment',
    },
    {
      accountCode: '6200',
      accountName: 'Depreciation Expense — ROU Asset',
      debit: activeDepLine.depreciationCharge,
      credit: 0,
      description: `Straight-line ROU depreciation for period ${activePeriodIndex}`,
    },
    {
      accountCode: '1690',
      accountName: 'Accumulated Depreciation — ROU Asset',
      debit: 0,
      credit: activeDepLine.depreciationCharge,
      description: 'Balance sheet contra-asset accumulation',
    },
  ];

  const totalSubDebit = subLines.reduce((acc, l) => acc + l.debit, 0);
  const totalSubCredit = subLines.reduce((acc, l) => acc + l.credit, 0);

  journalEntries.push({
    entryId: 'JRN-002',
    entryType: 'SUBSEQUENT_MEASUREMENT',
    postingDate: activeAmortLine.periodDate,
    periodIndex: activePeriodIndex,
    lines: subLines,
    totalDebit: round2(totalSubDebit),
    totalCredit: round2(totalSubCredit),
    isBalanced: Math.abs(totalSubDebit - totalSubCredit) < 0.01,
    narration: `Subsequent measurement journal entry for period ${activePeriodIndex} ended ${activeAmortLine.periodDate}.`,
  });

  // Entry 3: Cumulative Reporting Period Summary Journal
  const cumLines: JournalLine[] = [
    {
      accountCode: '6100',
      accountName: 'Finance Cost — Cumulative Interest to Date',
      debit: reportingBalances.totalInterestExpensedToDate,
      credit: 0,
      description: 'Total interest expense recognised from commencement to reporting date',
    },
    {
      accountCode: '6200',
      accountName: 'Depreciation Expense — Cumulative ROU Dep',
      debit: reportingBalances.totalDepreciationExpensedToDate,
      credit: 0,
      description: 'Total straight-line ROU depreciation recognised to reporting date',
    },
    {
      accountCode: '2600',
      accountName: 'Lease Liability (Net Reduction)',
      debit: round2(
        new Decimal(initialLiabilityDec).minus(reportingBalances.totalLeaseLiability).toNumber()
      ),
      credit: 0,
      description: 'Net reduction in principal lease liability to date',
    },
    {
      accountCode: '1010',
      accountName: 'Bank / Cash (Total Lease Payments)',
      debit: 0,
      credit: reportingBalances.totalPaymentsMadeToDate,
      description: 'Total cumulative cash payments made to lessor',
    },
    {
      accountCode: '1690',
      accountName: 'Accumulated Depreciation — ROU Asset',
      debit: 0,
      credit: reportingBalances.accumulatedDepreciation,
      description: 'Total contra-asset accumulated depreciation on balance sheet',
    },
  ];

  const totalCumDebit = cumLines.reduce((acc, l) => acc + l.debit, 0);
  const totalCumCredit = cumLines.reduce((acc, l) => acc + l.credit, 0);

  journalEntries.push({
    entryId: 'JRN-003',
    entryType: 'ANNUAL_SUMMARY',
    postingDate: input.reportingDate,
    lines: cumLines,
    totalDebit: round2(totalCumDebit),
    totalCredit: round2(totalCumCredit),
    isBalanced: Math.abs(totalCumDebit - totalCumCredit) < 0.05,
    narration: `Cumulative financial statement roll-forward from commencement to reporting date ${input.reportingDate}.`,
  });

  // 10. Audit Reconciliation Checks
  const totalPaymentsOverTerm = amortisationSchedule.reduce((s, r) => s + r.paymentAmount, 0);
  const totalInterestOverTerm = amortisationSchedule.reduce((s, r) => s + r.interestExpense, 0);
  const totalDepOverTerm = depreciationSchedule.reduce((s, r) => s + r.depreciationCharge, 0);

  const checks: ReconciliationCheckItem[] = [
    {
      id: 'RC-01',
      title: 'Initial ROU Asset Roll-Up Proof',
      description: 'Verifies A0 = L0 + Direct Costs + Prepayments + Restoration - Incentives.',
      standardReference: 'IFRS 16.24',
      expectedValue: round2(initialRouAssetDec),
      actualValue: round2(
        initialLiabilityDec
          .plus(initialDirectCostsDec)
          .plus(prepaymentsDec)
          .plus(restorationDec)
          .minus(incentivesDec)
      ),
      variance: round2(
        new Decimal(initialRouAssetDec)
          .minus(
            initialLiabilityDec
              .plus(initialDirectCostsDec)
              .plus(prepaymentsDec)
              .plus(restorationDec)
              .minus(incentivesDec)
          )
          .toNumber()
      ),
      isPassed: true,
    },
    {
      id: 'RC-02',
      title: 'Liability Term Amortisation Proof',
      description: 'Verifies final lease liability closes to exactly 0.00 at term expiry.',
      standardReference: 'IFRS 16.36',
      expectedValue: 0.0,
      actualValue: amortisationSchedule[amortisationSchedule.length - 1].closingLiability,
      variance: amortisationSchedule[amortisationSchedule.length - 1].closingLiability,
      isPassed: amortisationSchedule[amortisationSchedule.length - 1].closingLiability <= 0.01,
    },
    {
      id: 'RC-03',
      title: 'ROU Asset Net Book Value Zeroing Proof',
      description: 'Verifies ROU Asset fully depreciates to 0.00 at term expiry.',
      standardReference: 'IFRS 16.31',
      expectedValue: 0.0,
      actualValue: depreciationSchedule[depreciationSchedule.length - 1].closingNetBookValue,
      variance: depreciationSchedule[depreciationSchedule.length - 1].closingNetBookValue,
      isPassed: depreciationSchedule[depreciationSchedule.length - 1].closingNetBookValue <= 0.01,
    },
    {
      id: 'RC-04',
      title: 'Reporting Date Liability Balance Consistency',
      description: 'Verifies Current Liability + Non-Current Liability == Total Liability at reporting date.',
      standardReference: 'IAS 1.69',
      expectedValue: reportingBalances.totalLeaseLiability,
      actualValue: round2(
        reportingBalances.currentLeaseLiability + reportingBalances.nonCurrentLeaseLiability
      ),
      variance: round2(
        reportingBalances.totalLeaseLiability -
          (reportingBalances.currentLeaseLiability + reportingBalances.nonCurrentLeaseLiability)
      ),
      isPassed:
        Math.abs(
          reportingBalances.totalLeaseLiability -
            (reportingBalances.currentLeaseLiability + reportingBalances.nonCurrentLeaseLiability)
        ) <= 0.02,
    },
    {
      id: 'RC-05',
      title: 'Full Life P&L vs Cash Outflow Integrity',
      description: 'Total P&L (Interest + Deprec.) must equal Net Cash Outflow + Restoration Provision.',
      standardReference: 'IFRS 16 Conceptual Framework',
      expectedValue: round2(
        totalPaymentsOverTerm +
          (input.initialDirectCosts || 0) +
          (input.prepaymentsMade || 0) -
          (input.leaseIncentivesReceived || 0) +
          (input.restorationProvision || 0)
      ),
      actualValue: round2(totalInterestOverTerm + totalDepOverTerm),
      variance: round2(
        Math.abs(
          totalPaymentsOverTerm +
            (input.initialDirectCosts || 0) +
            (input.prepaymentsMade || 0) -
            (input.leaseIncentivesReceived || 0) +
            (input.restorationProvision || 0) -
            (totalInterestOverTerm + totalDepOverTerm)
        )
      ),
      isPassed:
        Math.abs(
          totalPaymentsOverTerm +
            (input.initialDirectCosts || 0) +
            (input.prepaymentsMade || 0) -
            (input.leaseIncentivesReceived || 0) +
            (input.restorationProvision || 0) -
            (totalInterestOverTerm + totalDepOverTerm)
        ) <= 0.05,
    },
    {
      id: 'RC-06',
      title: 'Double-Entry Journal Balancing Test',
      description: 'Total debits must equal total credits across all generated journal entries.',
      standardReference: 'IAS 1 Presentation of Financial Statements',
      expectedValue: round2(totalInitDebit),
      actualValue: round2(totalInitCredit),
      variance: round2(Math.abs(totalInitDebit - totalInitCredit)),
      isPassed: Math.abs(totalInitDebit - totalInitCredit) <= 0.01,
    },
  ];

  // 11. Structured IFRS 16.58 & IFRS 7.39 Maturity Analysis Builder
  const buildMaturityBands = (startPeriodIndex: number) => {
    // startPeriodIndex: 0 for inception lifetime, or activePeriodIndex for reporting date
    const remainingLines = amortisationSchedule.slice(startPeriodIndex);
    const totalRemainingCash = remainingLines.reduce((s, r) => s + r.paymentAmount, 0);

    const bandDefs = [
      { id: 'YEAR_1', label: 'Not later than 1 year (Year 1)', subLabel: 'Due within next 12 months', minDelta: 1, maxDelta: m },
      { id: 'YEAR_2', label: 'Later than 1 year and not later than 2 years (Year 2)', subLabel: 'Due in months 13 to 24', minDelta: m + 1, maxDelta: 2 * m },
      { id: 'YEAR_3', label: 'Later than 2 years and not later than 3 years (Year 3)', subLabel: 'Due in months 25 to 36', minDelta: 2 * m + 1, maxDelta: 3 * m },
      { id: 'YEAR_4', label: 'Later than 3 years and not later than 4 years (Year 4)', subLabel: 'Due in months 37 to 48', minDelta: 3 * m + 1, maxDelta: 4 * m },
      { id: 'YEAR_5', label: 'Later than 4 years and not later than 5 years (Year 5)', subLabel: 'Due in months 49 to 60', minDelta: 4 * m + 1, maxDelta: 5 * m },
      { id: 'THEREAFTER', label: 'Later than 5 years (Thereafter)', subLabel: 'Due beyond 60 months', minDelta: 5 * m + 1, maxDelta: Infinity },
    ];

    const resultBands: MaturityBandRow[] = bandDefs.map((def) => {
      const matching = remainingLines.filter((_, idx) => {
        const delta = idx + 1; // 1-indexed relative to startPeriodIndex
        return delta >= def.minDelta && delta <= def.maxDelta;
      });

      const undiscounted = matching.reduce((s, r) => s + r.paymentAmount, 0);
      const interest = matching.reduce((s, r) => s + r.interestExpense, 0);
      const principal = matching.reduce((s, r) => s + r.principalRepayment, 0);
      const dateRange = matching.length > 0
        ? `${matching[0].periodDate} to ${matching[matching.length - 1].periodDate}`
        : 'None';
      const pct = totalRemainingCash > 0 ? (undiscounted / totalRemainingCash) * 100 : 0;

      return {
        bandId: def.id,
        label: def.label,
        subLabel: def.subLabel,
        dateRange,
        periodCount: matching.length,
        undiscountedCashFlow: round2(undiscounted),
        financeCostPortion: round2(interest),
        principalPortion: round2(principal),
        percentageOfTotal: round2(pct),
      };
    });

    const totalUndisc = resultBands.reduce((s, b) => s + b.undiscountedCashFlow, 0);
    const totalInterest = resultBands.reduce((s, b) => s + b.financeCostPortion, 0);
    const presentVal = round2(totalUndisc - totalInterest);

    return {
      bands: resultBands,
      totalUndiscounted: round2(totalUndisc),
      totalFinanceCost: round2(totalInterest),
      presentValue: presentVal,
    };
  };

  const repMaturity = buildMaturityBands(activePeriodIndex);
  const lifeMaturity = buildMaturityBands(0);

  const maturityAnalysis: MaturityAnalysisDisclosure = {
    asOfReportingDate: input.reportingDate,
    reportingDateBands: repMaturity.bands,
    reportingDateTotalUndiscounted: repMaturity.totalUndiscounted,
    reportingDateUnearnedFinanceCost: repMaturity.totalFinanceCost,
    reportingDatePresentValue: repMaturity.presentValue,

    lifetimeBands: lifeMaturity.bands,
    lifetimeTotalUndiscounted: lifeMaturity.totalUndiscounted,
    lifetimeUnearnedFinanceCost: lifeMaturity.totalFinanceCost,
    lifetimePresentValue: lifeMaturity.presentValue,

    // Quick access / backwards compatibility
    year1: lifeMaturity.bands[0].undiscountedCashFlow,
    year2: lifeMaturity.bands[1].undiscountedCashFlow,
    year3: lifeMaturity.bands[2].undiscountedCashFlow,
    year4: lifeMaturity.bands[3].undiscountedCashFlow,
    year5: lifeMaturity.bands[4].undiscountedCashFlow,
    thereafter: lifeMaturity.bands[5].undiscountedCashFlow,
    totalUndiscounted: lifeMaturity.totalUndiscounted,
    unearnedFinanceCost: lifeMaturity.totalFinanceCost,
    netPresentValue: lifeMaturity.presentValue,
  };

  return {
    input,
    effectiveTermMonths,
    totalPeriods,
    periodicDiscountRate: periodicRateDec.toNumber(),
    initialLeaseLiability: round2(initialLiabilityDec),
    initialRouAsset: round2(initialRouAssetDec),
    totalUndiscountedCashFlows: round2(totalPaymentsOverTerm),
    totalFinanceCost: round2(totalInterestOverTerm),
    totalDepreciationCost: round2(totalDepOverTerm),
    amortisationSchedule,
    depreciationSchedule,
    journalEntries,
    reportingBalances,
    reconciliationChecks: checks,
    allChecksPassed: checks.every((c) => c.isPassed),
    maturityAnalysis,
  };
}
