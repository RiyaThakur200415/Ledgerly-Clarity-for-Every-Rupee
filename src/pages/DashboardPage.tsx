import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, ReceiptText, ShieldAlert } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard.tsx';
import { FinancialChart } from '../components/dashboard/FinancialChart.tsx';
import { ExpenseBreakdown } from '../components/dashboard/ExpenseBreakdown.tsx';
import { TransactionTable } from '../components/transactions/TransactionTable.tsx';
import { Transaction, Category, AnalyticsData } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatINR } from '../utils/formatters.ts';

interface DashboardPageProps {
  selectedMonth: number;
  selectedYear: number;
  categories: Category[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
  onViewAllTransactions: () => void;
  onViewBudgets: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  selectedMonth,
  selectedYear,
  categories,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  onViewAllTransactions,
  onViewBudgets,
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [timeframe, setTimeframe] = useState<string>('6m');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, txRes] = await Promise.all([
        api.getAnalytics({ timeframe, month: selectedMonth, year: selectedYear }),
        api.getTransactions({ limit: 6, sortBy: 'newest' }),
      ]);

      if (analyticsRes.success) {
        setAnalytics(analyticsRes);
      }
      if (txRes.success) {
        setRecentTransactions(txRes.transactions);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear, timeframe]);

  const metrics = analytics?.metrics || {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0,
    savingsRate: 0,
    changes: { income: 0, expense: 0, savings: 0, balance: 0 },
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 4 Premium Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          label="Total Balance"
          amount={metrics.totalBalance}
          change={metrics.changes.balance}
          type="balance"
        />
        <MetricCard
          label="Monthly Income"
          amount={metrics.monthlyIncome}
          change={metrics.changes.income}
          type="income"
        />
        <MetricCard
          label="Monthly Expenses"
          amount={metrics.monthlyExpenses}
          change={metrics.changes.expense}
          type="expense"
        />
        <MetricCard
          label="Savings"
          amount={metrics.savings}
          change={metrics.changes.savings}
          type="savings"
        />
      </div>

      {/* Main Charts Row: Financial Overview (7 cols) & Expense Breakdown (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <FinancialChart
            data={analytics?.timeline || []}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-5">
          <ExpenseBreakdown
            categories={analytics?.categoryBreakdown || []}
            totalExpenses={metrics.monthlyExpenses}
          />
        </div>
      </div>

      {/* Active Budget Notification & Snapshot (if warnings exist) */}
      {analytics?.budgetUtilization && analytics.budgetUtilization.some((b) => b.status === 'Warning' || b.status === 'Exceeded') && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#191C19] border border-[#B89B5E]/30 dark:border-[#B89B5E]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B89B5E]/10 text-[#B89B5E] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#171717] dark:text-[#F4F1EA]">
                Budget Watch Attention
              </h4>
              <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
                Certain spending streams are approaching or have exceeded their monthly thresholds.
              </p>
            </div>
          </div>
          <button
            onClick={onViewBudgets}
            className="text-xs font-semibold text-[#173F35] dark:text-[#B89B5E] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-center"
          >
            <span>Review Budgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-heading text-xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
              Recent Activity
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
              Latest ledger entries across your personal accounts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Transaction</span>
            </button>
            <button
              onClick={onViewAllTransactions}
              className="text-xs font-medium text-[#173F35] dark:text-[#B89B5E] hover:underline flex items-center gap-1"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* High density transaction preview */}
        <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl shadow-2xs overflow-hidden">
          <div className="divide-y divide-[#171717]/6 dark:divide-white/6">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-[#6B6B6B]">Loading recent transactions...</div>
            ) : recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-[#6B6B6B]">
                <ReceiptText className="w-8 h-8 mx-auto text-[#6B6B6B]/40 mb-2" />
                <p className="font-serif-heading font-semibold text-sm text-[#171717] dark:text-[#F4F1EA]">No transactions yet</p>
                <p className="text-xs mt-1">Start tracking your spending by adding your first transaction.</p>
                <button
                  onClick={onOpenAddModal}
                  className="mt-3 py-1.5 px-3.5 bg-[#173F35] text-white text-xs font-semibold rounded-md"
                >
                  Add Transaction
                </button>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx._id}
                    className="p-4 flex items-center justify-between hover:bg-[#F7F5F0]/70 dark:hover:bg-[#1E231E]/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate pr-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                            : 'bg-[#9E2A2B]/10 text-[#9E2A2B] dark:text-[#E05757]'
                        }`}
                      >
                        {isIncome ? '+' : '−'}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium text-[#171717] dark:text-[#F4F1EA] truncate">
                          {tx.description}
                        </p>
                        {/* Unboxed metadata row with typographic separators */}
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
                          <span>{tx.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tx.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tx.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`font-mono-num font-semibold text-sm ${
                          isIncome
                            ? 'text-[#2D6A4F] dark:text-[#40916C]'
                            : 'text-[#171717] dark:text-[#F4F1EA]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
