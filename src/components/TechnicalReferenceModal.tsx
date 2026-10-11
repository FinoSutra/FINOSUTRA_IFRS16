import React from 'react';
import { X, BookOpen, ExternalLink, Bookmark } from 'lucide-react';

interface TechnicalReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalReferenceModal: React.FC<TechnicalReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const references = [
    {
      para: 'IFRS 16.22',
      title: 'Commencement Date',
      text: 'The date on which a lessor makes an underlying asset available for use by a lessee. At the commencement date, a lessee shall recognise a right-of-use asset and a lease liability.',
    },
    {
      para: 'IFRS 16.24',
      title: 'Initial Measurement of ROU Asset',
      text: 'Cost of ROU asset comprises: (a) initial measurement of lease liability; (b) lease payments made at or before commencement less lease incentives received; (c) initial direct costs incurred; and (d) dismantling, removal and site restoration estimate (IAS 37).',
    },
    {
      para: 'IFRS 16.26',
      title: 'Initial Measurement of Lease Liability',
      text: 'At commencement date, lease liability is measured at present value of lease payments not paid at that date, discounted using rate implicit in lease or lessee’s incremental borrowing rate (IBR).',
    },
    {
      para: 'IFRS 16.27',
      title: 'Lease Payments in Liability',
      text: 'Includes: fixed payments (including in-substance fixed payments) less incentives; variable payments that depend on an index/rate; amounts expected to be payable under residual value guarantees; and exercise price of purchase/termination options if reasonably certain.',
    },
    {
      para: 'IFRS 16.36',
      title: 'Subsequent Liability Measurement',
      text: 'After commencement date, carrying amount of lease liability is increased by interest expense (effective interest rate), reduced by lease payments made, and remeasured for modifications.',
    },
    {
      para: 'IFRS 16.5',
      title: 'Recognition Exemptions',
      text: 'Lessee may elect not to apply balance sheet recognition to: (a) short-term leases (term <= 12 months with no purchase option); and (b) leases for which underlying asset is of low value (<= ~$5,000 new). Payments are expensed straight-line in P&L.',
    },
    {
      para: 'IAS 1.69',
      title: 'Current vs. Non-Current Presentation',
      text: 'An entity shall classify a liability as current when it is expected to be settled within 12 months after the reporting period. In lease accounting, the principal portion payable within 12 months is classified as current.',
    },
    {
      para: 'IFRS 16.58',
      title: 'Maturity Analysis Disclosure',
      text: 'Lessee shall disclose a maturity analysis of lease liabilities applying IFRS 7 paragraphs 39 and B11 separately from other financial liabilities, showing undiscounted contractual cash flow commitments.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold">IFRS 16 Technical Accounting Reference</h3>
              <p className="text-xs text-slate-400">Authoritative IFRS 16 paragraph rules embedded in Finosutra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {references.map((ref, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                  {ref.para}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{ref.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-1">
                {ref.text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Brand: Finosutra Financial Technologies</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
