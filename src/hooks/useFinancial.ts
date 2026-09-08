import { useContext } from 'react';
import { FinancialContext, type FinancialContextType } from '@/contexts/FinancialContext';

export function useFinancial(): FinancialContextType {
  const ctx = useContext(FinancialContext);
  if (!ctx) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return ctx;
}
