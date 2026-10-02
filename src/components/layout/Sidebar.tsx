import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
  PieChart,
  FolderKanban,
  Settings,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  X,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

export type NavTab = 'dashboard' | 'transactions' | 'analytics' | 'budgets' | 'categories' | 'settings' | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  onOpenAddModal,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as NavTab, label: 'Transactions', icon: ReceiptText },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: TrendingUp },
    { id: 'budgets' as NavTab, label: 'Budgets', icon: PieChart },
    { id: 'categories' as NavTab, label: 'Categories', icon: FolderKanban },
  ];

  const secondaryNavItems = [
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
    { id: 'profile' as NavTab, label: 'Profile', icon: UserIcon },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#EFECE5] dark:bg-[#161816] border-r border-[#171717]/8 dark:border-white/8 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#171717]/6 dark:border-white/6">
        <div className="flex items-center gap-3.5">
          {/* Logo Mark: Minimal geometric financial glyph */}
          <div className="w-11 h-11 rounded-xl bg-[#173F35] dark:bg-[#245749] border border-[#B89B5E]/30 flex items-center justify-center text-[#B89B5E] shadow-sm shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 8h10" />
              <path d="M7 12h6" />
              <path d="M7 16h8" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif-heading text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F4F1EA] leading-none">
              Ledgerly
            </h1>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] tracking-wide mt-1 font-medium">
              Clarity for every rupee.
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-[#6B6B6B] hover:text-[#171717] dark:hover:text-[#F4F1EA]"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Add CTA */}
      <div className="px-5 pt-5 pb-2">
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] dark:hover:bg-[#1b4338] text-[#F7F5F0] text-xs font-semibold tracking-wide transition-colors shadow-sm"
        >
          <CreditCard className="w-3.5 h-3.5 text-[#B89B5E]" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-[#6B6B6B] dark:text-[#A7AAA5] font-semibold">
          Overview
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-white dark:bg-[#1E231E] text-[#173F35] dark:text-[#CBB075] font-semibold shadow-xs border border-[#171717]/6 dark:border-white/6'
                  : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA] hover:bg-[#E7E3DC] dark:hover:bg-[#1B1E1B]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#173F35] dark:text-[#CBB075]' : 'text-current'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-5 px-3 pb-2 text-[10px] uppercase tracking-wider text-[#6B6B6B] dark:text-[#A7AAA5] font-semibold">
          Preferences
        </div>
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-white dark:bg-[#1E231E] text-[#173F35] dark:text-[#CBB075] font-semibold shadow-xs border border-[#171717]/6 dark:border-white/6'
                  : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA] hover:bg-[#E7E3DC] dark:hover:bg-[#1B1E1B]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#173F35] dark:text-[#CBB075]' : 'text-current'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme & Footer Profile Card */}
      <div className="p-3 border-t border-[#171717]/8 dark:border-white/8 space-y-2">
        <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
          <span className="text-[11px] font-medium">Appearance</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-[#E7E3DC] dark:hover:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme mode"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* User Mini-Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-[#1E231E]/70 border border-[#171717]/6 dark:border-white/6">
          <div
            className="flex items-center gap-2.5 cursor-pointer truncate"
            onClick={() => handleNavClick('profile')}
          >
            <img
              src={user?.profilePhoto || '/src/assets/images/avatar_riya_finance_1790940141252.jpg'}
              alt={user?.name || 'User Profile'}
              className="w-8 h-8 rounded-full object-cover border border-[#B89B5E]/30 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] truncate leading-tight">
                {user?.name || 'Riya Thakur'}
              </p>
              <p className="text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5] truncate">
                Personal Account
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-[#6B6B6B] hover:text-[#9E2A2B] dark:hover:text-[#E05757] rounded-md transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 z-50 lg:hidden transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Mobile Bottom Navigation Bar for rapid thumb switching */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#EFECE5]/95 dark:bg-[#161816]/95 backdrop-blur-md border-t border-[#171717]/8 dark:border-white/8 z-30 flex items-center justify-around py-2 px-1">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#173F35] dark:text-[#CBB075] font-semibold' : 'text-[#6B6B6B] dark:text-[#A7AAA5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenAddModal}
          className="w-9 h-9 rounded-full bg-[#173F35] dark:bg-[#245749] text-[#F7F5F0] flex items-center justify-center shadow-md active:scale-95 transition-transform"
          aria-label="Add transaction"
        >
          <CreditCard className="w-4 h-4 text-[#B89B5E]" />
        </button>
      </div>
    </>
  );
};
