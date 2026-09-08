import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/hooks/useFinancial';
import { Button } from '@/components/Button';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/constants';
import type { Expense } from '@/types';

export function Expenses() {
  const { setExpenses } = useFinancial();
  const [values, setValues] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = DEFAULT_EXPENSE_CATEGORIES.slice(0, 4);

  const totalExpenses = Object.values(values).reduce((s, v) => s + v, 0);

  const handleValueChange = (label: string, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    const num = cleaned ? parseInt(cleaned, 10) / 100 : 0;
    setValues((prev) => ({ ...prev, [label]: num }));
  };

  const handleContinue = () => {
    const expenseList: Expense[] = categories
      .filter((c) => (values[c.label] ?? 0) > 0)
      .map((c) => ({
        id: `expense-${c.label}`,
        category: c.label,
        amount: values[c.label] ?? 0,
        icon: c.icon,
      }));
    setExpenses(expenseList);
    navigate('/onboarding/goals');
  };

  const handleSkip = () => {
    setExpenses([]);
    navigate('/onboarding/goals');
  };

  return (
    <div className="flex-1 flex flex-col">
      <section className="mb-6">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-3">
          Qual sua média de gastos mensais?
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Toque em cada categoria para preencher seus gastos.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.label;
          const val = values[cat.label] ?? 0;
          return (
            <div
              key={cat.label}
              onClick={() => setActiveCategory(isActive ? null : cat.label)}
              className={`bg-white rounded-xl p-4 flex flex-col gap-2 border transition-all cursor-pointer ${
                isActive || val > 0
                  ? 'border-primary shadow-md'
                  : 'border-surface-container hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    val > 0 ? 'bg-primary' : 'bg-primary/10'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-body-lg ${
                      val > 0 ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {cat.icon}
                  </span>
                </div>
                {val > 0 && (
                  <span className="text-label-sm font-bold text-primary">
                    R$ {val.toFixed(0)}
                  </span>
                )}
              </div>
              <span className="text-label-md font-label-md text-on-surface-variant">
                {cat.label}
              </span>
              {isActive && (
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={val > 0 ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                  onChange={(e) => handleValueChange(cat.label, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-10 mt-1 px-3 bg-surface-container-lowest border border-surface-container-high rounded-lg font-body-md text-body-md focus:border-primary focus:ring-0 text-center"
                  autoFocus
                />
              )}
            </div>
          );
        })}
      </div>

      {totalExpenses > 0 && (
        <div className="bg-primary-container/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">Total de gastos</span>
          <span className="font-headline-md text-headline-md text-primary font-bold">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden mb-6 h-32 relative">
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[48px] opacity-40">
            account_balance
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="mt-auto pt-6">
        <Button onClick={handleContinue} variant="secondary">
          Continuar
        </Button>
        <button
          onClick={handleSkip}
          className="w-full mt-4 text-on-surface-variant font-label-md text-label-md py-2 hover:text-primary transition-colors"
        >
          Prefiro informar depois
        </button>
      </div>
    </div>
  );
}

export default Expenses;
