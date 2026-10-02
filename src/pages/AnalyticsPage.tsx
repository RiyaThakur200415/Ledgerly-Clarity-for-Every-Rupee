import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Lightbulb, PieChart, BarChart3, CheckCircle2 } from 'lucide-react';
import { AnalyticsData } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatINR } from '../utils/formatters.ts';

interface AnalyticsPageProps {
  selectedMonth: number;
  selectedYear: number;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  selectedMonth,
  selectedYear,
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<string>('6m');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await api.getAnalytics({ timeframe, month: selectedMonth, year: selectedYear });
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe, selectedMonth, selectedYear]);

  const metrics = data?.metrics;
  const currentMo = data?.monthlyComparison.currentMonth;
  const prevMo = data?.monthlyComparison.previousMonth;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Financial Analytics & Intelligence
          </h2>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
            Deep forensic breakdown of cash flow trends, savings velocity, and allocations
          </p>
        </div>

        <div className="flex items-center bg-white dark:bg-[#191C19] p-0.5 rounded-lg border border-[#171717]/8 dark:border-white/8 shadow-2xs">
          {[
            { id: '30d', label: '30D' },
            { id: '3m', label: '3M' },
            { id: '6m', label: '6M' },
            { id: '1y', label: '1Y' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeframe === tf.id
                  ? 'bg-[#173F35] text-white font-semibold shadow-2xs'
                  : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Savings Rate Banner & Key Velocity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Savings Rate Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6B6B] dark:text-[#A7AAA5] uppercase tracking-wider">
              Savings Rate
            </span>
            <span className="p-1.5 rounded-md bg-[#2D6A4F]/10 text-[#2D6A4F]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div className="my-4">
            <div className="font-mono-num text-3xl sm:text-4xl font-bold text-[#171717] dark:text-[#F4F1EA]">
              {metrics ? `${metrics.savingsRate}%` : '—'}
            </div>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-1">
              Percentage of total inflow retained after all expenses
            </p>
          </div>

          {/* Clean progress bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-[#EFECE5] dark:bg-[#111311] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#173F35] dark:bg-[#B89B5E] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(metrics?.savingsRate || 0, 0), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#6B6B6B] dark:text-[#A7AAA5]">
              <span>Target: 30%</span>
              <span className="font-semibold text-[#2D6A4F]">Target Exceeded</span>
            </div>
          </div>
        </div>

        {/* Month-over-Month Comparison Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#171717]/6 dark:border-white/6">
            <span className="text-xs font-semibold text-[#6B6B6B] dark:text-[#A7AAA5] uppercase tracking-wider">
              Monthly Velocity Comparison
            </span>
            <span className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
              {currentMo?.name || 'October'} vs {prevMo?.name || 'September'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 my-4">
            <div className="p-3 rounded-lg bg-[#F7F5F0] dark:bg-[#111311] border border-[#171717]/5 dark:border-white/5">
              <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Inflow Change</span>
              <div className="font-mono-num text-base font-bold text-[#171717] dark:text-[#F4F1EA] mt-1">
                {metrics?.changes.income ?? 0 > 0 ? '+' : ''}{metrics?.changes.income ?? 0}%
              </div>
              <span className="text-[10px] text-[#6B6B6B] block mt-0.5">
                {formatINR(currentMo?.income || 0)} vs {formatINR(prevMo?.income || 0)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F5F0] dark:bg-[#111311] border border-[#171717]/5 dark:border-white/5">
              <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Outflow Change</span>
              <div className={`font-mono-num text-base font-bold mt-1 ${(metrics?.changes.expense || 0) <= 0 ? 'text-[#2D6A4F]' : 'text-[#9E2A2B]'}`}>
                {metrics?.changes.expense ?? 0 > 0 ? '+' : ''}{metrics?.changes.expense ?? 0}%
              </div>
              <span className="text-[10px] text-[#6B6B6B] block mt-0.5">
                {formatINR(currentMo?.expense || 0)} vs {formatINR(prevMo?.expense || 0)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F5F0] dark:bg-[#111311] border border-[#171717]/5 dark:border-white/5">
              <span className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Savings Delta</span>
              <div className="font-mono-num text-base font-bold text-[#2D6A4F] mt-1">
                {metrics?.changes.savings ?? 0 > 0 ? '+' : ''}{metrics?.changes.savings ?? 0}%
              </div>
              <span className="text-[10px] text-[#6B6B6B] block mt-0.5">
                {formatINR(currentMo?.savings || 0)} vs {formatINR(prevMo?.savings || 0)}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">
            Consolidated surplus for current month stands at <strong className="text-[#171717] dark:text-[#F4F1EA] font-mono-num">{formatINR(metrics?.savings || 0)}</strong>.
          </div>
        </div>
      </div>

      {/* Row 2: Dynamic Statistical Insights */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-[#B89B5E]" />
          <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Ledger Intelligence & Findings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data?.insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#F7F5F0] dark:bg-[#111311] border border-[#171717]/6 dark:border-white/6 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E] shrink-0 mt-0.5" />
              <p className="text-xs text-[#171717] dark:text-[#F4F1EA] leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Income vs Expenses Multi-Bar Chart & Top Ranked Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income vs Expense Monthly Comparison Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#171717]/6 dark:border-white/6">
            <div>
              <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
                Income vs Expense Spread
              </h3>
              <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
                Bar comparison across recorded periods
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#173F35] dark:text-[#40916C]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#173F35] dark:bg-[#40916C]" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-[#B89B5E]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B89B5E]" /> Expense
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="mt-6">
            <div className="space-y-4">
              {data?.timeline.map((point) => {
                const maxVal = Math.max(...(data?.timeline.map((p) => Math.max(p.income, p.expense)) || [100000]));
                const incPct = (point.income / maxVal) * 100;
                const expPct = (point.expense / maxVal) * 100;

                return (
                  <div key={point.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#171717] dark:text-[#F4F1EA]">{point.label}</span>
                      <span className="font-mono-num text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">
                        +{formatINR(point.income)} / -{formatINR(point.expense)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 h-4">
                      {/* Income Bar */}
                      <div className="bg-[#EFECE5] dark:bg-[#111311] rounded-xs overflow-hidden flex justify-end">
                        <div
                          className="bg-[#173F35] dark:bg-[#40916C] h-full rounded-xs transition-all duration-300"
                          style={{ width: `${incPct}%` }}
                        />
                      </div>
                      {/* Expense Bar */}
                      <div className="bg-[#EFECE5] dark:bg-[#111311] rounded-xs overflow-hidden">
                        <div
                          className="bg-[#B89B5E] h-full rounded-xs transition-all duration-300"
                          style={{ width: `${expPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Spending Categories Ranked */}
        <div className="lg:col-span-5 bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-[#171717]/6 dark:border-white/6">
              <h3 className="font-serif-heading text-lg font-semibold text-[#171717] dark:text-[#F4F1EA]">
                Top Spending Streams
              </h3>
              <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
                Ranked by cumulative outflow this month
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {data?.topCategories.map((cat, idx) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#171717] dark:text-[#F4F1EA] flex items-center gap-2">
                      <span className="text-[#6B6B6B] text-[11px] font-mono-num">{idx + 1}.</span>
                      {cat.category}
                    </span>
                    <span className="font-mono-num font-semibold text-[#171717] dark:text-[#F4F1EA]">
                      {formatINR(cat.amount)}
                      <span className="text-[11px] text-[#6B6B6B] ml-1.5">({cat.percentage}%)</span>
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-[#EFECE5] dark:bg-[#111311] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#171717]/6 dark:border-white/6 text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
            Reflects primary expenditures recorded in current reporting period.
          </div>
        </div>
      </div>
    </div>
  );
};
