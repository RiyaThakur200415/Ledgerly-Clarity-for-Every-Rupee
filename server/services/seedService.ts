import bcrypt from 'bcryptjs';
import { db } from '../db/database.ts';

export const seedInitialData = async () => {
  // Check if categories exist
  if (db.categories.count() === 0) {
    const defaultCategories = [
      { name: 'Food', type: 'expense' as const, icon: 'Utensils', color: '#2D6A4F', isDefault: true, userId: 'system' },
      { name: 'Shopping', type: 'expense' as const, icon: 'ShoppingBag', color: '#B89B5E', isDefault: true, userId: 'system' },
      { name: 'Transportation', type: 'expense' as const, icon: 'Car', color: '#3D5A80', isDefault: true, userId: 'system' },
      { name: 'Bills', type: 'expense' as const, icon: 'Receipt', color: '#C05621', isDefault: true, userId: 'system' },
      { name: 'Entertainment', type: 'expense' as const, icon: 'Film', color: '#7B2CBF', isDefault: true, userId: 'system' },
      { name: 'Health', type: 'expense' as const, icon: 'HeartPulse', color: '#2A9D8F', isDefault: true, userId: 'system' },
      { name: 'Education', type: 'expense' as const, icon: 'GraduationCap', color: '#4A5568', isDefault: true, userId: 'system' },
      { name: 'Salary', type: 'income' as const, icon: 'Briefcase', color: '#173F35', isDefault: true, userId: 'system' },
      { name: 'Freelance', type: 'income' as const, icon: 'Laptop', color: '#2F855A', isDefault: true, userId: 'system' },
      { name: 'Investment', type: 'income' as const, icon: 'TrendingUp', color: '#D97706', isDefault: true, userId: 'system' },
      { name: 'Other', type: 'expense' as const, icon: 'MoreHorizontal', color: '#718096', isDefault: true, userId: 'system' },
    ];

    for (const cat of defaultCategories) {
      db.categories.insert(cat);
    }
    console.log('[Seed] Default categories initialized');
  }

  // Check if demo user exists
  let demoUser = db.users.findOne((u) => u.email === 'riya.kri.thakur2004@gmail.com');
  if (!demoUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    demoUser = db.users.insert({
      _id: 'user_riya_default',
      name: 'Riya Thakur',
      email: 'riya.kri.thakur2004@gmail.com',
      password: hashedPassword,
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      notifications: {
        budgetAlerts: true,
        monthlySummary: true,
        largeTransactions: true,
      },
      profilePhoto: '/src/assets/images/avatar_riya_finance_1790940141252.jpg',
    });
    console.log('[Seed] Demo user created:', demoUser.email);
  }

  // Check if user has transactions
  const userTxCount = db.transactions.count((t) => t.userId === demoUser!._id);
  if (userTxCount === 0) {
    const userId = demoUser._id;

    // October 2026 (Current Month)
    const octTransactions = [
      { userId, type: 'income' as const, amount: 85000, description: 'TechCorp Senior Salary', category: 'Salary', date: '2026-10-01', paymentMethod: 'Bank Transfer' as const, notes: 'Monthly corporate payroll direct deposit' },
      { userId, type: 'income' as const, amount: 25000, description: 'Fintech UI Consulting Retainer', category: 'Freelance', date: '2026-10-02', paymentMethod: 'Bank Transfer' as const, notes: 'Design sprint milestone 1' },
      { userId, type: 'expense' as const, amount: 18000, description: 'Apartment Rent — Indiranagar', category: 'Bills', date: '2026-10-01', paymentMethod: 'Bank Transfer' as const, notes: 'October apartment rental' },
      { userId, type: 'expense' as const, amount: 5450, description: 'Nature Basket Organic Groceries', category: 'Food', date: '2026-10-02', paymentMethod: 'UPI' as const, notes: 'Weekly pantry & fresh greens' },
      { userId, type: 'expense' as const, amount: 3850, description: 'The Olive Bistro Dinner', category: 'Food', date: '2026-10-01', paymentMethod: 'Credit Card' as const, notes: 'Team celebration dinner' },
      { userId, type: 'expense' as const, amount: 6800, description: 'FabIndia Autumn Linens & Kurta', category: 'Shopping', date: '2026-10-02', paymentMethod: 'Credit Card' as const, notes: 'Seasonal festive attire' },
      { userId, type: 'expense' as const, amount: 2850, description: 'Airtel Broadband & Bescom Power', category: 'Bills', date: '2026-10-02', paymentMethod: 'UPI' as const, notes: 'Electricity and fiber connectivity' },
      { userId, type: 'expense' as const, amount: 2150, description: 'Uber Premier City Commute', category: 'Transportation', date: '2026-10-02', paymentMethod: 'UPI' as const, notes: 'Airport transfers & meetings' },
      { userId, type: 'expense' as const, amount: 2400, description: 'Apollo Pharmacy & Wellness Check', category: 'Health', date: '2026-10-01', paymentMethod: 'UPI' as const, notes: 'Supplements & annual bloodwork' },
      { userId, type: 'expense' as const, amount: 1800, description: 'O’Reilly Design Systems Book', category: 'Education', date: '2026-10-01', paymentMethod: 'Debit Card' as const, notes: 'Professional engineering references' },
      { userId, type: 'expense' as const, amount: 849, description: 'Netflix Premium & Spotify Family', category: 'Entertainment', date: '2026-10-01', paymentMethod: 'Credit Card' as const, notes: 'Monthly recurring entertainment subscriptions' },
      { userId, type: 'expense' as const, amount: 1650, description: 'Shell Petrol & Express Toll', category: 'Transportation', date: '2026-10-02', paymentMethod: 'UPI' as const, notes: 'Weekend commute fuel top-up' },
    ];

    // September 2026
    const sepTransactions = [
      { userId, type: 'income' as const, amount: 85000, description: 'TechCorp Senior Salary', category: 'Salary', date: '2026-09-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'income' as const, amount: 12000, description: 'Quarterly Mutual Fund Dividend', category: 'Investment', date: '2026-09-15', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 18000, description: 'Apartment Rent', category: 'Bills', date: '2026-09-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 8200, description: 'Whole Food Market & Cafes', category: 'Food', date: '2026-09-10', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 7500, description: 'Zara Home & Work Apparel', category: 'Shopping', date: '2026-09-18', paymentMethod: 'Credit Card' as const },
      { userId, type: 'expense' as const, amount: 3100, description: 'Metro Pass & Uber Rides', category: 'Transportation', date: '2026-09-20', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 2900, description: 'Utility Bills & Maintenance', category: 'Bills', date: '2026-09-05', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 1450, description: 'PVR IMAX Movie Tickets', category: 'Entertainment', date: '2026-09-22', paymentMethod: 'Credit Card' as const },
      { userId, type: 'expense' as const, amount: 1200, description: 'Dental Cleaning & Floss', category: 'Health', date: '2026-09-25', paymentMethod: 'Cash' as const },
    ];

    // August 2026
    const augTransactions = [
      { userId, type: 'income' as const, amount: 85000, description: 'TechCorp Senior Salary', category: 'Salary', date: '2026-08-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'income' as const, amount: 18000, description: 'Freelance Advisory Session', category: 'Freelance', date: '2026-08-14', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 18000, description: 'Apartment Rent', category: 'Bills', date: '2026-08-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 7800, description: 'Groceries & Dining Out', category: 'Food', date: '2026-08-12', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 5600, description: 'Electronics & Audio Gear', category: 'Shopping', date: '2026-08-16', paymentMethod: 'Credit Card' as const },
      { userId, type: 'expense' as const, amount: 3400, description: 'Cab rides & Airport Bus', category: 'Transportation', date: '2026-08-22', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 2750, description: 'Electricity & Gas bill', category: 'Bills', date: '2026-08-04', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 1200, description: 'Concert & Streaming', category: 'Entertainment', date: '2026-08-28', paymentMethod: 'Credit Card' as const },
    ];

    // July 2026
    const julTransactions = [
      { userId, type: 'income' as const, amount: 85000, description: 'TechCorp Senior Salary', category: 'Salary', date: '2026-07-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 18000, description: 'Apartment Rent', category: 'Bills', date: '2026-07-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 7400, description: 'Gourmet Market & Weekly Grocery', category: 'Food', date: '2026-07-11', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 4900, description: 'Summer Wardrobe Essentials', category: 'Shopping', date: '2026-07-15', paymentMethod: 'Credit Card' as const },
      { userId, type: 'expense' as const, amount: 2800, description: 'City Commute & Fuel', category: 'Transportation', date: '2026-07-19', paymentMethod: 'UPI' as const },
    ];

    // June 2026
    const junTransactions = [
      { userId, type: 'income' as const, amount: 85000, description: 'TechCorp Senior Salary', category: 'Salary', date: '2026-06-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'income' as const, amount: 15000, description: 'Mid-Year Engineering Bonus', category: 'Salary', date: '2026-06-15', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 18000, description: 'Apartment Rent', category: 'Bills', date: '2026-06-01', paymentMethod: 'Bank Transfer' as const },
      { userId, type: 'expense' as const, amount: 6900, description: 'Monthly Groceries & Coffee', category: 'Food', date: '2026-06-10', paymentMethod: 'UPI' as const },
      { userId, type: 'expense' as const, amount: 5200, description: 'Home Furnishings', category: 'Shopping', date: '2026-06-18', paymentMethod: 'Credit Card' as const },
      { userId, type: 'expense' as const, amount: 2900, description: 'Commute & Travel', category: 'Transportation', date: '2026-06-21', paymentMethod: 'UPI' as const },
    ];

    const allTx = [
      ...octTransactions,
      ...sepTransactions,
      ...augTransactions,
      ...julTransactions,
      ...junTransactions,
    ];

    for (const tx of allTx) {
      db.transactions.insert(tx);
    }
    console.log(`[Seed] Inserted ${allTx.length} realistic transactions for ${demoUser.name}`);
  }

  // Check budgets
  const budgetCount = db.budgets.count((b) => b.userId === demoUser!._id && b.month === 10 && b.year === 2026);
  if (budgetCount === 0) {
    const userId = demoUser._id;
    const defaultBudgets = [
      { userId, category: 'Food', amount: 10000, month: 10, year: 2026 },
      { userId, category: 'Shopping', amount: 8000, month: 10, year: 2026 },
      { userId, category: 'Transportation', amount: 4000, month: 10, year: 2026 },
      { userId, category: 'Bills', amount: 22000, month: 10, year: 2026 },
      { userId, category: 'Entertainment', amount: 3000, month: 10, year: 2026 },
      { userId, category: 'Health', amount: 4000, month: 10, year: 2026 },
      { userId, category: 'Education', amount: 3000, month: 10, year: 2026 },
    ];
    for (const b of defaultBudgets) {
      db.budgets.insert(b);
    }
    console.log('[Seed] October 2026 budgets initialized');
  }
};
