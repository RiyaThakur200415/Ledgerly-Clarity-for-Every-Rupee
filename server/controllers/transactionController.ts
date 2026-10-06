import type { Response } from 'express';
import { db } from '../db/database.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {
      search,
      category,
      type,
      startDate,
      endDate,
      paymentMethod,
      sortBy = 'newest',
      page = '1',
      limit = '10',
    } = req.query;

    let items = db.transactions.find((t) => t.userId === userId);

    // Filter by type
    if (type && type !== 'all') {
      items = items.filter((t) => t.type === type);
    }

    // Filter by category
    if (category && category !== 'all') {
      items = items.filter((t) => t.category.toLowerCase() === String(category).toLowerCase());
    }

    // Filter by payment method
    if (paymentMethod && paymentMethod !== 'all') {
      items = items.filter((t) => t.paymentMethod === paymentMethod);
    }

    // Filter by search query
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Filter by date range
    if (startDate && typeof startDate === 'string') {
      items = items.filter((t) => t.date >= startDate);
    }
    if (endDate && typeof endDate === 'string') {
      items = items.filter((t) => t.date <= endDate);
    }

    // Calculate totals of filtered set
    const totalIncome = items
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = items
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return dateDiff !== 0 ? dateDiff : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return dateDiff !== 0 ? dateDiff : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });

    const totalCount = items.length;

    // Pagination
    let paginatedItems = items;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = limit === 'all' ? totalCount : Math.max(1, parseInt(limit as string, 10) || 10);
    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    if (limit !== 'all') {
      const startIndex = (pageNum - 1) * limitNum;
      paginatedItems = items.slice(startIndex, startIndex + limitNum);
    }

    return res.status(200).json({
      success: true,
      transactions: paginatedItems,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      summary: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ success: false, message: 'Unable to load transactions.' });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const transaction = db.transactions.findById(id);
    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve transaction.' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { type, amount, description, category, date, paymentMethod, notes } = req.body;

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Valid transaction type (income or expense) is required.' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number greater than 0.' });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Description cannot be empty.' });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'A valid transaction date is required.' });
    }

    const validPaymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];
    const chosenPaymentMethod = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'UPI';

    const newTransaction = db.transactions.insert({
      userId,
      type,
      amount: Math.round(numericAmount * 100) / 100,
      description: description.trim(),
      category: category.trim(),
      date,
      paymentMethod: chosenPaymentMethod,
      notes: notes ? String(notes).trim() : undefined,
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully.',
      transaction: newTransaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong while saving your transaction.' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { type, amount, description, category, date, paymentMethod, notes } = req.body;

    const existing = db.transactions.findById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Transaction not found or access denied.' });
    }

    const updates: any = {};
    if (type) {
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid transaction type.' });
      }
      updates.type = type;
    }

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than 0.' });
      }
      updates.amount = Math.round(numericAmount * 100) / 100;
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Description cannot be empty.' });
      }
      updates.description = description.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Category cannot be empty.' });
      }
      updates.category = category.trim();
    }

    if (date !== undefined) {
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({ success: false, message: 'Valid date is required.' });
      }
      updates.date = date;
    }

    if (paymentMethod !== undefined) {
      const validPaymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ success: false, message: 'Invalid payment method.' });
      }
      updates.paymentMethod = paymentMethod;
    }

    if (notes !== undefined) {
      updates.notes = String(notes).trim();
    }

    const updated = db.transactions.update(id, updates);
    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      transaction: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update transaction.' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existing = db.transactions.findById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Transaction not found or access denied.' });
    }

    db.transactions.remove(id);
    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete transaction.' });
  }
};

export const exportTransactionsCsv = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const items = db.transactions.find((t) => t.userId === userId);
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const header = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)', 'Payment Method', 'Notes'];
    const rows = items.map((t) => [
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ledgerly_transactions.csv"');
    return res.send(csvContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
};
