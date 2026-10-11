/**
 * Finosutra IFRS 16 SaaS — Portfolio Service & Consolidation Engine
 * Computes portfolio-wide aggregates, asset class roll-forwards, group maturity analyses,
 * and maintains persistent multi-entity tenant storage.
 */

import { calculateIFRS16 } from '../engine/ifrs16Engine.ts';
import { 
  LeasePortfolioItem, 
  OrganizationEntity, 
  SaaSUser, 
  PortfolioConsolidatedMetrics, 
  SubscriptionStatus, 
  SubscriptionPlanId,
  AuditTrailEvent, 
  BillingInvoice 
} from '../types/portfolio.ts';
import { AssetClass } from '../types/ifrs16.ts';

export const INITIAL_ENTITIES: OrganizationEntity[] = [
  {
    id: 'ent-all',
    name: 'All Consolidated Entities (Group View)',
    legalEntityCode: 'GRP-000',
    country: 'Global',
    currency: 'USD',
    fiscalYearEnd: '12-31',
    taxId: 'US-GRP-98765432'
  },
  {
    id: 'ent-hq',
    name: 'Acme Global Holdings Inc (Headquarters)',
    legalEntityCode: 'AGH-101',
    country: 'United States',
    currency: 'USD',
    fiscalYearEnd: '12-31',
    taxId: 'US-FED-48192039'
  },
  {
    id: 'ent-uk',
    name: 'Acme Logistics & Retail UK Ltd',
    legalEntityCode: 'ALR-202',
    country: 'United Kingdom',
    currency: 'USD', // group reporting
    fiscalYearEnd: '12-31',
    taxId: 'GB-VAT-92837461'
  },
  {
    id: 'ent-apac',
    name: 'Acme Operations APAC Pte Ltd',
    legalEntityCode: 'AOA-303',
    country: 'Singapore',
    currency: 'USD',
    fiscalYearEnd: '12-31',
    taxId: 'SG-UEN-202319284K'
  },
  {
    id: 'ent-eu',
    name: 'Acme Technologies Europe GmbH',
    legalEntityCode: 'ATE-404',
    country: 'Germany',
    currency: 'USD',
    fiscalYearEnd: '12-31',
    taxId: 'DE-UST-81928374'
  }
];

export const INITIAL_USERS: SaaSUser[] = [
  {
    id: 'usr-1',
    name: 'Elena Rostova, CA',
    email: 'elena.rostova@acmeglobal.com',
    role: 'REVIEWER',
    title: 'Group Financial Controller',
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'usr-2',
    name: 'Marcus Chen, CPA',
    email: 'marcus.chen@acmeglobal.com',
    role: 'PREPARER',
    title: 'Senior Technical Accounting Analyst',
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'usr-3',
    name: 'David Vance, FCA',
    email: 'd.vance@pwc-audit-lead.com',
    role: 'EXTERNAL_AUDITOR',
    title: 'External Audit Engagement Partner (Big 4)',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'usr-4',
    name: 'Sarah Jenkins, CPA',
    email: 'sarah.jenkins@acmeglobal.com',
    role: 'ADMIN',
    title: 'Chief Financial Officer',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'usr-free',
    name: 'Alex Miller, CA',
    email: 'alex.miller@freemium-user.org',
    role: 'PREPARER',
    title: 'Independent Accounting Practitioner',
    avatarColor: 'bg-teal-600',
    companyName: 'Miller Advisory Services',
    planId: 'FREEMIUM'
  }
];

export const FREEMIUM_SUBSCRIPTION: SubscriptionStatus = {
  planId: 'FREEMIUM',
  planName: 'Freemium Starter (Free Forever)',
  billingCycle: 'ANNUAL',
  status: 'ACTIVE',
  activeSince: '2026-01-01',
  nextRenewal: '2099-12-31',
  seatsUsed: 1,
  seatsMax: 1,
  leasesUsed: 2,
  leasesMax: 3,
  monthlyPrice: 0
};

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlanId,
  {
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    leasesMax: number;
    seatsMax: number;
    features: string[];
    badge: string;
  }
> = {
  FREEMIUM: {
    name: 'Freemium Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    leasesMax: 3,
    seatsMax: 1,
    features: [
      'Up to 3 Active Lease Contracts',
      '1 Corporate Legal Entity',
      '1 User Seat',
      'Full IFRS 16 Amortisation Schedule',
      'Straight-Line ROU Depreciation Engine',
      'Double-Entry Journal Entry Generator',
      'Balance Sheet Presentation (IAS 1 Split)',
      'Mathematical Reconciliation Certificate',
      'Standard Excel Export (.xlsx)',
      'Free Forever · No Credit Card Required'
    ],
    badge: 'Free Forever'
  },
  PRACTITIONER: {
    name: 'Practitioner',
    monthlyPrice: 49,
    annualPrice: 39,
    leasesMax: 15,
    seatsMax: 3,
    features: [
      'Up to 15 Active Lease Contracts',
      '3 Corporate Legal Entities',
      '3 Finance Team User Seats',
      'Full IFRS 16 Amortisation & PV Engine',
      'Rent-Free Periods & Fit-Out Incentives',
      'Batch CSV Lease Importer',
      'Double-Entry General Ledger Journals',
      'Standard Excel & JSON Model Export',
      'Chartered Accountant Email Support'
    ],
    badge: 'Individual CPAs'
  },
  CORPORATE: {
    name: 'Corporate Finance',
    monthlyPrice: 149,
    annualPrice: 119,
    leasesMax: 75,
    seatsMax: 10,
    features: [
      'Up to 75 Active Lease Contracts',
      '15 Multi-Tenant Subsidiaries',
      '10 Finance Team User Seats',
      'Multi-Currency Support (ISO 4217)',
      'Stepped Contractual Rental Escalations',
      'Statutory Financial Note Disclosures (IFRS 16.47-60)',
      '6-Sheet Big 4 Consolidated Audit Workbook (.xlsx)',
      'Role-Based Approval Workflow',
      'Priority Phone & CA Specialist Support'
    ],
    badge: 'Most Popular'
  },
  ENTERPRISE: {
    name: 'Enterprise & Audit Practice',
    monthlyPrice: 399,
    annualPrice: 319,
    leasesMax: -1,
    seatsMax: 999,
    features: [
      'Unlimited Active Lease Contracts',
      'Unlimited Legal Entities & Subsidiaries',
      'Unlimited User Seats & External Auditor Viewers',
      'Custom ERP Chart of Accounts (SAP, Oracle, NetSuite)',
      'Contract Modifications & Remeasurements (Phase 6)',
      'SSO (SAML 2.0 / Okta / Azure AD)',
      'Custom SLA & Dedicated Technical Partner'
    ],
    badge: 'Multinational Groups'
  }
};

export const INITIAL_SUBSCRIPTION: SubscriptionStatus = {
  planId: 'CORPORATE',
  planName: 'Corporate Finance Plan',
  billingCycle: 'ANNUAL',
  status: 'ACTIVE',
  activeSince: '2026-01-01',
  nextRenewal: '2027-01-01',
  seatsUsed: 4,
  seatsMax: 10,
  leasesUsed: 6,
  leasesMax: 75,
  monthlyPrice: 119
};

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0041',
    date: '2026-01-01',
    amount: 1428.00,
    currency: 'USD',
    status: 'PAID',
    planName: 'Corporate Finance (Annual - 10 Seats)',
    receiptUrl: '#'
  },
  {
    id: 'inv-100',
    invoiceNumber: 'INV-2025-0019',
    date: '2025-01-01',
    amount: 1428.00,
    currency: 'USD',
    status: 'PAID',
    planName: 'Corporate Finance (Annual - 10 Seats)',
    receiptUrl: '#'
  }
];

export const INITIAL_AUDIT_LOGS: AuditTrailEvent[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-10 16:45:12',
    userName: 'Elena Rostova, CA',
    userRole: 'REVIEWER',
    action: 'APPROVE',
    leaseRef: 'LSE-HQ-001',
    summary: 'Approved London Executive HQ Lease calculation schedule and IBR of 6.00%.'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-10 15:30:20',
    userName: 'Marcus Chen, CPA',
    userRole: 'PREPARER',
    action: 'UPDATE',
    leaseRef: 'LSE-WH-002',
    summary: 'Updated restoration provision to $50,000 under IAS 37 and rent stepped schedule.'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-10 14:10:05',
    userName: 'David Vance, FCA',
    userRole: 'EXTERNAL_AUDITOR',
    action: 'EXPORT_EXCEL',
    leaseRef: 'PORTFOLIO',
    summary: 'Exported portfolio consolidated Big-4 audit workpapers for interim statutory audit.'
  }
];

export const INITIAL_LEASES: LeasePortfolioItem[] = [
  {
    id: 'lease-001',
    leaseReference: 'LSE-HQ-001',
    leaseDescription: 'Global Headquarters Building (Levels 14-16)',
    entityId: 'ent-hq',
    entityName: 'Acme Global Holdings Inc',
    assetClass: 'PROPERTY',
    status: 'APPROVED',
    assignedPreparer: 'Marcus Chen, CPA',
    approvedBy: 'Elena Rostova, CA',
    approvedAt: '2026-10-09',
    costCenter: 'CC-100-EXEC',
    notes: 'Primary global corporate office. Stepped rent in Year 2-5. 5-year lease term.',
    createdAt: '2026-01-15',
    updatedAt: '2026-10-09',
    input: {
      leaseReference: 'LSE-HQ-001',
      leaseDescription: 'Global Headquarters Building (Levels 14-16)',
      lesseeEntity: 'Acme Global Holdings Inc',
      assetClass: 'PROPERTY',
      currency: 'USD',
      commencementDate: '2025-01-01',
      contractEndDate: '2029-12-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'MONTHLY',
      paymentTiming: 'IN_ARREARS',
      basePayment: 50000,
      rentFreePeriods: 0,
      escalationType: 'STEPPED_RENT',
      escalationRate: 0,
      steppedRentSlabs: [
        { id: 's1', fromPeriod: 1, toPeriod: 12, periodicPayment: 50000, label: 'Year 1 Introductory' },
        { id: 's2', fromPeriod: 13, toPeriod: 36, periodicPayment: 55000, label: 'Years 2-3 Base' },
        { id: 's3', fromPeriod: 37, toPeriod: 60, periodicPayment: 60000, label: 'Years 4-5 Matured' }
      ],
      discountRateType: 'IBR',
      annualDiscountRate: 6.0,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 15000,
      prepaymentsMade: 50000,
      leaseIncentivesReceived: 30000,
      restorationProvision: 25000,
      reportingDate: '2025-12-31'
    }
  },
  {
    id: 'lease-002',
    leaseReference: 'LSE-WH-002',
    leaseDescription: 'National Distribution Warehouse & Hub',
    entityId: 'ent-uk',
    entityName: 'Acme Logistics & Retail UK Ltd',
    assetClass: 'PROPERTY',
    status: 'APPROVED',
    assignedPreparer: 'Marcus Chen, CPA',
    approvedBy: 'Elena Rostova, CA',
    approvedAt: '2026-10-08',
    costCenter: 'CC-300-LOGISTICS',
    notes: 'Central logistics cross-docking facility. 10-year lease with 3.0% annual escalation.',
    createdAt: '2025-06-01',
    updatedAt: '2026-10-08',
    input: {
      leaseReference: 'LSE-WH-002',
      leaseDescription: 'National Distribution Warehouse & Hub',
      lesseeEntity: 'Acme Logistics & Retail UK Ltd',
      assetClass: 'PROPERTY',
      currency: 'USD',
      commencementDate: '2024-01-01',
      contractEndDate: '2033-12-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'MONTHLY',
      paymentTiming: 'IN_ADVANCE',
      basePayment: 35000,
      rentFreePeriods: 3,
      escalationType: 'FIXED_PERCENTAGE',
      escalationRate: 3.0,
      discountRateType: 'IBR',
      annualDiscountRate: 5.5,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 20000,
      prepaymentsMade: 0,
      leaseIncentivesReceived: 0,
      restorationProvision: 50000,
      reportingDate: '2025-12-31'
    }
  },
  {
    id: 'lease-003',
    leaseReference: 'LSE-FL-003',
    leaseDescription: 'Electric Delivery Vehicle Fleet (40 Units)',
    entityId: 'ent-uk',
    entityName: 'Acme Logistics & Retail UK Ltd',
    assetClass: 'MOTOR_VEHICLES',
    status: 'ACTIVE',
    assignedPreparer: 'Marcus Chen, CPA',
    costCenter: 'CC-320-FLEET',
    notes: 'Quarterly payment structure with lessor implicit interest rate of 4.8%.',
    createdAt: '2025-03-01',
    updatedAt: '2026-10-01',
    input: {
      leaseReference: 'LSE-FL-003',
      leaseDescription: 'Electric Delivery Vehicle Fleet (40 Units)',
      lesseeEntity: 'Acme Logistics & Retail UK Ltd',
      assetClass: 'MOTOR_VEHICLES',
      currency: 'USD',
      commencementDate: '2025-01-01',
      contractEndDate: '2028-12-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'QUARTERLY',
      paymentTiming: 'IN_ARREARS',
      basePayment: 42000,
      rentFreePeriods: 0,
      escalationType: 'NONE',
      escalationRate: 0,
      discountRateType: 'IMPLICIT_RATE',
      annualDiscountRate: 4.8,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 5000,
      prepaymentsMade: 0,
      leaseIncentivesReceived: 0,
      restorationProvision: 0,
      reportingDate: '2025-12-31'
    }
  },
  {
    id: 'lease-004',
    leaseReference: 'LSE-DC-004',
    leaseDescription: 'Core Cloud Data Center Infrastructure (Hall B)',
    entityId: 'ent-eu',
    entityName: 'Acme Technologies Europe GmbH',
    assetClass: 'IT_AND_OFFICE_EQUIPMENT',
    status: 'REVIEW_PENDING',
    assignedPreparer: 'Marcus Chen, CPA',
    costCenter: 'CC-500-TECH',
    notes: 'Mission critical server rack leasing agreement. 36 months monthly payments.',
    createdAt: '2025-07-01',
    updatedAt: '2026-10-05',
    input: {
      leaseReference: 'LSE-DC-004',
      leaseDescription: 'Core Cloud Data Center Infrastructure (Hall B)',
      lesseeEntity: 'Acme Technologies Europe GmbH',
      assetClass: 'IT_AND_OFFICE_EQUIPMENT',
      currency: 'USD',
      commencementDate: '2025-04-01',
      contractEndDate: '2028-03-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'MONTHLY',
      paymentTiming: 'IN_ADVANCE',
      basePayment: 22000,
      rentFreePeriods: 0,
      escalationType: 'NONE',
      escalationRate: 0,
      discountRateType: 'IBR',
      annualDiscountRate: 5.25,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 8000,
      prepaymentsMade: 22000,
      leaseIncentivesReceived: 10000,
      restorationProvision: 15000,
      reportingDate: '2025-12-31'
    }
  },
  {
    id: 'lease-005',
    leaseReference: 'LSE-RET-005',
    leaseDescription: 'Prime High Street Retail Flagship (Orchard Rd)',
    entityId: 'ent-apac',
    entityName: 'Acme Operations APAC Pte Ltd',
    assetClass: 'PROPERTY',
    status: 'ACTIVE',
    assignedPreparer: 'Marcus Chen, CPA',
    costCenter: 'CC-210-RETAIL',
    notes: 'Flagship store with 6 months initial rent-free incentive from landlord.',
    createdAt: '2024-10-01',
    updatedAt: '2026-09-20',
    input: {
      leaseReference: 'LSE-RET-005',
      leaseDescription: 'Prime High Street Retail Flagship (Orchard Rd)',
      lesseeEntity: 'Acme Operations APAC Pte Ltd',
      assetClass: 'PROPERTY',
      currency: 'USD',
      commencementDate: '2025-01-01',
      contractEndDate: '2030-12-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'MONTHLY',
      paymentTiming: 'IN_ARREARS',
      basePayment: 28000,
      rentFreePeriods: 6,
      escalationType: 'FIXED_PERCENTAGE',
      escalationRate: 2.5,
      discountRateType: 'IBR',
      annualDiscountRate: 5.75,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 12000,
      prepaymentsMade: 0,
      leaseIncentivesReceived: 40000,
      restorationProvision: 35000,
      reportingDate: '2025-12-31'
    }
  },
  {
    id: 'lease-006',
    leaseReference: 'LSE-MFG-006',
    leaseDescription: 'Automated Precision Assembly Plant Machinery',
    entityId: 'ent-hq',
    entityName: 'Acme Global Holdings Inc',
    assetClass: 'PLANT_AND_MACHINERY',
    status: 'APPROVED',
    assignedPreparer: 'Marcus Chen, CPA',
    approvedBy: 'Elena Rostova, CA',
    approvedAt: '2026-10-07',
    costCenter: 'CC-400-MFG',
    notes: 'Heavy industrial production robotic assembly arm systems. 7 years quarterly.',
    createdAt: '2024-01-01',
    updatedAt: '2026-10-07',
    input: {
      leaseReference: 'LSE-MFG-006',
      leaseDescription: 'Automated Precision Assembly Plant Machinery',
      lesseeEntity: 'Acme Global Holdings Inc',
      assetClass: 'PLANT_AND_MACHINERY',
      currency: 'USD',
      commencementDate: '2024-01-01',
      contractEndDate: '2030-12-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'QUARTERLY',
      paymentTiming: 'IN_ADVANCE',
      basePayment: 32000,
      rentFreePeriods: 0,
      escalationType: 'NONE',
      escalationRate: 0,
      discountRateType: 'IBR',
      annualDiscountRate: 6.25,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 18000,
      prepaymentsMade: 0,
      leaseIncentivesReceived: 0,
      restorationProvision: 20000,
      reportingDate: '2025-12-31'
    }
  }
];

const STORAGE_KEYS = {
  LEASES: 'finosutra_leases_v1',
  ENTITIES: 'finosutra_entities_v1',
  ACTIVE_ENTITY: 'finosutra_active_entity_v1',
  CURRENT_USER: 'finosutra_current_user_v1',
  SUBSCRIPTION: 'finosutra_subscription_v1',
  AUDIT_LOGS: 'finosutra_audit_logs_v1'
};

export class PortfolioService {
  /**
   * Load stored leases with calculation results
   */
  public static loadLeases(): LeasePortfolioItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEASES);
      let items: LeasePortfolioItem[] = stored ? JSON.parse(stored) : INITIAL_LEASES;
      
      // Calculate results for all leases
      return items.map((item) => {
        try {
          const calcResult = calculateIFRS16(item.input);
          return { ...item, calcResult };
        } catch (e) {
          console.error(`Failed to calculate lease ${item.leaseReference}:`, e);
          return item;
        }
      });
    } catch (e) {
      console.warn('Error reading leases from storage, falling back to initial leases:', e);
      return INITIAL_LEASES.map((item) => ({
        ...item,
        calcResult: calculateIFRS16(item.input)
      }));
    }
  }

  /**
   * Save leases array to localStorage
   */
  public static saveLeases(leases: LeasePortfolioItem[]): void {
    try {
      // Strip calculated results before persisting to minimize size
      const toSave = leases.map(({ calcResult, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEYS.LEASES, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save leases to storage:', e);
    }
  }

  /**
   * Load entities
   */
  public static loadEntities(): OrganizationEntity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENTITIES);
      return stored ? JSON.parse(stored) : INITIAL_ENTITIES;
    } catch {
      return INITIAL_ENTITIES;
    }
  }

  /**
   * Load current user role
   */
  public static loadCurrentUser(): SaaSUser {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  }

  public static saveCurrentUser(user: SaaSUser): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  /**
   * Load subscription status
   */
  public static loadSubscription(): SubscriptionStatus {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      return stored ? JSON.parse(stored) : INITIAL_SUBSCRIPTION;
    } catch {
      return INITIAL_SUBSCRIPTION;
    }
  }

  public static saveSubscription(sub: SubscriptionStatus): void {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  }

  public static switchSubscription(
    planId: SubscriptionPlanId,
    billingCycle: 'MONTHLY' | 'ANNUAL' = 'ANNUAL'
  ): SubscriptionStatus {
    const planInfo = SUBSCRIPTION_PLANS[planId];
    const newSub: SubscriptionStatus = {
      planId,
      planName: planInfo.name,
      billingCycle,
      status: 'ACTIVE',
      activeSince: new Date().toISOString().split('T')[0],
      nextRenewal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seatsUsed: 1,
      seatsMax: planInfo.seatsMax,
      leasesUsed: 1,
      leasesMax: planInfo.leasesMax,
      monthlyPrice: billingCycle === 'ANNUAL' ? planInfo.annualPrice : planInfo.monthlyPrice
    };
    this.saveSubscription(newSub);
    return newSub;
  }

  public static loadAllUsers(): SaaSUser[] {
    try {
      const stored = localStorage.getItem('finosutra_all_users_v1');
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  public static saveAllUsers(users: SaaSUser[]): void {
    localStorage.setItem('finosutra_all_users_v1', JSON.stringify(users));
  }

  /**
   * Load audit logs
   */
  public static loadAuditLogs(): AuditTrailEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public static addAuditLog(event: Omit<AuditTrailEvent, 'id' | 'timestamp'>): void {
    const logs = this.loadAuditLogs();
    const newLog: AuditTrailEvent = {
      ...event,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    logs.unshift(newLog);
    if (logs.length > 100) logs.pop(); // keep last 100
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  /**
   * Calculate consolidated portfolio metrics across a filtered set of leases
   */
  public static computePortfolioConsolidation(leases: LeasePortfolioItem[]): PortfolioConsolidatedMetrics {
    let totalROUAssetInitial = 0;
    let totalROUAssetClosing = 0;
    let totalLeaseLiabilityInitial = 0;
    let totalLeaseLiabilityClosing = 0;
    let totalCurrentLiability = 0;
    let totalNonCurrentLiability = 0;
    let totalAnnualDepreciation = 0;
    let totalAnnualInterestExpense = 0;
    let totalUndiscountedFutureCashFlows = 0;
    let sumIBRWeighted = 0;
    let totalWeight = 0;
    let allAuditsPassed = true;

    const assetClasses: AssetClass[] = [
      'PROPERTY',
      'PLANT_AND_MACHINERY',
      'MOTOR_VEHICLES',
      'IT_AND_OFFICE_EQUIPMENT',
      'OTHER'
    ];

    const byAssetClass: PortfolioConsolidatedMetrics['byAssetClass'] = {
      PROPERTY: { count: 0, rouAsset: 0, leaseLiability: 0, currentLiability: 0, nonCurrentLiability: 0, annualDepreciation: 0, annualInterest: 0 },
      PLANT_AND_MACHINERY: { count: 0, rouAsset: 0, leaseLiability: 0, currentLiability: 0, nonCurrentLiability: 0, annualDepreciation: 0, annualInterest: 0 },
      MOTOR_VEHICLES: { count: 0, rouAsset: 0, leaseLiability: 0, currentLiability: 0, nonCurrentLiability: 0, annualDepreciation: 0, annualInterest: 0 },
      IT_AND_OFFICE_EQUIPMENT: { count: 0, rouAsset: 0, leaseLiability: 0, currentLiability: 0, nonCurrentLiability: 0, annualDepreciation: 0, annualInterest: 0 },
      OTHER: { count: 0, rouAsset: 0, leaseLiability: 0, currentLiability: 0, nonCurrentLiability: 0, annualDepreciation: 0, annualInterest: 0 }
    };

    const byEntity: PortfolioConsolidatedMetrics['byEntity'] = {};

    let mYear1 = 0;
    let mYear2 = 0;
    let mYear3 = 0;
    let mYear4 = 0;
    let mYear5 = 0;
    let mAfter5 = 0;

    for (const lease of leases) {
      const res = lease.calcResult;
      if (!res) continue;

      if (!res.allChecksPassed) {
        allAuditsPassed = false;
      }

      const initialROU = res.initialRouAsset;
      const initialLiab = res.initialLeaseLiability;
      const closingROU = res.reportingBalances.rouAssetNetBookValue;
      const closingLiab = res.reportingBalances.totalLeaseLiability;
      const currentLiab = res.reportingBalances.currentLeaseLiability;
      const nonCurrentLiab = res.reportingBalances.nonCurrentLeaseLiability;

      // Annualized P&L: 12 months amortisation
      // Sum depreciation and interest from first 12 months or schedule
      let leaseDepr12m = 0;
      let leaseInt12m = 0;
      const periodsInYear = lease.input.paymentFrequency === 'MONTHLY' ? 12 : 
                            lease.input.paymentFrequency === 'QUARTERLY' ? 4 : 
                            lease.input.paymentFrequency === 'SEMI_ANNUAL' ? 2 : 1;
      
      const deprRows = res.depreciationSchedule.slice(0, periodsInYear);
      for (const d of deprRows) {
        leaseDepr12m += d.depreciationCharge;
      }
      const amortRows = res.amortisationSchedule.slice(0, periodsInYear);
      for (const a of amortRows) {
        leaseInt12m += a.interestExpense;
      }

      totalROUAssetInitial += initialROU;
      totalROUAssetClosing += closingROU;
      totalLeaseLiabilityInitial += initialLiab;
      totalLeaseLiabilityClosing += closingLiab;
      totalCurrentLiability += currentLiab;
      totalNonCurrentLiability += nonCurrentLiab;
      totalAnnualDepreciation += leaseDepr12m;
      totalAnnualInterestExpense += leaseInt12m;

      // Undiscounted future cash flows
      const undiscounted = res.amortisationSchedule.reduce((s, r) => s + r.paymentAmount, 0);
      totalUndiscountedFutureCashFlows += undiscounted;

      // Weighted average discount rate by initial liability
      sumIBRWeighted += lease.input.annualDiscountRate * initialLiab;
      totalWeight += initialLiab;

      // Asset Class breakdown
      const ac = lease.assetClass || 'OTHER';
      if (!byAssetClass[ac]) {
        byAssetClass[ac] = { count: 0, rouAsset: 0, leaseLiability: 0, currentLiability: 0, nonCurrentLiability: 0, annualDepreciation: 0, annualInterest: 0 };
      }
      byAssetClass[ac].count += 1;
      byAssetClass[ac].rouAsset += closingROU;
      byAssetClass[ac].leaseLiability += closingLiab;
      byAssetClass[ac].currentLiability += currentLiab;
      byAssetClass[ac].nonCurrentLiability += nonCurrentLiab;
      byAssetClass[ac].annualDepreciation += leaseDepr12m;
      byAssetClass[ac].annualInterest += leaseInt12m;

      // Entity breakdown
      const entId = lease.entityId || 'ent-hq';
      if (!byEntity[entId]) {
        byEntity[entId] = {
          entityName: lease.entityName || 'General Entity',
          count: 0,
          rouAsset: 0,
          leaseLiability: 0,
          currentLiability: 0,
          nonCurrentLiability: 0
        };
      }
      byEntity[entId].count += 1;
      byEntity[entId].rouAsset += closingROU;
      byEntity[entId].leaseLiability += closingLiab;
      byEntity[entId].currentLiability += currentLiab;
      byEntity[entId].nonCurrentLiability += nonCurrentLiab;

      // Maturity bands
      mYear1 += res.maturityAnalysis.year1 || 0;
      mYear2 += res.maturityAnalysis.year2 || 0;
      mYear3 += res.maturityAnalysis.year3 || 0;
      mYear4 += res.maturityAnalysis.year4 || 0;
      mYear5 += res.maturityAnalysis.year5 || 0;
      mAfter5 += res.maturityAnalysis.thereafter || 0;
    }

    const totalUndiscountedMaturity = mYear1 + mYear2 + mYear3 + mYear4 + mYear5 + mAfter5;
    const effectOfDiscounting = Math.max(0, totalUndiscountedMaturity - totalLeaseLiabilityClosing);

    return {
      totalLeasesCount: leases.length,
      activeLeasesCount: leases.filter((l) => l.status === 'ACTIVE' || l.status === 'APPROVED').length,
      totalROUAssetInitial,
      totalROUAssetClosing,
      totalLeaseLiabilityInitial,
      totalLeaseLiabilityClosing,
      totalCurrentLiability,
      totalNonCurrentLiability,
      totalAnnualDepreciation,
      totalAnnualInterestExpense,
      totalAnnualPLCharge: totalAnnualDepreciation + totalAnnualInterestExpense,
      totalUndiscountedFutureCashFlows,
      weightedAverageIBR: totalWeight > 0 ? sumIBRWeighted / totalWeight : 0,
      allAuditsPassed,
      byAssetClass,
      byEntity,
      consolidatedMaturity: {
        year1: mYear1,
        year2: mYear2,
        year3: mYear3,
        year4: mYear4,
        year5: mYear5,
        after5Years: mAfter5,
        totalUndiscounted: totalUndiscountedMaturity,
        effectOfDiscounting,
        totalPresentValue: totalLeaseLiabilityClosing
      }
    };
  }
}
