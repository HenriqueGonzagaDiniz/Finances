import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { MonthlyData, Goal, AppSettings, Expense, SavedPlan, Transaction } from '@/types';
import { storage } from '@/services/storage';
import { db } from '@/services/db';
import { STORAGE_KEYS } from '@/constants';

export interface FinancialContextType {
  monthlyData: MonthlyData;
  goals: Goal[];
  settings: AppSettings;
  savedPlans: SavedPlan[];
  transactions: Transaction[];
  transactionsLoaded: boolean;
  setIncome: (value: number) => void;
  setExpenses: (expenses: Expense[]) => void;
  addGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  updateGoal: (goal: Goal) => void;
  completeOnboarding: () => void;
  saveCurrentPlan: (name: string) => void;
  restorePlan: (planId: string) => void;
  deleteSavedPlan: (planId: string) => void;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearTransactions: () => Promise<void>;
  resetAll: () => void;
}

export const FinancialContext = createContext<FinancialContextType | null>(null);

const defaultMonthlyData: MonthlyData = { income: 0, expenses: [] };
const defaultSettings: AppSettings = { onboardingCompleted: false };

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData>(() => {
    return storage.getItem<MonthlyData>(STORAGE_KEYS.MONTHLY_DATA) ?? defaultMonthlyData;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    return storage.getItem<Goal[]>(STORAGE_KEYS.GOALS) ?? [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    return storage.getItem<AppSettings>(STORAGE_KEYS.SETTINGS) ?? defaultSettings;
  });

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    return storage.getItem<SavedPlan[]>(STORAGE_KEYS.SAVED_PLANS) ?? [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    db.getAll<Transaction>()
      .then((items) => {
        if (!cancelled) {
          setTransactions(items.sort((a, b) => (a.date < b.date ? 1 : -1)));
        }
      })
      .catch((e) => console.error('Failed to load transactions', e))
      .finally(() => {
        if (!cancelled) setTransactionsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    storage.setItem(STORAGE_KEYS.MONTHLY_DATA, monthlyData);
  }, [monthlyData]);

  useEffect(() => {
    storage.setItem(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  useEffect(() => {
    storage.setItem(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    storage.setItem(STORAGE_KEYS.SAVED_PLANS, savedPlans);
  }, [savedPlans]);

  const setIncome = useCallback((value: number) => {
    setMonthlyData((prev) => ({ ...prev, income: value }));
  }, []);

  const setExpenses = useCallback((expenses: Expense[]) => {
    setMonthlyData((prev) => ({ ...prev, expenses }));
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  }, []);

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateGoal = useCallback((goal: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  }, []);

  const completeOnboarding = useCallback(() => {
    setSettings({ onboardingCompleted: true });
  }, []);

  const saveCurrentPlan = useCallback(
    (name: string) => {
      const plan: SavedPlan = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        monthlyData: structuredClone(monthlyData),
        goals: structuredClone(goals),
      };
      setSavedPlans((prev) => [plan, ...prev]);
    },
    [monthlyData, goals],
  );

  const restorePlan = useCallback(
    (planId: string) => {
      const plan = savedPlans.find((p) => p.id === planId);
      if (!plan) return;
      setMonthlyData(structuredClone(plan.monthlyData));
      setGoals(structuredClone(plan.goals));
    },
    [savedPlans],
  );

  const deleteSavedPlan = useCallback((planId: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
  }, []);

  const resetAll = useCallback(() => {
    storage.clearAll();
    setMonthlyData(defaultMonthlyData);
    setGoals([]);
    setSettings(defaultSettings);
  }, []);

  const addTransaction = useCallback(async (transaction: Transaction) => {
    await db.put(transaction);
    setTransactions((prev) =>
      [...prev, transaction].sort((a, b) => (a.date < b.date ? 1 : -1)),
    );
  }, []);

  const updateTransaction = useCallback(async (transaction: Transaction) => {
    await db.put(transaction);
    setTransactions((prev) =>
      prev.map((t) => (t.id === transaction.id ? transaction : t)).sort((a, b) => (a.date < b.date ? 1 : -1)),
    );
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await db.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearTransactions = useCallback(async () => {
    await db.clear();
    setTransactions([]);
  }, []);

  return (
    <FinancialContext.Provider
      value={{
        monthlyData,
        goals,
        settings,
        savedPlans,
        transactions,
        transactionsLoaded,
        setIncome,
        setExpenses,
        addGoal,
        removeGoal,
        updateGoal,
        completeOnboarding,
        saveCurrentPlan,
        restorePlan,
        deleteSavedPlan,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactions,
        resetAll,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}
