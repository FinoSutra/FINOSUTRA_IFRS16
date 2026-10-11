/**
 * Finosutra IFRS 16 SaaS — Portfolio & Multi-Tenant Enterprise Data Models
 * Supports group consolidations, multi-entity portfolios, role-based workflows, and commercial subscriptions.
 */

import { LeaseContractInput, IFRS16CalculationResult, AssetClass } from './ifrs16.ts';

export type LeaseLifecycleStatus = 'ACTIVE' | 'DRAFT' | 'REVIEW_PENDING' | 'APPROVED' | 'TERMINATED';

export type UserRole = 'PREPARER' | 'REVIEWER' | 'EXTERNAL_AUDITOR' | 'ADMIN';

export interface SaaSUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarColor: string;
  companyName?: string;
  planId?: SubscriptionPlanId;
  twoFactorEnabled?: boolean;
  createdAt?: string;
}

export interface OrganizationEntity {
  id: string;
  name: string;
  legalEntityCode: string;
  country: string;
  currency: string;
  fiscalYearEnd: string; // MM-DD, e.g. "12-31" or "03-31"
  taxId: string;
}

export interface LeasePortfolioItem {
  id: string;
  leaseReference: string;
  leaseDescription: string;
  entityId: string;
  entityName: string;
  assetClass: AssetClass;
  status: LeaseLifecycleStatus;
  input: LeaseContractInput;
  calcResult?: IFRS16CalculationResult;
  assignedPreparer: string;
  approvedBy?: string;
  approvedAt?: string;
  costCenter: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioConsolidatedMetrics {
  totalLeasesCount: number;
  activeLeasesCount: number;
  totalROUAssetInitial: number;
  totalROUAssetClosing: number;
  totalLeaseLiabilityInitial: number;
  totalLeaseLiabilityClosing: number;
  totalCurrentLiability: number;
  totalNonCurrentLiability: number;
  totalAnnualDepreciation: number;
  totalAnnualInterestExpense: number;
  totalAnnualPLCharge: number;
  totalUndiscountedFutureCashFlows: number;
  weightedAverageIBR: number;
  allAuditsPassed: boolean;
  byAssetClass: Record<
    AssetClass,
    {
      count: number;
      rouAsset: number;
      leaseLiability: number;
      currentLiability: number;
      nonCurrentLiability: number;
      annualDepreciation: number;
      annualInterest: number;
    }
  >;
  byEntity: Record<
    string,
    {
      entityName: string;
      count: number;
      rouAsset: number;
      leaseLiability: number;
      currentLiability: number;
      nonCurrentLiability: number;
    }
  >;
  consolidatedMaturity: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
    after5Years: number;
    totalUndiscounted: number;
    effectOfDiscounting: number;
    totalPresentValue: number;
  };
}

export type SubscriptionPlanId = 'FREEMIUM' | 'PRACTITIONER' | 'CORPORATE' | 'ENTERPRISE';

export interface SubscriptionStatus {
  planId: SubscriptionPlanId;
  planName: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE';
  activeSince: string;
  nextRenewal: string;
  seatsUsed: number;
  seatsMax: number;
  leasesUsed: number;
  leasesMax: number; // -1 for unlimited
  monthlyPrice: number;
}

export interface AuditTrailEvent {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'CALCULATE' | 'APPROVE' | 'REJECT' | 'EXPORT_EXCEL' | 'IMPORT_BATCH' | 'USER_LOGIN' | 'USER_REGISTERED' | 'PLAN_CHANGED';
  leaseRef: string;
  summary: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING';
  planName: string;
  receiptUrl: string;
}
