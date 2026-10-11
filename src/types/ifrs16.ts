/**
 * Finosutra IFRS 16 SaaS — Core TypeScript Types & Data Models
 * Strictly compliant with IFRS 16 (Leases)
 */

export type AssetClass =
  | 'PROPERTY'
  | 'PLANT_AND_MACHINERY'
  | 'MOTOR_VEHICLES'
  | 'IT_AND_OFFICE_EQUIPMENT'
  | 'OTHER';

export type PaymentFrequency =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUAL'
  | 'ANNUAL';

export type PaymentTiming = 'IN_ARREARS' | 'IN_ADVANCE';

export type DiscountRateType = 'IBR' | 'IMPLICIT_RATE';

export type CompoundingConvention = 'NOMINAL_ANNUAL' | 'EFFECTIVE_ANNUAL';

export type EscalationType = 'NONE' | 'FIXED_PERCENTAGE' | 'STEPPED_RENT';

export interface SteppedRentSlab {
  id: string;
  fromPeriod: number; // 1-based period index
  toPeriod: number;   // inclusive period index
  periodicPayment: number; // payment per period
  label?: string;     // e.g. "Year 1", "Fit-out rate"
}

export interface LeaseContractInput {
  // Identification
  leaseReference: string;
  leaseDescription: string;
  lesseeEntity: string;
  assetClass: AssetClass;
  currency: string; // ISO 4217, e.g. USD, EUR, GBP, AUD, SGD

  // Contract Dates & Term
  commencementDate: string; // YYYY-MM-DD
  contractEndDate: string; // YYYY-MM-DD
  hasRenewalOption: boolean;
  renewalEndDate?: string; // YYYY-MM-DD if reasonably certain
  hasTerminationOption: boolean;
  terminationDate?: string; // YYYY-MM-DD if reasonably certain

  // Recognition Exemptions (IFRS 16.5)
  shortTermElection: boolean;
  lowValueElection: boolean;

  // Payments & Cash Flows
  paymentFrequency: PaymentFrequency;
  paymentTiming: PaymentTiming;
  basePayment: number; // periodic payment
  rentFreePeriods: number; // initial periods with 0 payment
  escalationType: EscalationType;
  escalationRate: number; // annual percentage increase (e.g. 3 for 3%)
  steppedRentSlabs?: SteppedRentSlab[]; // multi-slab stepped rent schedule table

  // Discounting
  discountRateType: DiscountRateType;
  annualDiscountRate: number; // e.g. 5.0 for 5% APR
  compoundingConvention: CompoundingConvention;

  // Initial ROU Asset Adjustments (IFRS 16.24)
  initialDirectCosts: number;
  prepaymentsMade: number;
  leaseIncentivesReceived: number;
  restorationProvision: number; // IAS 37 present value

  // Financial Reporting
  reportingDate: string; // YYYY-MM-DD balance sheet cut-off
}

export interface AmortisationLine {
  periodIndex: number;
  periodDate: string;
  openingLiability: number;
  interestExpense: number;
  paymentAmount: number;
  principalRepayment: number;
  closingLiability: number;
  isRentFree: boolean;
  isAdvancePeriod1: boolean;
}

export interface DepreciationLine {
  periodIndex: number;
  periodDate: string;
  openingCost: number;
  openingAccumulatedDepreciation: number;
  openingNetBookValue: number;
  depreciationCharge: number;
  closingAccumulatedDepreciation: number;
  closingNetBookValue: number;
}

export interface JournalLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntry {
  entryId: string;
  entryType: 'INITIAL_RECOGNITION' | 'SUBSEQUENT_MEASUREMENT' | 'ANNUAL_SUMMARY';
  postingDate: string;
  periodIndex?: number;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  narration: string;
}

export interface ReportingDateBalances {
  reportingDate: string;
  activePeriodIndex: number;
  rouAssetGrossCost: number;
  accumulatedDepreciation: number;
  rouAssetNetBookValue: number;
  totalLeaseLiability: number;
  currentLeaseLiability: number;
  nonCurrentLeaseLiability: number;
  next12MonthsPayments: number;
  next12MonthsInterest: number;
  totalInterestExpensedToDate: number;
  totalDepreciationExpensedToDate: number;
  totalPaymentsMadeToDate: number;
}

export interface ReconciliationCheckItem {
  id: string;
  title: string;
  description: string;
  standardReference: string;
  expectedValue: number;
  actualValue: number;
  variance: number;
  isPassed: boolean;
}

export interface MaturityBandRow {
  bandId: string;
  label: string;
  subLabel: string;
  dateRange: string;
  periodCount: number;
  undiscountedCashFlow: number;
  financeCostPortion: number;
  principalPortion: number;
  percentageOfTotal: number;
}

export interface MaturityAnalysisDisclosure {
  asOfReportingDate: string;
  // Dynamic reporting date perspective (remaining commitments from balance sheet cut-off)
  reportingDateBands: MaturityBandRow[];
  reportingDateTotalUndiscounted: number;
  reportingDateUnearnedFinanceCost: number;
  reportingDatePresentValue: number; // Reconciles to Total Lease Liability on Balance Sheet!

  // Inception lifetime perspective (for initial contract profile)
  lifetimeBands: MaturityBandRow[];
  lifetimeTotalUndiscounted: number;
  lifetimeUnearnedFinanceCost: number;
  lifetimePresentValue: number;

  // Legacy/quick access fields
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  thereafter: number;
  totalUndiscounted: number;
  unearnedFinanceCost: number;
  netPresentValue: number;
}

export interface IFRS16CalculationResult {
  // Input Echo
  input: LeaseContractInput;

  // Key Initial Metrics
  effectiveTermMonths: number;
  totalPeriods: number;
  periodicDiscountRate: number; // decimal e.g. 0.004167
  initialLeaseLiability: number;
  initialRouAsset: number;
  totalUndiscountedCashFlows: number;
  totalFinanceCost: number;
  totalDepreciationCost: number;

  // Schedules
  amortisationSchedule: AmortisationLine[];
  depreciationSchedule: DepreciationLine[];

  // Journals & Reporting
  journalEntries: JournalEntry[];
  reportingBalances: ReportingDateBalances;

  // Verification & Audit Checks
  reconciliationChecks: ReconciliationCheckItem[];
  allChecksPassed: boolean;

  // Maturity Analysis (IFRS 16.58)
  maturityAnalysis: MaturityAnalysisDisclosure;
}

export interface ValidationWarning {
  field: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
}
