import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Shield } from 'lucide-react';
import { Category } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';
import { CategoryModal } from '../components/categories/CategoryModal.tsx';
import { DeleteConfirmModal } from '../components/transactions/DeleteConfirmModal.tsx';

interface CategoriesPageProps {
  categories: Category[];
  onRefreshCategories: () => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  onRefreshCategories,
}) => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteCategory(categoryToDelete._id);
      showToast('Category deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      onRefreshCategories();
    } catch (err: any) {
      showToast(err.message || 'Cannot delete category.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Category Architecture
          </h2>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
            Organize personal cash flow by customizing expense and income designations
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-md transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Expense Categories */}
      <div className="space-y-3">
        <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
          Expenditure Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {expenseCategories.map((c) => (
            <div
              key={c._id}
              className="p-4 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs flex items-center justify-between hover:border-[#171717]/15 dark:hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3 truncate">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <div className="truncate">
                  <span className="text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] block truncate">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5]">
                    {c.isDefault ? 'Standard Default' : 'Custom'}
                  </span>
                </div>
              </div>

              {!c.isDefault && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setModalOpen(true);
                    }}
                    className="p-1 text-[#6B6B6B] hover:text-[#173F35] rounded"
                    title="Edit category"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(c);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1 text-[#6B6B6B] hover:text-[#9E2A2B] rounded"
                    title="Delete category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div className="space-y-3 pt-4 border-t border-[#171717]/6 dark:border-white/6">
        <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
          Inflow & Revenue Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {incomeCategories.map((c) => (
            <div
              key={c._id}
              className="p-4 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3 truncate">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <div className="truncate">
                  <span className="text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] block truncate">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5]">
                    {c.isDefault ? 'Standard Default' : 'Custom'}
                  </span>
                </div>
              </div>

              {!c.isDefault && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setModalOpen(true);
                    }}
                    className="p-1 text-[#6B6B6B] hover:text-[#173F35] rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(c);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1 text-[#6B6B6B] hover:text-[#9E2A2B] rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note on Protection */}
      <div className="p-4 rounded-xl bg-[#EFECE5] dark:bg-[#161816] border border-[#171717]/6 dark:border-white/6 flex items-start gap-3 text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
        <Shield className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E] shrink-0 mt-0.5" />
        <p>
          Standard default categories ensure unbroken ledger analytics. If you attempt to delete a custom category that currently possesses active transactions, Ledgerly will safeguard your ledger by requiring those transactions to be reassigned first.
        </p>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefreshCategories}
        categoryToEdit={editingCategory}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Custom Category"
        description={`Are you sure you want to permanently delete category "${categoryToDelete?.name}"?`}
        isDeleting={isDeleting}
      />
    </div>
  );
};
