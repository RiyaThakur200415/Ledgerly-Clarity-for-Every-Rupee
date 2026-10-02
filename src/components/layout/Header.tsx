import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface HeaderProps {
  onToggleMobileNav: () => void;
  onOpenAddModal: () => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileNav,
  onOpenAddModal,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Riya';

  const months = [
    { value: 10, label: 'October 2026', year: 2026 },
    { value: 9, label: 'September 2026', year: 2026 },
    { value: 8, label: 'August 2026', year: 2026 },
    { value: 7, label: 'July 2026', year: 2026 },
    { value: 6, label: 'June 2026', year: 2026 },
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#F7F5F0]/90 dark:bg-[#111311]/90 backdrop-blur-md border-b border-[#171717]/8 dark:border-white/8 px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Greetings */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 -ml-2 text-[#171717] dark:text-[#F4F1EA] hover:bg-[#EFECE5] dark:hover:bg-[#191C19] rounded-md transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-serif-heading text-xl lg:text-2xl font-semibold text-[#171717] dark:text-[#F4F1EA] tracking-tight leading-none">
              {getGreeting()}, {firstName}.
            </h2>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-1 hidden sm:block">
              Here's your financial overview for this month.
            </p>
          </div>
        </div>

        {/* Right: Month Selector & Primary Add Action */}
        <div className="flex items-center gap-3">
          {/* Month Selector dropdown */}
          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 absolute left-3 text-[#6B6B6B] dark:text-[#A7AAA5] pointer-events-none" />
            <select
              value={`${selectedMonth}-${selectedYear}`}
              onChange={(e) => {
                const [m, y] = e.target.value.split('-').map(Number);
                setSelectedMonth(m);
                setSelectedYear(y);
              }}
              className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-[#191C19] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 hover:border-[#171717]/20 transition-colors cursor-pointer appearance-none shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            >
              {months.map((m) => (
                <option key={`${m.value}-${m.year}`} value={`${m.value}-${m.year}`}>
                  {m.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 pointer-events-none text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5]">
              ▾
            </span>
          </div>

          {/* Add Transaction CTA */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] dark:hover:bg-[#1c453a] rounded-md transition-colors shadow-xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
};
