import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Key, 
  History, 
  Check, 
  Sparkles, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle,
  ExternalLink,
  GitBranch
} from 'lucide-react';
import { 
  OrganizationEntity, 
  SaaSUser, 
  SubscriptionStatus, 
  BillingInvoice, 
  AuditTrailEvent, 
  UserRole,
  SubscriptionPlanId 
} from '../types/portfolio.ts';
import { INITIAL_USERS, INITIAL_INVOICES } from '../services/portfolioService.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface WorkspaceSettingsViewProps {
  entities: OrganizationEntity[];
  onAddEntity: (entity: OrganizationEntity) => void;
  currentUser: SaaSUser;
  onChangeUser: (user: SaaSUser) => void;
  subscription: SubscriptionStatus;
  onUpdateSubscription: (newSub: SubscriptionStatus) => void;
  auditLogs: AuditTrailEvent[];
  onNavigateToPricing: () => void;
}

export const WorkspaceSettingsView: React.FC<WorkspaceSettingsViewProps> = ({
  entities,
  onAddEntity,
  currentUser,
  onChangeUser,
  subscription,
  onUpdateSubscription,
  auditLogs,
  onNavigateToPricing
}) => {
  const [activeTab, setActiveTab] = useState<'BILLING' | 'ENTITIES' | 'TEAM' | 'INTEGRATIONS' | 'AUDIT_TRAIL'>('BILLING');
  
  // Entity Form Modal State
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityCode, setNewEntityCode] = useState('');
  const [newEntityCountry, setNewEntityCountry] = useState('United States');
  const [newEntityCurrency, setNewEntityCurrency] = useState('USD');

  // Simulated API Key State
  const [apiKey, setApiKey] = useState('fino_live_sk_8f7b2c91a0e44583b271d990');
  const [isKeyCopied, setIsKeyCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsKeyCopied(true);
    setTimeout(() => setIsKeyCopied(false), 2000);
  };

  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    const newEntity: OrganizationEntity = {
      id: `ent-${Date.now()}`,
      name: newEntityName,
      legalEntityCode: newEntityCode || `ENT-${Math.floor(100 + Math.random() * 900)}`,
      country: newEntityCountry,
      currency: newEntityCurrency,
      fiscalYearEnd: '12-31',
      taxId: `TAX-${Math.floor(100000 + Math.random() * 900000)}`
    };

    onAddEntity(newEntity);
    setNewEntityName('');
    setNewEntityCode('');
    setIsAddEntityOpen(false);
  };

  const handleSimulateUpgrade = (planId: SubscriptionPlanId, planName: string, maxLeases: number, maxSeats: number, price: number) => {
    onUpdateSubscription({
      ...subscription,
      planId,
      planName,
      leasesMax: maxLeases,
      seatsMax: maxSeats,
      monthlyPrice: price
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Enterprise Workspace Administration</span>
            <span>·</span>
            <span className="text-emerald-400">Subscription &amp; Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workspace Hub &amp; Billing Portal
          </h1>
          <p className="text-xs text-slate-300">
            Manage corporate reporting entities, team roles, billing plans, ERP integrations, and compliance audit trails.
          </p>
        </div>

        {/* User Role Switcher Pill */}
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${currentUser.avatarColor}`}>
            {currentUser.name.charAt(0)}
          </div>
          <div className="text-left text-xs">
            <div className="font-bold text-slate-200">{currentUser.name}</div>
            <div className="text-[10px] text-blue-400 font-medium">
              Role: {currentUser.role.replace(/_/g, ' ')}
            </div>
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const u = INITIAL_USERS.find((usr) => usr.id === e.target.value);
              if (u) onChangeUser(u);
            }}
            className="ml-2 bg-slate-900 border border-slate-600 rounded-md text-[11px] px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
          >
            {INITIAL_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                Switch: {u.role.replace(/_/g, ' ')} ({u.name.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Workspace Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('BILLING')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'BILLING'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Subscription &amp; Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('ENTITIES')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'ENTITIES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Corporate Entities ({entities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TEAM')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'TEAM'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team &amp; Roles</span>
        </button>

        <button
          onClick={() => setActiveTab('INTEGRATIONS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'INTEGRATIONS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>ERP Integrations &amp; API</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_TRAIL')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'AUDIT_TRAIL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Trail Logs</span>
        </button>
      </div>

      {/* TAB 1: BILLING & SUBSCRIPTION */}
      {activeTab === 'BILLING' && (
        <div className="space-y-6">
          {/* Active Plan Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active Subscription
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 font-medium">Billed {subscription.billingCycle.toLowerCase()}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 pt-1">
                  {subscription.planName}
                </h2>
                <p className="text-xs text-slate-500">
                  Renews automatically on <span className="font-semibold text-slate-700">{subscription.nextRenewal}</span> for ${subscription.monthlyPrice * 12}/year.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToPricing}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upgrade / Change Plan</span>
                </button>
              </div>
            </div>

            {/* Quota Meters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leases Meter */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Active Lease Contracts Quota</span>
                  <span className="font-mono text-blue-600">
                    {subscription.leasesUsed} / {subscription.leasesMax === -1 ? 'Unlimited' : subscription.leasesMax} Contracts
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${subscription.leasesMax === -1 ? 15 : Math.min(100, (subscription.leasesUsed / subscription.leasesMax) * 100)}%`
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {subscription.leasesMax === -1
                    ? 'Unlimited lease contracts active under Enterprise tier.'
                    : `${subscription.leasesMax - subscription.leasesUsed} contract slots remaining.`}
                </p>
              </div>

              {/* Seats Meter */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Finance Team User Seats</span>
                  <span className="font-mono text-indigo-600">
                    {subscription.seatsUsed} / {subscription.seatsMax} Seats Assigned
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (subscription.seatsUsed / subscription.seatsMax) * 100)}%`
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {subscription.seatsMax - subscription.seatsUsed} team member invites available.
                </p>
              </div>
            </div>

            {/* Quick Plan Switcher */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Instant Plan Switcher (Freemium &amp; Pro Tiers):
                </span>
                <button
                  onClick={onNavigateToPricing}
                  className="text-xs text-blue-600 hover:underline font-bold"
                >
                  Full Feature Matrix →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateUpgrade('FREEMIUM', 'Freemium Starter', 3, 1, 0)}
                  className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                    subscription.planId === 'FREEMIUM'
                      ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Freemium</div>
                  <div className="text-[11px] text-emerald-600 font-bold">$0 / mo</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">3 Leases · 1 Seat</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateUpgrade('PRACTITIONER', 'Practitioner Plan', 15, 3, 49)}
                  className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                    subscription.planId === 'PRACTITIONER'
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Practitioner</div>
                  <div className="text-[11px] text-blue-600 font-bold">$49 / mo</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">15 Leases · 3 Seats</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateUpgrade('CORPORATE', 'Corporate Finance Plan', 75, 10, 149)}
                  className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                    subscription.planId === 'CORPORATE'
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Corporate</div>
                  <div className="text-[11px] text-blue-600 font-bold">$149 / mo</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">75 Leases · 10 Seats</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateUpgrade('ENTERPRISE', 'Enterprise & Practice', -1, 999, 399)}
                  className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                    subscription.planId === 'ENTERPRISE'
                      ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">Enterprise</div>
                  <div className="text-[11px] text-purple-600 font-bold">$399 / mo</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Unlimited Leases</div>
                </button>
              </div>
            </div>
          </div>

          {/* Invoicing History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Commercial Invoice History &amp; Payment Receipts</span>
              </h3>
              <span className="text-xs text-slate-500">Auto-generated tax invoices</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Invoice ID</th>
                    <th className="p-3 font-semibold">Billing Date</th>
                    <th className="p-3 font-semibold">Plan Description</th>
                    <th className="p-3 font-semibold text-right">Amount (USD)</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {INITIAL_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                      <td className="p-3">{inv.date}</td>
                      <td className="p-3 font-medium text-slate-900">{inv.planName}</td>
                      <td className="p-3 text-right font-mono font-semibold">${inv.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => alert(`Downloading official PDF Tax Invoice: ${inv.invoiceNumber}`)}
                          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORPORATE ENTITIES */}
      {activeTab === 'ENTITIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Multi-Tenant Legal Entities &amp; Subsidiaries
              </h2>
              <p className="text-xs text-slate-500">
                Define organizational units, functional currencies, and fiscal year ends for group consolidations.
              </p>
            </div>
            <button
              onClick={() => setIsAddEntityOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Legal Entity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entities.map((ent) => (
              <div
                key={ent.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 relative hover:border-blue-400 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {ent.legalEntityCode}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 pt-1.5">{ent.name}</h3>
                  </div>
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jurisdiction:</span>
                    <span className="font-medium text-slate-800">{ent.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Functional Currency:</span>
                    <span className="font-mono font-medium text-slate-800">{ent.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fiscal Year End:</span>
                    <span className="font-medium text-slate-800">{ent.fiscalYearEnd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax Identification:</span>
                    <span className="font-mono font-medium text-slate-800">{ent.taxId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Entity Modal */}
          {isAddEntityOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-900">Add New Subsidiary / Legal Entity</h3>
                <form onSubmit={handleCreateEntity} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Entity Name</label>
                    <input
                      type="text"
                      required
                      value={newEntityName}
                      onChange={(e) => setNewEntityName(e.target.value)}
                      placeholder="e.g. Acme Logistics Australia Pty Ltd"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Entity Code</label>
                      <input
                        type="text"
                        value={newEntityCode}
                        onChange={(e) => setNewEntityCode(e.target.value)}
                        placeholder="e.g. ALA-505"
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                      <input
                        type="text"
                        value={newEntityCurrency}
                        onChange={(e) => setNewEntityCurrency(e.target.value)}
                        placeholder="USD"
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={newEntityCountry}
                      onChange={(e) => setNewEntityCountry(e.target.value)}
                      placeholder="e.g. Australia"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddEntityOpen(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-xs"
                    >
                      Save Entity
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEAM & ROLES */}
      {activeTab === 'TEAM' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Finance Team &amp; Audit Practice Access Control
              </h3>
              <p className="text-xs text-slate-500">
                Four segregation-of-duties roles: Preparer (data entry), Reviewer (approval), External Auditor (read-only audit), and Admin (CFO).
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {subscription.seatsUsed} of {subscription.seatsMax} Seats Used
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold">Permissions</th>
                  <th className="p-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {INITIAL_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] ${user.avatarColor}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{user.title}</td>
                    <td className="p-3 text-slate-500">
                      {user.role === 'PREPARER' && 'Draft lease inputs, modify cash flow slabs'}
                      {user.role === 'REVIEWER' && 'Approve contracts, sign off on IBR assumptions'}
                      {user.role === 'EXTERNAL_AUDITOR' && 'Read-only recalculation, audit workpaper exports'}
                      {user.role === 'ADMIN' && 'Full platform governance, billing & org management'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ERP INTEGRATIONS & API */}
      {activeTab === 'INTEGRATIONS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Developer API &amp; Webhook Credentials
                </h3>
                <p className="text-xs text-slate-500">
                  Sync lease contracts directly with SAP S/4HANA, Oracle NetSuite, and Microsoft Dynamics 365.
                </p>
              </div>
              <Key className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Production REST API Key</label>
              <div className="flex items-center gap-2 max-w-xl">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 bg-slate-50 select-all"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                >
                  {isKeyCopied ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Bearer token used for automated batch journal uploads to your enterprise General Ledger.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="font-bold text-sm text-slate-900">SAP S/4HANA Finance</div>
              <p className="text-xs text-slate-500">
                Direct BAPI export of monthly ROU depreciation and lease liability interest vouchers into ACDOCA.
              </p>
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Configured &amp; Ready
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="font-bold text-sm text-slate-900">Oracle NetSuite ERP</div>
              <p className="text-xs text-slate-500">
                Automated SuiteScript 2.0 integration for amortization schedules and multi-book reporting.
              </p>
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Configured &amp; Ready
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="font-bold text-sm text-slate-900">Microsoft Dynamics 365</div>
              <p className="text-xs text-slate-500">
                Native OData entity mapping for Asset Leasing module double-entry synchronisation.
              </p>
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Configured &amp; Ready
              </span>
            </div>
          </div>

          {/* GitHub Source Repository Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl border border-slate-700 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">GitHub Repository: FinoSutra/IFRS16</h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                      Linked
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Continuous integration &amp; version control repository for Finosutra IFRS 16 platform.
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/FinoSutra/IFRS16"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
              >
                <span>Open on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Quick Git Sync Commands (Terminal):</div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1 select-all overflow-x-auto">
                <p>git remote add origin https://github.com/FinoSutra/IFRS16.git</p>
                <p>git branch -M main</p>
                <p>git push -u origin main</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL LOGS */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Statutory Governance Audit Trail (SOX &amp; Big 4 Audit Logging)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Immutable, timestamped event stream capturing contract edits, approvals, and export events.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">SOC 1 / SOC 2 Ready</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Timestamp (UTC)</th>
                  <th className="p-3 font-semibold">Actor</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Contract Ref</th>
                  <th className="p-3 font-semibold">Audit Event Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 block">{log.userRole}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-blue-600">{log.leaseRef}</td>
                    <td className="p-3 text-slate-600">{log.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
