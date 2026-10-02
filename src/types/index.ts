export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer';

export interface User {
  _id: string;
  name: string;
  email: string;
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    budgetAlerts: boolean;
    monthlySummary: boolean;
    largeTransactions: boolean;
  };
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'Healthy' | 'Warning' | 'Exceeded';
  month: number;
  year: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  type: 'expense' | 'income' | 'both';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  success: boolean;
  timeframe: string;
  selectedMonth: number;
  selectedYear: number;
  metrics: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savings: number;
    savingsRate: number;
    changes: {
      income: number;
      expense: number;
      savings: number;
      balance: number;
    };
  };
  timeline: {
    label: string;
    income: number;
    expense: number;
    savings: number;
    net: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  topCategories: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  monthlyComparison: {
    currentMonth: {
      name: string;
      income: number;
      expense: number;
      savings: number;
    };
    previousMonth: {
      name: string;
      income: number;
      expense: number;
      savings: number;
    };
  };
  budgetUtilization: Budget[];
  insights: string[];
}
