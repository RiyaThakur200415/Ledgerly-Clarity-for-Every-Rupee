import React, { useState, useEffect } from 'react';
import { Plus, Download, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { TransactionTable } from '../components/transactions/TransactionTable.tsx';
import { Transaction, Category } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';
import { formatINR } from '../utils/formatters.ts';

interface TransactionsPageProps {
  categories: Category[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
  refreshTrigger: number;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  categories,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  refreshTrigger,
}) => {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTransactions({
        search,
        category: categoryFilter,
        type: typeFilter,
        sortBy,
        page,
        limit: 10,
      });

      if (res.success) {
        setTransactions(res.transactions);
        setTotalCount(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
        setSummary(res.summary);
      }
    } catch (err: any) {
      showToast(err.message || 'Unable to load transactions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, categoryFilter, typeFilter, sortBy, page, refreshTrigger]);

  const handleExportCsv = async () => {
    try {
      await api.downloadCsv();
      showToast('CSV statement downloaded.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download statement.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Financial Transactions
          </h2>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
            Audit, filter, and reconcile all income and expense items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-md bg-white dark:bg-[#191C19] hover:bg-[#F7F5F0] dark:hover:bg-[#111311] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#173F35] dark:text-[#B89B5E]" />
            <span>Export Statement</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-md transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Filtered Subset Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#6B6B6B] dark:text-[#A7AAA5]">Filtered Inflow</span>
            <ArrowDownLeft className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="font-mono-num text-xl font-bold text-[#2D6A4F] dark:text-[#40916C] mt-2">
            +{formatINR(summary.totalIncome)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#6B6B6B] dark:text-[#A7AAA5]">Filtered Outflow</span>
            <ArrowUpRight className="w-4 h-4 text-[#9E2A2B] dark:text-[#E05757]" />
          </div>
          <div className="font-mono-num text-xl font-bold text-[#171717] dark:text-[#F4F1EA] mt-2">
            -{formatINR(summary.totalExpenses)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#6B6B6B] dark:text-[#A7AAA5]">Net Differential</span>
            <Wallet className="w-4 h-4 text-[#B89B5E]" />
          </div>
          <div className={`font-mono-num text-xl font-bold mt-2 ${summary.netBalance >= 0 ? 'text-[#2D6A4F] dark:text-[#40916C]' : 'text-[#9E2A2B]'}`}>
            {summary.netBalance >= 0 ? '+' : ''}{formatINR(summary.netBalance)}
          </div>
        </div>
      </div>

      {/* Main Table with search & pagination */}
      <TransactionTable
        transactions={transactions}
        categories={categories}
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
        onAddTransaction={onOpenAddModal}
        onExportCsv={handleExportCsv}
        isLoading={isLoading}
        totalCount={totalCount}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
};
