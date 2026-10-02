import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters.ts';

interface CategoryItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseBreakdownProps {
  categories: CategoryItem[];
  totalExpenses: number;
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({
  categories,
  totalExpenses,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const activeCategory = hoveredCategory
    ? categories.find((c) => c.category === hoveredCategory)
    : null;

  return (
    <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-5 lg:p-6 shadow-2xs">
      <div className="pb-4 border-b border-[#171717]/6 dark:border-white/6">
        <h3 className="font-serif-heading text-lg lg:text-xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
          Expense Breakdown
        </h3>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
          Spending distribution by functional category
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut Chart with Center Metric */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-[#171717]/5 dark:text-white/5"
              strokeWidth={strokeWidth}
            />

            {/* Category segments */}
            {categories.map((cat) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += cat.percentage;

              const isHovered = hoveredCategory === cat.category;

              return (
                <circle
                  key={cat.category}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] dark:text-[#A7AAA5] font-medium">
              {activeCategory ? activeCategory.category : 'Total Outflow'}
            </span>
            <span className="font-mono-num font-bold text-sm sm:text-base text-[#171717] dark:text-[#F4F1EA] mt-0.5">
              {activeCategory ? formatINR(activeCategory.amount) : formatINR(totalExpenses)}
            </span>
            {activeCategory && (
              <span className="text-[11px] font-mono-num text-[#B89B5E] font-medium">
                {activeCategory.percentage}%
              </span>
            )}
          </div>
        </div>

        {/* Beside List: Category | Amount | Percentage */}
        <div className="md:col-span-7 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] text-center py-6">
              No expenses recorded for this month.
            </p>
          ) : (
            categories.map((cat) => {
              const isHovered = hoveredCategory === cat.category;
              return (
                <div
                  key={cat.category}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-xs ${
                    isHovered
                      ? 'bg-[#F7F5F0] dark:bg-[#111311] border border-[#171717]/8 dark:border-white/8'
                      : 'hover:bg-[#F7F5F0]/60 dark:hover:bg-[#111311]/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-[#171717] dark:text-[#F4F1EA] truncate">
                      {cat.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono-num">
                    <span className="text-[#171717] dark:text-[#F4F1EA] font-semibold">
                      {formatINR(cat.amount)}
                    </span>
                    <span className="text-[#6B6B6B] dark:text-[#A7AAA5] text-[11px] w-10 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
