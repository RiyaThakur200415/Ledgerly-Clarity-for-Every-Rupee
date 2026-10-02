import React, { useEffect, useState } from 'react';
import { Mail, Calendar, ShieldCheck, Wallet, ReceiptText, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { formatINR } from '../utils/formatters.ts';

interface ProfilePageProps {
  onGoToSettings: () => void;
  onGoToTransactions: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onGoToSettings,
  onGoToTransactions,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalTx: 0, netBalance: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getTransactions({ limit: 1 });
        if (res.success) {
          setStats({
            totalTx: res.pagination.total,
            netBalance: res.summary.netBalance,
          });
        }
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Profile Banner */}
      <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.profilePhoto || '/src/assets/images/avatar_riya_finance_1790940141252.jpg'}
            alt={user?.name || 'User Profile'}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#B89B5E] shadow-sm"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#171717] dark:text-[#F4F1EA]">
                  {user?.name || 'Riya Thakur'}
                </h2>
                <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
                  Private Wealth Member · Personal Ledger Account
                </p>
              </div>

              <button
                onClick={onGoToSettings}
                className="py-1.5 px-3.5 text-xs font-medium rounded-md bg-[#F7F5F0] dark:bg-[#111311] hover:bg-[#EFECE5] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 transition-colors self-center sm:self-start"
              >
                Edit Profile
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#173F35] dark:text-[#B89B5E]" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#173F35] dark:text-[#B89B5E]" />
                Member since May 2026
              </span>
              <span className="flex items-center gap-1.5 text-[#2D6A4F] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                KYC & Auth Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Ledger Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#A7AAA5]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Recorded Entries</span>
            <ReceiptText className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E]" />
          </div>
          <div className="font-mono-num text-2xl font-bold text-[#171717] dark:text-[#F4F1EA] mt-2">
            {stats.totalTx} transactions
          </div>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5] mt-1">Reconciled in personal ledger</p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#A7AAA5]">
            <span className="text-xs font-medium uppercase tracking-wider">Net Cumulative Position</span>
            <Wallet className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="font-mono-num text-2xl font-bold text-[#2D6A4F] dark:text-[#40916C] mt-2">
            {formatINR(stats.netBalance)}
          </div>
          <p className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5] mt-1">Lifetime total surplus</p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#A7AAA5]">
            <span className="text-xs font-medium uppercase tracking-wider">Account Standing</span>
            <Award className="w-4 h-4 text-[#B89B5E]" />
          </div>
          <div className="font-mono-num text-2xl font-bold text-[#171717] dark:text-[#F4F1EA] mt-2">
            Exemplary
          </div>
          <p className="text-[11px] text-[#2D6A4F] font-medium mt-1">Consistent surplus & savings</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={onGoToTransactions}
          className="p-5 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 hover:border-[#173F35]/30 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
        >
          <div>
            <h4 className="text-sm font-semibold text-[#171717] dark:text-[#F4F1EA]">Review Transaction Archive</h4>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">Access complete history with search and export capabilities</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#173F35] dark:group-hover:text-[#B89B5E] transition-colors" />
        </div>

        <div
          onClick={onGoToSettings}
          className="p-5 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 hover:border-[#173F35]/30 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
        >
          <div>
            <h4 className="text-sm font-semibold text-[#171717] dark:text-[#F4F1EA]">Preferences & Notifications</h4>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">Manage currency units, password credentials, and themes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#173F35] dark:group-hover:text-[#B89B5E] transition-colors" />
        </div>
      </div>
    </div>
  );
};
