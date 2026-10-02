import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, ArrowDownLeft, PiggyBank } from 'lucide-react';
import { formatINR } from '../../utils/formatters.ts';

interface MetricCardProps {
  label: string;
  amount: number;
  change: number;
  comparisonLabel?: string;
  type: 'balance' | 'income' | 'expense' | 'savings';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  amount,
  change,
  comparisonLabel = 'from last month',
  type,
}) => {
  const isPositiveChange = change >= 0;

  // Semantic color for change indicator based on metric type
  // For expenses, higher spending is red/negative, lower spending is green/positive
  const isGood = type === 'expense' ? change <= 0 : change >= 0;

  const getIcon = () => {
    switch (type) {
      case 'balance':
        return <Wallet className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E]" />;
      case 'income':
        return <ArrowDownLeft className="w-4 h-4 text-[#2D6A4F]" />;
      case 'expense':
        return <ArrowUpRight className="w-4 h-4 text-[#9E2A2B] dark:text-[#E05757]" />;
      case 'savings':
        return <PiggyBank className="w-4 h-4 text-[#B89B5E]" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-5 shadow-2xs hover:border-[#171717]/15 dark:hover:border-white/15 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#6B6B6B] dark:text-[#A7AAA5] tracking-wide">
          {label}
        </span>
        <div className="p-2 rounded-lg bg-[#F7F5F0] dark:bg-[#111311] border border-[#171717]/5 dark:border-white/5">
          {getIcon()}
        </div>
      </div>

      <div className="mt-3">
        <div className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] dark:text-[#F4F1EA]">
          {formatINR(amount)}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#171717]/5 dark:border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`flex items-center font-medium font-mono-num text-xs ${
              isGood
                ? 'text-[#2D6A4F] dark:text-[#40916C]'
                : 'text-[#9E2A2B] dark:text-[#E05757]'
            }`}
          >
            {isPositiveChange ? '+' : ''}
            {change}%
          </span>
          <span className="text-[#6B6B6B] dark:text-[#A7AAA5] text-[11px]">
            {comparisonLabel}
          </span>
        </div>

        {isGood ? (
          <TrendingUp className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#40916C]" />
        ) : (
          <ArrowDownRight className="w-3.5 h-3.5 text-[#9E2A2B] dark:text-[#E05757]" />
        )}
      </div>
    </div>
  );
};
