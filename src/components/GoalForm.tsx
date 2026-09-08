import { useState } from 'react';
import type { Goal } from '@/types';
import { GOAL_SUGGESTIONS } from '@/constants';
import { Chip } from '@/components/Chip';
import { parseCurrencyInput } from '@/utils/format';

interface GoalFormProps {
  initial?: Goal | null;
  onSubmit: (goal: Goal) => void;
  onCancel: () => void;
}

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [targetAmount, setTargetAmount] = useState(initial?.targetAmount ?? 0);
  const [targetDirty, setTargetDirty] = useState(Boolean(initial));
  const [deadlineMonths, setDeadlineMonths] = useState(initial?.deadlineMonths ?? 12);
  const [monthlySaving, setMonthlySaving] = useState(initial?.monthlySavingCapacity ?? 0);
  const [savingDirty, setSavingDirty] = useState(Boolean(initial));
  const [savedAmount, setSavedAmount] = useState(initial?.savedAmount ?? 0);
  const [savedDirty, setSavedDirty] = useState(Boolean(initial));

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSubmit = () => {
    if (!name.trim() || targetAmount <= 0) return;
    onSubmit({
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(),
      targetAmount,
      deadlineMonths: Math.max(1, deadlineMonths),
      savedAmount,
      monthlySavingCapacity: monthlySaving,
    });
  };

  const canSubmit = name.trim().length > 0 && targetAmount > 0;

  return (
    <div className="px-container-margin">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          {initial ? 'Editar meta' : 'Nova meta'}
        </h3>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined text-on-surface-variant">close</span>
        </button>
      </div>

      {!initial && (
        <div className="flex flex-wrap gap-xs mb-4">
          {GOAL_SUGGESTIONS.map((s) => (
            <Chip key={s} onClick={() => setName(s)}>
              {s}
            </Chip>
          ))}
        </div>
      )}

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="goal-name"
      >
        Nome da meta
      </label>
      <input
        id="goal-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Viagem, Carro Novo, Reserva"
        className="w-full h-14 mb-4 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
      />

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="goal-value"
      >
        Valor desejado
      </label>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile">
          R$
        </span>
        <input
          id="goal-value"
          type="text"
          inputMode="numeric"
          value={targetDirty ? fmt(targetAmount) : ''}
          onChange={(e) => {
            setTargetDirty(true);
            setTargetAmount(parseCurrencyInput(e.target.value));
          }}
          placeholder="0,00"
          className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl pl-14 pr-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
        />
      </div>

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="goal-deadline"
      >
        Prazo (meses)
      </label>
      <input
        id="goal-deadline"
        type="number"
        min={1}
        value={deadlineMonths}
        onChange={(e) => setDeadlineMonths(parseInt(e.target.value, 10) || 1)}
        className="w-full h-14 mb-4 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
      />

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="goal-saving"
      >
        Quanto consegue guardar por mês?
      </label>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile">
          R$
        </span>
        <input
          id="goal-saving"
          type="text"
          inputMode="numeric"
          value={savingDirty ? fmt(monthlySaving) : ''}
          onChange={(e) => {
            setSavingDirty(true);
            setMonthlySaving(parseCurrencyInput(e.target.value));
          }}
          placeholder="0,00"
          className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl pl-14 pr-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
        />
      </div>

      <label
        className="font-label-md text-label-md text-on-surface-variant ml-1 mb-1 block"
        htmlFor="goal-saved"
      >
        Valor já guardado <span className="text-on-surface-variant opacity-60">(opcional)</span>
      </label>
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile">
          R$
        </span>
        <input
          id="goal-saved"
          type="text"
          inputMode="numeric"
          value={savedDirty ? fmt(savedAmount) : ''}
          onChange={(e) => {
            setSavedDirty(true);
            setSavedAmount(parseCurrencyInput(e.target.value));
          }}
          placeholder="0,00"
          className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl pl-14 pr-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full h-[56px] rounded-xl bg-primary text-on-primary font-headline-md text-body-lg shadow-[0_8px_24px_rgba(13,99,27,0.15)] transition-all active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {initial ? 'Salvar alterações' : 'Criar meta'}
        <span className="material-symbols-outlined">check</span>
      </button>
    </div>
  );
}