import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Table, 
  BookMarked, 
  Landmark, 
  Scale, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  ShieldCheck,
  Building,
  ArrowRight,
  ExternalLink,
  FileText,
  Save,
  Check,
  ArrowLeft,
  Upload
} from 'lucide-react';

import { LeaseContractInput, IFRS16CalculationResult } from './types/ifrs16.ts';
import { 
  LeasePortfolioItem, 
  OrganizationEntity, 
  SaaSUser, 
  SubscriptionStatus, 
  SubscriptionPlanId,
  AuditTrailEvent, 
  LeaseLifecycleStatus 
} from './types/portfolio.ts';
import { GOLDEN_TEST_PRESETS, TestPreset } from './engine/testPresets.ts';
import { calculateIFRS16, validateLeaseInput } from './engine/ifrs16Engine.ts';
import { 
  PortfolioService, 
  INITIAL_ENTITIES, 
  INITIAL_LEASES 
} from './services/portfolioService.ts';

import { Header, MainNavPage } from './components/Header.tsx';
import { ProductOverview } from './components/ProductOverview.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { CompanyProfile } from './components/CompanyProfile.tsx';
import { PortfolioView } from './components/PortfolioView.tsx';
import { ConsolidatedDisclosuresView } from './components/ConsolidatedDisclosuresView.tsx';
import { WorkspaceSettingsView } from './components/WorkspaceSettingsView.tsx';
import { BatchImportModal } from './components/BatchImportModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { UpgradeModal } from './components/UpgradeModal.tsx';
import { LeaseInputForm } from './components/LeaseInputForm.tsx';
import { MetricsCards } from './components/MetricsCards.tsx';
import { AmortisationScheduleTable } from './components/AmortisationScheduleTable.tsx';
import { DepreciationScheduleTable } from './components/DepreciationScheduleTable.tsx';
import { JournalEntriesView } from './components/JournalEntriesView.tsx';
import { BalanceSheetPresentation } from './components/BalanceSheetPresentation.tsx';
import { ReconciliationPanel } from './components/ReconciliationPanel.tsx';
import { TechnicalReferenceModal } from './components/TechnicalReferenceModal.tsx';
import { AuditReportView } from './components/AuditReportView.tsx';
import { exportCalculationToExcel } from './services/exportService.ts';

export default function App() {
  // Navigation State (Defaults to SaaS Portfolio Hub)
  const [activePage, setActivePage] = useState<MainNavPage>('PORTFOLIO');

  // Portfolio State (Loaded from storage or initial seed)
  const [leases, setLeases] = useState<LeasePortfolioItem[]>(() => PortfolioService.loadLeases());
  const [entities, setEntities] = useState<OrganizationEntity[]>(() => PortfolioService.loadEntities());
  const [activeEntityId, setActiveEntityId] = useState<string>('ent-all');
  const [currentUser, setCurrentUser] = useState<SaaSUser>(() => PortfolioService.loadCurrentUser());
  const [subscription, setSubscription] = useState<SubscriptionStatus>(() => PortfolioService.loadSubscription());
  const [auditLogs, setAuditLogs] = useState<AuditTrailEvent[]>(() => PortfolioService.loadAuditLogs());

  // Currently active lease in single-lease calculation engine
  const [currentLeaseId, setCurrentLeaseId] = useState<string>(leases[0]?.id || 'lease-001');
  const [currentInput, setCurrentInput] = useState<LeaseContractInput>(leases[0]?.input || GOLDEN_TEST_PRESETS[0].input);
  const [activePresetId, setActivePresetId] = useState<string>('CUSTOM');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Active result tab inside single lease calculation engine
  const [activeResultTab, setActiveResultTab] = useState<
    'AMORTISATION' | 'DEPRECIATION' | 'JOURNALS' | 'PRESENTATION' | 'RECONCILIATION' | 'AUDIT_MEMO'
  >('AMORTISATION');

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Synchronize leases to localStorage whenever modified
  useEffect(() => {
    PortfolioService.saveLeases(leases);
  }, [leases]);

  // Synchronize user & subscription
  useEffect(() => {
    PortfolioService.saveCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    PortfolioService.saveSubscription(subscription);
  }, [subscription]);

  // Compute portfolio consolidated metrics across currently active scope
  const portfolioMetrics = useMemo(() => {
    const scopeLeases = activeEntityId === 'ent-all' 
      ? leases 
      : leases.filter((l) => l.entityId === activeEntityId);
    return PortfolioService.computePortfolioConsolidation(scopeLeases);
  }, [leases, activeEntityId]);

  // Single Lease Calculation Execution
  const validationWarnings = useMemo(() => {
    return validateLeaseInput(currentInput);
  }, [currentInput]);

  const calcResult = useMemo<IFRS16CalculationResult>(() => {
    return calculateIFRS16(currentInput);
  }, [currentInput]);

  // Handler: When user edits input in the single lease form
  const handleInputChange = (newInput: LeaseContractInput) => {
    setCurrentInput(newInput);
    setHasUnsavedChanges(true);

    // Also update in leases array if matched
    setLeases((prev) =>
      prev.map((l) => {
        if (l.id === currentLeaseId) {
          const updatedCalc = calculateIFRS16(newInput);
          return {
            ...l,
            leaseReference: newInput.leaseReference,
            leaseDescription: newInput.leaseDescription,
            assetClass: newInput.assetClass,
            input: newInput,
            calcResult: updatedCalc,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return l;
      })
    );
  };

  // Handler: Drill down into a lease from the portfolio
  const handleOpenLeaseInEngine = (lease: LeasePortfolioItem) => {
    setCurrentLeaseId(lease.id);
    setCurrentInput(lease.input);
    setActivePresetId('CUSTOM');
    setHasUnsavedChanges(false);
    setActivePage('ENGINE');
  };

  // Handler: Add a new lease
  const handleAddNewLease = () => {
    if (subscription.leasesMax !== -1 && leases.length >= subscription.leasesMax) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const newId = `lease-${Date.now()}`;
    const nextRef = `LSE-NEW-00${leases.length + 1}`;
    const targetEntity = entities.find((e) => e.id === activeEntityId && e.id !== 'ent-all') || entities[1] || entities[0];

    const newInput: LeaseContractInput = {
      leaseReference: nextRef,
      leaseDescription: 'New Commercial Property Lease',
      lesseeEntity: targetEntity.name,
      assetClass: 'PROPERTY',
      currency: targetEntity.currency || 'USD',
      commencementDate: '2026-01-01',
      contractEndDate: '2030-12-31',
      hasRenewalOption: false,
      hasTerminationOption: false,
      shortTermElection: false,
      lowValueElection: false,
      paymentFrequency: 'MONTHLY',
      paymentTiming: 'IN_ARREARS',
      basePayment: 25000,
      rentFreePeriods: 0,
      escalationType: 'NONE',
      escalationRate: 0,
      discountRateType: 'IBR',
      annualDiscountRate: 5.5,
      compoundingConvention: 'NOMINAL_ANNUAL',
      initialDirectCosts: 5000,
      prepaymentsMade: 0,
      leaseIncentivesReceived: 0,
      restorationProvision: 0,
      reportingDate: '2026-12-31'
    };

    const newLeaseItem: LeasePortfolioItem = {
      id: newId,
      leaseReference: nextRef,
      leaseDescription: 'New Commercial Property Lease',
      entityId: targetEntity.id,
      entityName: targetEntity.name,
      assetClass: 'PROPERTY',
      status: 'DRAFT',
      assignedPreparer: currentUser.name,
      costCenter: 'CC-NEW',
      notes: 'Initial draft lease contract.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      input: newInput,
      calcResult: calculateIFRS16(newInput)
    };

    setLeases((prev) => [newLeaseItem, ...prev]);
    setCurrentLeaseId(newId);
    setCurrentInput(newInput);
    setActivePresetId('CUSTOM');
    setActivePage('ENGINE');

    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'CREATE',
      leaseRef: nextRef,
      summary: `Created new lease contract ${nextRef} under ${targetEntity.name}.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: Clone a lease
  const handleDuplicateLease = (leaseId: string) => {
    if (subscription.leasesMax !== -1 && leases.length >= subscription.leasesMax) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const target = leases.find((l) => l.id === leaseId);
    if (!target) return;

    const clonedRef = `${target.leaseReference}-COPY`;
    const clonedInput: LeaseContractInput = {
      ...target.input,
      leaseReference: clonedRef,
      leaseDescription: `${target.leaseDescription} (Copy)`
    };

    const clonedItem: LeasePortfolioItem = {
      ...target,
      id: `lease-${Date.now()}`,
      leaseReference: clonedRef,
      leaseDescription: `${target.leaseDescription} (Copy)`,
      status: 'DRAFT',
      approvedBy: undefined,
      approvedAt: undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      input: clonedInput,
      calcResult: calculateIFRS16(clonedInput)
    };

    setLeases((prev) => [clonedItem, ...prev]);

    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'CREATE',
      leaseRef: clonedRef,
      summary: `Duplicated contract ${target.leaseReference} to create ${clonedRef}.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: Delete a lease
  const handleDeleteLease = (leaseId: string) => {
    const target = leases.find((l) => l.id === leaseId);
    if (!target) return;
    if (leases.length <= 1) {
      alert('Portfolio must contain at least one lease contract.');
      return;
    }

    setLeases((prev) => prev.filter((l) => l.id !== leaseId));

    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'REJECT',
      leaseRef: target.leaseReference,
      summary: `Deleted lease contract ${target.leaseReference} from portfolio.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: Update lease approval lifecycle status
  const handleUpdateLeaseStatus = (leaseId: string, newStatus: LeaseLifecycleStatus) => {
    setLeases((prev) =>
      prev.map((l) => {
        if (l.id === leaseId) {
          return {
            ...l,
            status: newStatus,
            approvedBy: newStatus === 'APPROVED' ? currentUser.name : l.approvedBy,
            approvedAt: newStatus === 'APPROVED' ? new Date().toISOString().split('T')[0] : l.approvedAt
          };
        }
        return l;
      })
    );

    const target = leases.find((l) => l.id === leaseId);
    if (target) {
      PortfolioService.addAuditLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: newStatus === 'APPROVED' ? 'APPROVE' : 'UPDATE',
        leaseRef: target.leaseReference,
        summary: `Status updated to ${newStatus} by ${currentUser.name}.`
      });
      setAuditLogs(PortfolioService.loadAuditLogs());
    }
  };

  // Handler: Batch CSV Import
  const handleImportBatch = (newLeases: LeasePortfolioItem[]) => {
    const computed = newLeases.map((item) => ({
      ...item,
      calcResult: calculateIFRS16(item.input)
    }));

    setLeases((prev) => [...computed, ...prev]);

    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'IMPORT_BATCH',
      leaseRef: 'BATCH',
      summary: `Batch imported ${newLeases.length} lease contracts via CSV template.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: Reset to Sample Portfolio
  const handleResetSamplePortfolio = () => {
    const sample = INITIAL_LEASES.map((item) => ({
      ...item,
      calcResult: calculateIFRS16(item.input)
    }));
    setLeases(sample);
    PortfolioService.saveLeases(sample);

    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'UPDATE',
      leaseRef: 'ALL',
      summary: 'Reset portfolio to standard Big-4 sample portfolio.'
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: Golden Test Preset Selection
  const handleSelectPreset = (preset: TestPreset) => {
    setCurrentInput(preset.input);
    setActivePresetId(preset.id);
    setHasUnsavedChanges(true);
  };

  // Handler: Import single JSON
  const handleImportJSON = (imported: LeaseContractInput) => {
    setCurrentInput(imported);
    setActivePresetId('CUSTOM');
    setHasUnsavedChanges(true);
  };

  // Handler: Add Entity
  const handleAddEntity = (newEntity: OrganizationEntity) => {
    const updated = [...entities, newEntity];
    setEntities(updated);
    localStorage.setItem('finosutra_entities_v1', JSON.stringify(updated));

    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'CREATE',
      leaseRef: newEntity.legalEntityCode,
      summary: `Registered new reporting legal entity: ${newEntity.name}.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: Change Subscription Plan
  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    const newSub = PortfolioService.switchSubscription(planId, subscription.billingCycle);
    setSubscription(newSub);
    PortfolioService.addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'PLAN_CHANGED',
      leaseRef: 'SUBSCRIPTION',
      summary: `Switched subscription plan to ${newSub.planName} (${newSub.leasesMax === -1 ? 'Unlimited' : `${newSub.leasesMax} leases`}).`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: User Login
  const handleLogin = (user: SaaSUser) => {
    setCurrentUser(user);
    if (user.planId) {
      const newSub = PortfolioService.switchSubscription(user.planId);
      setSubscription(newSub);
    }
    PortfolioService.addAuditLog({
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      leaseRef: 'SECURITY',
      summary: `User ${user.name} logged into Finosutra workspace.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: User Sign Up & Account Provisioning
  const handleRegister = (newUser: SaaSUser, newEntity: OrganizationEntity, planId: SubscriptionPlanId) => {
    setCurrentUser(newUser);
    const updatedEntities = [newEntity, ...entities];
    setEntities(updatedEntities);
    setActiveEntityId(newEntity.id);
    localStorage.setItem('finosutra_entities_v1', JSON.stringify(updatedEntities));

    const newSub = PortfolioService.switchSubscription(planId);
    setSubscription(newSub);

    PortfolioService.addAuditLog({
      userName: newUser.name,
      userRole: newUser.role,
      action: 'USER_REGISTERED',
      leaseRef: newEntity.legalEntityCode,
      summary: `New account registered for ${newUser.name} with ${newEntity.name} under ${newSub.planName}.`
    });
    setAuditLogs(PortfolioService.loadAuditLogs());
  };

  // Handler: User Logout
  const handleLogout = () => {
    const guestUser: SaaSUser = {
      id: 'usr-guest',
      name: 'Guest User',
      email: 'guest@finosutra.com',
      role: 'PREPARER',
      title: 'Visiting Evaluator',
      avatarColor: 'bg-slate-600',
      planId: 'FREEMIUM'
    };
    setCurrentUser(guestUser);
    const freeSub = PortfolioService.switchSubscription('FREEMIUM');
    setSubscription(freeSub);
  };

  const currentPreset = GOLDEN_TEST_PRESETS.find((p) => p.id === activePresetId);
  const activeEntityObj = entities.find((e) => e.id === activeEntityId) || entities[0];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans">
      {/* 1. Top Enterprise Website & Application Header */}
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        currentInput={currentInput}
        calcResult={calcResult}
        onSelectPreset={handleSelectPreset}
        onImportJSON={handleImportJSON}
        onOpenHelp={() => setIsHelpOpen(true)}
        currentUser={currentUser}
        activeEntity={activeEntityObj}
        subscription={subscription}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenMultiLeaseUploader={() => setIsBatchModalOpen(true)}
      />

      {/* 2. Main Page Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: PORTFOLIO DASHBOARD (Core SaaS Hub) */}
        {activePage === 'PORTFOLIO' && (
          <PortfolioView
            leases={leases}
            entities={entities}
            activeEntityId={activeEntityId}
            onSelectEntity={setActiveEntityId}
            currentUser={currentUser}
            metrics={portfolioMetrics}
            onOpenLeaseInEngine={handleOpenLeaseInEngine}
            onAddNewLease={handleAddNewLease}
            onDuplicateLease={handleDuplicateLease}
            onDeleteLease={handleDeleteLease}
            onUpdateLeaseStatus={handleUpdateLeaseStatus}
            onImportBatch={handleImportBatch}
            onResetSamplePortfolio={handleResetSamplePortfolio}
            onViewDisclosures={() => setActivePage('DISCLOSURES')}
            subscription={subscription}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        )}

        {/* VIEW 2: CONSOLIDATED NOTE DISCLOSURES (IFRS 16.47–60) */}
        {activePage === 'DISCLOSURES' && (
          <ConsolidatedDisclosuresView
            metrics={portfolioMetrics}
            entities={entities}
            leases={leases}
            activeEntityName={activeEntityObj.name}
          />
        )}

        {/* VIEW 3: WORKSPACE SETTINGS & BILLING HUB */}
        {activePage === 'SETTINGS' && (
          <WorkspaceSettingsView
            entities={entities}
            onAddEntity={handleAddEntity}
            currentUser={currentUser}
            onChangeUser={setCurrentUser}
            subscription={subscription}
            onUpdateSubscription={setSubscription}
            auditLogs={auditLogs}
            onNavigateToPricing={() => setActivePage('PRICING')}
          />
        )}

        {/* VIEW 4: PRODUCT / MARKETING OVERVIEW */}
        {activePage === 'PRODUCT' && (
          <ProductOverview
            onLaunchEngine={() => setActivePage('PORTFOLIO')}
            onViewPricing={() => setActivePage('PRICING')}
          />
        )}

        {/* VIEW 5: COMMERCIAL SAAS PRICING */}
        {activePage === 'PRICING' && (
          <PricingSection
            activePlanId={subscription.planId}
            onSelectPlan={(planId) => {
              handleSelectPlan(planId);
            }}
          />
        )}

        {/* VIEW 6: COMPANY PROFILE & ABOUT */}
        {activePage === 'PROFILE' && <CompanyProfile />}

        {/* VIEW 7: SINGLE LEASE CALCULATION ENGINE */}
        {activePage === 'ENGINE' && (
          <div className="space-y-6">
            {/* Top Return to Portfolio Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivePage('PORTFOLIO')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  title="Return to Portfolio Register"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-blue-600">{currentInput.leaseReference}</span>
                    <span>·</span>
                    <span>{currentInput.leaseDescription}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Entity: {currentInput.lesseeEntity} | Asset: {currentInput.assetClass} | Term: {currentInput.commencementDate} to {currentInput.contractEndDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBatchModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200 cursor-pointer shadow-2xs"
                  title="Need to import multiple lease contracts at once? Open Multi-Lease Uploader"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Multi-Lease Uploader</span>
                </button>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Synced to Portfolio
                </span>
                <button
                  onClick={() => exportCalculationToExcel(calcResult)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Big 4 Excel</span>
                </button>
              </div>
            </div>

            {/* Scenario Context Card */}
            {currentPreset && (
              <div className="bg-[#0F172A] text-white rounded-xl p-4 shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-blue-400">
                      {currentPreset.tag}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300 font-medium">
                      {currentPreset.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {currentPreset.description}
                  </p>
                  <div className="text-[11px] text-amber-300/90 font-medium pt-0.5">
                    Accounting Focus: {currentPreset.accountingNote}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveResultTab('AUDIT_MEMO')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Audit Memorandum (Big 4)</span>
                  </button>

                  <button
                    onClick={() => exportCalculationToExcel(calcResult)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export Big 4 Excel (.xlsx)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Key Measurement Metrics Ribbon */}
            <MetricsCards result={calcResult} />

            {/* Two-Section Layout: Inputs Wizard + Schedules & Journals */}
            <div className="space-y-6">
              {/* Section A: Lease Assumptions Input Wizard */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    Lease Contract Inputs &amp; Accounting Assumptions
                  </h2>
                  <span className="text-xs text-slate-500">
                    Arbitrary-precision Decimal.js calculation active
                  </span>
                </div>
                <LeaseInputForm
                  input={currentInput}
                  onChange={handleInputChange}
                  warnings={validationWarnings}
                />
              </div>

              {/* Section B: Financial Reporting Output Workspace */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      IFRS 16 Financial Schedules, Ledgers &amp; Disclosures
                    </h2>
                  </div>

                  {/* View Switcher Tabs */}
                  <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                    <button
                      onClick={() => setActiveResultTab('AMORTISATION')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                        activeResultTab === 'AMORTISATION'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>Liability Amortisation</span>
                    </button>

                    <button
                      onClick={() => setActiveResultTab('DEPRECIATION')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                        activeResultTab === 'DEPRECIATION'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>ROU Depreciation</span>
                    </button>

                    <button
                      onClick={() => setActiveResultTab('JOURNALS')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                        activeResultTab === 'JOURNALS'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>Journal Entries</span>
                    </button>

                    <button
                      onClick={() => setActiveResultTab('PRESENTATION')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                        activeResultTab === 'PRESENTATION'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Balance Sheet &amp; Disclosures</span>
                    </button>

                    <button
                      onClick={() => setActiveResultTab('RECONCILIATION')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                        activeResultTab === 'RECONCILIATION'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Audit Reconciliations</span>
                      {calcResult.allChecksPassed && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                      )}
                    </button>

                    <button
                      onClick={() => setActiveResultTab('AUDIT_MEMO')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                        activeResultTab === 'AUDIT_MEMO'
                          ? 'bg-[#0F172A] text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Big 4 Audit Memo (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Tab Panes */}
                <div>
                  {activeResultTab === 'AMORTISATION' && (
                    <AmortisationScheduleTable
                      schedule={calcResult.amortisationSchedule}
                      currency={currentInput.currency}
                    />
                  )}

                  {activeResultTab === 'DEPRECIATION' && (
                    <DepreciationScheduleTable
                      schedule={calcResult.depreciationSchedule}
                      currency={currentInput.currency}
                    />
                  )}

                  {activeResultTab === 'JOURNALS' && (
                    <JournalEntriesView
                      entries={calcResult.journalEntries}
                      currency={currentInput.currency}
                    />
                  )}

                  {activeResultTab === 'PRESENTATION' && (
                    <BalanceSheetPresentation result={calcResult} />
                  )}

                  {activeResultTab === 'RECONCILIATION' && (
                    <ReconciliationPanel
                      checks={calcResult.reconciliationChecks}
                      allPassed={calcResult.allChecksPassed}
                      currency={currentInput.currency}
                    />
                  )}

                  {activeResultTab === 'AUDIT_MEMO' && (
                    <AuditReportView result={calcResult} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Professional Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Finosutra IFRS 16</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">Enterprise Lease Accounting SaaS</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Built by Chartered Accountants to automate multi-entity lessee accounting, journal generation, and statutory disclosures.
              </p>
            </div>

            {/* Footer Navigation Links */}
            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
              <button
                onClick={() => setActivePage('PORTFOLIO')}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Portfolio Hub
              </button>
              <button
                onClick={() => setActivePage('ENGINE')}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Single Lease Engine
              </button>
              <button
                onClick={() => setActivePage('DISCLOSURES')}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Notes Disclosures
              </button>
              <button
                onClick={() => setActivePage('SETTINGS')}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Workspace &amp; Billing
              </button>
              <button
                onClick={() => setActivePage('PRICING')}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Pricing Plans
              </button>
              <a
                href="https://www.finosutra.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition inline-flex items-center gap-1"
              >
                <span>finosutra.com</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://github.com/FinoSutra/IFRS16"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition inline-flex items-center gap-1 font-medium text-slate-600"
                title="View Finosutra IFRS 16 source repository on GitHub"
              >
                <span>GitHub (FinoSutra/IFRS16)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © {new Date().getFullYear()} Finosutra Financial Technologies. All rights reserved.
            </div>

            <div className="flex items-center gap-3">
              <span>IFRS 16 &amp; IAS 1 Compliant</span>
              <span>·</span>
              <span>Arbitrary Decimal Precision</span>
              <span>·</span>
              <span>SOC 1 &amp; SOX Ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Technical Reference Modal */}
      <TechnicalReferenceModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 5. User Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        subscription={subscription}
        onOpenPricing={() => {
          setIsAuthModalOpen(false);
          setActivePage('PRICING');
        }}
      />

      {/* 6. Subscription Quota & Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentSubscription={subscription}
        currentLeaseCount={leases.length}
        onSelectPlan={(planId) => {
          handleSelectPlan(planId);
        }}
      />

      {/* 7. Multi-Lease Uploader Modal */}
      <BatchImportModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onImportLeases={(newLeases) => {
          handleImportBatch(newLeases);
          setIsBatchModalOpen(false);
          setActivePage('PORTFOLIO');
        }}
      />
    </div>
  );
}
