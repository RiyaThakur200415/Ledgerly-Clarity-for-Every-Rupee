import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.ts';
import { config } from '../config/config.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';

const generateToken = (userId: string, email: string, name: string) => {
  return jwt.sign({ userId, email, name }, config.jwtSecret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.users.findOne((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.users.insert({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      notifications: {
        budgetAlerts: true,
        monthlySummary: true,
        largeTransactions: true,
      },
    });

    const token = generateToken(newUser._id, newUser.email, newUser.name);
    const { password: _, ...userSafe } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to Ledgerly!',
      token,
      user: userSafe,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create account. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.users.findOne((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.email, user.name);
    const { password: _, ...userSafe } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userSafe,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Failed to authenticate. Please try again.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = db.users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    const { password: _, ...userSafe } = user;
    return res.status(200).json({ success: true, user: userSafe });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { name, currency, dateFormat, theme, notifications, profilePhoto } = req.body;
    const updates: any = {};

    if (name && typeof name === 'string') updates.name = name.trim();
    if (currency && typeof currency === 'string') updates.currency = currency;
    if (dateFormat && typeof dateFormat === 'string') updates.dateFormat = dateFormat;
    if (theme && ['light', 'dark', 'system'].includes(theme)) updates.theme = theme;
    if (notifications && typeof notifications === 'object') updates.notifications = notifications;
    if (typeof profilePhoto === 'string') updates.profilePhoto = profilePhoto;

    const updatedUser = db.users.update(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { password: _, ...userSafe } = updatedUser;
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: userSafe,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile settings.' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = db.users.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.users.update(userId, { password: hashedPassword });

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};
