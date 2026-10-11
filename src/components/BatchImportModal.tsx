import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  FileText,
  FileCheck,
  HelpCircle
} from 'lucide-react';
import { LeaseContractInput, AssetClass, PaymentFrequency, PaymentTiming } from '../types/ifrs16.ts';
import { LeasePortfolioItem } from '../types/portfolio.ts';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeases: (newLeases: LeasePortfolioItem[]) => void;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  onImportLeases
}) => {
  const [activeTab, setActiveTab] = useState<'FILE' | 'PASTE'>('FILE');
  const [csvText, setCsvText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [previewItems, setPreviewItems] = useState<LeasePortfolioItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sampleCsv = `leaseReference,leaseDescription,entityName,assetClass,commencementDate,contractEndDate,paymentFrequency,paymentTiming,basePayment,annualDiscountRate
LSE-US-010,Regional Tech Hub Office,Acme Global Holdings Inc,PROPERTY,2025-01-01,2029-12-31,MONTHLY,IN_ARREARS,38000,5.5
LSE-UK-011,Automated Parcel Sorting Line,Acme Logistics & Retail UK Ltd,PLANT_AND_MACHINERY,2024-07-01,2029-06-30,QUARTERLY,IN_ADVANCE,25000,4.75
LSE-DE-012,Executive Transport Vans (15 Units),Acme Technologies Europe GmbH,MOTOR_VEHICLES,2025-01-01,2028-12-31,MONTHLY,IN_ARREARS,14500,5.2
LSE-SG-013,APAC Data Center Racks,Acme Asia Pacific Pte Ltd,IT_AND_OFFICE_EQUIPMENT,2025-04-01,2030-03-31,MONTHLY,IN_ARREARS,22000,4.85`;

  const parseCsvRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setImportErrors(['CSV must contain a header row and at least one data row.']);
      setPreviewItems([]);
      return;
    }

    const errors: string[] = [];
    const items: LeasePortfolioItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = parseCsvRow(line);

      if (cols.length < 8) {
        errors.push(`Row ${i}: Insufficient columns (${cols.length} found, expected at least 8 columns).`);
        continue;
      }

      const leaseRef = cols[0] || `LSE-IMP-${Date.now().toString().slice(-4)}-${i}`;
      const desc = cols[1] || 'Imported Lease Contract';
      const entName = cols[2] || 'Acme Global Holdings Inc';
      const rawAssetClass = (cols[3] || 'PROPERTY').toUpperCase().replace(/[\s-]/g, '_');
      const assetClass: AssetClass = ['PROPERTY', 'PLANT_AND_MACHINERY', 'MOTOR_VEHICLES', 'IT_AND_OFFICE_EQUIPMENT', 'OTHER'].includes(rawAssetClass)
        ? (rawAssetClass as AssetClass)
        : 'PROPERTY';

      const commDate = cols[4] || '2025-01-01';
      const endDate = cols[5] || '2029-12-31';
      const rawFreq = (cols[6] || 'MONTHLY').toUpperCase();
      const freq: PaymentFrequency = ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'].includes(rawFreq)
        ? (rawFreq as PaymentFrequency)
        : 'MONTHLY';

      const rawTiming = (cols[7] || 'IN_ARREARS').toUpperCase();
      const timing: PaymentTiming = rawTiming.includes('ADVANCE') ? 'IN_ADVANCE' : 'IN_ARREARS';

      const payment = parseFloat(cols[8]?.replace(/[^0-9.-]+/g, '')) || 10000;
      const ibr = parseFloat(cols[9]?.replace(/[^0-9.-]+/g, '')) || 5.0;

      const input: LeaseContractInput = {
        leaseReference: leaseRef,
        leaseDescription: desc,
        lesseeEntity: entName,
        assetClass,
        currency: 'USD',
        commencementDate: commDate,
        contractEndDate: endDate,
        hasRenewalOption: false,
        hasTerminationOption: false,
        shortTermElection: false,
        lowValueElection: false,
        paymentFrequency: freq,
        paymentTiming: timing,
        basePayment: payment,
        rentFreePeriods: 0,
        escalationType: 'NONE',
        escalationRate: 0,
        discountRateType: 'IBR',
        annualDiscountRate: ibr,
        compoundingConvention: 'NOMINAL_ANNUAL',
        initialDirectCosts: 0,
        prepaymentsMade: 0,
        leaseIncentivesReceived: 0,
        restorationProvision: 0,
        reportingDate: '2025-12-31'
      };

      const newItem: LeasePortfolioItem = {
        id: `lease-imp-${Date.now()}-${i}`,
        leaseReference: leaseRef,
        leaseDescription: desc,
        entityId: 'ent-hq',
        entityName: entName,
        assetClass,
        status: 'ACTIVE',
        assignedPreparer: 'Import Pipeline / Marcus Chen, CPA',
        costCenter: 'CC-PORTFOLIO',
        notes: 'Bulk imported contract batch via Multi-Lease Uploader.',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        input
      };

      items.push(newItem);
    }

    setImportErrors(errors);
    setPreviewItems(items);
  };

  const handleFileProcess = (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      setCsvText(content);
      parseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ifrs16_multi_lease_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setUploadedFileName('multi_lease_sample_template.csv');
    setCsvText(sampleCsv);
    parseCsv(sampleCsv);
  };

  const handleConfirmImport = () => {
    if (previewItems.length === 0) return;
    onImportLeases(previewItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 shadow-xs flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Multi-Lease Uploader</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  CSV / Spreadsheet
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Bulk onboard dozens or hundreds of lease contracts simultaneously into your active portfolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar / Options */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Method Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTab('FILE')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                activeTab === 'FILE'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload File (.csv)
            </button>
            <button
              onClick={() => setActiveTab('PASTE')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                activeTab === 'PASTE'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste CSV Text
            </button>
          </div>

          {/* Quick Actions: Download Template & Load Sample */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition cursor-pointer shadow-2xs"
              title="Download CSV template ready for Excel or Google Sheets"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download CSV Template</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold transition cursor-pointer shadow-2xs"
              title="Populate 4 realistic sample contracts to test"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>Load 4-Lease Sample</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'FILE' ? (
            <div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.tsv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileProcess(file);
                  e.target.value = '';
                }}
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/70'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    {uploadedFileName ? (
                      <span className="text-emerald-700 flex items-center justify-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        Loaded file: <span className="font-mono">{uploadedFileName}</span>
                      </span>
                    ) : (
                      'Click to browse or drag and drop your CSV file here'
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports .csv, .tsv, and comma-separated text files exported from Excel, SAP, or Oracle
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition"
                >
                  Choose File from Computer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Paste Comma-Separated Values (CSV)</span>
                <span className="text-slate-500">Headers: leaseReference, description, entity, assetClass, commencement, end, freq, timing, payment, ibr</span>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  parseCsv(e.target.value);
                }}
                placeholder="leaseReference,leaseDescription,entityName,assetClass,commencementDate,contractEndDate,paymentFrequency,paymentTiming,basePayment,annualDiscountRate..."
                rows={6}
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Validation Warnings */}
          {importErrors.length > 0 && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Validation Issues ({importErrors.length})</span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto pl-5">
                {importErrors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Table */}
          {previewItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <span>Ready to Ingest: {previewItems.length} Contracts</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-mono">
                    Total Base Rent: ${previewItems.reduce((acc, curr) => acc + curr.input.basePayment, 0).toLocaleString()} / period
                  </span>
                </span>
                <span className="text-emerald-700 flex items-center gap-1 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  IFRS 16 Format Validated
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="max-h-52 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="p-2.5 font-semibold">Lease Reference</th>
                        <th className="p-2.5 font-semibold">Contract Description</th>
                        <th className="p-2.5 font-semibold">Asset Class</th>
                        <th className="p-2.5 font-semibold">Term</th>
                        <th className="p-2.5 font-semibold text-right">Payment</th>
                        <th className="p-2.5 font-semibold text-right">IBR Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {previewItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition">
                          <td className="p-2.5 font-mono font-bold text-blue-600">{item.leaseReference}</td>
                          <td className="p-2.5 max-w-[200px] truncate" title={item.leaseDescription}>{item.leaseDescription}</td>
                          <td className="p-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">
                              {item.assetClass}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {item.input.commencementDate} → {item.input.contractEndDate}
                          </td>
                          <td className="p-2.5 font-mono text-right font-medium">
                            ${item.input.basePayment.toLocaleString()} <span className="text-[10px] text-slate-400">({item.input.paymentFrequency})</span>
                          </td>
                          <td className="p-2.5 font-mono text-right text-emerald-600 font-semibold">
                            {item.input.annualDiscountRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Quick Help Guide */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Required CSV Columns</span>
            </div>
            <p className="text-slate-500">
              Columns required in order: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">leaseReference</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">leaseDescription</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">entityName</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">assetClass</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">commencementDate</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">contractEndDate</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">paymentFrequency</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">paymentTiming</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">basePayment</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">annualDiscountRate</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {previewItems.length > 0 ? (
              <span><strong className="text-slate-900">{previewItems.length}</strong> leases ready for automated IFRS 16 schedule generation</span>
            ) : (
              <span>Select or drop a CSV file to inspect leases before importing</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={previewItems.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Import {previewItems.length} Leases into Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
