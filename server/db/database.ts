import fs from 'fs';
import path from 'path';

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  password: string;
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

export interface TransactionDoc {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetDoc {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  month: number; // 1-12
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDoc {
  _id: string;
  userId: string; // 'system' or specific user
  name: string;
  type: 'expense' | 'income' | 'both';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: UserDoc[];
  transactions: TransactionDoc[];
  budgets: BudgetDoc[];
  categories: CategoryDoc[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'ledgerly_db.json');

class Database {
  private data: DatabaseSchema = {
    users: [],
    transactions: [],
    budgets: [],
    categories: [],
  };
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to initialize database, using in-memory fallback:', err);
      this.data = { users: [], transactions: [], budgets: [], categories: [] };
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Collections accessors
  public get users() {
    return this.collection<UserDoc>('users');
  }

  public get transactions() {
    return this.collection<TransactionDoc>('transactions');
  }

  public get budgets() {
    return this.collection<BudgetDoc>('budgets');
  }

  public get categories() {
    return this.collection<CategoryDoc>('categories');
  }

  private collection<T extends { _id: string }>(key: keyof DatabaseSchema) {
    return {
      find: (predicate?: (item: T) => boolean): T[] => {
        const list = (this.data[key] as unknown) as T[];
        return predicate ? list.filter(predicate) : [...list];
      },
      findOne: (predicate: (item: T) => boolean): T | null => {
        const list = (this.data[key] as unknown) as T[];
        const item = list.find(predicate);
        return item ? { ...item } : null;
      },
      findById: (id: string): T | null => {
        const list = (this.data[key] as unknown) as T[];
        const item = list.find((i) => i._id === id);
        return item ? { ...item } : null;
      },
      insert: (doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'> & { _id?: string }): T => {
        const now = new Date().toISOString();
        const newDoc = {
          ...doc,
          _id: doc._id || Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
          createdAt: now,
          updatedAt: now,
        } as unknown as T;
        (this.data[key] as unknown as T[]).push(newDoc);
        this.save();
        return { ...newDoc };
      },
      update: (id: string, updates: Partial<T>): T | null => {
        const list = (this.data[key] as unknown) as T[];
        const index = list.findIndex((i) => i._id === id);
        if (index === -1) return null;
        const updated = {
          ...list[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        list[index] = updated;
        this.save();
        return { ...updated };
      },
      remove: (id: string): boolean => {
        const list = (this.data[key] as unknown) as T[];
        const index = list.findIndex((i) => i._id === id);
        if (index === -1) return false;
        list.splice(index, 1);
        this.save();
        return true;
      },
      count: (predicate?: (item: T) => boolean): number => {
        const list = (this.data[key] as unknown) as T[];
        return predicate ? list.filter(predicate).length : list.length;
      },
    };
  }
}

export const db = new Database();
