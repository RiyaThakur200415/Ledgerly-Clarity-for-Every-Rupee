import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar } from 'lucide-react';
import { Budget, Category } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: Budget | null;
  categories: Category[];
  selectedMonth: number;
  selectedYear: number;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit,
  categories,
  selectedMonth,
  selectedYear,
}) => {
  const { showToast } = useToast();
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category);
      setAmount(String(budgetToEdit.amount));
    } else {
      setCategory(expenseCategories[0]?.name || 'Food');
      setAmount('');
    }
    setError('');
  }, [budgetToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Please enter a valid monthly allocation greater than ₹0.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (budgetToEdit) {
        await api.updateBudget(budgetToEdit._id, {
          amount: Math.round(num * 100) / 100,
          category,
        });
        showToast('Budget updated successfully.', 'success');
      } else {
        await api.createBudget({
          category,
          amount: Math.round(num * 100) / 100,
          month: selectedMonth,
          year: selectedYear,
        });
        showToast('Monthly budget created.', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save budget.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#F7F5F0] dark:bg-[#191C19] border border-[#171717]/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#171717]/8 dark:border-white/8 bg-white dark:bg-[#1E231E]">
          <div>
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
              {budgetToEdit ? 'Modify Budget' : 'Allocate New Budget'}
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
              Set spending limits for disciplined financial tracking
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B6B6B] hover:text-[#171717] dark:hover:text-[#F4F1EA] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#9E2A2B]/10 border border-[#9E2A2B]/20 text-[#9E2A2B] text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Expense Category
            </label>
            <div className="relative">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5] pointer-events-none" />
              <select
                disabled={!!budgetToEdit}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none appearance-none disabled:opacity-60"
              >
                {expenseCategories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6B6B6B] pointer-events-none">
                ▾
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B6B6B] dark:text-[#A7AAA5]">
                ₹
              </span>
              <input
                type="number"
                step="100"
                min="100"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2 text-sm font-mono-num font-semibold rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#171717]/8 dark:border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] dark:text-[#A7AAA5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : budgetToEdit ? 'Update Budget' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
