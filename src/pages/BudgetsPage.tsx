import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { Budget, Category } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';
import { formatINR } from '../utils/formatters.ts';
import { BudgetModal } from '../components/budgets/BudgetModal.tsx';
import { DeleteConfirmModal } from '../components/transactions/DeleteConfirmModal.tsx';

interface BudgetsPageProps {
  categories: Category[];
  selectedMonth: number;
  selectedYear: number;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({
  categories,
  selectedMonth,
  selectedYear,
}) => {
  const { showToast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState({ totalBudget: 0, totalSpent: 0, remaining: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBudgets(selectedMonth, selectedYear);
      if (res.success) {
        setBudgets(res.budgets);
        setSummary(res.summary);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve budgets.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleDeleteConfirm = async () => {
    if (!budgetToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteBudget(budgetToDelete._id);
      showToast('Budget removed.', 'success');
      setDeleteModalOpen(false);
      setBudgetToDelete(null);
      fetchBudgets();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove budget.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Monthly Budget Allocations
          </h2>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
            Monitor thresholds and avoid overspending across active categories
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-md transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Budget Allocation</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#171717]/6 dark:border-white/6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B] dark:text-[#A7AAA5]">
              Total Budget Capacity
            </span>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#171717] dark:text-[#F4F1EA] mt-1">
              {formatINR(summary.totalSpent)} <span className="text-sm font-normal text-[#6B6B6B] dark:text-[#A7AAA5]">/ {formatINR(summary.totalBudget)}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Net Remaining Buffer</span>
            <div className={`font-mono-num text-lg font-bold ${summary.remaining >= 0 ? 'text-[#2D6A4F] dark:text-[#40916C]' : 'text-[#9E2A2B]'}`}>
              {formatINR(summary.remaining)}
            </div>
          </div>
        </div>

        {/* Global Progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-mono-num text-[#6B6B6B] dark:text-[#A7AAA5]">
            <span>Utilization</span>
            <span>{summary.percentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#EFECE5] dark:bg-[#111311] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.percentage > 100
                  ? 'bg-[#9E2A2B]'
                  : summary.percentage > 85
                  ? 'bg-[#B89B5E]'
                  : 'bg-[#173F35] dark:bg-[#40916C]'
              }`}
              style={{ width: `${Math.min(summary.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-white dark:bg-[#191C19] border border-[#171717]/8 rounded-xl p-5 animate-pulse" />
          ))
        ) : budgets.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-[#191C19] border border-[#171717]/8 rounded-xl text-[#6B6B6B]">
            <p className="font-serif-heading text-base font-semibold text-[#171717] dark:text-[#F4F1EA]">No budgets set for this month</p>
            <p className="text-xs mt-1">Establish monthly category caps to manage your spending disciplinedly.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 py-1.5 px-4 bg-[#173F35] text-white text-xs font-semibold rounded-md"
            >
              Allocate First Budget
            </button>
          </div>
        ) : (
          budgets.map((b) => {
            const isExceeded = b.status === 'Exceeded';
            const isWarning = b.status === 'Warning';
            const excessAmount = b.spent - b.amount;

            return (
              <div
                key={b._id}
                className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#171717]/15 dark:hover:border-white/15 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-[#171717] dark:text-[#F4F1EA]">
                        {b.category}
                      </h4>
                      {/* Zero-pill status text */}
                      <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                        {isExceeded ? (
                          <span className="text-[#9E2A2B] dark:text-[#E05757] font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Exceeded
                          </span>
                        ) : isWarning ? (
                          <span className="text-[#B89B5E] font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Warning (80%+)
                          </span>
                        ) : (
                          <span className="text-[#2D6A4F] dark:text-[#40916C] font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Healthy
                          </span>
                        )}
                        <span aria-hidden="true" className="text-[#6B6B6B]">·</span>
                        <span className="font-mono-num text-[#6B6B6B] dark:text-[#A7AAA5]">{b.percentage}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingBudget(b);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-[#6B6B6B] hover:text-[#173F35] dark:hover:text-[#B89B5E] rounded transition-colors"
                        title="Edit budget"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setBudgetToDelete(b);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-[#6B6B6B] hover:text-[#9E2A2B] dark:hover:text-[#E05757] rounded transition-colors"
                        title="Delete budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="mt-4 flex items-baseline justify-between font-mono-num">
                    <div>
                      <span className="text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5] block">Spent</span>
                      <span className="text-base font-bold text-[#171717] dark:text-[#F4F1EA]">
                        {formatINR(b.spent)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5] block">Limit</span>
                      <span className="text-xs font-medium text-[#6B6B6B] dark:text-[#A7AAA5]">
                        {formatINR(b.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full bg-[#EFECE5] dark:bg-[#111311] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExceeded
                            ? 'bg-[#9E2A2B]'
                            : isWarning
                            ? 'bg-[#B89B5E]'
                            : 'bg-[#173F35] dark:bg-[#40916C]'
                        }`}
                        style={{ width: `${Math.min(b.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="mt-4 pt-3 border-t border-[#171717]/5 dark:border-white/5 text-[11px]">
                  {isExceeded ? (
                    <span className="text-[#9E2A2B] dark:text-[#E05757] font-medium font-mono-num">
                      Budget exceeded by {formatINR(excessAmount)}
                    </span>
                  ) : (
                    <span className="text-[#6B6B6B] dark:text-[#A7AAA5] font-mono-num">
                      {formatINR(b.remaining)} remaining this month
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBudgets}
        budgetToEdit={editingBudget}
        categories={categories}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Budget Allocation"
        description={`Are you sure you want to remove the monthly spending limit for "${budgetToDelete?.category}"? Transactions under this category will remain intact.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
