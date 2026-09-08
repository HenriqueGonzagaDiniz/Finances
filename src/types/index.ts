export interface Expense {
  id: string;
  category: string;
  amount: number;
  icon: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  deadlineMonths: number;
  savedAmount: number;
  monthlySavingCapacity: number;
}

export interface MonthlyData {
  income: number;
  expenses: Expense[];
}

export interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  monthlyData: MonthlyData;
  goals: Goal[];
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export interface CutSuggestion {
  category: string;
  icon: string;
  currentAmount: number;
  suggestedAmount: number;
  cutValue: number;
  reason: string;
}

export type GoalStatus = 'on_track' | 'needs_adjustment' | 'no_goal';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  freeMoney: number;
  recommendedSaving: number;
  savingsPercentage: number;
  requiredGoalSaving: number;
  monthlySavingCapacity: number;
  goalStatus: GoalStatus;
  adjustmentNeeded: number;
  expenseBreakdown: ExpenseBreakdown[];
  cutSuggestions: CutSuggestion[];
  estimatedMonthsToGoal: number;
}

export interface AppSettings {
  onboardingCompleted: boolean;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  icon?: string;
  date: string;
  month: string;
  note?: string;
}
