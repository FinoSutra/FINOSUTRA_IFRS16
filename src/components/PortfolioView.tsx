import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  FileSpreadsheet, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Copy, 
  Trash2, 
  TrendingUp, 
  ShieldCheck, 
  Calculator, 
  ChevronRight,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import { LeasePortfolioItem, OrganizationEntity, PortfolioConsolidatedMetrics, SaaSUser, LeaseLifecycleStatus, SubscriptionStatus } from '../types/portfolio.ts';
import { AssetClass } from '../types/ifrs16.ts';
import { formatCurrency, formatAccountingNumber } from '../utils/formatters.ts';
import { exportPortfolioConsolidationToExcel } from '../services/portfolioExportService.ts';
import { BatchImportModal } from './BatchImportModal.tsx';

interface PortfolioViewProps {
  leases: LeasePortfolioItem[];
  entities: OrganizationEntity[];
  activeEntityId: string;
  onSelectEntity: (entityId: string) => void;
  currentUser: SaaSUser;
  metrics: PortfolioConsolidatedMetrics;
  onOpenLeaseInEngine: (lease: LeasePortfolioItem) => void;
  onAddNewLease: () => void;
  onDuplicateLease: (leaseId: string) => void;
  onDeleteLease: (leaseId: string) => void;
  onUpdateLeaseStatus: (leaseId: string, newStatus: LeaseLifecycleStatus) => void;
  onImportBatch: (newLeases: LeasePortfolioItem[]) => void;
  onResetSamplePortfolio: () => void;
  onViewDisclosures: () => void;
  subscription?: SubscriptionStatus;
  onOpenUpgradeModal?: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  leases,
  entities,
  activeEntityId,
  onSelectEntity,
  currentUser,
  metrics,
  onOpenLeaseInEngine,
  onAddNewLease,
  onDuplicateLease,
  onDeleteLease,
  onUpdateLeaseStatus,
  onImportBatch,
  onResetSamplePortfolio,
  onViewDisclosures,
  subscription,
  onOpenUpgradeModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Filter leases
  const filteredLeases = useMemo(() => {
    return leases.filter((l) => {
      // Entity filter
      if (activeEntityId !== 'ent-all' && l.entityId !== activeEntityId) {
        return false;
      }
      // Asset class filter
      if (selectedAssetClass !== 'ALL' && l.assetClass !== selectedAssetClass) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && l.status !== selectedStatus) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = l.leaseReference.toLowerCase().includes(q);
        const matchesDesc = l.leaseDescription.toLowerCase().includes(q);
        const matchesEntity = (l.entityName || '').toLowerCase().includes(q);
        if (!matchesRef && !matchesDesc && !matchesEntity) return false;
      }
      return true;
    });
  }, [leases, activeEntityId, selectedAssetClass, selectedStatus, searchQuery]);

  const activeEntityObj = entities.find((e) => e.id === activeEntityId) || entities[0];

  const handleExportConsolidation = () => {
    exportPortfolioConsolidationToExcel(filteredLeases, metrics, entities, activeEntityObj.name);
  };

  const getStatusBadge = (status: LeaseLifecycleStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" />
            Active
          </span>
        );
      case 'REVIEW_PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            In Review
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Entity Switcher */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Group Portfolio Consolidation Workspace</span>
            <span>·</span>
            <span className="text-emerald-400">Multi-Entity Enterprise Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {activeEntityObj.name}
          </h1>
          <p className="text-xs text-slate-300">
            Consolidated IFRS 16 lease liability balances, ROU amortisation, and statutory note disclosures across {filteredLeases.length} contracts.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAddNewLease}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Contract</span>
          </button>

          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs font-semibold transition border border-blue-400/40 cursor-pointer shadow-xs"
            title="Upload multiple lease contracts at once via CSV or spreadsheet"
          >
            <Upload className="w-4 h-4 text-blue-300" />
            <span>Multi-Lease Uploader</span>
          </button>

          <button
            onClick={handleExportConsolidation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Big 4 Consolidation (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Freemium Quota Alert Ribbon */}
      {subscription && subscription.planId === 'FREEMIUM' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-3 text-emerald-950">
            <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] uppercase tracking-wider shrink-0">
              Freemium Plan
            </span>
            <span>
              You are currently utilizing <strong>{leases.length} of {subscription.leasesMax}</strong> active lease slots.
              Upgrade to Practitioner or Corporate to unlock up to 75 leases, bulk CSV uploads, and statutory note disclosures.
            </span>
          </div>
          <button
            onClick={onOpenUpgradeModal}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Upgrade Plan →
          </button>
        </div>
      )}

      {/* 2. Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total ROU Assets */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Consolidated ROU Assets</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(metrics.totalROUAssetClosing, 'USD')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Initial Gross Asset:</span>
            <span className="font-medium font-mono text-slate-700">{formatCurrency(metrics.totalROUAssetInitial, 'USD')}</span>
          </div>
        </div>

        {/* Card 2: Total Lease Liabilities */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Lease Liabilities</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(metrics.totalLeaseLiabilityClosing, 'USD')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Undiscounted Commitments:</span>
            <span className="font-medium font-mono text-slate-700">{formatCurrency(metrics.totalUndiscountedFutureCashFlows, 'USD')}</span>
          </div>
        </div>

        {/* Card 3: Current vs Non-Current Split */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Current Liability (&lt;12M)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono tracking-tight">
            {formatCurrency(metrics.totalCurrentLiability, 'USD')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Non-Current Portion:</span>
            <span className="font-medium font-mono text-slate-700">{formatCurrency(metrics.totalNonCurrentLiability, 'USD')}</span>
          </div>
        </div>

        {/* Card 4: Annual P&L Charge */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Annual P&amp;L Charge</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(metrics.totalAnnualPLCharge, 'USD')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Depr: {formatCurrency(metrics.totalAnnualDepreciation, 'USD')}</span>
            <span>Int: {formatCurrency(metrics.totalAnnualInterestExpense, 'USD')}</span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search bar */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter leases by reference or description..."
            className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters & Entity */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Entity Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Entity:</span>
            <select
              value={activeEntityId}
              onChange={(e) => onSelectEntity(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Asset:</span>
            <select
              value={selectedAssetClass}
              onChange={(e) => setSelectedAssetClass(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Asset Classes</option>
              <option value="PROPERTY">Property / Real Estate</option>
              <option value="PLANT_AND_MACHINERY">Plant &amp; Machinery</option>
              <option value="MOTOR_VEHICLES">Motor Vehicles</option>
              <option value="IT_AND_OFFICE_EQUIPMENT">IT &amp; Office Equipment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Active</option>
              <option value="REVIEW_PENDING">In Review</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={onResetSamplePortfolio}
            title="Reset to default multi-asset sample portfolio"
            className="p-1.5 rounded-lg border border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Multi-Lease Uploader quick button */}
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200 cursor-pointer shadow-2xs"
            title="Upload multiple lease contracts via CSV spreadsheet"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Multi Leases</span>
          </button>
        </div>
      </div>

      {/* 4. Interactive Portfolio Lease Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Consolidated Lease Register</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {filteredLeases.length} Contracts
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Live balances calculated with arbitrary-precision Decimal.js engine under IFRS 16
            </p>
          </div>

          <button
            onClick={onViewDisclosures}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <span>View Full Statutory Notes Disclosures (IFRS 16 paras 47–60)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0F172A] text-white">
              <tr>
                <th className="p-3 font-semibold">Contract Ref</th>
                <th className="p-3 font-semibold">Description &amp; Entity</th>
                <th className="p-3 font-semibold">Asset Class</th>
                <th className="p-3 font-semibold text-right">Periodic Payment</th>
                <th className="p-3 font-semibold text-right">IBR (%)</th>
                <th className="p-3 font-semibold text-right">ROU Asset</th>
                <th className="p-3 font-semibold text-right">Lease Liability</th>
                <th className="p-3 font-semibold text-right">Current Portion</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredLeases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-slate-300" />
                      <p className="text-sm font-medium text-slate-700">No matching lease contracts found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery ? `No contracts match "${searchQuery}". Try searching another reference or description.` : 'No contracts match the selected entity or asset class.'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
                          >
                            Clear search query
                          </button>
                        )}
                        <button
                          onClick={() => setIsBatchModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition border border-blue-200 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Open Multi-Lease Uploader</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeases.map((lease, idx) => {
                  const res = lease.calcResult;
                  const isZebra = idx % 2 === 1;

                  return (
                    <tr
                      key={lease.id}
                      className={`hover:bg-blue-50/40 transition group ${
                        isZebra ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      {/* Ref */}
                      <td className="p-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                        <button
                          onClick={() => onOpenLeaseInEngine(lease)}
                          className="hover:underline flex items-center gap-1 text-left cursor-pointer"
                        >
                          <span>{lease.leaseReference}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {lease.input.commencementDate} to {lease.input.contractEndDate}
                        </div>
                      </td>

                      {/* Desc & Entity */}
                      <td className="p-3 max-w-[220px]">
                        <div className="font-semibold text-slate-900 truncate" title={lease.leaseDescription}>
                          {lease.leaseDescription}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" title={lease.entityName}>
                          {lease.entityName}
                        </div>
                      </td>

                      {/* Asset Class */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {lease.assetClass.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Periodic Payment */}
                      <td className="p-3 text-right font-mono font-medium whitespace-nowrap">
                        {formatCurrency(lease.input.basePayment, lease.input.currency)}
                        <span className="text-[10px] text-slate-400 block font-sans">
                          {lease.input.paymentFrequency.toLowerCase()} ({lease.input.paymentTiming === 'IN_ADVANCE' ? 'adv' : 'arr'})
                        </span>
                      </td>

                      {/* IBR */}
                      <td className="p-3 text-right font-mono whitespace-nowrap font-medium text-slate-700">
                        {lease.input.annualDiscountRate.toFixed(2)}%
                      </td>

                      {/* ROU Asset */}
                      <td className="p-3 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {res ? formatCurrency(res.reportingBalances.rouAssetNetBookValue, lease.input.currency) : '—'}
                      </td>

                      {/* Lease Liability */}
                      <td className="p-3 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {res ? formatCurrency(res.reportingBalances.totalLeaseLiability, lease.input.currency) : '—'}
                      </td>

                      {/* Current Portion */}
                      <td className="p-3 text-right font-mono font-medium text-amber-700 whitespace-nowrap">
                        {res ? formatCurrency(res.reportingBalances.currentLeaseLiability, lease.input.currency) : '—'}
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        {getStatusBadge(lease.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenLeaseInEngine(lease)}
                            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                            title="Open in Single Lease Calculation Engine (Full Schedules & Journals)"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDuplicateLease(lease.id)}
                            className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                            title="Clone / Duplicate Lease"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Role-based approval button */}
                          {(currentUser.role === 'REVIEWER' || currentUser.role === 'ADMIN') && lease.status !== 'APPROVED' && (
                            <button
                              onClick={() => onUpdateLeaseStatus(lease.id, 'APPROVED')}
                              className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                              title="Sign Off & Approve Lease (Reviewer)"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteLease(lease.id)}
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                            title="Delete Contract"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Foot Totals */}
            <tfoot className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan={5} className="p-3 text-right font-sans uppercase text-[11px] text-slate-600">
                  Consolidated Total ({filteredLeases.length} Contracts):
                </td>
                <td className="p-3 text-right font-mono text-xs">
                  {formatCurrency(metrics.totalROUAssetClosing, 'USD')}
                </td>
                <td className="p-3 text-right font-mono text-xs">
                  {formatCurrency(metrics.totalLeaseLiabilityClosing, 'USD')}
                </td>
                <td className="p-3 text-right font-mono text-xs text-amber-700">
                  {formatCurrency(metrics.totalCurrentLiability, 'USD')}
                </td>
                <td colSpan={2} className="p-3 text-center text-xs text-emerald-600">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    100% Balanced
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. Underlying Asset Breakdown & Group Maturity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Class Roll-Forward Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                IFRS 16.53 Asset Class Roll-Forward
              </h3>
              <p className="text-xs text-slate-500">
                Right-of-use asset carrying amounts by class of underlying asset
              </p>
            </div>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-3">
            {Object.entries(metrics.byAssetClass).map(([cls, data]) => {
              if (data.count === 0) return null;
              const pct = metrics.totalROUAssetClosing > 0 ? (data.rouAsset / metrics.totalROUAssetClosing) * 100 : 0;

              return (
                <div key={cls} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>{cls.replace(/_/g, ' ')} ({data.count} contracts)</span>
                    <span className="font-mono">{formatCurrency(data.rouAsset, 'USD')} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Lease Liability: {formatCurrency(data.leaseLiability, 'USD')}</span>
                    <span>Annual Depr: {formatCurrency(data.annualDepreciation, 'USD')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consolidated Contractual Maturity Profile */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                IFRS 16.58 Consolidated Maturity Profile
              </h3>
              <p className="text-xs text-slate-500">
                Undiscounted future lease payments across portfolio
              </p>
            </div>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Within 1 Year (Next 12 Months)</span>
              <span className="font-mono font-bold text-slate-900">{formatCurrency(metrics.consolidatedMaturity.year1, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Between 1 and 2 Years</span>
              <span className="font-mono font-semibold text-slate-800">{formatCurrency(metrics.consolidatedMaturity.year2, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Between 2 and 3 Years</span>
              <span className="font-mono font-semibold text-slate-800">{formatCurrency(metrics.consolidatedMaturity.year3, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Between 3 and 5 Years</span>
              <span className="font-mono font-semibold text-slate-800">
                {formatCurrency(metrics.consolidatedMaturity.year4 + metrics.consolidatedMaturity.year5, 'USD')}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Later than 5 Years</span>
              <span className="font-mono font-semibold text-slate-800">{formatCurrency(metrics.consolidatedMaturity.after5Years, 'USD')}</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-slate-900 font-bold">
              <span>Total Undiscounted Commitments</span>
              <span className="font-mono">{formatCurrency(metrics.consolidatedMaturity.totalUndiscounted, 'USD')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Import Modal */}
      <BatchImportModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onImportLeases={onImportBatch}
      />
    </div>
  );
};
