import type { Transaction } from '@/types';

export function getMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function currentMonthKey(): string {
  return getMonthKey(new Date());
}

export function monthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  const label = date.toLocaleDateString('pt-BR', { month: 'long' });
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${y}`;
}

export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return getMonthKey(date);
}

export function filterByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter((t) => t.month === monthKey);
}

export function sumIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function sumExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function balance(transactions: Transaction[]): number {
  return sumIncome(transactions) - sumExpenses(transactions);
}

export function availableMonthKeys(transactions: Transaction[]): string[] {
  const set = new Set(transactions.map((t) => t.month));
  return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
}

export function groupByCategory(transactions: Transaction[]): Map<string, { total: number; icon?: string }> {
  const map = new Map<string, { total: number; icon?: string }>();
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const current = map.get(t.category) ?? { total: 0, icon: t.icon };
    current.total += t.amount;
    if (t.icon) current.icon = t.icon;
    map.set(t.category, current);
  }
  return map;
}
