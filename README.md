# Finosutra IFRS 16 Lease Accounting Engine & SaaS Platform

> **Official Repository**: [https://github.com/FinoSutra/IFRS16](https://github.com/FinoSutra/IFRS16)  
> **Brand**: Finosutra Financial Technologies ([finosutra.com](https://www.finosutra.com/))  
> **Standard Compliance**: IFRS 16 / Ind AS 116 / US GAAP ASC 842 / IAS 1 / IFRS 7  

Enterprise-grade IFRS 16 lease accounting and portfolio management software engineered for CFOs, corporate controllers, finance teams, and Big 4 auditors.

---

## 🚀 Key Features

- **Exact Actuarial Calculation Engine**:
  - Arbitrary-precision mathematics via `decimal.js` preventing floating-point drift across 100+ year schedules.
  - Full support for Payments in Advance (Day 1 annuity-due discounting) and Payments in Arrears.
  - Multi-frequency payment models: Annual, Semi-Annual, Quarterly, and Monthly compounding.
  - Stepped / graduated rent escalation matrices and lease modifications.
  - Initial direct costs, lease incentives, and restoration provisions (IAS 37).

- **Automated Multi-Lease Uploader (CSV & Excel)**:
  - Drag-and-drop batch ingestion for 100+ contracts simultaneously.
  - Quoted-field RFC 4180 compliant CSV parser.
  - Instant downloadable template and 1-click test datasets.
  - Real-time pre-validation of interest borrowing rates (IBR), terms, and payment schedules.

- **Automated Statutory Double-Entry Accounting**:
  - Initial recognition journal entries (ROU Asset vs. Lease Liability vs. Cash).
  - Monthly / periodic amortisation interest and depreciation entries.
  - Automated Current vs. Non-Current liability split per IAS 1.69 (Principal Reduction Method).

- **Multi-Entity Portfolio Hub**:
  - Global portfolio roll-ups across subsidiaries and currencies.
  - Search by reference code, asset class, or description.
  - Multi-asset classification: Real Estate & Offices, Retail Stores, Plant & Heavy Machinery, IT Infrastructure, and Fleet Vehicles.

- **Big 4 Audit-Ready Excel Export**:
  - Automated 6-tab workbook generation via `exceljs`:
    1. Executive Summary & Key Metrics
    2. Actuarial Amortisation Schedule
    3. Straight-Line ROU Depreciation Schedule
    4. Balanced Double-Entry Journal Entries
    5. Balance Sheet & P&L Disclosures (IFRS 16.53)
    6. Contractual Cash Flow Maturity Analysis (IFRS 16.58 / IFRS 7.39)

- **Enterprise Governance & Security**:
  - Role-Based Access Control (Preparer, Reviewer, External Auditor, Admin).
  - Immutable SOX & SOC 1 audit trail logging.
  - ERP Integration blueprints for SAP S/4HANA (BAPI/ACDOCA), Oracle NetSuite, and Microsoft Dynamics 365.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Math Engine**: Decimal.js (arbitrary precision decimal arithmetic)
- **Spreadsheet Generation**: ExcelJS & XLSX
- **Build & Dev Tooling**: Vite 8, Bun / Node.js

---

## 📦 How to Push this Code to your GitHub Repository

To link this code to your GitHub repo ([`https://github.com/FinoSutra/IFRS16`](https://github.com/FinoSutra/IFRS16)) on your machine:

```bash
# 1. Initialize git
git init -b main

# 2. Add remote repository
git remote add origin https://github.com/FinoSutra/IFRS16.git

# 3. Add all project files and commit
git add .
git commit -m "feat: complete Finosutra IFRS 16 lease accounting engine and portfolio SaaS"

# 4. Push to main branch
git push -u origin main
```

---

## 📄 License & Rights

© Finosutra Financial Technologies. All rights reserved.
