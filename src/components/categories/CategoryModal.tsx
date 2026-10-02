import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { Category } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: Category | null;
}

const PRESET_COLORS = [
  '#173F35', // Forest green
  '#2D6A4F', // Elegant green
  '#B89B5E', // Champagne gold
  '#3D5A80', // Steel blue
  '#C05621', // Warm rust
  '#7B2CBF', // Deep royal violet
  '#2A9D8F', // Teal
  '#4A5568', // Slate
  '#9E2A2B', // Burgundy
  '#D97706', // Amber
];

const PRESET_ICONS = [
  'Utensils',
  'ShoppingBag',
  'Car',
  'Receipt',
  'Film',
  'HeartPulse',
  'GraduationCap',
  'Briefcase',
  'Laptop',
  'TrendingUp',
  'Home',
  'Gift',
  'Coffee',
  'Tag',
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<'expense' | 'income' | 'both'>('expense');
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);
  const [icon, setIcon] = useState<string>(PRESET_ICONS[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setColor(categoryToEdit.color);
      setIcon(categoryToEdit.icon);
    } else {
      setName('');
      setType('expense');
      setColor(PRESET_COLORS[0]);
      setIcon(PRESET_ICONS[0]);
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (categoryToEdit) {
        await api.updateCategory(categoryToEdit._id, {
          name: name.trim(),
          type,
          color,
          icon,
        });
        showToast('Category updated.', 'success');
      } else {
        await api.createCategory({
          name: name.trim(),
          type,
          color,
          icon,
        });
        showToast('Category added to your catalog.', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
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
              {categoryToEdit ? 'Edit Category' : 'Create Custom Category'}
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
              Customize categories for personalized expense labeling
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
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Pet Care, Subscriptions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Type Classification
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#EFECE5] dark:bg-[#111311] p-1 rounded-lg border border-[#171717]/6 dark:border-white/6">
              {(['expense', 'income', 'both'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-1.5 text-[11px] font-medium rounded-md transition-colors capitalize ${
                    type === t
                      ? 'bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] font-semibold shadow-2xs'
                      : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
              Palette Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-115 ring-2 ring-offset-2 ring-[#173F35]' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
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
              {isSubmitting ? 'Saving...' : categoryToEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
