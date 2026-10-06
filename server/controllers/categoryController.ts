import type { Response } from 'express';
import { db } from '../db/database.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    // Categories are either system or specific to user
    const list = db.categories.find((c) => c.userId === 'system' || (userId ? c.userId === userId : false));

    // Sort by name
    list.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({ success: true, categories: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { name, type = 'expense', icon = 'Tag', color = '#2D6A4F' } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const trimmedName = name.trim();
    // Check if duplicate exists
    const existing = db.categories.findOne(
      (c) => (c.userId === 'system' || c.userId === userId) && c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existing) {
      return res.status(400).json({ success: false, message: `Category "${trimmedName}" already exists.` });
    }

    const newCat = db.categories.insert({
      userId,
      name: trimmedName,
      type: ['expense', 'income', 'both'].includes(type) ? type : 'expense',
      icon: typeof icon === 'string' ? icon : 'Tag',
      color: typeof color === 'string' ? color : '#2D6A4F',
      isDefault: false,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: newCat,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { name, icon, color, type } = req.body;

    const existing = db.categories.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // System categories cannot be renamed or modified by normal users, unless cloned
    if (existing.userId === 'system') {
      return res.status(403).json({ success: false, message: 'System default categories cannot be altered.' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this category.' });
    }

    const updates: any = {};
    if (name && typeof name === 'string') updates.name = name.trim();
    if (icon && typeof icon === 'string') updates.icon = icon.trim();
    if (color && typeof color === 'string') updates.color = color.trim();
    if (type && ['expense', 'income', 'both'].includes(type)) updates.type = type;

    const updated = db.categories.update(id, updates);
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existing = db.categories.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (existing.userId === 'system') {
      return res.status(403).json({ success: false, message: 'Standard baseline categories cannot be deleted.' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this category.' });
    }

    // Check if actively used by user's transactions
    const usedCount = db.transactions.count(
      (t) => t.userId === userId && t.category.toLowerCase() === existing.name.toLowerCase()
    );

    if (usedCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${existing.name}" because it is currently assigned to ${usedCount} transaction${usedCount > 1 ? 's' : ''}. Please reassign or update those transactions before removing this category.`,
      });
    }

    db.categories.remove(id);
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
};
