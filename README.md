Ledgerly — Clarity for Every Rupee
A classic, elegant full-stack personal finance & expense management platform.

<p align="center">
  <a href="https://ledgerly-clarity-for-every-rupee-2.onrender.com/">🚀 Live Demo</a>
</p>

✨ Overview
Ledgerly is a production-grade full-stack personal finance and expense tracking application designed around a refined private-banking-inspired dashboard experience.
It combines warm ivory surfaces, deep forest accents, elegant serif typography, high-density financial data tables, interactive analytics, and Indian Rupee (₹) formatting into one focused financial workspace.
Ledgerly — Clarity for every rupee.

What Ledgerly helps you do
- Track income and expenses
- Monitor monthly cash flow
- Understand category-wise spending
- Set and monitor monthly budgets
- Analyze savings and spending trends
- Manage transactions securely
- Export financial statements
- Customize categories and account preferences
🌐 Live Demo
Open Ledgerly →
🎯 Core Value Pillars
◈ Zero-Pill Visual Discipline
A refined interface that avoids unnecessary status-card clutter and uses clean typography, spacing, and separators for financial metadata.
◈ Dynamic Ledger Mathematics
Financial metrics are reconciled dynamically from transaction data, including:
- Total balance
- Monthly income
- Monthly expenses
- Monthly savings
- Savings rate
- Category spending distribution
- Month-over-month changes
◈ High-Density Data Grids
A powerful transaction workspace with instant search, category filtering, income/expense filtering, date filtering, sorting, pagination, and CSV export.
◈ Visual Financial Trajectories
Interactive financial visualizations make spending patterns easier to understand through dual-line cash-flow charts, income vs. expense comparisons, time-range analysis, donut-based expense breakdowns, and savings-rate visualization.
🚀 Key Features
🔐 Full-Stack Authentication
- JWT-based authentication
- bcrypt password hashing
- Persistent authenticated sessions
- Protected REST API routes
- One-click demo login for evaluation
📊 Dynamic Financial Dashboard
The dashboard provides an at-a-glance view of:
- Total Balance
- Monthly Income
- Monthly Expenses
- Monthly Savings
- Month-over-month percentage changes
All financial figures are calculated dynamically from transaction data.
📈 Interactive Cash Flow Analytics
Explore income and expenses across:
- 7 Days
- 30 Days
- 3 Months
- 6 Months
- 1 Year
The custom SVG dual-line chart includes interactive hover states and precise numerical tooltips.
🍩 Expense Breakdown
Visualize spending allocation across:
- Food
- Shopping
- Transport
- Bills
- Health
- Entertainment
- Education
- Custom categories
💳 Transaction Management
Complete CRUD functionality for:
- Creating transactions
- Editing transactions
- Deleting transactions
- Searching and filtering
- Sorting and pagination
- CSV statement export
Supported types:
- Income
- Expense
Supported payment methods:
- UPI
- Credit Card
- Debit Card
- Bank Transfer
- Cash
Destructive actions are protected by confirmation modals.
🔎 Search, Filter & Sort
Find records using:
- Real-time description and notes search
- Category filters
- Transaction-type filters
- Date filters
- Newest / Oldest sorting
- Highest / Lowest amount sorting
- Pagination
🎯 Budget Management
Set monthly spending limits for individual categories and monitor utilization in real time.
Budget states:
- Healthy
- Warning — 80%+
- Exceeded
🏷️ Custom Category Management
Create and customize categories with:
- Custom names
- Hex color swatches
- Icons
Ledgerly also prevents deletion of categories currently referenced by transactions.
🧠 Financial Analytics & Intelligence
Ledgerly provides rule-based insights derived from transaction patterns:
- Savings Rate gauge
- Month-over-month spending velocity
- Top spending streams
- Category distribution
- Dynamic financial observations
⚙️ Account Governance & Preferences
Manage:
- Personal profile
- Avatar preview
- Base currency
- Date format
- Password
- Application theme
Supported currencies:
INR ₹ · USD $ · EUR € · GBP £
Themes:
Classic Ivory Light · Obsidian Dark
📤 Data Export
Export transaction records as an RFC 4180-compliant CSV statement.
🛠️ Tech Stack
Layer	Technologies
Frontend	React 19, TypeScript, Vite 8
Styling	Tailwind CSS v4
UI / Motion	Lucide React, Motion
Backend	Node.js, Express 4, TypeScript
Runtime	tsx
Authentication	JSON Web Tokens, bcryptjs
Database	Persistent JSON data engine
AI / Integration	Google Gemini API
Typography	Cormorant Garamond, Plus Jakarta Sans, JetBrains Mono


Design Language
Ledgerly follows a premium financial-dashboard aesthetic:
- Warm Ivory surfaces
- Deep Forest accents
- Cormorant Garamond for editorial headings
- Plus Jakarta Sans for UI content
- JetBrains Mono for tabular financial numbers
- Indian Rupee (₹) as the primary monetary format
🏗️ Architecture
Ledgerly
│
├── Frontend
│   ├── React 19
│   ├── TypeScript
│   ├── Vite
│   ├── Tailwind CSS
│   └── Context-based application state
│
├── Backend
│   ├── Node.js
│   ├── Express
│   ├── REST API
│   ├── JWT Authentication
│   └── bcrypt Password Security
│
├── Data Layer
│   ├── Persistent JSON Database
│   ├── Collection Managers
│   ├── Atomic Disk Flushing
│   └── Automatic Seed Data
│
└── Financial Intelligence
    ├── Analytics Engine
    ├── Budget Calculations
    ├── Spending Insights
    └── Transaction Reconciliation
📁 Project Structure
Ledgerly/
│
├── data/
│   └── ledgerly_db.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   └── services/
│
├── src/
│   ├── assets/images/
│   ├── components/
│   │   ├── budgets/
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── transactions/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── index.css
│
├── server.ts
├── package.json
└── tsconfig.json
⚡ Getting Started
Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key for Gemini-powered functionality
Installation
git clone <your-repository-url>
cd Ledgerly-Clarity-for-every-rupee
npm install
Environment Variables
Create a .env file:
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
Never commit .env or expose API keys in a public repository.

Development
npm run dev
Application:
http://localhost:3000
Production Build
npm run build
npm start
👤 Demo Account
For quick evaluation, use the built-in demo login.
Email
riya.kri.thakur2004@gmail.com
Password
password123
You can also use Sign in as Demo on the authentication page.
For production deployments, replace or disable demo credentials and use secure secrets.

🔌 REST API
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register a new user	No
POST	/api/auth/login	Authenticate user	No
GET	/api/auth/me	Fetch current profile	Yes
PUT	/api/auth/profile	Update profile/preferences	Yes
PUT	/api/auth/password	Change password	Yes
GET	/api/transactions	Query transactions	Yes
POST	/api/transactions	Create transaction	Yes
GET	/api/transactions/:id	Fetch transaction	Yes
PUT	/api/transactions/:id	Update transaction	Yes
DELETE	/api/transactions/:id	Delete transaction	Yes
GET	/api/transactions/export/csv	Export CSV statement	Yes
GET	/api/analytics	Compute financial analytics	Yes
GET	/api/budgets	Get budget utilization	Yes
POST	/api/budgets	Create category budget	Yes
PUT	/api/budgets/:id	Update budget	Yes
DELETE	/api/budgets/:id	Delete budget	Yes
GET	/api/categories	List categories	Optional
POST	/api/categories	Create category	Yes
PUT	/api/categories/:id	Update category	Yes
DELETE	/api/categories/:id	Delete category	Yes


🚢 Deployment
The current live deployment is hosted on Render:
https://ledgerly-clarity-for-every-rupee-2.onrender.com/
Recommended Render configuration:
Build Command:
npm install && npm run build

Start Command:
npm start
Configure secrets through the hosting provider's environment-variable settings rather than committing them to Git.
🔒 Security
Ledgerly uses:
- JWT authentication
- bcrypt password hashing
- Protected API routes
- Server-side authorization middleware
- Environment-based secret configuration
- Confirmation safeguards for destructive operations
- Category dependency validation
For a larger production deployment, consider migrating from local JSON persistence to a managed database and persistent storage solution.
📜 License
This project is licensed under the Apache-2.0 License.
👩‍💻 Author
Riya Kumari
Computer Science & Engineering
VIT-AP University
<p align="center">
  <strong>Ledgerly</strong><br>
  <em>Clarity for every rupee.</em>
</p>