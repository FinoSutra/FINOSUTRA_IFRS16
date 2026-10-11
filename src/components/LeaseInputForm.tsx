import React, { useState } from 'react';
import { 
  FileText, 
  CreditCard, 
  Percent, 
  Calendar, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Tag,
  Plus,
  Trash2,
  Layers
} from 'lucide-react';
import { LeaseContractInput, ValidationWarning, SteppedRentSlab } from '../types/ifrs16.ts';

interface LeaseInputFormProps {
  input: LeaseContractInput;
  onChange: (updated: LeaseContractInput) => void;
  warnings: ValidationWarning[];
}

export const LeaseInputForm: React.FC<LeaseInputFormProps> = ({
  input,
  onChange,
  warnings,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTRACT' | 'PAYMENTS' | 'DISCOUNT' | 'REPORTING'>('CONTRACT');

  const update = <K extends keyof LeaseContractInput>(key: K, value: LeaseContractInput[K]) => {
    onChange({
      ...input,
      [key]: value,
    });
  };

  const getFieldError = (fieldName: string) => {
    return warnings.find((w) => w.field === fieldName && w.severity === 'ERROR')?.message;
  };

  const getFieldWarning = (fieldName: string) => {
    return warnings.find((w) => w.field === fieldName && w.severity === 'WARNING')?.message;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Form Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50 flex flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('CONTRACT')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'CONTRACT'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Contract & Asset</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PAYMENTS')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'PAYMENTS'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>2. Payments & Escalation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DISCOUNT')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'DISCOUNT'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>3. Discount Rate & Adjustments</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REPORTING')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'REPORTING'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>4. Reporting Cut-Off</span>
        </button>
      </div>

      <div className="p-5">
        {/* TAB 1: CONTRACT & ASSET */}
        {activeTab === 'CONTRACT' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lease Reference / Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={input.leaseReference}
                  onChange={(e) => update('leaseReference', e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. LEASE-OFFICE-2025"
                />
                {getFieldError('leaseReference') && (
                  <p className="text-[11px] text-red-600 mt-1">{getFieldError('leaseReference')}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lessee Entity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={input.lesseeEntity}
                  onChange={(e) => update('lesseeEntity', e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Acme Corporation Ltd"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Class (IFRS 16.53)
                </label>
                <select
                  value={input.assetClass}
                  onChange={(e) => update('assetClass', e.target.value as LeaseContractInput['assetClass'])}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="PROPERTY">Property / Real Estate</option>
                  <option value="PLANT_AND_MACHINERY">Plant & Machinery</option>
                  <option value="MOTOR_VEHICLES">Motor Vehicles</option>
                  <option value="IT_AND_OFFICE_EQUIPMENT">IT & Office Equipment</option>
                  <option value="OTHER">Other Tangible Assets</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Functional Currency (ISO 4217)
                </label>
                <select
                  value={input.currency}
                  onChange={(e) => update('currency', e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="AUD">AUD ($ - Australian Dollar)</option>
                  <option value="CAD">CAD ($ - Canadian Dollar)</option>
                  <option value="SGD">SGD ($ - Singapore Dollar)</option>
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="JPY">JPY (¥ - Japanese Yen)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lease Description
                </label>
                <input
                  type="text"
                  value={input.leaseDescription}
                  onChange={(e) => update('leaseDescription', e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Optional brief description"
                />
              </div>
            </div>

            {/* Dates & Term Options */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Lease Term Determination (IFRS 16.18–21)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Commencement Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={input.commencementDate}
                    onChange={(e) => update('commencementDate', e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                  <span className="text-[10px] text-slate-500">Date lessor makes underlying asset available.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contractual End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={input.contractEndDate}
                    onChange={(e) => update('contractEndDate', e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                  {getFieldError('contractEndDate') && (
                    <p className="text-[11px] text-red-600 mt-1">{getFieldError('contractEndDate')}</p>
                  )}
                </div>
              </div>

              {/* Judgement Options */}
              <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={input.hasRenewalOption}
                      onChange={(e) => update('hasRenewalOption', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-medium text-slate-800">
                      Renewal Option (Reasonably certain to exercise)
                    </span>
                  </label>
                  {input.hasRenewalOption && (
                    <div className="pl-6">
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Extended Renewal End Date
                      </label>
                      <input
                        type="date"
                        value={input.renewalEndDate || ''}
                        onChange={(e) => update('renewalEndDate', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border rounded-md border-slate-300 bg-white"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={input.hasTerminationOption}
                      onChange={(e) => update('hasTerminationOption', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-medium text-slate-800">
                      Early Termination Option (Reasonably certain to exercise)
                    </span>
                  </label>
                  {input.hasTerminationOption && (
                    <div className="pl-6">
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Expected Early Termination Date
                      </label>
                      <input
                        type="date"
                        value={input.terminationDate || ''}
                        onChange={(e) => update('terminationDate', e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border rounded-md border-slate-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recognition Exemptions (IFRS 16.5) */}
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                IFRS 16 Recognition Exemption Elections (Optional Practical Expedients)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.shortTermElection}
                    onChange={(e) => update('shortTermElection', e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      Short-Term Lease Election (IFRS 16.5a)
                    </span>
                    <p className="text-[11px] text-slate-600">
                      For leases with effective term &le; 12 months. Expensed straight-line in P&L.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.lowValueElection}
                    onChange={(e) => update('lowValueElection', e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      Low-Value Asset Election (IFRS 16.5b)
                    </span>
                    <p className="text-[11px] text-slate-600">
                      For underlying assets with new value &le; ~$5,000 (e.g. IT equipment, tablets).
                    </p>
                  </div>
                </label>
              </div>
              {getFieldError('shortTermElection') && (
                <p className="text-[11px] text-red-600 mt-2 font-medium">{getFieldError('shortTermElection')}</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENTS & ESCALATION */}
        {activeTab === 'PAYMENTS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  value={input.paymentFrequency}
                  onChange={(e) => update('paymentFrequency', e.target.value as LeaseContractInput['paymentFrequency'])}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="MONTHLY">Monthly (12 periods/yr)</option>
                  <option value="QUARTERLY">Quarterly (4 periods/yr)</option>
                  <option value="SEMI_ANNUAL">Semi-Annual (2 periods/yr)</option>
                  <option value="ANNUAL">Annual (1 period/yr)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Timing
                </label>
                <select
                  value={input.paymentTiming}
                  onChange={(e) => update('paymentTiming', e.target.value as LeaseContractInput['paymentTiming'])}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="IN_ARREARS">In Arrears (End of Period)</option>
                  <option value="IN_ADVANCE">In Advance (Start of Period / Day 1)</option>
                </select>
                <span className="text-[10px] text-slate-500">
                  {input.paymentTiming === 'IN_ADVANCE'
                    ? 'Day-1 payment reduces liability before interest accrues.'
                    : 'Interest accrues over the full period before payment.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Periodic Payment Amount ({input.currency}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="100"
                  value={input.basePayment}
                  onChange={(e) => update('basePayment', parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 font-semibold text-slate-900"
                />
                {getFieldError('basePayment') && (
                  <p className="text-[11px] text-red-600 mt-1">{getFieldError('basePayment')}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rent-Free Periods (Incentive / Fit-out)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={input.rentFreePeriods || 0}
                  onChange={(e) => update('rentFreePeriods', parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <span className="text-[10px] text-slate-500">
                  Number of initial {input.paymentFrequency.toLowerCase()} periods where rent is zero.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contractual Rental Escalation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={input.escalationType}
                    onChange={(e) => update('escalationType', e.target.value as LeaseContractInput['escalationType'])}
                    className="w-full text-xs px-2 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="NONE">None (Flat)</option>
                    <option value="FIXED_PERCENTAGE">Fixed % Annual</option>
                    <option value="STEPPED_RENT">Stepped Rent Schedule (Multi-Slab)</option>
                  </select>

                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    disabled={input.escalationType !== 'FIXED_PERCENTAGE'}
                    value={input.escalationRate || 0}
                    onChange={(e) => update('escalationRate', parseFloat(e.target.value) || 0)}
                    placeholder="Annual % increase"
                    className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  {input.escalationType === 'STEPPED_RENT'
                    ? 'Define distinct periodic payment amounts for contractual lease slabs below.'
                    : 'Fixed increases are measured at commencement (IFRS 16.27a).'}
                </span>
              </div>
            </div>

            {/* STEPPED RENT MULTI-SLAB SCHEDULE TABLE */}
            {input.escalationType === 'STEPPED_RENT' && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Contractual Stepped Rent Schedule Table
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSlabs = input.steppedRentSlabs || [];
                      const lastSlab = currentSlabs[currentSlabs.length - 1];
                      const nextFrom = lastSlab ? lastSlab.toPeriod + 1 : 1;
                      const nextTo = nextFrom + 11;
                      const newSlab: SteppedRentSlab = {
                        id: `SLAB-${Date.now()}`,
                        fromPeriod: nextFrom,
                        toPeriod: nextTo,
                        periodicPayment: lastSlab ? lastSlab.periodicPayment : input.basePayment,
                        label: `Slab ${currentSlabs.length + 1}`,
                      };
                      update('steppedRentSlabs', [...currentSlabs, newSlab]);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-500 transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Rent Slab</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  Specify payment amounts for custom contract phases (e.g., Year 1 fit-out rent, Year 2 stepping, Year 3+ escalation).
                </p>

                {(!input.steppedRentSlabs || input.steppedRentSlabs.length === 0) ? (
                  <div className="bg-white p-4 rounded-md border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-xs text-slate-500">
                      No custom stepped rent slabs defined yet. Base payment applies to all periods.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultSlabs: SteppedRentSlab[] = [
                          { id: 'slab-1', fromPeriod: 1, toPeriod: 12, periodicPayment: input.basePayment, label: 'Year 1' },
                          { id: 'slab-2', fromPeriod: 13, toPeriod: 24, periodicPayment: Math.round(input.basePayment * 1.05), label: 'Year 2 (+5%)' },
                          { id: 'slab-3', fromPeriod: 25, toPeriod: 36, periodicPayment: Math.round(input.basePayment * 1.10), label: 'Year 3 (+10%)' },
                        ];
                        update('steppedRentSlabs', defaultSlabs);
                      }}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      + Populate default 3-year stepped schedule template
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 font-semibold text-slate-700 border-b">
                        <tr>
                          <th className="py-2 px-3">Slab Label</th>
                          <th className="py-2 px-3 w-28">From Period #</th>
                          <th className="py-2 px-3 w-28">To Period #</th>
                          <th className="py-2 px-3">Periodic Rent ({input.currency})</th>
                          <th className="py-2 px-2 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {input.steppedRentSlabs.map((slab, idx) => (
                          <tr key={slab.id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={slab.label || ''}
                                onChange={(e) => {
                                  const updated = [...input.steppedRentSlabs!];
                                  updated[idx] = { ...updated[idx], label: e.target.value };
                                  update('steppedRentSlabs', updated);
                                }}
                                placeholder={`Slab ${idx + 1}`}
                                className="w-full text-xs px-2 py-1 border rounded font-sans border-slate-300"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="number"
                                min="1"
                                value={slab.fromPeriod}
                                onChange={(e) => {
                                  const updated = [...input.steppedRentSlabs!];
                                  updated[idx] = { ...updated[idx], fromPeriod: parseInt(e.target.value, 10) || 1 };
                                  update('steppedRentSlabs', updated);
                                }}
                                className="w-20 text-xs px-2 py-1 border rounded border-slate-300"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="number"
                                min="1"
                                value={slab.toPeriod}
                                onChange={(e) => {
                                  const updated = [...input.steppedRentSlabs!];
                                  updated[idx] = { ...updated[idx], toPeriod: parseInt(e.target.value, 10) || 1 };
                                  update('steppedRentSlabs', updated);
                                }}
                                className="w-20 text-xs px-2 py-1 border rounded border-slate-300"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="number"
                                min="0"
                                step="100"
                                value={slab.periodicPayment}
                                onChange={(e) => {
                                  const updated = [...input.steppedRentSlabs!];
                                  updated[idx] = { ...updated[idx], periodicPayment: parseFloat(e.target.value) || 0 };
                                  update('steppedRentSlabs', updated);
                                }}
                                className="w-32 text-xs px-2 py-1 border rounded border-slate-300 font-semibold text-slate-900"
                              />
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = input.steppedRentSlabs!.filter((_, i) => i !== idx);
                                  update('steppedRentSlabs', updated);
                                }}
                                className="text-slate-400 hover:text-red-600 transition p-1"
                                title="Delete Slab"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DISCOUNT RATE & INITIAL ADJUSTMENTS */}
        {activeTab === 'DISCOUNT' && (
          <div className="space-y-4">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-600" />
                Discount Rate Specification (IFRS 16.26)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Rate Methodology
                  </label>
                  <select
                    value={input.discountRateType}
                    onChange={(e) => update('discountRateType', e.target.value as LeaseContractInput['discountRateType'])}
                    className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="IBR">Lessee's Incremental Borrowing Rate (IBR)</option>
                    <option value="IMPLICIT_RATE">Interest Rate Implicit in the Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Discount Rate (APR %) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    max="50"
                    step="0.25"
                    value={input.annualDiscountRate}
                    onChange={(e) => update('annualDiscountRate', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                  {getFieldError('annualDiscountRate') && (
                    <p className="text-[11px] text-red-600 mt-1">{getFieldError('annualDiscountRate')}</p>
                  )}
                  {getFieldWarning('annualDiscountRate') && (
                    <p className="text-[11px] text-amber-600 mt-1">{getFieldWarning('annualDiscountRate')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Compounding Convention
                  </label>
                  <select
                    value={input.compoundingConvention}
                    onChange={(e) => update('compoundingConvention', e.target.value as LeaseContractInput['compoundingConvention'])}
                    className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="NOMINAL_ANNUAL">Nominal Annual (r = APR / m) [Default]</option>
                    <option value="EFFECTIVE_ANNUAL">Actuarial Effective (r = (1+APR)^(1/m) - 1)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Initial ROU Asset Adjustments */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Initial Right-of-Use Asset Adjustments (IFRS 16.24)
              </h4>
              <p className="text-[11px] text-slate-600 mb-3 font-mono">
                ROU Asset (A₀) = Initial Liability + Direct Costs + Prepayments + Restoration Provision - Incentives Received
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Initial Direct Costs (+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={input.initialDirectCosts || 0}
                    onChange={(e) => update('initialDirectCosts', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-1.5 border rounded-md border-slate-300 bg-white"
                    placeholder="e.g. Legal, stamp duty"
                  />
                  <span className="text-[10px] text-slate-500">Capitalised under IFRS 16.24(c).</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Prepayments Made (+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={input.prepaymentsMade || 0}
                    onChange={(e) => update('prepaymentsMade', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-1.5 border rounded-md border-slate-300 bg-white"
                    placeholder="Paid before start"
                  />
                  <span className="text-[10px] text-slate-500">Paid at/before commencement.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Restoration Provision (+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={input.restorationProvision || 0}
                    onChange={(e) => update('restorationProvision', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-1.5 border rounded-md border-slate-300 bg-white"
                    placeholder="IAS 37 present value"
                  />
                  <span className="text-[10px] text-slate-500">Dismantling/reinstatement cost.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 text-red-700">
                    Lease Incentives Received (-)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={input.leaseIncentivesReceived || 0}
                    onChange={(e) => update('leaseIncentivesReceived', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-1.5 border rounded-md border-slate-300 bg-white text-red-700 font-medium"
                    placeholder="Cash rebates from lessor"
                  />
                  <span className="text-[10px] text-slate-500">Deducted from initial asset.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIAL REPORTING CUT-OFF */}
        {activeTab === 'REPORTING' && (
          <div className="space-y-4">
            <div className="max-w-md bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Balance Sheet Reporting Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={input.reportingDate}
                onChange={(e) => update('reportingDate', e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-md border-slate-300 bg-white font-medium"
              />
              <p className="text-[11px] text-slate-600 mt-2">
                The engine will extract closing balances, accumulated depreciation, and the
                <strong> Current vs Non-Current liability split</strong> (next 12 months capital reduction per IAS 1.69)
                specifically as of this reporting cut-off date.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
