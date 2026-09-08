import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/hooks/useFinancial';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { GoalCard } from '@/components/GoalCard';
import { EmptyState } from '@/components/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import { SideMenu } from '@/components/SideMenu';
import { formatCurrency } from '@/utils/format';
import { calculateSummary } from '@/utils/financial';

export function Dashboard() {
  const {
    monthlyData,
    goals,
    savedPlans,
    saveCurrentPlan,
    restorePlan,
    deleteSavedPlan,
    resetAll,
  } = useFinancial();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainGoal = goals[0];

  const summary = calculateSummary(monthlyData.income, monthlyData.expenses, mainGoal);

  return (
    <>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="space-y-4">
          <div className="bg-primary-container/20 rounded-xl p-4">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Plano atual</p>
            <p className="font-headline-md text-headline-md text-on-surface mt-1">
              {formatCurrency(summary.totalIncome)}/mês
            </p>
            {mainGoal && (
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                Meta: {mainGoal.name} · {formatCurrency(summary.monthlySavingCapacity)}/mês
              </p>
            )}
          </div>

          <div className="border-t border-surface-container pt-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">history</span>
              Planos anteriores ({savedPlans.length})
            </h3>

            {savedPlans.length === 0 ? (
              <p className="font-label-sm text-label-sm text-on-surface-variant text-center py-6">
                Nenhum plano salvo ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {savedPlans.map((plan) => {
                  const totalExp = plan.monthlyData.expenses.reduce((s, e) => s + e.amount, 0);
                  const free = Math.max(0, plan.monthlyData.income - totalExp);
                  const goalName = plan.goals[0]?.name ?? 'Sem meta';
                  return (
                    <div
                      key={plan.id}
                      className="bg-white rounded-xl p-3 border border-surface-container flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-body-md">
                          folder
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-label-md text-label-md text-on-surface truncate text-sm">
                          {plan.name}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant text-xs">
                          {formatCurrency(plan.monthlyData.income)} · {goalName} · Livre{' '}
                          {formatCurrency(free)}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            restorePlan(plan.id);
                            setMenuOpen(false);
                          }}
                          className="w-7 h-7 rounded-full hover:bg-surface-container-low flex items-center justify-center text-primary transition-colors"
                          title="Restaurar"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                        </button>
                        <button
                          onClick={() => deleteSavedPlan(plan.id)}
                          className="w-7 h-7 rounded-full hover:bg-error-container/30 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                          title="Excluir"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-surface-container pt-4 space-y-2">
            <button
              onClick={() => {
                saveCurrentPlan(
                  `Plano - ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
                );
                resetAll();
                navigate('/');
              }}
              className="w-full text-primary font-label-md text-label-md py-3 flex items-center justify-center gap-2 hover:bg-surface-container-low rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Salvar plano e criar novo
            </button>
            <button
              onClick={() => {
                resetAll();
                navigate('/');
              }}
              className="w-full text-on-surface-variant font-label-md text-label-md py-2 flex items-center justify-center gap-2 hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              Descartar e começar novo
            </button>
          </div>
        </div>
      </SideMenu>

      <Header
        title="Finances"
        rightAction={
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
        }
      />

      <section className="mt-base mb-md text-center">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
          Seu Plano Financeiro
        </h2>
        <p className="font-body-md text-on-surface-variant mt-xs">
          {mainGoal
            ? summary.goalStatus === 'on_track'
              ? 'Você está no caminho certo para sua meta!'
              : 'Vamos ajustar sua rota financeira'
            : 'Organize suas finanças definindo uma meta'}
        </p>
      </section>

      {mainGoal && (
        <section className="mb-md">
          <div
            className={`rounded-xl p-md ambient-shadow overflow-hidden relative ${
              summary.goalStatus === 'on_track'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary-container text-on-primary-container'
            }`}
          >
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <span
                className="material-symbols-outlined text-[120px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                savings
              </span>
            </div>
            <div className="relative z-10 flex flex-col gap-base">
              {summary.goalStatus === 'on_track' ? (
                <>
                  <span className="font-label-md uppercase tracking-wider opacity-80">
                    Meta: {mainGoal.name}
                  </span>
                  <h3 className="font-headline-lg-mobile text-headline-lg-mobile">
                    Guardando {formatCurrency(summary.monthlySavingCapacity)}/mês
                  </h3>
                  <p className="font-body-md opacity-90">
                    Você atingirá {formatCurrency(mainGoal.targetAmount)} em{' '}
                    <strong>
                      {summary.estimatedMonthsToGoal === Infinity
                        ? '—'
                        : `${summary.estimatedMonthsToGoal} ${summary.estimatedMonthsToGoal === 1 ? 'mês' : 'meses'}`}
                    </strong>
                    .
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="font-label-md">
                      Economia necessária: {formatCurrency(summary.requiredGoalSaving)}/mês — você está
                      guardando{' '}
                      {summary.monthlySavingCapacity >= summary.requiredGoalSaving
                        ? 'o suficiente ✅'
                        : 'menos que o ideal'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-label-md uppercase tracking-wider opacity-80">
                    Atenção: {mainGoal.name}
                  </span>
                  <h3 className="font-headline-lg-mobile text-headline-lg-mobile">
                    Faltam {formatCurrency(summary.adjustmentNeeded)}/mês
                  </h3>
                  <p className="font-body-md opacity-90">
                    Para atingir {formatCurrency(mainGoal.targetAmount)} em {mainGoal.deadlineMonths}{' '}
                    meses, você precisa de{' '}
                    <strong>{formatCurrency(summary.requiredGoalSaving)}/mês</strong>.
                  </p>
                  <p className="font-body-md opacity-80">
                    Você informou que consegue guardar{' '}
                    <strong>{formatCurrency(summary.monthlySavingCapacity)}/mês</strong>. Veja abaixo
                    sugestões de onde ajustar seus gastos.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {mainGoal ? (
        <section className="mt-md">
          <GoalCard goal={mainGoal} monthlySaving={summary.monthlySavingCapacity} />
        </section>
      ) : (
        <section className="mt-md">
          <EmptyState
            icon="flag"
            title="Nenhuma meta definida"
            description="Defina metas para acompanhar seu progresso financeiro."
          />
        </section>
      )}

      <section className="mt-md grid grid-cols-2 gap-gutter">
        <div className="bg-surface-container-lowest rounded-xl p-sm ambient-shadow flex flex-col gap-xs border-l-4 border-secondary">
          <span className="font-label-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">payments</span>
            Renda
          </span>
          <span className="font-headline-md text-headline-md text-on-surface">
            {formatCurrency(summary.totalIncome)}
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-sm ambient-shadow flex flex-col gap-xs border-l-4 border-error">
          <span className="font-label-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
            Gastos
          </span>
          <span className="font-headline-md text-headline-md text-on-surface">
            {formatCurrency(summary.totalExpenses)}
          </span>
          {summary.totalExpenses > 0 && summary.totalIncome > 0 && (
            <span className="font-label-sm text-on-surface-variant">
              {summary.savingsPercentage < 0
                ? '⚠️ Gastando mais que ganha'
                : `${100 - summary.savingsPercentage}% da renda`}
            </span>
          )}
        </div>
        <div className="col-span-2 bg-secondary-container rounded-xl p-sm flex items-center justify-between border-2 border-dashed border-primary/20">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">celebration</span>
            </div>
            <div>
              <span className="font-label-sm text-on-secondary-container">Dinheiro Livre</span>
              <p className="font-headline-md text-headline-md text-on-secondary-container">
                {formatCurrency(summary.freeMoney)}
              </p>
            </div>
          </div>
          <span className="font-label-sm text-on-secondary-container opacity-70">
            {summary.savingsPercentage}% da renda
          </span>
        </div>
      </section>

      {summary.expenseBreakdown.length > 0 && (
        <section className="mt-md">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">
            Distribuição dos gastos
          </h3>
          <div className="space-y-2">
            {summary.expenseBreakdown.map((item) => (
              <div
                key={item.category}
                className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-surface-container"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-body-md">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface truncate">
                      {item.category}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant ml-2">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {summary.goalStatus === 'needs_adjustment' && summary.cutSuggestions.length > 0 && (
        <section className="mt-md">
          <div className="bg-error-container/30 rounded-xl p-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Ajustes necessários</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Faltam {formatCurrency(summary.adjustmentNeeded)}/mês para atingir sua meta. Aqui estão
              algumas sugestões:
            </p>
            <div className="space-y-3">
              {summary.cutSuggestions.map((s) => (
                <div
                  key={s.category}
                  className="bg-white rounded-xl p-4 flex items-center gap-3 border border-error/10"
                >
                  <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-error">arrow_downward</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-md text-on-surface-variant">
                        {s.icon}
                      </span>
                      <span className="font-headline-md text-headline-md text-on-surface">
                        {s.category}
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                      De {formatCurrency(s.currentAmount)} →
                      <span className="text-primary font-bold">
                        {' '}{formatCurrency(s.suggestedAmount)}
                      </span>
                    </p>
                    <p className="font-label-sm text-label-sm text-error mt-1">
                      Corte: {formatCurrency(s.cutValue)}/mês
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      {s.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white/60 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface">Total do corte</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  {formatCurrency(summary.cutSuggestions.reduce((s, c) => s + c.cutValue, 0))}
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={Math.min(
                    100,
                    (summary.cutSuggestions.reduce((s, c) => s + c.cutValue, 0) /
                      summary.adjustmentNeeded) *
                      100,
                  )}
                />
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                {summary.cutSuggestions.reduce((s, c) => s + c.cutValue, 0) >=
                summary.adjustmentNeeded
                  ? '✅ Com esses cortes, você atinge a meta no prazo!'
                  : 'Ainda pode ser necessário revisar mais categorias'}
              </p>
            </div>
          </div>
        </section>
      )}

      {summary.goalStatus === 'no_goal' && summary.totalIncome > 0 && (
        <section className="mt-md">
          <div className="bg-surface-container-low rounded-xl p-md text-center">
            <span
              className="material-symbols-outlined text-primary text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trending_up
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Com sua renda de {formatCurrency(summary.totalIncome)} e gastos de{' '}
              {formatCurrency(summary.totalExpenses)}, sobram{' '}
              <strong>{formatCurrency(summary.freeMoney)}/mês</strong>.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Defina uma meta financeira para começarmos a planejar seus objetivos.
            </p>
          </div>
        </section>
      )}

      {summary.totalIncome > 0 && (
        <section className="mt-md p-4 bg-surface-container-low rounded-xl">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
            Resumo financeiro
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Regra 50/30/20 — Essencial
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                {formatCurrency(Math.round(summary.totalIncome * 0.5))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Regra 50/30/20 — Estilo de vida
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                {formatCurrency(Math.round(summary.totalIncome * 0.3))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Regra 50/30/20 — Poupança
              </span>
              <span className="font-label-md text-label-md text-primary font-bold">
                {formatCurrency(summary.recommendedSaving)}
              </span>
            </div>
            <div className="border-t border-surface-container pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface">Taxa de economia</span>
                <span className="font-headline-md text-headline-md text-primary">
                  {summary.savingsPercentage}%
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-lg">
        <Button onClick={() => navigate('/')} icon="check_circle">
          Confirmar Plano
        </Button>
        <p className="text-center font-label-md text-on-surface-variant mt-sm">
          Você pode ajustar as metas a qualquer momento.
        </p>
      </section>
    </>
  );
}
