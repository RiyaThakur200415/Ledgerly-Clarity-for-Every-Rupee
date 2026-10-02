import { User, Transaction, Budget, Category, AnalyticsData } from '../types/index.ts';

const TOKEN_KEY = 'ledgerly_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      if (response.status === 401) {
        removeStoredToken();
      }
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // Auth Endpoints
  async register(payload: { name: string; email: string; password: string }) {
    return this.request<{ success: boolean; token: string; user: User; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(payload: { email: string; password: string }) {
    return this.request<{ success: boolean; token: string; user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMe() {
    return this.request<{ success: boolean; user: User }>('/api/auth/me');
  }

  async updateProfile(updates: Partial<User>) {
    return this.request<{ success: boolean; user: User; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async updatePassword(payload: { currentPassword: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Transactions Endpoints
  async getTransactions(params?: {
    search?: string;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
    sortBy?: string;
    page?: number;
    limit?: number | string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qs = query.toString();
    return this.request<{
      success: boolean;
      transactions: Transaction[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
      summary: { totalIncome: number; totalExpenses: number; netBalance: number };
    }>(`/api/transactions${qs ? `?${qs}` : ''}`);
  }

  async createTransaction(transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return this.request<{ success: boolean; transaction: Transaction; message: string }>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    return this.request<{ success: boolean; transaction: Transaction; message: string }>(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics Endpoints
  async getAnalytics(params?: { timeframe?: string; month?: number; year?: number }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query.set(key, String(val));
        }
      });
    }
    const qs = query.toString();
    return this.request<AnalyticsData>(`/api/analytics${qs ? `?${qs}` : ''}`);
  }

  // Budgets Endpoints
  async getBudgets(month = 10, year = 2026) {
    return this.request<{
      success: boolean;
      month: number;
      year: number;
      budgets: Budget[];
      summary: { totalBudget: number; totalSpent: number; remaining: number; percentage: number };
    }>(`/api/budgets?month=${month}&year=${year}`);
  }

  async createBudget(budget: { category: string; amount: number; month: number; year: number }) {
    return this.request<{ success: boolean; budget: Budget; message: string }>('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async updateBudget(id: string, updates: { amount?: number; category?: string }) {
    return this.request<{ success: boolean; budget: Budget; message: string }>(`/api/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBudget(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories Endpoints
  async getCategories() {
    return this.request<{ success: boolean; categories: Category[] }>('/api/categories');
  }

  async createCategory(category: { name: string; type?: 'expense' | 'income' | 'both'; icon?: string; color?: string }) {
    return this.request<{ success: boolean; category: Category; message: string }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, updates: Partial<Category>) {
    return this.request<{ success: boolean; category: Category; message: string }>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCategory(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // CSV Export Download
  async downloadCsv() {
    const token = getStoredToken();
    const response = await fetch('/api/transactions/export/csv', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to generate CSV export.');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledgerly_statement_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const api = new ApiService();
