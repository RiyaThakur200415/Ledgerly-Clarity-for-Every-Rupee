import { Response } from 'express';
import { db } from '../db/database.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const month = parseInt(req.query.month as string, 10) || 10;
    const year = parseInt(req.query.year as string, 10) || 2026;

    const budgets = db.budgets.find((b) => b.userId === userId && b.month === month && b.year === year);

    // Calculate spent per category in this month/year
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
    const userTx = db.transactions.find((t) => t.userId === userId && t.type === 'expense' && t.date.startsWith(monthPrefix));

    const spentMap: Record<string, number> = {};
    for (const tx of userTx) {
      spentMap[tx.category.toLowerCase()] = (spentMap[tx.category.toLowerCase()] || 0) + tx.amount;
    }

    const items = budgets.map((b) => {
      const spent = spentMap[b.category.toLowerCase()] || 0;
      const remaining = b.amount - spent;
      const percentage = Math.round((spent / b.amount) * 1000) / 10;
      let status: 'Healthy' | 'Warning' | 'Exceeded' = 'Healthy';
      if (percentage >= 100) {
        status = 'Exceeded';
      } else if (percentage >= 80) {
        status = 'Warning';
      }

      return {
        _id: b._id,
        category: b.category,
        amount: b.amount,
        spent,
        remaining,
        percentage,
        status,
        month: b.month,
        year: b.year,
        createdAt: b.createdAt,
      };
    });

    const totalBudget = items.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = items.reduce((sum, b) => sum + b.spent, 0);

    return res.status(200).json({
      success: true,
      month,
      year,
      budgets: items,
      summary: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        percentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 1000) / 10 : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return res.status(500).json({ success: false, message: 'Unable to load budgets.' });
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { category, amount, month, year } = req.body;

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Budget amount must be greater than 0.' });
    }

    const targetMonth = parseInt(month, 10) || 10;
    const targetYear = parseInt(year, 10) || 2026;

    // Check duplicate
    const existing = db.budgets.findOne(
      (b) =>
        b.userId === userId &&
        b.category.toLowerCase() === category.trim().toLowerCase() &&
        b.month === targetMonth &&
        b.year === targetYear
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A budget for "${category}" already exists for this month. You can edit the existing budget.`,
      });
    }

    const newBudget = db.budgets.insert({
      userId,
      category: category.trim(),
      amount: Math.round(numericAmount * 100) / 100,
      month: targetMonth,
      year: targetYear,
    });

    return res.status(201).json({
      success: true,
      message: 'Budget allocated successfully.',
      budget: newBudget,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create budget.' });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { amount, category } = req.body;

    const existing = db.budgets.findById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Budget not found or unauthorized.' });
    }

    const updates: any = {};
    if (amount !== undefined) {
      const num = Number(amount);
      if (isNaN(num) || num <= 0) {
        return res.status(400).json({ success: false, message: 'Budget amount must be a positive number.' });
      }
      updates.amount = Math.round(num * 100) / 100;
    }

    if (category && typeof category === 'string' && category.trim().length > 0) {
      updates.category = category.trim();
    }

    const updated = db.budgets.update(id, updates);
    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully.',
      budget: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update budget.' });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existing = db.budgets.findById(id);
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Budget not found or unauthorized.' });
    }

    db.budgets.remove(id);
    return res.status(200).json({
      success: true,
      message: 'Budget removed successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete budget.' });
  }
};
