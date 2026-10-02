import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Transaction } from '../../types/index.ts';
import { formatINR, formatDate } from '../../utils/formatters.ts';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction?: Transaction | null;
  title?: string;
  description?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  title = 'Delete Transaction',
  description = 'Are you sure you want to delete this transaction? This action will permanently remove it from your financial records.',
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#F7F5F0] dark:bg-[#191C19] border border-[#171717]/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-[#9E2A2B]/10 dark:bg-[#E05757]/10 flex items-center justify-center text-[#9E2A2B] dark:text-[#E05757] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B6B6B] hover:text-[#171717] dark:hover:text-[#F4F1EA] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
            {title}
          </h3>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-1.5 leading-relaxed">
            {description}
          </p>

          {transaction && (
            <div className="mt-4 p-3 rounded-lg bg-white dark:bg-[#1E231E] border border-[#171717]/6 dark:border-white/6 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-[#A7AAA5]">Description:</span>
                <span className="font-medium text-[#171717] dark:text-[#F4F1EA]">{transaction.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-[#A7AAA5]">Amount:</span>
                <span className="font-mono-num font-semibold text-[#171717] dark:text-[#F4F1EA]">
                  {formatINR(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B] dark:text-[#A7AAA5]">Date:</span>
                <span className="text-[#171717] dark:text-[#F4F1EA]">{formatDate(transaction.date)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="py-2 px-4 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] dark:text-[#A7AAA5] dark:hover:text-[#F4F1EA] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="py-2 px-4 text-xs font-semibold text-white bg-[#9E2A2B] hover:bg-[#801F20] dark:bg-[#C0392B] dark:hover:bg-[#A93226] rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};
