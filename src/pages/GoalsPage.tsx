import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { GoalForm } from '@/components/GoalForm';
import { ProgressRing } from '@/components/ProgressRing';
import type { Goal } from '@/types';
import { formatCurrency } from '@/utils/format';
import { calculateGoalProgress, estimateGoalMonths } from '@/utils/financial';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, removeGoal } = useFinancial();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setFormOpen(true);
  };

  const handleSubmit = (goal: Goal) => {
    if (editing) {
      updateGoal(goal);
    } else {
      addGoal(goal);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = (goal: Goal) => {
    if (window.confirm(`Excluir a meta "${goal.name}"?`)) {
      removeGoal(goal.id);
    }
  };

  return (
    <>
      <Header title="Metas" />

      {goals.length === 0 ? (
        <div className="mt-md">
          <EmptyState
            icon="flag"
            title="Nenhuma meta ainda"
            description="Defina objetivos financeiros para acompanhar seu progresso e se manter motivado."
          />
        </div>
      ) : (
        <div className="space-y-3 mt-md">
          {goals.map((goal) => {
            const progress = calculateGoalProgress(goal);
            const months = estimateGoalMonths(goal, goal.monthlySavingCapacity);
            const reached = progress >= 100;
            return (
              <div
                key={goal.id}
                className="bg-surface-container-lowest rounded-xl p-md ambient-shadow flex items-center gap-md border border-surface-container"
              >
                <ProgressRing value={progress} size={72} strokeWidth={7} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline-md text-headline-md text-on-surface truncate">
                      {goal.name}
                    </h4>
                    {reached && (
                      <span className="material-symbols-outlined text-primary text-body-md">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="font-label-md text-primary">
                    {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {reached
                      ? 'Meta atingida! 🎉'
                      : months === Infinity
                        ? 'Defina uma economia mensal'
                        : `~${months} ${months === 1 ? 'mês' : 'meses'} restantes`}
                  </p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(goal)}
                    className="w-8 h-8 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors"
                    aria-label={`Editar ${goal.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(goal)}
                    className="w-8 h-8 rounded-full hover:bg-error-container/30 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                    aria-label={`Excluir ${goal.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[55]" onClick={() => setFormOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[60] bg-surface rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto pb-safe">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-3 mb-4" />
            <GoalForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => {
                setFormOpen(false);
                setEditing(null);
              }}
            />
          </div>
        </>
      )}

      <button
        onClick={openCreate}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-on-primary shadow-[0_8px_24px_rgba(13,99,27,0.3)] flex items-center justify-center transition-all active:scale-90 z-50"
        aria-label="Adicionar meta"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </>
  );
}