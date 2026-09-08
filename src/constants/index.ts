export interface CategoryMeta {
  icon: string;
  label: string;
  priority: number;
}

export const DEFAULT_EXPENSE_CATEGORIES: CategoryMeta[] = [
  { icon: 'receipt_long', label: 'Faturas', priority: 2 },
  { icon: 'home_work', label: 'Aluguel', priority: 1 },
  { icon: 'commute', label: 'Transporte', priority: 2 },
  { icon: 'subscriptions', label: 'Assinaturas', priority: 4 },
  { icon: 'restaurant', label: 'Alimentação', priority: 1 },
  { icon: 'health_and_safety', label: 'Saúde', priority: 1 },
  { icon: 'school', label: 'Educação', priority: 3 },
  { icon: 'shopping_bag', label: 'Compras', priority: 5 },
];

export function getCategoryMeta(label: string): CategoryMeta {
  return (
    DEFAULT_EXPENSE_CATEGORIES.find((c) => c.label === label) ?? {
      icon: 'shopping_cart',
      label,
      priority: 3,
    }
  );
}

export const GOAL_SUGGESTIONS = ['Viagem', 'Reserva', 'Educação', 'Carro', 'Casa', 'Investimento'];

export const STORAGE_KEYS = {
  MONTHLY_DATA: '@finances:monthly_data',
  GOALS: '@finances:goals',
  SETTINGS: '@finances:settings',
  SAVED_PLANS: '@finances:saved_plans',
} as const;
