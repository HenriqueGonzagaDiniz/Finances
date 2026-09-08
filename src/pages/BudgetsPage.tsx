import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import type { Budget } from '@/types';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/constants';
import {
  currentMonthKey,
  filterByMonth,
  groupByCategory,
} from '@/utils/transactions';

const SPENDING_LIMIT_WARNING = 0.8;

export default function BudgetsPage() {
  const { transactions, budgets, setBudgets } = useFinancial();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [dirty, setDirty] = useState(false);

  const monthTx = filterByMonth(transactions, currentMonthKey());
  const spending = groupByCategory(monthTx);

  const budgetMap = new Map(budgets.map((b) => [b.category, b]));

  const handleSetBudget = (category: string, icon: string | undefined) => {
    const parts = draftValue.replace(',', '.');
    const value = parseFloat(parts);
    if (isNaN(value) || value < 0) return;
    const existing = budgetMap.get(category);
    if (value === 0) {
      setBudgets(budgets.filter((b) => b.category !== category));
    } else {
      const next: Budget = { category, limit: value, icon: icon ?? existing?.icon };
      setBudgets([...budgets.filter((b) => b.category !== category), next]);
    }
    setEditingKey(null);
    setDraftValue('');
    setDirty(false);
  };

  const removeBudget = (category: string) => {
    setBudgets(budgets.filter((b) => b.category !== category));
    setEditingKey(null);
  };

  const categories = DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
    label: c.label,
    icon: c.icon,
  }));

  const hasBudgets = budgets.length > 0;

  return (
    <>
      <Header title="Orçamentos" />

      {!hasBudgets && spending.size === 0 ? (
        <div className="mt-md">
          <EmptyState
            icon="account_balance_wallet"
            title="Defina seus orçamentos"
            description="Crie limites mensais por categoria para controlar seus gastos e receber alertas."
          />
        </div>
      ) : (
        <div className="space-y-3 mt-md">
          {categories.map((cat) => {
            const spent = spending.get(cat.label)?.total ?? 0;
            const budget = budgetMap.get(cat.label);
            const isEditing = editingKey === cat.label;
            const pct = budget && budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
            const overBudget = budget && spent > budget.limit;
            const warning = budget && pct >= SPENDING_LIMIT_WARNING && pct < 100;

            if (!budget && spent === 0) return null;

            return (
              <div
                key={cat.label}
                className="bg-surface-container-lowest rounded-xl px-4 py-3 border border-surface-container"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-body-md">
                      {cat.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-label-md text-label-md text-on-surface">{cat.label}</span>
                    <span
                      className={`font-label-sm block ${
                        overBudget
                          ? 'text-error'
                          : warning
                            ? 'text-tertiary'
                            : 'text-on-surface-variant'
                      }`}
                    >
                      {budget
                        ? `${formatAmount(spent)} / ${formatAmount(budget.limit)} (${Math.round(pct)}%)`
                        : `${formatAmount(spent)} gasto · sem limite`}
                    </span>
                  </div>
                  {budget && (overBudget || warning) && (
                    <span
                      className={`material-symbols-outlined ${
                        overBudget ? 'text-error' : 'text-tertiary'
                      }`}
                    >
                      {overBudget ? 'warning' : 'info'}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setEditingKey(isEditing ? null : cat.label);
                      setDraftValue(budget ? String(budget.limit) : '');
                    }}
                    className="w-8 h-8 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors"
                    aria-label={`Configurar orçamento ${cat.label}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {budget ? 'edit' : 'add'}
                    </span>
                  </button>
                </div>

                {budget && (
                  <div className={overBudget ? 'opacity-100' : 'opacity-80'}>
                    <ProgressBar value={Math.min(100, pct)} tint={overBudget ? 'error' : warning ? 'tertiary' : 'primary'} />
                  </div>
                )}

                {isEditing && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-label-md">
                        R$
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={draftValue}
                        onChange={(e) => {
                          setDirty(true);
                          setDraftValue(e.target.value);
                        }}
                        placeholder="0,00"
                        className="w-full h-12 pl-9 pr-3 bg-surface-container-lowest border-2 border-surface-container-high rounded-lg font-body-md text-body-md focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={() => handleSetBudget(cat.label, cat.icon)}
                      disabled={!dirty}
                      className="h-12 px-4 rounded-lg bg-primary text-on-primary font-label-md disabled:opacity-40"
                    >
                      Salvar
                    </button>
                    {budget && (
                      <button
                        onClick={() => removeBudget(cat.label)}
                        className="w-12 h-12 rounded-lg hover:bg-error-container/30 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                        aria-label="Remover orçamento"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {budgets.length === 0 && (
            <p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-4">
              Informe gastos e defina limites nas categorias acima para acompanhar.
            </p>
          )}
        </div>
      )}
    </>
  );
}

function formatAmount(v: number): string {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}