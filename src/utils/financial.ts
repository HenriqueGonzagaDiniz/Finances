import type { FinancialSummary, Goal, Expense, CutSuggestion, ExpenseBreakdown, GoalStatus } from '@/types';
import { getCategoryMeta } from '@/constants';

export function calculateTotalExpenses(expenses: { amount: number }[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function calculateFreeMoney(income: number, totalExpenses: number): number {
  return Math.max(0, income - totalExpenses);
}

export function calculateRecommendedSaving(income: number): number {
  return Math.round(income * 0.2);
}

export function calculateSavingsPercentage(income: number, totalExpenses: number): number {
  if (income === 0) return 0;
  const free = income - totalExpenses;
  return Math.round((free / income) * 100);
}

export function calculateRequiredGoalSaving(targetAmount: number, deadlineMonths: number): number {
  if (deadlineMonths <= 0) return 0;
  return Math.round(targetAmount / deadlineMonths);
}

export function calculateExpenseBreakdown(
  expenses: Expense[],
  totalExpenses: number,
): ExpenseBreakdown[] {
  return expenses
    .filter((e) => e.amount > 0)
    .map((e) => ({
      category: e.category,
      amount: e.amount,
      percentage: totalExpenses > 0 ? Math.round((e.amount / totalExpenses) * 100) : 0,
      icon: e.icon,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateCutSuggestions(
  expenses: Expense[],
  gap: number,
): CutSuggestion[] {
  if (gap <= 0 || expenses.length === 0) return [];

  const sorted = [...expenses]
    .filter((e) => e.amount > 0)
    .map((e) => ({ ...e, meta: getCategoryMeta(e.category) }))
    .sort((a, b) => b.meta.priority - a.meta.priority || b.amount - a.amount);

  let remainingGap = gap;
  const suggestions: CutSuggestion[] = [];

  for (const exp of sorted) {
    if (remainingGap <= 0) break;
    const label = exp.meta.label;
    const priority = exp.meta.priority;

    if (priority <= 2) {
      const cut = Math.min(remainingGap, Math.round(exp.amount * 0.15));
      if (cut > 0) {
        suggestions.push({
          category: label,
          icon: exp.icon,
          currentAmount: exp.amount,
          suggestedAmount: exp.amount - cut,
          cutValue: cut,
          reason:
            priority === 1
              ? 'Reduza 15% otimizando este gasto essencial'
              : 'Ajuste este gasto para liberar orçamento',
        });
        remainingGap -= cut;
      }
    } else if (priority <= 3) {
      const cut = Math.min(remainingGap, Math.round(exp.amount * 0.3));
      if (cut > 0) {
        suggestions.push({
          category: label,
          icon: exp.icon,
          currentAmount: exp.amount,
          suggestedAmount: exp.amount - cut,
          cutValue: cut,
          reason: 'Revise este gasto — é possível reduzir sem grande impacto',
        });
        remainingGap -= cut;
      }
    } else {
      const cut = Math.min(remainingGap, exp.amount);
      if (cut > 0) {
        suggestions.push({
          category: label,
          icon: exp.icon,
          currentAmount: exp.amount,
          suggestedAmount: exp.amount - cut,
          cutValue: cut,
          reason: 'Corte temporário — este gasto não é essencial',
        });
        remainingGap -= cut;
      }
    }
  }

  return suggestions;
}

export function calculateSummary(
  income: number,
  expenses: Expense[],
  goal?: Goal | null,
): FinancialSummary {
  const totalExpenses = calculateTotalExpenses(expenses);
  const freeMoney = calculateFreeMoney(income, totalExpenses);
  const recommendedSaving = calculateRecommendedSaving(income);
  const savingsPercentage = calculateSavingsPercentage(income, totalExpenses);
  const expenseBreakdown = calculateExpenseBreakdown(expenses, totalExpenses);

  if (!goal || goal.targetAmount === 0) {
    return {
      totalIncome: income,
      totalExpenses,
      freeMoney,
      recommendedSaving,
      savingsPercentage,
      requiredGoalSaving: 0,
      monthlySavingCapacity: 0,
      goalStatus: 'no_goal',
      adjustmentNeeded: 0,
      expenseBreakdown,
      cutSuggestions: [],
      estimatedMonthsToGoal: 0,
    };
  }

  const requiredGoalSaving = calculateRequiredGoalSaving(goal.targetAmount, goal.deadlineMonths);
  const monthlySavingCapacity = goal.monthlySavingCapacity;
  const estimatedMonthsToGoal =
    monthlySavingCapacity > 0
      ? Math.ceil(goal.targetAmount / monthlySavingCapacity)
      : Infinity;

  let goalStatus: GoalStatus;
  let adjustmentNeeded = 0;
  let cutSuggestions: CutSuggestion[] = [];

  if (monthlySavingCapacity >= requiredGoalSaving) {
    goalStatus = 'on_track';
  } else {
    goalStatus = 'needs_adjustment';
    adjustmentNeeded = requiredGoalSaving - monthlySavingCapacity;
    cutSuggestions = calculateCutSuggestions(expenses, adjustmentNeeded);
  }

  return {
    totalIncome: income,
    totalExpenses,
    freeMoney,
    recommendedSaving,
    savingsPercentage,
    requiredGoalSaving,
    monthlySavingCapacity,
    goalStatus,
    adjustmentNeeded,
    expenseBreakdown,
    cutSuggestions,
    estimatedMonthsToGoal,
  };
}

export function calculateGoalProgress(goal: Goal): number {
  if (goal.targetAmount === 0) return 0;
  const progress = goal.savedAmount > 0
    ? Math.round((goal.savedAmount / goal.targetAmount) * 100)
    : Math.min(100, Math.round((goal.monthlySavingCapacity * 1) / goal.targetAmount * 100));
  return Math.min(100, Math.max(0, progress));
}

export function estimateGoalMonths(goal: Goal, _monthlySaving: number): number {
  if (goal.monthlySavingCapacity <= 0) return Infinity;
  const remaining = goal.targetAmount - goal.savedAmount;
  return Math.ceil(remaining / goal.monthlySavingCapacity);
}
