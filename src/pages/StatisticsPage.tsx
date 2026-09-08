import { useMemo, useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';
import { formatCurrency } from '@/utils/format';
import {
  currentMonthKey,
  shiftMonth,
  monthLabel,
  filterByMonth,
  sumIncome,
  sumExpenses,
  groupByCategory,
} from '@/utils/transactions';

export default function StatisticsPage() {
  const { transactions } = useFinancial();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());

  const monthTx = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const totalExpenses = sumExpenses(monthTx);

  const categoryData = useMemo(() => {
    const groups = groupByCategory(monthTx);
    const sorted = Array.from(groups.entries())
      .map(([label, { total, icon }]) => ({ label, value: total, icon }))
      .sort((a, b) => b.value - a.value);
    return sorted;
  }, [monthTx]);

  const lastSixMonths = useMemo(() => {
    const months: Array<{ label: string; income: number; expense: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const key = shiftMonth(selectedMonth, -i);
      const tx = filterByMonth(transactions, key);
      const short = monthLabel(key).split(' ')[0].slice(0, 3);
      months.push({
        label: short.charAt(0).toUpperCase() + short.slice(1),
        income: sumIncome(tx),
        expense: sumExpenses(tx),
      });
    }
    return months;
  }, [transactions, selectedMonth]);

  const hasData = transactions.length > 0;

  return (
    <>
      <Header title="Análises" />

      <div className="flex items-center justify-between mt-base mb-md">
        <button
          onClick={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors"
          aria-label="Mês anterior"
        >
          <span className="material-symbols-outlined text-primary">chevron_left</span>
        </button>
        <span className="font-headline-md text-headline-md text-on-surface">{monthLabel(selectedMonth)}</span>
        <button
          onClick={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors"
          aria-label="Próximo mês"
        >
          <span className="material-symbols-outlined text-primary">chevron_right</span>
        </button>
      </div>

      {!hasData ? (
        <div className="mt-md">
          <EmptyState
            icon="bar_chart"
            title="Sem dados para analisar"
            description="Registre transações para visualizar gráficos e análises."
          />
        </div>
      ) : (
        <div className="space-y-md pb-xl">
          <section className="bg-surface-container-lowest rounded-xl p-md ambient-shadow">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">
              Despesas por categoria
            </h3>
            {categoryData.length === 0 ? (
              <p className="font-label-sm text-label-sm text-on-surface-variant py-4 text-center">
                Nenhuma despesa neste mês.
              </p>
            ) : (
              <div className="flex items-center justify-center">
                <DonutChart
                  data={categoryData.map((c) => ({ label: c.label, value: c.value }))}
                  centerLabel={formatCurrency(totalExpenses)}
                  centerSub="Total"
                />
              </div>
            )}
            {categoryData.length > 0 && (
              <div className="mt-md space-y-2">
                {categoryData.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-body-md text-on-surface-variant">
                      {c.icon ?? 'shopping_cart'}
                    </span>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="font-label-md text-label-md text-on-surface truncate">
                        {c.label}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {Math.round((c.value / totalExpenses) * 100)}% · {formatCurrency(c.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-md ambient-shadow">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">
              Receita × Despesa (6 meses)
            </h3>
            <BarChart data={lastSixMonths} />
          </section>
        </div>
      )}
    </>
  );
}