export interface MonthlyBar {
  label: string;
  income: number;
  expense: number;
}

interface BarChartProps {
  data: MonthlyBar[];
  height?: number;
}

export function BarChart({ data, height = 180 }: BarChartProps) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  const barWidth = 16;
  const gap = 10;
  const groupWidth = barWidth * 2 + gap;
  const chartWidth = Math.max(data.length * (groupWidth + 16), 100);

  return (
    <div className="w-full overflow-x-auto py-2">
      <svg width={chartWidth} height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {data.map((d, i) => {
          const incomeH = (d.income / max) * (height - 30);
          const expenseH = (d.expense / max) * (height - 30);
          const x = i * (groupWidth + 16);
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={height - 24 - incomeH}
                width={barWidth}
                height={Math.max(incomeH, d.income > 0 ? 3 : 0)}
                rx={4}
                fill="#2e7d32"
              />
              <rect
                x={x + barWidth + gap}
                y={height - 24 - expenseH}
                width={barWidth}
                height={Math.max(expenseH, d.expense > 0 ? 3 : 0)}
                rx={4}
                fill="#ba1a1a"
              />
              <text
                x={x + barWidth + 5}
                y={height - 8}
                textAnchor="middle"
                className="fill-on-surface-variant"
                fontSize={11}
                fontWeight={500}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex gap-4 mt-1 justify-center text-label-sm text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#2e7d32]" />
          Receita
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#ba1a1a]" />
          Despesa
        </span>
      </div>
    </div>
  );
}