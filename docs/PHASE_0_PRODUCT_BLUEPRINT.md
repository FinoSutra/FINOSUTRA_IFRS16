# FINOSUTRA IFRS 16 SAAS — PHASE 0 PRODUCT BLUEPRINT & SYSTEM ARCHITECTURE
**Document Reference:** FIN-IFRS16-BLPRT-001  
**Target Release:** Finosutra IFRS 16 SaaS v1.0  
**Author:** Senior SaaS Product Architect, Full-Stack Technical Lead & IFRS 16 Application Architect  
**Reviewer & Accounting Authority:** Chartered Accountant / Financial Reporting Lead  
**Status:** Submitted for Professional Review & Formal Phase Approval  

---

## Executive Summary & Design Philosophy
Finosutra IFRS 16 is engineered as an enterprise-grade, audit-ready Software-as-a-Service (SaaS) platform for lessees, accounting firms, and financial reporting teams worldwide. It addresses the compliance, financial reporting, and audit requirements mandated by **IFRS 16 (Leases)**.

The product philosophy adheres to three strict principles:
1. **Mathematical & Accounting Precision:** Zero floating-point rounding errors (via arbitrary-precision decimal mathematics), exact day-count and frequency conventions, strict separation between contractual cash flows and balance sheet recognition.
2. **Auditability & Traceability:** Every journal entry, liability roll-forward, and asset depreciation schedule can be tied back directly to source lease terms, accounting judgements, and discount rates.
3. **Clean Technical Architecture:** Modular separation between the UI presentation, the pure calculation engine (functional, headless, zero UI dependencies), and the persistence/multi-tenant layer.

---

## A. Product Requirements Document (PRD)

### 1. Business & User Objectives
- **Target Audience:** Financial controllers, reporting managers, Chartered Accountants / CPAs, external auditors, and CFOs.
- **Problem Statement:** Spreadsheets for IFRS 16 suffer from broken formulas, lack of audit trails, incorrect handling of irregular periods or advance/arrears timing, unverified discount rate compounding, and lack of systematic journal generation.
- **Solution:** A cloud-native web platform that automates initial measurement, amortisation, depreciation, period-end journals, balance sheet presentation (current vs non-current), maturity disclosures, and audit exports.

### 2. High-Level User Persona
- **Corporate Financial Accountant (Preparer):** Enters lease contracts, uploads/inputs payment schedules, reviews validation alerts, runs amortisation, and generates monthly/quarterly closing journals.
- **Financial Controller / Partner (Reviewer):** Verifies judgements (lease term renewal options, discount rate benchmarks), reviews reconciliations, and locks calculation versions.
- **External Auditor (Auditor):** Inspects calculation parameters, extracts complete schedule roll-forwards, checks effective interest math, and exports audit-ready Excel workbooks with visible formulas.

### 3. Core Functional Workflows
1. **Lease Onboarding:** Capture core contract attributes, asset class, dates, payment frequency, payment timing, rate benchmarks, and initial ROU adjustments.
2. **Assumption & Judgement Review:** System highlights renewal/termination option judgements, rent-free periods, and discount rate convention warnings.
3. **Engine Execution:** Independent, deterministic computation producing:
   - Initial Lease Liability (PV of lease payments).
   - Initial ROU Asset (PV + initial direct costs + restoration - incentives received + prepayments).
   - Period-by-period Lease Liability Amortisation Schedule.
   - Period-by-period ROU Asset Depreciation Schedule.
4. **Financial Reporting & Closing:** User specifies reporting cut-off date (e.g. 31 Dec 2026). System derives closing balances, accumulated depreciation, interest accrued, current liability portion (next 12 months principal), non-current liability portion, and journal entries.
5. **Reconciliation & Integrity Engine:** Automated equality checks:
   - Initial ROU Asset = Initial Liability + Adjustments.
   - Closing Liability = Initial Liability + Total Accrued Interest - Total Payments Made.
   - Closing Net ROU = Cost - Accumulated Depreciation.
   - Debits = Credits across all generated journal entries.
6. **Export & Sharing:** Immediate generation of structured Excel workbooks (with tabbed schedules and reconciliations) and publication-ready PDF summary reports.

---

## B. MVP Feature List and Prioritised Backlog

### Phase 1 & 2 (First Usable Prototype / MVP 1):
| Priority | Feature Description | Scope & Capability |
| :--- | :--- | :--- |
| **P0** | Single Lease Input & Validation | Clean 4-step wizard: Contract Basics, Payments & Escalation, Initial Adjustments, Rate & Reporting Date. |
| **P0** | Standalone IFRS 16 Engine | Decimal-precision PV discounting, advance/arrears payment timing, regular payment frequencies (Monthly, Quarterly, Semi-Annual, Annual). |
| **P0** | Amortisation Schedule | Opening liability, interest expense, payment made, principal repayment, closing liability. |
| **P0** | ROU Depreciation Schedule | Straight-line depreciation over lease term / useful life, opening gross book value, depreciation charge, accumulated depreciation, net book value. |
| **P0** | Financial Reporting Cut-off | Balance extraction for any selected reporting date; current vs non-current split based on next 12 months capital reduction. |
| **P0** | Journal Entry Generator | Initial recognition journal, subsequent period interest & depreciation journals, payment settlement journals. |
| **P0** | Reconciliation Checks Panel | Real-time mathematical proof showing zero variance on balance roll-forwards and debit/credit equality. |
| **P0** | Data Export (Excel / PDF) | Client-side export of formatted XLSX schedules and PDF executive report. |
| **P1** | Local State Serialization | Save/Load calculation inputs via structured JSON files so users can persist work prior to cloud backend rollout. |

### Prioritised Future Backlog:
- **Phase 4:** Cloud multi-tenant persistence (PostgreSQL / Firebase), User authentication (RBAC), Organisation workspace management.
- **Phase 5:** Stripe billing subscription tiers, seat licensing, automated invoicing.
- **Phase 6:** Portfolio aggregation, multi-lease bulk upload (CSV/Excel ingestion), lease modification & remeasurement workflows (IFRS 16 para 39–46), index/rate linked escalation (CPI/SOFR).
- **Phase 7:** SOC2 compliance, immutable audit trail, single sign-on (SAML/Okta).

---

## C. Explicit Out-of-Scope List (What Will NOT Be in MVP 1)
To ensure delivery of a rock-solid, audit-compliant core, the following are explicitly deferred:
1. **Lessor Accounting:** IFRS 16 sections for finance/operating lessor accounting. Finosutra focuses solely on Lessee accounting.
2. **Complex Contract Modifications (IFRS 16.44-46):** Mid-term scope expansions, early partial terminations, and discount rate revisions will be implemented in Phase 6.
3. **Variable Payments Linked to Sales/Turnover:** Variable payments that depend on future sales or usage (IFRS 16.38b) are expensed in P&L as incurred and do not form part of the lease liability.
4. **Multi-Currency Hedging & Foreign Exchange Revaluation (IAS 21):** The initial engine calculates in the functional currency of the lease; FX revaluation at closing rates is deferred.
5. **Direct ERP Integrations (SAP, NetSuite, Oracle):** Integration via REST API / webhooks is planned for enterprise tier in Phase 7.
6. **Sublease Accounting & Intermediate Lessor Classification (IFRS 16.B58).**

---

## D. Screen-by-Screen UI Specification

### 1. Navigation Shell & Header
- **Top Bar:** Finosutra Logo, Active Organisation/Tenant Name, Currency Selector badge, "New Calculation" CTA, Help & IFRS 16 Reference drawer toggle.
- **Design Language:** Deep Navy (`#0F172A`), Slate Neutral (`#F8FAFC`), Corporate Blue Accent (`#2563EB`), Emerald Green (`#059669`) for positive validation, Amber (`#D97706`) for accounting judgements.

### 2. Screen 1: New Lease Workflow / Input Form
- **Layout:** Two-column responsive layout. Left: Guided multi-step accordion card. Right: Live calculation preview & validation alert summary.
- **Step 1 — Contract & Asset Information:**
  - Lease Reference / Code, Description, Lessee Entity Name.
  - Asset Class dropdown (Property, Plant & Machinery, Vehicles, IT Equipment, Other).
  - Commencement Date & Contractual End Date.
  - Recognition Exemption Checkboxes (Short-term <12 months, Low-value <$5,000) with automatic alert if checked.
- **Step 2 — Lease Term & Judgements:**
  - Non-cancellable period auto-calculated in months/days.
  - Extension Option (Likely to exercise: Yes/No, Extension End Date).
  - Termination Option (Reasonably certain not to exercise: Yes/No).
  - Effective Lease Term displayed clearly.
- **Step 3 — Payments & Cash Flows:**
  - Currency selector (ISO 4217, default USD, EUR, GBP, AUD, SGD, etc.).
  - Payment Frequency (Monthly, Quarterly, Semi-Annual, Annual).
  - Payment Timing (In Arrears vs In Advance).
  - Base Payment Amount per period.
  - Rent-Free Period (Number of initial periods with zero payment).
  - Payment Escalation (Fixed annual % increase or stepped payment table).
- **Step 4 — Discount Rate & Initial Adjustments:**
  - Discount Rate type: Incremental Borrowing Rate (IBR) or Rate Implicit in Lease.
  - Annual Percentage Rate (APR).
  - Discounting convention (Nominal/Periodic compounding vs Annual Effective rate).
  - Initial Direct Costs (capitalised to ROU asset).
  - Lease Incentives Received at/before commencement (reduces ROU asset).
  - Restoration / Dismantling Costs (present value provision capitalised under IAS 37 / IFRS 16.24d).
  - Prepayments made at/before commencement.
- **Step 5 — Financial Reporting Assumptions:**
  - Financial Year End date and Current Reporting Cut-off Date.

### 3. Screen 2: Calculation Summary & KPI Dashboard
- **Cards at Top:**
  - **Initial Lease Liability:** Total present value of lease payments.
  - **Initial ROU Asset Value:** Liability + Initial Direct Costs + Restoration + Prepayments - Incentives.
  - **Total Cash Outflows:** Undiscounted total payments over full term.
  - **Total Finance Cost (Interest):** Total cash payments minus Initial Liability.
  - **Total Depreciation:** Total ROU asset amortised over term.
  - **P&L Profile Comparison:** Front-loaded IFRS 16 expense (Depreciation + Interest) vs Old IAS 17 operating lease straight-line rent.

### 4. Screen 3: Lease Liability Amortisation Schedule
- **Interactive Data Table:** Filterable by period or financial year.
- **Columns:**
  1. Period # (0, 1, 2, ... N)
  2. Payment Date / Period End Date
  3. Opening Lease Liability
  4. Interest Expense Accrued ($Opening \times r$)
  5. Cash Payment Made
  6. Principal Repayment (Cash Payment - Interest)
  7. Closing Lease Liability
- **Summary Footer:** Total Interest Accrued, Total Payments Made, Total Principal Repaid.

### 5. Screen 4: ROU Asset Depreciation Schedule
- **Interactive Data Table:**
- **Columns:**
  1. Period # / Financial Year
  2. Opening Gross Cost
  3. Opening Accumulated Depreciation
  4. Opening Net Book Value
  5. Depreciation Charge for the Period
  6. Closing Accumulated Depreciation
  7. Closing Net Book Value
- **Summary Footer:** Initial Cost, Total Depreciation to date, Net Book Value at cut-off.

### 6. Screen 5: Accounting Journal Entries
- **Presentation:** Standard debit/credit ledger format with accounting dates, account code/name, debits, credits, and formal audit narration.
- **Tabs:**
  - *Day-1 Initial Recognition:*
    - Dr. Right-of-Use Asset
    - Cr. Lease Liability
    - Cr. Bank/Cash (Prepayments / Initial Direct Costs)
    - Cr. Provision for Restoration (IAS 37)
    - Dr. Bank/Cash (Incentives received)
  - *Period Subsequent Measurement (for selected reporting cut-off):*
    - Dr. Finance Cost / Interest Expense (P&L)
    - Cr. Lease Liability
    - Dr. Lease Liability
    - Cr. Cash / Bank (Lease Payment)
    - Dr. Depreciation Expense — ROU Asset (P&L)
    - Cr. Accumulated Depreciation — ROU Asset (Balance Sheet)
  - *Year-End Summary Journal:* Aggregated debits and credits for financial statement posting.

### 7. Screen 6: Reporting Date Balances & Balance Sheet Presentation
- **Financial Statement Presentation Box:**
  - **Non-Current Assets:** Right-of-Use Asset (Net of Accumulated Depreciation).
  - **Current Liabilities:** Current portion of Lease Liability (principal payable within next 12 months from reporting date).
  - **Non-Current Liabilities:** Non-current portion of Lease Liability (principal payable after 12 months).
  - **Statement of Profit or Loss:** Depreciation of ROU asset, Interest on Lease Liability.
  - **Statement of Cash Flows:** Financing cash outflow (principal portion), Operating cash outflow (interest portion or per entity policy).

### 8. Screen 7: Reconciliation & Mathematical Integrity Center
- **Automated Verification Matrix (Status Badge: PASSED / FAILED):**
  - Check 1: Opening Liability + Interest - Payments = Closing Liability (Variance: $0.00).
  - Check 2: Initial ROU Asset - Accumulated Depreciation = Closing ROU Net Book Value (Variance: $0.00).
  - Check 3: Total P&L Impact over full lease life (Interest + Depreciation) = Total Net Cash Paid + Restoration Provision.
  - Check 4: Trial Balance Balance Test (Total Debits == Total Credits across all generated journals).

### 9. Screen 8: Export Center & Audit File Generator
- **Excel Export:** Formatted `.xlsx` file containing Cover Page, Lease Assumptions, Amortisation Schedule, Depreciation Schedule, Journal Entries, and Reconciliation Check sheet.
- **PDF Export:** Clean board-level / audit-ready executive PDF summary.
- **JSON Serialization:** Full calculation snapshot export/import.

---

## E. Detailed Lease Input Data Dictionary

| # | Field Name | Data Type | Status | Validation Rules | Default | Type | Accounting Relevance & Standard Reference | In MVP 1? |
|---|---|---|---|---|---|---|---|---|
| 1 | `leaseId` | UUID string | Auto | Valid UUID v4 | Generated | Derived | Internal primary key identifier. | Yes |
| 2 | `leaseReference` | String (1-50) | Required | Non-empty, alphanumeric + dash/underscore | "" | Input | Unique contract identifier in company registers. | Yes |
| 3 | `leaseDescription` | String (1-255)| Optional | Max 255 chars | "" | Input | Descriptive summary of leased item/premises. | Yes |
| 4 | `lesseeEntity` | String (1-100)| Required | Non-empty | "Main Operating Entity" | Input | Reporting entity name for financial statements. | Yes |
| 5 | `assetClass` | Enum | Required | PROPERTY, VEHICLE, EQUIPMENT, IT, OTHER | PROPERTY | Input | IFRS 16.53 requires disclosures by class of underlying asset. | Yes |
| 6 | `commencementDate`| Date (ISO) | Required | YYYY-MM-DD format, valid calendar date | Current date | Input | IFRS 16.22: Date lessor makes underlying asset available. | Yes |
| 7 | `contractEndDate` | Date (ISO) | Required | Must be > commencementDate | Commencement + 3 yrs | Input | Contractual expiry date before options. | Yes |
| 8 | `hasRenewalOption`| Boolean | Required | true / false | false | Judgement | IFRS 16.18: Assessment whether lessee is reasonably certain to exercise. | Yes |
| 9 | `renewalEndDate` | Date (ISO) | Optional | Required if hasRenewalOption = true; > contractEndDate | null | Judgement | Extended lease end date if renewal is reasonably certain. | Yes |
| 10| `hasTerminationOpt`| Boolean | Required | true / false | false | Judgement | IFRS 16.18: Option to terminate early. | Yes |
| 11| `terminationDate` | Date (ISO) | Optional | Required if hasTerminationOpt & reasonably certain | null | Judgement | Adjusted end date if early termination is reasonably certain. | Yes |
| 12| `leaseTermMonths` | Integer | Auto | Computed from commencement to effective end date | Derived | Derived | Effective lease term under IFRS 16.18–21. | Yes |
| 13| `shortTermElection`| Boolean | Optional | Disabled if leaseTermMonths > 12 | false | Policy Election | IFRS 16.5(a): Practical expedient to expense short-term leases. | Yes |
| 14| `lowValueElection` | Boolean | Optional | Max asset value when new ~USD 5,000 | false | Policy Election | IFRS 16.5(b): Practical expedient for low-value underlying assets. | Yes |
| 15| `currency` | String (3) | Required | ISO 4217 3-letter code (USD, EUR, GBP, etc.) | USD | Input | Functional currency of the lease contract. | Yes |
| 16| `paymentFrequency`| Enum | Required | MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL | MONTHLY | Input | Determines compounding periods per year ($m$). | Yes |
| 17| `paymentTiming` | Enum | Required | IN_ADVANCE, IN_ARREARS | IN_ARREARS | Input | Controls whether period discounting uses $(1+r)^{-(t-1)}$ or $(1+r)^{-t}$. | Yes |
| 18| `basePayment` | Decimal | Required | > 0.00 | 1000.00 | Input | Fixed periodic lease payment per IFRS 16.27(a). | Yes |
| 19| `rentFreePeriods` | Integer | Optional | >= 0, < total periods | 0 | Input | Initial periods where payment is 0.00 (incentive/fit-out). | Yes |
| 20| `escalationType` | Enum | Optional | NONE, FIXED_PERCENTAGE, STEPPED | NONE | Input | Fixed periodic contractual increases. | Yes |
| 21| `escalationRate` | Decimal | Optional | >= 0.00, <= 100.00 (Annual % increase) | 0.00 | Input | Fixed increases are included in lease payments (IFRS 16.27a). | Yes |
| 22| `discountRateType`| Enum | Required | IBR, IMPLICIT_RATE | IBR | Input | IFRS 16.26: Rate implicit in lease or incremental borrowing rate. | Yes |
| 23| `annualDiscountRate`| Decimal | Required | > 0.00%, <= 50.00% | 5.00% | Input | Annual percentage rate applied to discount payments. | Yes |
| 24| `compoundingConv` | Enum | Required | NOMINAL_ANNUAL, EFFECTIVE_ANNUAL | NOMINAL_ANNUAL | Judgement | Rate conversion convention ($r_{per} = i/m$ vs $r_{per} = (1+i)^{1/m}-1$). | Yes |
| 25| `initialDirectCosts`| Decimal | Optional | >= 0.00 | 0.00 | Input | IFRS 16.24(c): Costs incurred by lessee that would not have been incurred otherwise. | Yes |
| 26| `prepaymentsMade` | Decimal | Optional | >= 0.00 | 0.00 | Input | IFRS 16.24(b): Lease payments made at or before commencement date. | Yes |
| 27| `leaseIncentivesRec`| Decimal | Optional | >= 0.00 | 0.00 | Input | IFRS 16.24(b): Incentives received from lessor reduce initial ROU asset. | Yes |
| 28| `restorationCost` | Decimal | Optional | >= 0.00 (Present value under IAS 37) | 0.00 | Input | IFRS 16.24(d): Estimate of dismantling/restoration obligations. | Yes |
| 29| `reportingDate` | Date (ISO) | Required | >= commencementDate | Calendar Period End | Input | Balance sheet cut-off date for closing balance extraction. | Yes |

*Note on Payment Classification:* Only fixed payments (including in-substance fixed payments) and contractual payments that depend on an index/rate are included in the initial lease liability. Variable payments linked to future sales, performance, or asset usage are excluded from the lease liability and expensed in P&L when incurred (IFRS 16.38(b)).

---

## F. Recommended Architecture & Technology Comparison

### 1. Technology Trade-Off Comparison: Backend & Database

| Evaluation Criterion | Option 1: Managed Relational PostgreSQL (Cloud SQL / Supabase / Neon) | Option 2: Document / NoSQL (Firebase Firestore) |
| :--- | :--- | :--- |
| **Data Integrity & ACID** | **Outstanding (Native ACID):** Strict foreign keys, check constraints, transaction isolation. Zero risk of orphaned journal entries. | Moderate: Eventual consistency models, manual application-level referential integrity. |
| **Financial Reporting & Aggregation** | **Native SQL Power:** SUM, GROUP BY, window functions, period roll-forwards, complex portfolio analytics. | Poor: No native ad-hoc aggregation across large sets of documents without complex cloud functions. |
| **Multi-Tenant Row Isolation** | **Native Row-Level Security (RLS):** Database engine guarantees tenant isolation at connection level. | Firestore Security Rules: Flexible, but queries must explicitly match rule constraints to avoid permission fails. |
| **Audit Trails & Versioning** | **Native:** Append-only event tables, temporal tables, audit triggers. | Requires manual document copying or Cloud Functions. |
| **Google AI Studio Prototyping** | Fully supported via Cloud SQL / Express API integration. | Fully supported via Firebase integration. |
| **Future Commercial Scalability** | Standard enterprise architecture for financial systems (SAP, Workday, NetSuite all use relational databases). | Non-standard for complex accounting engines. |

### 2. Recommended Architecture
**Architecture Decision:** **Single-Page Application (React 19 + TypeScript + Tailwind CSS) with a Headless Pure Calculation Engine and Express / PostgreSQL Backend.**

```
+-----------------------------------------------------------------------------------+
|                           CLIENT BROWSER (Vite / React 19)                       |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  |  Lease Input UI    |   |  Schedule Visualizer  |   |  Journal & Audit View  |  |
|  +---------+----------+   +-----------+-----------+   +-----------+------------+  |
|            |                          |                           |               |
|  +---------v--------------------------v---------------------------v------------+  |
|  |                        UI State & View Orchestration                        |  |
|  +------------------------------------+----------------------------------------+  |
|                                       |                                           |
|       +-------------------------------v-------------------------------+           |
|       |     HEADLESS IFRS 16 ENGINE (Pure TypeScript / Decimal.js)    |           |
|       |  * Zero DOM dependencies                                      |           |
|       |  * 100% deterministic & unit-testable                         |           |
|       |  * Runs in browser for instant feedback & on Node server      |           |
|       +-------------------------------+-------------------------------+           |
+---------------------------------------|-------------------------------------------+
                                        | (Encrypted HTTPS REST API)
+---------------------------------------v-------------------------------------------+
|                           BACKEND API (Node.js / Express / tsx)                   |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | Auth & Org Context |   |  Lease & Version Svc  |   | Export Worker (XLSX)   |  |
|  +---------+----------+   +-----------+-----------+   +-----------+------------+  |
|            |                          |                           |               |
|  +---------v--------------------------v---------------------------v------------+  |
|  |                Multi-Tenant Data Access Layer (Drizzle ORM)                 |  |
|  +------------------------------------+----------------------------------------+  |
+---------------------------------------|-------------------------------------------+
                                        |
+---------------------------------------v-------------------------------------------+
|                    MANAGED POSTGRESQL (Google Cloud SQL)                          |
|  * Strict Schemas, Foreign Keys, Audit Logs, Row-Level Isolation                  |
+-----------------------------------------------------------------------------------+
```

#### Why this architecture?
1. **Financial Engine Portability:** The IFRS 16 calculation engine is written in pure TypeScript with zero DOM/browser dependencies. It runs on the client for instant live calculation updates (sub-millisecond recalculation on input changes) AND runs on the server for automated batch processing, PDF/Excel generation, and verification.
2. **Double-Entry Relational Rigor:** Financial ledgers are fundamentally relational. Accounts, leases, journal headers, journal lines, and period balances require foreign key integrity. PostgreSQL ensures an accidental deletion or corruption cannot leave orphan debits without credits.
3. **Simplicity in Evolution:**
   - In **Phase 1-3**, the application delivers instant value as an interactive client-side application with client exports and JSON save/load.
   - In **Phase 4**, we connect the Express backend and PostgreSQL database using the exact same calculation engine types without any frontend rewrite.

---

## G. Database Entity Relationship Design (For Phase 4 SaaS Persistence)

### 1. Entity Relationship Diagram (Conceptual Schema)
```
+--------------------+           +------------------------+
|   organisations    | 1       * |   organisation_users   |
+--------------------+-----------+------------------------+
| id (PK)            |           | id (PK)                |
| name               |           | organisation_id (FK)   |
| default_currency   |           | user_id (FK)           |
| subscription_tier  |           | role (ADMIN/USER/AUD)  |
+---------+----------+           +-----------+------------+
          | 1                                | *
          |                                  |
          | 1                                v
          | *                        +--------------------+
+---------v----------+               |       users        |
|      leases        |               +--------------------+
+--------------------+               | id (PK)            |
| id (PK)            |               | email              |
| organisation_id(FK)|               | full_name          |
| lease_reference    |               +--------------------+
| asset_class        |
| status (ACTIVE/etc)|
+---------+----------+
          | 1
          |
          | *
+---------v----------+
| calculation_versions
+--------------------+
| id (PK)            |
| lease_id (FK)      |
| version_number     |
| is_locked          |
| input_snapshot_json|
| commencement_date  |
| effective_end_date |
| discount_rate      |
| initial_liability  |
| initial_rou_asset  |
| created_by (FK)    |
+---------+----------+
          | 1
          |---------------------------------------+
          | *                                     | *
+---------v----------+                  +---------v----------+
| amortisation_lines |                  |  depreciation_lines|
+--------------------+                  +--------------------+
| id (PK)            |                  | id (PK)            |
| calc_version_id(FK)|                  | calc_version_id(FK)|
| period_index       |                  | period_index       |
| period_date        |                  | period_date        |
| opening_liability  |                  | opening_cost       |
| interest_expense   |                  | opening_accum_dep  |
| payment_amount     |                  | depreciation_charge|
| principal_repaid   |                  | closing_accum_dep  |
| closing_liability  |                  | closing_net_book   |
+--------------------+                  +--------------------+
          |
          | *
+---------v----------+
|   journal_entries  |
+--------------------+
| id (PK)            |
| calc_version_id(FK)|
| entry_type (INIT/..|
| posting_date       |
| account_code       |
| account_name       |
| debit_amount       |
| credit_amount      |
| narration          |
+--------------------+
```

### 2. Tenant Isolation Enforcement
- Every table containing customer data has a mandatory `organisation_id` foreign key.
- Database queries in the service layer enforce `WHERE organisation_id = :current_user_org_id`.
- PostgreSQL Row-Level Security (RLS) policies will be enabled on all tenant tables to prevent cross-tenant data leaks even in the event of an application-level query error.

---

## H. Proposed API & Service Boundaries

| Service Name | Boundary & Responsibility | Key Endpoints / Methods |
| :--- | :--- | :--- |
| **Lease Service** | Manages lease contract lifecycle, basic CRUD, validation, and status tracking. | `GET /api/leases`<br>`POST /api/leases`<br>`GET /api/leases/:id` |
| **Calculation Engine Service** | Pure stateless calculation service. Accepts inputs, returns schedules, journals, and balances. | `POST /api/calculate`<br>`POST /api/validate-inputs` |
| **Version & Snapshot Service** | Stores immutable calculation snapshots, audit locking, and comparisons. | `POST /api/leases/:id/versions`<br>`GET /api/leases/:id/versions/:ver` |
| **Reporting & Schedule Service** | Extracts balance sheet and P&L figures for an arbitrary reporting cut-off date. | `POST /api/reports/cut-off-balances`<br>`POST /api/reports/maturity-analysis` |
| **Export Service** | Generates formatted Excel (.xlsx) workbooks and PDF executive summaries. | `POST /api/exports/excel`<br>`POST /api/exports/pdf` |
| **Auth & Workspace Service** | Manages user authentication, tenant switching, role permissions, and audit logs. | `GET /api/organisations/current`<br>`GET /api/users/me` |

---

## I. IFRS 16 Accounting Requirements Matrix

| # | Accounting Standard Area | Mandatory / Election | IFRS 16 Reference | In First Engine? | Accounting Treatment / Rules | Approval Req'd? |
|---|---|---|---|---|---|---|
| 1 | **Lease Identification** | Mandatory | IFRS 16.9, B9–B31 | Yes | An agreement conveys the right to control the use of an identified asset for a period of time in exchange for consideration. | Review |
| 2 | **Lease Commencement Date**| Mandatory | IFRS 16.22 | Yes | Date on which a lessor makes an underlying asset available for use by a lessee. Initial measurement occurs at this date. | Yes |
| 3 | **Lease Term Determination**| Mandatory / Judgement | IFRS 16.18–21 | Yes | Non-cancellable period + periods covered by renewal options if reasonably certain to exercise + termination option periods if reasonably certain not to exercise. | Yes |
| 4 | **Short-Term Lease Exemption**| Policy Election | IFRS 16.5(a), 6–8 | Yes (Alert/Flag) | Leases with term <= 12 months with no purchase option may be recognized as straight-line operating expense in P&L. Engine provides exemption bypass. | Yes |
| 5 | **Low-Value Asset Exemption**| Policy Election | IFRS 16.5(b), B3–B8 | Yes (Alert/Flag) | Leases of low-value assets (underlying value when new <= ~$5,000, e.g. PCs, office furniture) may be expensed straight-line. Engine provides exemption bypass. | Yes |
| 6 | **Lease Payments Definition**| Mandatory | IFRS 16.27 | Yes | Includes: fixed payments, in-substance fixed payments, less incentives. Excludes: variable payments linked to sales or usage (expensed as incurred under IFRS 16.38b). | Yes |
| 7 | **Discount Rate Selection** | Mandatory | IFRS 16.26 | Yes | Rate implicit in the lease; if not readily determinable, the lessee's Incremental Borrowing Rate (IBR). Engine supports both. | Yes |
| 8 | **Discount Rate Compounding**| Policy / Technical | Educational Material | Yes | Choice between: (a) Nominal APR divided by periods ($i/m$) or (b) Effective Annual Rate $(1+i)^{1/m}-1$. Standardized and explicit. | **CRITICAL APPROVAL** |
| 9 | **Initial Lease Liability** | Mandatory | IFRS 16.26 | Yes | Present value of lease payments not paid at commencement date, discounted using the interest rate in IFRS 16.26. | Yes |
| 10| **Initial ROU Asset Value** | Mandatory | IFRS 16.24 | Yes | Initial Liability + Prepayments made at/before commencement + Initial Direct Costs + Restoration Provision (IAS 37) - Lease Incentives received. | Yes |
| 11| **Subsequent Liability Measurement**| Mandatory | IFRS 16.36 | Yes | Amortised cost: Carrying amount increased by interest ($Opening \times r$), reduced by lease payments made. | Yes |
| 12| **ROU Asset Depreciation** | Mandatory | IFRS 16.31–32 | Yes | Straight-line depreciation over shorter of lease term and asset useful life (unless ownership transfers or purchase option is reasonably certain). | Yes |
| 13| **Current / Non-Current Split**| Mandatory | IAS 1.69 | Yes | At any reporting date: Current liability = principal portion of payments due in the next 12 months. Non-current = remaining liability. | **CRITICAL APPROVAL** |
| 14| **Maturity Analysis Disclosure**| Mandatory | IFRS 16.58, IFRS 7.39 | Yes | Undiscounted contractual cash flows due: Year 1, Year 2, Year 3, Year 4, Year 5, and thereafter, reconciled to Lease Liability. | Yes |
| 15| **Lease Modifications** | Mandatory | IFRS 16.44–46 | Phase 6 | Remeasurement of liability using revised discount rate when lease scope/term/consideration changes. | Deferred |
| 16| **Index / Rate Escalation** | Mandatory | IFRS 16.42(b) | Phase 6 | Floating rate adjustments (CPI, LIBOR/SOFR resets) requiring periodic liability remeasurement. | Deferred |
| 17| **ROU Asset Impairment** | Mandatory | IAS 36 | Phase 6 | Testing and writing down ROU asset if recoverable amount falls below carrying amount. Interface provided in MVP; manual adjustment field. | Deferred |

---

## J. Calculation Engine Design

### 1. Architectural Principles
- **Headless & Functional:** The calculation engine is a pure TypeScript function:
  $$\text{calculateIFRS16}(input: \text{IFRS16Input}): \text{IFRS16Result}$$
- **Arbitrary-Precision Arithmetic:** Implemented using `decimal.js` or `bignumber.js` to ensure zero IEEE 754 floating-point inaccuracies (e.g. `0.1 + 0.2 === 0.30000000000000004` is strictly prevented).
- **Date Math Independence:** Dedicated financial date library handles Leap Years (Feb 29), Month-End Conventions (31 Jan to 28 Feb), and exact day count rules.

### 2. Mathematical Formulations & Payment Timing Conventions

#### A. Periodic Discount Rate ($r$)
Depending on the user's selected compounding policy:
1. **Nominal Compounding (Industry Standard Practice in Banking & Corporate Leasing):**
   $$r = \frac{\text{Annual Discount Rate}}{m}$$
   where $m$ is the payment frequency (12 for monthly, 4 for quarterly, 2 for semi-annual, 1 for annual).
2. **Effective Annual Compounding (Strict Actuarial Practice):**
   $$r = (1 + \text{Annual Discount Rate})^{1/m} - 1$$

#### B. Present Value of Lease Payments (Initial Lease Liability $L_0$)
For $N$ periods with payment sequence $P_1, P_2, \dots, P_N$:
- **Payments in Arrears (End of Period):**
  $$L_0 = \sum_{t=1}^{N} \frac{P_t}{(1 + r)^t}$$
- **Payments in Advance (Beginning of Period):**
  $$L_0 = P_1 + \sum_{t=2}^{N} \frac{P_t}{(1 + r)^{t-1}}$$
  *(Note: Period 1 payment made immediately on day 1 has a discount factor of $(1+r)^0 = 1.00$, meaning it is discounted at zero periods).*

#### C. Initial Right-of-Use Asset ($A_0$)
Per IFRS 16.24:
$$A_0 = L_0 + \text{Initial Direct Costs} + \text{Prepayments} + \text{Restoration Provision} - \text{Lease Incentives Received}$$

#### D. Subsequent Liability Amortisation ($t = 1 \dots N$)
- For each period $t$:
  - $\text{Opening Liability}_t = \text{Closing Liability}_{t-1}$
  - If **Payments in Arrears**:
    $$\text{Interest Expense}_t = \text{Opening Liability}_t \times r$$
    $$\text{Principal Repayment}_t = P_t - \text{Interest Expense}_t$$
    $$\text{Closing Liability}_t = \text{Opening Liability}_t + \text{Interest Expense}_t - P_t$$
  - If **Payments in Advance**:
    - Day-1 payment $P_1$ reduces liability immediately before any interest accrues:
      $$\text{Net Principal Balance}_t = \text{Opening Liability}_t - P_t$$
      $$\text{Interest Expense}_t = \text{Net Principal Balance}_t \times r$$
      $$\text{Closing Liability}_t = \text{Net Principal Balance}_t + \text{Interest Expense}_t$$

#### E. ROU Asset Depreciation
Straight-line monthly depreciation charge:
$$D_t = \frac{A_0}{N}$$
Where $N$ is the total number of periods in the lease term. Closing Net Book Value at period $t$:
$$\text{Net Book Value}_t = A_0 - \sum_{i=1}^t D_i$$

#### F. Current vs Non-Current Liability Split at Reporting Date
At reporting date $T$:
- Total Lease Liability = $\text{Closing Liability}_T$.
- Payments to be made in the subsequent 12 months are identified.
- Total interest to be recognized over those next 12 months is calculated.
- **Current Lease Liability** = Total cash payments due in next 12 months $-$ Total interest accrued in next 12 months (= Principal repayment due in next 12 months).
- **Non-Current Lease Liability** = Total Lease Liability $-$ Current Lease Liability.
- *Check:* Current Liability + Non-Current Liability $\equiv$ Total Lease Liability.

---

## K. Security & Multi-Tenant Design

### 1. Data Isolation Architecture
1. **Tenant Identification:** Every authenticated user session is bound to a verified `organisation_id` retrieved from JWT token claims or session cookies.
2. **Database Level Defense:**
   - Database queries never trust client-supplied tenant IDs.
   - All SQL statements pass through an ORM wrapper that appends `WHERE tenant_id = session.tenant_id`.
   - PostgreSQL Row Level Security (RLS) configured as a secondary defence-in-depth perimeter.
3. **Storage & Credentials:**
   - Zero hardcoded API keys or database connection strings in client code.
   - All secret management handled via server environment variables.
   - All exports (PDF/Excel) generated on-demand with short-lived transient memory buffers; no unauthenticated temporary files saved on disk.

---

## L. Automated Testing Strategy

### 1. Five-Tier Testing Pyramid
```
        /  E2E Playwright UI Tests  \         (5-10 tests)
       /-----------------------------\
      /   Integration & API Tests     \       (20-30 tests)
     /---------------------------------\
    /   Financial Reconciliation Tests  \     (50+ tests)
   /-------------------------------------\
  /    Pure Accounting Engine Unit Tests   \  (100+ tests)
 /-----------------------------------------\
```

### 2. Proposed Golden Test Dataset (Matrix of Test Cases)

| Test ID | Scenario Description | Inputs ($P, N, r$, Timing) | Expected Accounting Behavior | Verification Check |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Standard Vanilla Lease (Arrears) | $1,000/mo, 36 mos, 6.0% APR, In Arrears | $L_0 = \$32,830.17$, amortises to exactly $\$0.00$ at period 36. | Final balance == 0.00; Sum(Principal) == $L_0$. |
| **TC-02** | Standard Vanilla Lease (Advance) | $1,000/mo, 36 mos, 6.0% APR, In Advance | $L_0 = \$32,994.32$. Day 1 payment of $1,000 reduces liability to $\$31,994.32$. | Period 1 interest is calculated on reduced balance. |
| **TC-03** | Lease with Rent-Free Incentive | $5,000/qtr, 20 qtrs, 5.0% APR, 2 qtrs rent-free | Zero cash in qtr 1 & 2; interest compounds and increases liability in early periods. | Liability increases during rent-free window. |
| **TC-04** | Initial Adjustments Roll-up | Base $L_0 = \$100,000$, Direct Cost: \$5k, Restoration: \$10k, Incentive: \$3k | ROU Asset = $\$100\text{k} + \$5\text{k} + \$10\text{k} - \$3\text{k} = \$112,000$. | Asset opening equals calculated sum. |
| **TC-05** | Short-Term Exemption Election | 10 months lease, user checks short-term election | Alert shown: No ROU Asset or Liability recognized on balance sheet; P&L rent expense flagged. | Balance Sheet $L_0 = 0$, $A_0 = 0$. |
| **TC-06** | Leap Year Date Boundary | Commencement 29 Feb 2024 to 28 Feb 2027 | Exact monthly anniversary dates handled without off-by-one errors. | Correct schedule length of 36 periods. |
| **TC-07** | Escalating Rental Lease | $10,000/yr with 3% annual escalation for 5 years | Payments: \$10k, \$10.3k, \$10.609k, etc. Discounted cash flows match formula. | Schedule reflects stepped payment amounts. |
| **TC-08** | Interim Cut-off Reporting Date | 5-year lease started 1 Jan 2025; Reporting cut-off 30 Jun 2026 (Month 18) | Extracts month 18 balances; correctly splits next 12 months (M19–M30) as Current. | Current + Non-Current == Month 18 Closing Liability. |

---

## M. Phase-by-Phase Implementation Plan

```
Phase 0: Architecture & Blueprint (THIS PHASE) [COMPLETED]
   |
Phase 1: Frontend Foundation & Interactive Lease Input Workflow
   |---> Deliverables: Design system, 4-step wizard form, live validation, assumptions review.
   |
Phase 2: Headless IFRS 16 Engine & Decimal Precision Core
   |---> Deliverables: Pure TypeScript calculation engine, unit tests, golden test validation.
   |
Phase 3: Schedules, Journal Generator, Reconciliations & Exports
   |---> Deliverables: Amortisation/depreciation tables, reporting cut-off, journals, XLSX/PDF exports.
   |
Phase 4: Backend API, PostgreSQL Persistence & Authentication
   |---> Deliverables: Express API, Cloud SQL/PostgreSQL, Drizzle ORM, multi-tenant RBAC.
   |
Phase 5: Subscriptions & Commercial SaaS Billing
   |---> Deliverables: Stripe integration, tier metering (leases/seats), customer portal.
   |
Phase 6: Advanced Lease Events & Portfolio Expansion
   |---> Deliverables: IFRS 16 modifications, remeasurements, bulk import, multi-lease portfolio reports.
   |
Phase 7: Production Hardening, Security Audit & Launch
   |---> Deliverables: Penetration testing, SOC2 controls, disaster recovery, performance optimization.
```

---

## N. Measurable Acceptance Criteria for MVP 1

1. **Accuracy:** Final closing lease liability at the end of the lease term must equal `0.00` (within $\pm \$0.01$ rounding tolerance) across all standard test cases.
2. **Reconciliation:** Debits and Credits must balance to `0.00` difference for every journal entry generated.
3. **Current/Non-Current Integrity:** Current liability + Non-current liability must exactly equal total closing liability at any user-specified reporting date.
4. **Performance:** Full schedule and journal calculation for a 120-month lease must execute in under 15 milliseconds on the client.
5. **Usability:** A user can input a complete lease contract, review assumptions, generate schedules, inspect journal entries, and download an Excel workbook in under 2 minutes.
6. **Zero Silent Failures:** Any invalid input (e.g. negative discount rate, end date before start date, zero payments) must trigger explicit, user-friendly field-level validation messages.

---

## O. Risk Register & Unresolved Decisions

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | **Discount Rate Compounding Ambiguity:** Clients using nominal rates ($i/12$) vs actuarial effective rates ($(1+i)^{1/12}-1$) producing subtle interest variances. | High | High | Make compounding convention an explicit user setting with clear default (Nominal) and descriptive helper tooltips. |
| **R-02** | **Current/Non-Current Liability Methodologies:** Different audit firms have slightly differing views on whether next period's interest is included in current liability. | High | Medium | Follow the standard capital reduction approach (Current = Principal repayments due within 12 months) and document this in the accounting notes. |
| **R-03** | **Irregular / Broken Period Dates:** Leases starting mid-month (e.g. 17th of the month) create fractional periods. | Medium | Medium | In MVP 1, support whole-month periods (or full periodic cycles). Explicitly document fractional day-count conventions as a Phase 2/3 refinement. |
| **R-04** | **Browser Decimal Precision Drift:** Standard JS numbers lose precision above 15 digits. | Critical | Low | Strictly mandate arbitrary-precision library (`decimal.js` or `big.js`) across the entire calculation engine. |

---

## P. Deployment & Estimated Operating Cost Considerations

### 1. Prototype & Development Environment (Google AI Studio Preview)
- **Cost:** $\$0.00$ / month (Included in development platform).
- **Purpose:** Rapid iterative frontend and engine development, initial user testing.

### 2. Production Cloud Architecture (Google Cloud Platform)
*Note: All figures below are architectural estimates based on public GCP list pricing as of 2026. Actual costs vary with traffic and committed use discounts.*

| Service Component | Specification / Tier | Estimated Monthly Cost (USD) |
| :--- | :--- | :--- |
| **Frontend & API Hosting** | Google Cloud Run (Serverless container, auto-scale 0 to N) | \$15 – \$35 / month |
| **Relational Database** | Google Cloud SQL (PostgreSQL, 1 vCPU, 3.75 GB RAM, SSD, Automated Daily Backups) | \$55 – \$85 / month |
| **Authentication & Identity** | Firebase Auth / Google Identity Platform (Free tier up to 50,000 MAUs) | \$0.00 (within free tier) |
| **DNS, SSL & CDN** | Cloudflare Pro / GCP Cloud Armor | \$20 / month |
| **Total Estimated Run Rate:** | **Initial Production SaaS Base** | **~\$90 – \$140 / month** |

---

## Approval Gate & Sign-off

### 1. Summary of Recommended Architecture
- **Frontend:** React 19 + TypeScript + Tailwind CSS for a responsive, modern enterprise interface.
- **Engine:** Headless, pure TypeScript calculation module using arbitrary-precision decimal mathematics.
- **Backend (Phase 4):** Node.js / Express with Google Cloud SQL (PostgreSQL) using Drizzle ORM and Row-Level Security for multi-tenant isolation.
- **Execution Order:** Complete the single-lease workflow, calculation engine, schedules, journals, reconciliations, and exports (Phase 1–3) before provisioning cloud database and payment infrastructure (Phase 4–5).

### 2. Key Decisions & Rationale
1. **Headless Engine:** Separates accounting logic completely from React UI components, guaranteeing testability and zero UI side-effects.
2. **Relational Database over NoSQL:** Financial accounting requires strict ACID transactions, foreign keys, and roll-forward aggregations that are natural in PostgreSQL and risky in NoSQL.
3. **Client-side MVP 1 Prototype:** Enables the Chartered Accountant to test and validate the exact mathematical output, UI workflows, and Excel exports immediately without waiting on database provisioning.

### 3. Critical Accounting Decisions Requiring Your Formal Approval
Before we code the calculation engine in Phase 2, please confirm your preferred treatment for:
1. **Compounding Convention Default:** Do you approve using **Nominal Annual Compounding** ($r = \text{APR} / 12$ for monthly) as the system default, with an option for Actuarial Effective Compounding?
2. **Current Liability Measurement Method:** Do you approve the **Principal Reduction Method** (Current Liability = Total cash payments in next 12 months minus total interest recognized in next 12 months) for the balance sheet presentation?
3. **Subsequent Measurement Timing for Advance Payments:** For payments in advance, do you confirm that Day-1 payment has zero interest and immediately reduces liability opening balance?

### 4. Recommended Next Step
Upon your approval, we will immediately start **Phase 1: Frontend Foundation and Lease Input Workflow**, setting up the design system, input forms, validation rules, and summary cards.
