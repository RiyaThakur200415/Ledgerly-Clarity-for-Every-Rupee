import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ToastProvider, useToast } from './context/ToastContext.tsx';
import { Sidebar, NavTab } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';
import { LandingAuthPage } from './pages/LandingAuthPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { TransactionsPage } from './pages/TransactionsPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { BudgetsPage } from './pages/BudgetsPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { TransactionModal } from './components/transactions/TransactionModal.tsx';
import { DeleteConfirmModal } from './components/transactions/DeleteConfirmModal.tsx';
import { Transaction, Category } from './types/index.ts';
import { api } from './services/api.ts';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Month & Year state (Defaults to October 2026 as per local context)
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Categories cache
  const [categories, setCategories] = useState<Category[]>([]);

  // Transaction Modal state
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  // Delete Transaction Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [isDeletingTx, setIsDeletingTx] = useState<boolean>(false);

  // Refresh trigger to sync updates across pages
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  const handleOpenAddModal = () => {
    setTxToEdit(null);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setTxToEdit(tx);
    setIsTxModalOpen(true);
  };

  const handleDeletePrompt = (tx: Transaction) => {
    setTxToDelete(tx);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!txToDelete) return;
    setIsDeletingTx(true);
    try {
      await api.deleteTransaction(txToDelete._id);
      showToast('Transaction removed from ledger.', 'success');
      setIsDeleteModalOpen(false);
      setTxToDelete(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete transaction.', 'error');
    } finally {
      setIsDeletingTx(false);
    }
  };

  const handleTxSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F7F5F0] dark:bg-[#111311] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#173F35] border border-[#B89B5E]/30 flex items-center justify-center text-[#B89B5E] shadow-md animate-pulse mb-3.5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 8h10" />
            <path d="M7 12h6" />
            <path d="M7 16h8" />
          </svg>
        </div>
        <p className="font-serif-heading text-2xl font-bold text-[#171717] dark:text-[#F4F1EA]">
          Ledgerly
        </p>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-1">
          Loading personal financial console...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingAuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#111311] flex flex-row selection:bg-[#173F35]/20 selection:text-[#173F35]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <Header
          onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
          onOpenAddModal={handleOpenAddModal}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />

        {/* Viewport Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              key={`dash-${refreshTrigger}-${selectedMonth}-${selectedYear}`}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              categories={categories}
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeletePrompt}
              onViewAllTransactions={() => setActiveTab('transactions')}
              onViewBudgets={() => setActiveTab('budgets')}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage
              categories={categories}
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeletePrompt}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage
              key={`analytics-${refreshTrigger}-${selectedMonth}-${selectedYear}`}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsPage
              key={`budgets-${refreshTrigger}-${selectedMonth}-${selectedYear}`}
              categories={categories}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesPage
              categories={categories}
              onRefreshCategories={fetchCategories}
            />
          )}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === 'profile' && (
            <ProfilePage
              onGoToSettings={() => setActiveTab('settings')}
              onGoToTransactions={() => setActiveTab('transactions')}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTxToEdit(null);
        }}
        onSuccess={handleTxSuccess}
        transactionToEdit={txToEdit}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTxToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        transaction={txToDelete}
        isDeleting={isDeletingTx}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
