import React, { useState } from 'react';
import { User, Lock, Bell, Palette, Globe, Check, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { api } from '../services/api.ts';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  // Profile Form state
  const [name, setName] = useState<string>(user?.name || 'Riya Thakur');
  const [email] = useState<string>(user?.email || 'riya.kri.thakur2004@gmail.com');
  const [currency, setCurrency] = useState<string>(user?.currency || 'INR');
  const [dateFormat, setDateFormat] = useState<string>(user?.dateFormat || 'DD/MM/YYYY');
  const [budgetAlerts, setBudgetAlerts] = useState<boolean>(user?.notifications?.budgetAlerts ?? true);
  const [monthlySummary, setMonthlySummary] = useState<boolean>(user?.notifications?.monthlySummary ?? true);
  const [largeTransactions, setLargeTransactions] = useState<boolean>(user?.notifications?.largeTransactions ?? true);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.updateProfile({
        name: name.trim(),
        currency,
        dateFormat,
        notifications: {
          budgetAlerts,
          monthlySummary,
          largeTransactions,
        },
      });

      if (res.success && res.user) {
        updateUser(res.user);
        showToast('Settings saved successfully.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update preferences.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.updatePassword({ currentPassword, newPassword });
      showToast('Password updated securely.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
          Settings & Account Governance
        </h2>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
          Configure personal identification, regional currency norms, and security credentials
        </p>
      </div>

      {/* Profile & Identification Card */}
      <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#171717]/6 dark:border-white/6 mb-6">
          <User className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E]" />
          <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Profile Identity
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={user?.profilePhoto || '/src/assets/images/avatar_riya_finance_1790940141252.jpg'}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#B89B5E]/40 shrink-0"
            />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#171717] dark:text-[#F4F1EA]">{name}</h4>
              <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">{email}</p>
              <p className="text-[11px] text-[#2D6A4F] font-medium">Verified Primary Member</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#F7F5F0] dark:bg-[#111311] text-[#6B6B6B] border border-[#171717]/8 dark:border-white/8 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Regional & Localization */}
          <div className="pt-4 border-t border-[#171717]/6 dark:border-white/6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Base Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Date Formatting
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 02/10/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/02/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-02)</option>
              </select>
            </div>
          </div>

          {/* Visual Theme Selection */}
          <div className="pt-4 border-t border-[#171717]/6 dark:border-white/6">
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-2">
              Visual Theme Atmosphere
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  theme === 'light'
                    ? 'border-[#173F35] bg-[#F7F5F0] text-[#171717] ring-1 ring-[#173F35]'
                    : 'border-[#171717]/10 bg-white text-[#6B6B6B]'
                }`}
              >
                <span className="text-xs font-semibold block">Classic Ivory (Light)</span>
                <span className="text-[10px] text-[#6B6B6B]">Warm off-white aesthetic</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  theme === 'dark'
                    ? 'border-[#B89B5E] bg-[#161816] text-[#F4F1EA] ring-1 ring-[#B89B5E]'
                    : 'border-[#171717]/10 bg-white dark:bg-[#1E231E] text-[#6B6B6B]'
                }`}
              >
                <span className="text-xs font-semibold block">Obsidian Dark</span>
                <span className="text-[10px] text-[#A7AAA5]">Deep midnight green</span>
              </button>
            </div>
          </div>

          {/* Notification Controls */}
          <div className="pt-4 border-t border-[#171717]/6 dark:border-white/6 space-y-3">
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA]">
              Notification Preferences
            </label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[#F7F5F0]/60 dark:bg-[#111311]/60 border border-[#171717]/6 dark:border-white/6 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-[#171717] dark:text-[#F4F1EA] block">Monthly Budget Overrun Warnings</span>
                  <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Alert when spending approaches 80% or exceeds allocation</span>
                </div>
                <input
                  type="checkbox"
                  checked={budgetAlerts}
                  onChange={(e) => setBudgetAlerts(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#173F35]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#F7F5F0]/60 dark:bg-[#111311]/60 border border-[#171717]/6 dark:border-white/6 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-[#171717] dark:text-[#F4F1EA] block">Consolidated Monthly Financial Briefing</span>
                  <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Receive a monthly reconciliation digest and trend report</span>
                </div>
                <input
                  type="checkbox"
                  checked={monthlySummary}
                  onChange={(e) => setMonthlySummary(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#173F35]"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="py-2 px-5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-lg shadow-sm transition-colors"
            >
              {isSavingProfile ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Credentials Card */}
      <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#171717]/6 dark:border-white/6 mb-6">
          <Lock className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E]" />
          <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Security Credentials
          </h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">
              Encrypted using bcrypt hashing
            </span>
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="py-2 px-5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-lg shadow-sm transition-colors"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Session Sign Out */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#9E2A2B]/15 dark:border-[#9E2A2B]/20 shadow-2xs flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Terminate Active Session
          </h4>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
            Clear local cryptographic authentication tokens and return to login gate
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#801F20] rounded-lg shadow-sm transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
