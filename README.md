# Ledgerly — Clarity for Every Rupee

An elegant, production-grade full-stack personal finance and expense tracking web application. Built with a bespoke financial dashboard aesthetic inspired by modern private banking interfaces, featuring warm ivory surfaces, deep forest accents, Cormorant Garamond serif typography, and Indian Rupee (`₹`) monetary formatting.

---

## 1. Project Overview

**Ledgerly** ("Clarity for every rupee.") empowers discerning individuals to manage income, track multi-category expenditures, monitor monthly budget utilization, analyze cash flow velocity, and inspect multi-period financial trends.

### Core Value Pillars
- **Zero-Pill Visual Discipline**: Metadata presented cleanly with typographic separators (`·`, `/`) rather than cluttered status pill capsules.
- **Dynamic Ledger Mathematics**: Real-time server-side reconciliation of total balance, monthly surplus, savings rate, and category spreads.
- **High-Density Data Grids**: High-speed table with search, category filtering, type filtering, multi-attribute sorting, and one-click CSV statement export.
- **Visual Trajectories**: Custom SVG curved multi-line cash flow charts and interactive donut breakdowns with center metrics.

---

## 2. Key Features

- **Full-Stack Authentication**: JWT authentication with bcrypt password hashing, persistent sessions, and 1-click evaluation demo login.
- **Dynamic Financial Overview**:
  - Total Balance, Monthly Income, Monthly Expenses, and Monthly Savings metric cards.
  - Month-over-month percentage changes calculated dynamically from transactions.
- **Interactive Dual-Line Cash Flow Chart**:
  - Inspect Income vs Expense trends over 7 Days, 30 Days, 3 Months, 6 Months, or 1 Year.
  - Interactive hover scrubbers with precise numeric tooltips.
- **Expense Breakdown Donut**:
  - Segmented arcs displaying spending allocation across Food, Shopping, Transport, Bills, Health, Entertainment, Education, etc.
- **Transaction CRUD & Auditing**:
  - Record, Edit, and Delete transactions with type (Income/Expense), category, date, and payment method (UPI, Credit Card, Debit Card, Bank Transfer, Cash).
  - Explicit confirmation modal safeguards before destructive deletions.
- **Comprehensive Search & Filters**:
  - Real-time text search across descriptions and notes.
  - Combined filters by category, transaction type, and date.
  - Sorting by Newest, Oldest, Highest amount, and Lowest amount.
  - Clean pagination.
- **Budget Thresholds**:
  - Set monthly spending ceilings per category.
  - Real-time utilization progress bars with `Healthy`, `Warning (80%+)`, and `Exceeded` statuses.
- **Category Management**:
  - Create and customize custom categories with hex color swatches and icons.
  - Automatic dependency protection preventing deletion of categories currently attached to active transactions.
- **Financial Analytics & Intelligence**:
  - Savings Rate gauge meter.
  - Month-over-month velocity comparison.
  - Ranked top spending streams.
  - Rule-based dynamic insights derived from transaction patterns.
- **Account Governance & Settings**:
  - Personal profile management and avatar preview.
  - Base currency preference (INR ₹, USD $, EUR €, GBP £).
  - Date format preference.
  - Obsidian Dark Mode / Classic Ivory Light Mode toggles.
  - Secure bcrypt password updates.
- **Data Export**:
  - Instant CSV export formatted to RFC 4180 specifications.

---

## 3. Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Node.js, Express 4, TypeScript (via `tsx`).
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`.
- **Database**: Persistent JSON data engine with atomic disk flushing, relational querying, and auto-seeding.
- **Typography**: Cormorant Garamond (Headings), Plus Jakarta Sans (UI body), JetBrains Mono (Tabular numerals).

---

## 4. Folder Structure

```
├── data/
│   └── ledgerly_db.json         # Persistent JSON database
├── server/
│   ├── config/                  # Server configuration and environment
│   ├── controllers/             # Express API controllers (auth, tx, analytics, budgets, categories)
│   ├── db/                      # Database engine and collection managers
│   ├── middleware/              # JWT auth and global error handling
│   ├── routes/                  # Express REST routes
│   └── services/                # Analytics engine and initial seed data
├── src/
│   ├── assets/images/           # High-resolution generated visual assets
│   ├── components/
│   │   ├── budgets/             # Budget modals and cards
│   │   ├── categories/          # Category modals and pickers
│   │   ├── dashboard/           # Metric cards, SVG dual-line chart, donut breakdown
│   │   ├── layout/              # Persistent desktop sidebar, mobile drawer, top header
│   │   └── transactions/        # Transaction table, modals, delete confirmations
│   ├── context/                 # AuthContext, ThemeContext, ToastContext
│   ├── pages/                   # Dashboard, Transactions, Analytics, Budgets, Categories, Settings, Profile, LandingAuth
│   ├── services/                # Typed frontend API client
│   ├── types/                   # TypeScript interfaces
│   ├── utils/                   # Indian Rupee (₹) and date formatters
│   ├── App.tsx                  # Root application router and shell
│   └── index.css                # Tailwind configuration and theme variables
├── server.ts                    # Full-stack server entry point (Express + Vite)
├── package.json
└── tsconfig.json
```

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js $\ge 18$
- npm or yarn

### Installation
```bash
npm install
```

### Running in Development
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 6. Pre-Configured Demo Credentials

For quick evaluation, click **"Sign in as Demo"** on the authentication page, or use:
- **Email**: `riya.kri.thakur2004@gmail.com`
- **Password**: `password123`

---

## 7. REST API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update user settings and preferences | Yes |
| `PUT` | `/api/auth/password` | Change user password | Yes |
| `GET` | `/api/transactions` | Query filtered & paginated transactions | Yes |
| `POST` | `/api/transactions` | Record a new transaction | Yes |
| `GET` | `/api/transactions/:id` | Fetch transaction by ID | Yes |
| `PUT` | `/api/transactions/:id` | Update an existing transaction | Yes |
| `DELETE` | `/api/transactions/:id` | Delete transaction from ledger | Yes |
| `GET` | `/api/transactions/export/csv` | Download full statement as CSV | Yes |
| `GET` | `/api/analytics` | Compute dynamic financial analytics | Yes |
| `GET` | `/api/budgets` | Get monthly budget utilization | Yes |
| `POST` | `/api/budgets` | Allocate new category budget | Yes |
| `PUT` | `/api/budgets/:id` | Update category budget limit | Yes |
| `DELETE` | `/api/budgets/:id` | Remove category budget | Yes |
| `GET` | `/api/categories` | List default & custom categories | Optional |
| `POST` | `/api/categories` | Add custom category | Yes |
| `PUT` | `/api/categories/:id` | Edit custom category | Yes |
| `DELETE` | `/api/categories/:id` | Delete custom category (validates usage) | Yes |

---

## 8. License

Apache-2.0
