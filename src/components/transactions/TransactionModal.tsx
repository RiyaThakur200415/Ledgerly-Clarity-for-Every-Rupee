import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText, Tag, CreditCard } from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod, Category } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: Transaction | null;
  categories: Category[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
  categories,
}) => {
  const { showToast } = useToast();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setDescription(transactionToEdit.description);
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
      setPaymentMethod(transactionToEdit.paymentMethod);
      setNotes(transactionToEdit.notes || '');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory(categories[0]?.name || 'Food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setNotes('');
    }
    setErrors({});
  }, [transactionToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      errs.amount = 'Please enter a valid amount greater than ₹0.';
    }
    if (!description.trim()) {
      errs.description = 'Description is required.';
    }
    if (!category.trim()) {
      errs.category = 'Please select a category.';
    }
    if (!date) {
      errs.date = 'Date is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (transactionToEdit) {
        await api.updateTransaction(transactionToEdit._id, {
          type,
          amount: parseFloat(amount),
          description: description.trim(),
          category,
          date,
          paymentMethod,
          notes: notes.trim() || undefined,
        });
        showToast('Transaction updated successfully.', 'success');
      } else {
        await api.createTransaction({
          type,
          amount: parseFloat(amount),
          description: description.trim(),
          category,
          date,
          paymentMethod,
          notes: notes.trim() || undefined,
        });
        showToast('New transaction recorded.', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Something went wrong while saving your transaction.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (c.type === 'both') return true;
    return c.type === type;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#F7F5F0] dark:bg-[#191C19] border border-[#171717]/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#171717]/8 dark:border-white/8 bg-white dark:bg-[#1E231E]">
          <div>
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
              {transactionToEdit ? 'Edit Transaction' : 'Record Transaction'}
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
              Enter transaction details to update your financial ledger
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B6B6B] hover:text-[#171717] dark:hover:text-[#F4F1EA] rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#EFECE5] dark:bg-[#111311] p-1 rounded-lg border border-[#171717]/6 dark:border-white/6">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  // Update category if current category isn't applicable
                  const expenseCats = categories.filter((c) => c.type === 'expense' || c.type === 'both');
                  if (!expenseCats.some((c) => c.name === category)) {
                    setCategory(expenseCats[0]?.name || 'Food');
                  }
                }}
                className={`py-2 text-xs font-medium rounded-md transition-colors ${
                  type === 'expense'
                    ? 'bg-white dark:bg-[#1E231E] text-[#9E2A2B] dark:text-[#E05757] font-semibold shadow-xs'
                    : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA]'
                }`}
              >
                Expense (−)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  const incomeCats = categories.filter((c) => c.type === 'income' || c.type === 'both');
                  if (!incomeCats.some((c) => c.name === category)) {
                    setCategory(incomeCats[0]?.name || 'Salary');
                  }
                }}
                className={`py-2 text-xs font-medium rounded-md transition-colors ${
                  type === 'income'
                    ? 'bg-white dark:bg-[#1E231E] text-[#2D6A4F] dark:text-[#40916C] font-semibold shadow-xs'
                    : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA]'
                }`}
              >
                Income (+)
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B6B6B] dark:text-[#A7AAA5]">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-8 pr-3.5 py-2 text-sm font-mono-num font-semibold rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border ${
                  errors.amount
                    ? 'border-[#9E2A2B]'
                    : 'border-[#171717]/10 dark:border-white/10 focus:border-[#173F35]'
                } focus:outline-none focus:ring-1 focus:ring-[#173F35]`}
              />
            </div>
            {errors.amount && <p className="text-[11px] text-[#9E2A2B] mt-1">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Description
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#6B6B6B] dark:text-[#A7AAA5]" />
              <input
                type="text"
                placeholder="e.g. Blue Tokai Coffee, TechCorp Salary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border ${
                  errors.description
                    ? 'border-[#9E2A2B]'
                    : 'border-[#171717]/10 dark:border-white/10 focus:border-[#173F35]'
                } focus:outline-none focus:ring-1 focus:ring-[#173F35]`}
              />
            </div>
            {errors.description && <p className="text-[11px] text-[#9E2A2B] mt-1">{errors.description}</p>}
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Category
              </label>
              <div className="relative">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5] pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none appearance-none"
                >
                  {filteredCategories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5] pointer-events-none">
                  ▾
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5] pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(['UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'] as PaymentMethod[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-md border text-center transition-colors truncate ${
                    paymentMethod === pm
                      ? 'bg-[#173F35] text-white border-[#173F35] font-semibold'
                      : 'bg-white dark:bg-[#1E231E] text-[#6B6B6B] dark:text-[#A7AAA5] border-[#171717]/8 dark:border-white/8 hover:text-[#171717] dark:hover:text-[#F4F1EA]'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add contextual details, invoice number, or references..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#171717]/8 dark:border-white/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] dark:text-[#A7AAA5] dark:hover:text-[#F4F1EA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] dark:hover:bg-[#1c453a] rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : transactionToEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
