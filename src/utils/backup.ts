import type { Transaction, Goal, Budget, MonthlyData, AppSettings, SavedPlan } from '@/types';
import { storage } from '@/services/storage';
import { db } from '@/services/db';
import { STORAGE_KEYS } from '@/constants';

export interface BackupData {
  version: 1;
  exportedAt: string;
  monthlyData: MonthlyData;
  goals: Goal[];
  settings: AppSettings;
  savedPlans: SavedPlan[];
  budgets: Budget[];
  transactions: Transaction[];
}

export function buildBackup(transactions: Transaction[]): BackupData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    monthlyData: storage.getItem<MonthlyData>(STORAGE_KEYS.MONTHLY_DATA) ?? { income: 0, expenses: [] },
    goals: storage.getItem<Goal[]>(STORAGE_KEYS.GOALS) ?? [],
    settings: storage.getItem<AppSettings>(STORAGE_KEYS.SETTINGS) ?? { onboardingCompleted: false },
    savedPlans: storage.getItem<SavedPlan[]>(STORAGE_KEYS.SAVED_PLANS) ?? [],
    budgets: storage.getItem<Budget[]>(STORAGE_KEYS.BUDGETS) ?? [],
    transactions,
  };
}

export function downloadBackup(data: BackupData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finances-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function applyBackup(data: BackupData): Promise<void> {
  storage.setItem(STORAGE_KEYS.MONTHLY_DATA, data.monthlyData);
  storage.setItem(STORAGE_KEYS.GOALS, data.goals);
  storage.setItem(STORAGE_KEYS.SETTINGS, data.settings);
  storage.setItem(STORAGE_KEYS.SAVED_PLANS, data.savedPlans);
  storage.setItem(STORAGE_KEYS.BUDGETS, data.budgets);
  await db.clear();
  for (const tx of data.transactions ?? []) {
    if (tx && tx.id && tx.amount !== undefined) {
      await db.put(tx);
    }
  }
}

export async function readBackupFile(file: File): Promise<BackupData> {
  const text = await file.text();
  const parsed = JSON.parse(text) as BackupData;
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.transactions)) {
    throw new Error('Arquivo de backup inválido ou incompatível.');
  }
  return parsed;
}