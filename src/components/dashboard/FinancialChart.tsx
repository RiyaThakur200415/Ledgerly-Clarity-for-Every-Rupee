import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters.ts';

interface TimelinePoint {
  label: string;
  income: number;
  expense: number;
  savings: number;
}

interface FinancialChartProps {
  data: TimelinePoint[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  isLoading?: boolean;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  timeframe,
  onTimeframeChange,
  isLoading,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const timeframes = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
  ];

  // Chart dimensions in SVG viewBox coordinate space
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Find max value across income and expense
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    10000
  );
  // Round up to nice number for grid
  const niceMax = Math.ceil(maxVal / 10000) * 10000;

  // Grid steps (4 horizontal guide lines)
  const gridSteps = [0, niceMax * 0.33, niceMax * 0.66, niceMax];

  // Helper coordinate mapper
  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + chartW / 2;
    return padding.left + (index / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const ratio = val / niceMax;
    return padding.top + chartH - ratio * chartH;
  };

  // Build SVG path strings with smooth curves
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const incomePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.income) }));
  const expensePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.expense) }));

  const incomePath = makeSmoothPath(incomePoints);
  const expensePath = makeSmoothPath(expensePoints);

  const incomeArea =
    incomePoints.length > 0
      ? `${incomePath} L ${incomePoints[incomePoints.length - 1].x} ${getY(0)} L ${incomePoints[0].x} ${getY(0)} Z`
      : '';
  const expenseArea =
    expensePoints.length > 0
      ? `${expensePath} L ${expensePoints[expensePoints.length - 1].x} ${getY(0)} L ${expensePoints[0].x} ${getY(0)} Z`
      : '';

  const activePoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;

  return (
    <div className="bg-white dark:bg-[#191C19] border border-[#171717]/8 dark:border-white/8 rounded-xl p-5 lg:p-6 shadow-2xs">
      {/* Chart Header & Segmented Timeframe Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/6 dark:border-white/6">
        <div>
          <h3 className="font-serif-heading text-lg lg:text-xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
            Income vs Expenses
          </h3>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5] mt-0.5">
            Cash flow trajectory over selected period
          </p>
        </div>

        {/* Legend & Timeframe Switcher */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 text-xs font-medium text-[#6B6B6B] dark:text-[#A7AAA5]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#173F35] dark:bg-[#40916C]" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B89B5E]" />
              <span>Expenses</span>
            </div>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center bg-[#EFECE5] dark:bg-[#111311] p-0.5 rounded-md border border-[#171717]/6 dark:border-white/6">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => onTimeframeChange(tf.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                  timeframe === tf.id
                    ? 'bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] shadow-2xs font-semibold'
                    : 'text-[#6B6B6B] dark:text-[#A7AAA5] hover:text-[#171717] dark:hover:text-[#F4F1EA]'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative mt-4">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-[#191C19]/50 backdrop-blur-2xs flex items-center justify-center z-10">
            <span className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">Loading trajectory...</span>
          </div>
        )}

        {/* Floating Tooltip if hovering */}
        {activePoint && hoverIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none z-20 bg-white dark:bg-[#111311] border border-[#171717]/10 dark:border-white/10 rounded-lg p-2.5 shadow-md text-xs transition-all duration-75"
            style={{
              left: `${Math.min(Math.max(10, (getX(hoverIndex) / width) * 100), 75)}%`,
            }}
          >
            <div className="font-semibold text-[#171717] dark:text-[#F4F1EA] border-b border-[#171717]/5 dark:border-white/5 pb-1 mb-1.5">
              {activePoint.label}
            </div>
            <div className="space-y-1 font-mono-num text-[11px]">
              <div className="flex justify-between gap-4 text-[#173F35] dark:text-[#40916C]">
                <span>Income:</span>
                <span className="font-semibold">{formatINR(activePoint.income)}</span>
              </div>
              <div className="flex justify-between gap-4 text-[#B89B5E]">
                <span>Expenses:</span>
                <span className="font-semibold">{formatINR(activePoint.expense)}</span>
              </div>
              <div className="flex justify-between gap-4 text-[#171717] dark:text-[#F4F1EA] border-t border-[#171717]/5 dark:border-white/5 pt-1">
                <span>Net Savings:</span>
                <span className="font-semibold">{formatINR(activePoint.savings)}</span>
              </div>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64 sm:h-72 overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#173F35" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#173F35" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B89B5E" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#B89B5E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {gridSteps.map((stepVal, idx) => {
            const y = getY(stepVal);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-[#171717]/6 dark:text-white/6"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono-num fill-[#6B6B6B] dark:fill-[#A7AAA5]"
                >
                  {formatINR(stepVal).replace('₹', '₹')}
                </text>
              </g>
            );
          })}

          {/* Shaded Areas */}
          <path d={incomeArea} fill="url(#incomeGradient)" />
          <path d={expenseArea} fill="url(#expenseGradient)" />

          {/* Income Line */}
          <path
            d={incomePath}
            fill="none"
            stroke="#173F35"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Expense Line */}
          <path
            d={expensePath}
            fill="none"
            stroke="#B89B5E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Interactive Hover Columns & Dots */}
          {data.map((_, i) => {
            const x = getX(i);
            const isHovered = hoverIndex === i;
            return (
              <g key={i}>
                {/* Invisible hover slice hit target */}
                <rect
                  x={x - chartW / (data.length * 2)}
                  y={padding.top}
                  width={chartW / data.length}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />

                {/* Scrubber vertical line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + chartH}
                    stroke="currentColor"
                    className="text-[#171717]/20 dark:text-white/20"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Data point markers */}
                <circle
                  cx={x}
                  cy={getY(data[i].income)}
                  r={isHovered ? 5 : 3.5}
                  fill="#173F35"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                <circle
                  cx={x}
                  cy={getY(data[i].expense)}
                  r={isHovered ? 5 : 3.5}
                  fill="#B89B5E"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* X-axis label */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[10px] font-sans fill-[#6B6B6B] dark:fill-[#A7AAA5] ${
                    isHovered ? 'font-semibold fill-[#171717] dark:fill-[#F4F1EA]' : ''
                  }`}
                >
                  {data[i].label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
