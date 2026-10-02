import React from 'react';
import { Edit2, Trash2, Search, ArrowUpDown, Filter, Download, Plus } from 'lucide-react';
import { Transaction, Category } from '../../types/index.ts';
import { formatINR, formatDate } from '../../utils/formatters.ts';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  search: string;
  setSearch: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onAddTransaction: () => void;
  onExportCsv?: () => void;
  isLoading?: boolean;
  totalCount: number;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  categories,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  onEdit,
  onDelete,
  onAddTransaction,
  onExportCsv,
  isLoading,
  totalCount,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl shadow-2xs overflow-hidden">
      {/* Search, Filter & Action Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#171717]/6 dark:border-white/6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5]" />
          <input
            type="text"
            placeholder="Search by description or notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3.5 py-1.5 text-xs rounded-md bg-[#F7F5F0] dark:bg-[#111311] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none placeholder:text-[#6B6B6B]/70"
          />
        </div>

        {/* Filter Controls (Segmented Tabs & Selectors) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Type Filter Tabs */}
          <div className="flex items-center bg-[#F7F5F0] dark:bg-[#111311] p-0.5 rounded-md border border-[#171717]/6 dark:border-white/6">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors capitalize ${
                  typeFilter === t
                    ? 'bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] font-semibold shadow-2xs'
                    : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA]'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="pl-3 pr-7 py-1.5 text-xs rounded-md bg-[#F7F5F0] dark:bg-[#111311] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6B6B6B] pointer-events-none">
              ▾
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs rounded-md bg-[#F7F5F0] dark:bg-[#111311] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6B6B6B] pointer-events-none">
              ▾
            </span>
          </div>

          {/* CSV Export Button */}
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-[#191C19] hover:bg-[#F7F5F0] dark:hover:bg-[#111311] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 transition-colors shadow-2xs"
              title="Export Transactions to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#173F35] dark:text-[#B89B5E]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#171717]/6 dark:border-white/6 bg-[#F7F5F0]/60 dark:bg-[#111311]/60 text-[11px] font-semibold text-[#6B6B6B] dark:text-[#A7AAA5] uppercase tracking-wider">
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Description</th>
              <th className="py-3 px-5">Category</th>
              <th className="py-3 px-5">Method</th>
              <th className="py-3 px-5 text-right">Amount</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171717]/4 dark:divide-white/4 text-xs">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-5"><div className="h-4 bg-[#171717]/5 dark:bg-white/5 rounded w-16" /></td>
                  <td className="py-3 px-5"><div className="h-4 bg-[#171717]/5 dark:bg-white/5 rounded w-40" /></td>
                  <td className="py-3 px-5"><div className="h-4 bg-[#171717]/5 dark:bg-white/5 rounded w-20" /></td>
                  <td className="py-3 px-5"><div className="h-4 bg-[#171717]/5 dark:bg-white/5 rounded w-16" /></td>
                  <td className="py-3 px-5 text-right"><div className="h-4 bg-[#171717]/5 dark:bg-white/5 rounded w-20 ml-auto" /></td>
                  <td className="py-3 px-5 text-right"><div className="h-4 bg-[#171717]/5 dark:bg-white/5 rounded w-12 ml-auto" /></td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B6B6B] dark:text-[#A7AAA5]">
                  <p className="font-serif-heading text-base font-semibold text-[#171717] dark:text-[#F4F1EA]">
                    No transactions found
                  </p>
                  <p className="text-xs mt-1">
                    Try adjusting your search criteria or add your first transaction.
                  </p>
                  <button
                    onClick={onAddTransaction}
                    className="mt-3 inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold text-white bg-[#173F35] rounded-md hover:bg-[#112d26] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Record Transaction
                  </button>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-[#F7F5F0]/80 dark:hover:bg-[#1E231E]/80 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-5 font-mono-num text-[#6B6B6B] dark:text-[#A7AAA5] whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Description & Notes (Zero-pill metadata) */}
                    <td className="py-3 px-5 max-w-xs">
                      <div className="font-medium text-[#171717] dark:text-[#F4F1EA] truncate">
                        {tx.description}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5] truncate mt-0.5">
                          {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Category: clean unboxed metadata with subtle dot */}
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className="text-[#171717] dark:text-[#F4F1EA] font-medium">
                        {tx.category}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="py-3 px-5 whitespace-nowrap text-[#6B6B6B] dark:text-[#A7AAA5]">
                      {tx.paymentMethod}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <span
                        className={`font-mono-num font-semibold text-sm ${
                          isIncome
                            ? 'text-[#2D6A4F] dark:text-[#40916C]'
                            : 'text-[#171717] dark:text-[#F4F1EA]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 text-[#6B6B6B] hover:text-[#173F35] dark:hover:text-[#B89B5E] rounded transition-colors"
                          title="Edit transaction"
                          aria-label={`Edit ${tx.description}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(tx)}
                          className="p-1.5 text-[#6B6B6B] hover:text-[#9E2A2B] dark:hover:text-[#E05757] rounded transition-colors"
                          title="Delete transaction"
                          aria-label={`Delete ${tx.description}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-[#171717]/6 dark:divide-white/6">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-[#6B6B6B]">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-[#6B6B6B] dark:text-[#A7AAA5]">
            <p className="font-serif-heading font-semibold text-sm text-[#171717] dark:text-[#F4F1EA]">
              No transactions found
            </p>
            <button
              onClick={onAddTransaction}
              className="mt-3 inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-[#173F35] rounded-md"
            >
              <Plus className="w-3 h-3" /> Record Transaction
            </button>
          </div>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div key={tx._id} className="p-4 space-y-2 hover:bg-[#F7F5F0]/60 dark:hover:bg-[#1E231E]/60 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-xs text-[#171717] dark:text-[#F4F1EA] leading-snug">
                      {tx.description}
                    </h4>
                    {/* Unboxed metadata row */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5] mt-1">
                      <span>{formatDate(tx.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.paymentMethod}</span>
                    </div>
                  </div>

                  <span
                    className={`font-mono-num font-semibold text-sm shrink-0 ${
                      isIncome ? 'text-[#2D6A4F] dark:text-[#40916C]' : 'text-[#171717] dark:text-[#F4F1EA]'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                  </span>
                </div>

                {tx.notes && (
                  <p className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5] italic">
                    {tx.notes}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#171717]/4 dark:border-white/4">
                  <button
                    onClick={() => onEdit(tx)}
                    className="flex items-center gap-1 text-[11px] text-[#6B6B6B] hover:text-[#173F35] py-1 px-2 rounded"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(tx)}
                    className="flex items-center gap-1 text-[11px] text-[#9E2A2B] py-1 px-2 rounded"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#171717]/6 dark:border-white/6 flex items-center justify-between text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
          <span>
            Showing page <strong className="text-[#171717] dark:text-[#F4F1EA]">{page}</strong> of{' '}
            <strong className="text-[#171717] dark:text-[#F4F1EA]">{totalPages}</strong> ({totalCount} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="py-1 px-2.5 rounded border border-[#171717]/10 dark:border-white/10 hover:bg-[#F7F5F0] dark:hover:bg-[#111311] disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="py-1 px-2.5 rounded border border-[#171717]/10 dark:border-white/10 hover:bg-[#F7F5F0] dark:hover:bg-[#111311] disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
