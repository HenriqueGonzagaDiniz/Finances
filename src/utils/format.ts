export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatCurrencySimple(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/\D/g, '');
  if (!cleaned) return 0;
  return parseInt(cleaned, 10) / 100;
}

export function maskCurrencyInput(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (!cleaned) return '';
  return (parseInt(cleaned, 10) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
