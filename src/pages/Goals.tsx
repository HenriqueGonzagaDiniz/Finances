import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/hooks/useFinancial';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { GOAL_SUGGESTIONS } from '@/constants';
import type { Goal } from '@/types';

export function Goals() {
  const { addGoal, completeOnboarding } = useFinancial();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [deadlineMonths, setDeadlineMonths] = useState(12);
  const [monthlySaving, setMonthlySaving] = useState(0);

  const [targetDirty, setTargetDirty] = useState(false);
  const [savingDirty, setSavingDirty] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const parseCurrency = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    return digits ? parseInt(digits, 10) / 100 : 0;
  };

  const handleSuggestion = (suggestion: string) => {
    setName(suggestion);
  };

  const handleFinish = () => {
    if (name && targetAmount > 0) {
      const goal: Goal = {
        id: crypto.randomUUID(),
        name,
        targetAmount,
        deadlineMonths,
        savedAmount: 0,
        monthlySavingCapacity: monthlySaving,
      };
      addGoal(goal);
    }
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="mb-lg">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">
          Qual sua meta financeira?
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Definir objetivos claros nos ajuda a criar um plano de economia personalizado para você.
        </p>
      </div>

      <div className="relative w-full h-48 bg-surface-container-low rounded-xl mb-lg overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(13,99,27,0.2)_0%,_transparent_70%)]" />
        <div className="flex flex-col items-center animate-subtle-float">
          <span
            className="material-symbols-outlined text-primary-container text-[64px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            flag
          </span>
        </div>
      </div>

      <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); handleFinish(); }}>
        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="goal-name">
            Nome da meta
          </label>
          <div className="relative">
            <input
              id="goal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Viagem, Carro Novo, Reserva"
              className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl px-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant">
              edit
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-gutter">
          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="goal-value">
              Valor desejado
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile">R$</span>
              <input
                id="goal-value"
                type="text"
                inputMode="numeric"
                value={targetDirty ? fmt(targetAmount) : ''}
                onChange={(e) => {
                  setTargetDirty(true);
                  setTargetAmount(parseCurrency(e.target.value));
                }}
                placeholder="0,00"
                className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl pl-14 pr-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
              />
            </div>
          </div>
          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="goal-deadline">
              Prazo (meses)
            </label>
            <div className="relative">
              <input
                id="goal-deadline"
                type="number"
                value={deadlineMonths}
                onChange={(e) => setDeadlineMonths(parseInt(e.target.value, 10) || 1)}
                placeholder="12"
                className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl px-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="monthly-saving">
            Quanto consegue guardar por mês?
          </label>
          <p className="font-label-sm text-label-sm text-on-surface-variant ml-1 mb-1">
            Seja realista. Não vale dizer que vai guardar tudo que sobra — a vida acontece.
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile">R$</span>
            <input
              id="monthly-saving"
              type="text"
              inputMode="numeric"
              value={savingDirty ? fmt(monthlySaving) : ''}
              onChange={(e) => {
                setSavingDirty(true);
                setMonthlySaving(parseCurrency(e.target.value));
              }}
              placeholder="0,00"
              className="w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl pl-14 pr-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        {name && targetAmount > 0 && (
          <div className="bg-secondary-container/30 rounded-xl p-4 space-y-1">
            {monthlySaving > 0 ? (
              <>
                <p className="font-label-md text-label-md text-on-secondary-container">
                  Com {fmt(monthlySaving)}/mês, você alcança sua meta em{' '}
                  <strong>{Math.ceil(targetAmount / monthlySaving)} meses</strong>.
                </p>
                {monthlySaving >= targetAmount / deadlineMonths ? (
                  <p className="font-label-sm text-label-sm text-primary">Você está no caminho certo!</p>
                ) : (
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Para atingir em {deadlineMonths} meses, precisaria guardar{' '}
                    <strong>{fmt(targetAmount / deadlineMonths)}/mês</strong>.
                  </p>
                )}
              </>
            ) : (
              <p className="font-label-md text-label-md text-on-secondary-container">
                Para atingir {fmt(targetAmount)} em {deadlineMonths} meses, você precisa guardar{' '}
                <strong>{fmt(targetAmount / deadlineMonths)}/mês</strong>. Informe quanto consegue
                guardar para vermos se está no caminho certo.
              </p>
            )}
          </div>
        )}

        <div className="pt-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant mb-sm block">Sugestões comuns:</span>
          <div className="flex flex-wrap gap-xs">
            {GOAL_SUGGESTIONS.map((s) => (
              <Chip key={s} onClick={() => handleSuggestion(s)}>{s}</Chip>
            ))}
          </div>
        </div>

        <div className="pt-md">
          <Button onClick={handleFinish} icon="arrow_forward">
            Finalizar
          </Button>
          <p className="text-center mt-md font-label-sm text-label-sm text-on-surface-variant px-lg">
            Ao finalizar, calcularemos sua jornada financeira automaticamente.
          </p>
        </div>
      </form>
    </div>
  );
}

export default Goals;
