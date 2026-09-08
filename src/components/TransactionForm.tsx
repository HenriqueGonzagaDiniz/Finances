import { useState } from 'react';
import type { Transaction } from '@/types';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/constants';
import { parseCurrencyInput } from '@/utils/format';
import { getMonthKey } from '@/utils/transactions';

const INCOME_CATEGORIES = [
  { icon: 'payments', label: 'Salário', priority: 1 },
  { icon: 'work', label: 'Freelance', priority: 3 },
  { icon: 'savings', label: 'Investimentos', priority: 3 },
  { icon: 'confirmation_number', label: 'Outros', priority: 5 },
] as const;

interface TransactionFormProps {
  initial?: Transaction | null;
  onSubmit: (data: Transaction) => void;
  onCancel: () => void;
}

export function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<Transaction['type']>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [amountDirty, setAmountDirty] = useState(Boolean(initial));
  const [category, setCategory] = useState(initial?.category ?? '');
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initial?.note ?? '');

  const categories =
    type === 'income'
      ? INCOME_CATEGORIES.map((c) => ({ icon: c.icon, label: c.label, priority: c.priority }))
      : DEFAULT_EXPENSE_CATEGORIES;

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleTypeChange = (t: Transaction['type']) => {
    setType(t);
    setCategory('');
  };

  const handleSubmit = () => {
    if (!category || amount <= 0 || !date) return;
    const dateObj = new Date(`${date}T12:00:00`);
    onSubmit({
      id: initial?.id ?? crypto.randomUUID(),
      type,
      amount,
      category,
      icon: categories.find((c) => c.label === category)?.icon,
      date,
      month: getMonthKey(dateObj),
      note: note.trim() || undefined,
    });
  };

  const canSubmit = Boolean(category) && amount > 0 && Boolean(date);

  return (
    <div className="px-container-margin">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          {initial ? 'Editar transação' : 'Nova transação'}
        </h3>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined text-on-surface-variant">close</span>
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`flex-1 h-12 rounded-xl font-label-md flex items-center justify-center gap-2 transition-colors ${
              type === t
                ? t === 'expense'
                  ? 'bg-error text-on-error'
                  : 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {t === 'expense' ? 'remove_circle_outline' : 'add_circle_outline'}
            </span>
            {t === 'expense' ? 'Despesa' : 'Receita'}
          </button>
        ))}
      </div>

      <label className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block">
        Valor
      </label>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile">
          R$
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={amountDirty ? fmt(amount) : ''}
          onChange={(e) => {
            setAmountDirty(true);
            setAmount(parseCurrencyInput(e.target.value));
          }}
          placeholder="0,00"
          className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl pl-14 pr-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
        />
      </div>

      <label className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block">
        Categoria
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setCategory(cat.label)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-label-md transition-colors ${
              category === cat.label
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="tx-date"
      >
        Data
      </label>
      <input
        id="tx-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full h-14 mb-4 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
      />

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="tx-note"
      >
        Observação <span className="text-on-surface-variant opacity-60">(opcional)</span>
      </label>
      <input
        id="tx-note"
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ex: Conta de luz, mercado..."
        className="w-full h-14 mb-6 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
      />

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full h-[56px] rounded-xl bg-primary text-on-primary font-headline-md text-body-lg shadow-[0_8px_24px_rgba(13,99,27,0.15)] transition-all active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {initial ? 'Salvar alterações' : 'Adicionar'}
        <span className="material-symbols-outlined">check</span>
      </button>
    </div>
  );
}
