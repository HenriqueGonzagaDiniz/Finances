import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { TransactionForm } from '@/components/TransactionForm';
import type { Transaction } from '@/types';
import {
  currentMonthKey,
  filterByMonth,
  shiftMonth,
  monthLabel,
  sumIncome,
  sumExpenses,
  balance,
  availableMonthKeys,
} from '@/utils/transactions';
import { formatCurrency } from '@/utils/format';

export default function Transactions() {
  const { transactions, transactionsLoaded, addTransaction, updateTransaction, deleteTransaction } =
    useFinancial();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const monthTransactions = filterByMonth(transactions, selectedMonth);
  const income = sumIncome(monthTransactions);
  const expenses = sumExpenses(monthTransactions);
  const bal = balance(monthTransactions);
  const months = availableMonthKeys(transactions);

  const hasPrev = months.some((m) => m < selectedMonth);
  const hasNext = selectedMonth < currentMonthKey() || months.some((m) => m > selectedMonth);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Transaction) => {
    if (editing) {
      await updateTransaction(data);
    } else {
      await addTransaction(data);
    }
    setFormOpen(false);
    setEditing(null);
    setSelectedMonth(data.month);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir esta transação?')) {
      await deleteTransaction(id);
    }
  };

  const dayLabel = (date: string) => {
    const d = new Date(`${date}T12:00:00`);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <>
      <Header title="Transações" />

      <div className="flex items-center justify-between mt-base mb-md">
        <button
          onClick={() => hasPrev && setSelectedMonth(shiftMonth(selectedMonth, -1))}
          disabled={!hasPrev}
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors disabled:opacity-30"
          aria-label="Mês anterior"
        >
          <span className="material-symbols-outlined text-primary">chevron_left</span>
        </button>
        <div className="text-center">
          <span className="font-headline-md text-headline-md text-on-surface">{monthLabel(selectedMonth)}</span>
          {months.length > 0 && (
            <div className="flex gap-1.5 justify-center mt-1">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    m === selectedMonth ? 'bg-primary' : 'bg-outline-variant hover:bg-primary/40'
                  }`}
                  aria-label={monthLabel(m)}
                />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => hasNext && setSelectedMonth(shiftMonth(selectedMonth, 1))}
          disabled={!hasNext}
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors disabled:opacity-30"
          aria-label="Próximo mês"
        >
          <span className="material-symbols-outlined text-primary">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-md">
        <div className="bg-primary-container/15 rounded-xl p-3 flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Receita</span>
          <span className="font-headline-md text-headline-md text-primary mt-1">
            {formatCurrency(income)}
          </span>
        </div>
        <div className="bg-error/10 rounded-xl p-3 flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Despesa</span>
          <span className="font-headline-md text-headline-md text-error mt-1">
            {formatCurrency(expenses)}
          </span>
        </div>
        <div className="bg-secondary-container/30 rounded-xl p-3 flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Saldo</span>
          <span
            className={`font-headline-md text-headline-md mt-1 ${
              bal >= 0 ? 'text-on-secondary-container' : 'text-error'
            }`}
          >
            {formatCurrency(bal)}
          </span>
        </div>
      </div>

      {!transactionsLoaded ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-primary text-[32px]">
            progress_activity
          </span>
        </div>
      ) : monthTransactions.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="Nenhuma transação"
          description="Registre suas receitas e despesas para acompanhar seus gastos do mês."
        />
      ) : (
        <div className="space-y-2">
          {monthTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-surface-container-lowest rounded-xl px-4 py-3 flex items-center gap-3 border border-surface-container"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'income' ? 'bg-primary/10' : 'bg-error/10'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-body-md ${
                    tx.type === 'income' ? 'text-primary' : 'text-error'
                  }`}
                >
                  {tx.icon ?? (tx.type === 'income' ? 'payments' : 'receipt_long')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    {tx.category}
                  </span>
                  <span
                    className={`font-headline-md text-headline-md ${
                      tx.type === 'income' ? 'text-primary' : 'text-error'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                    {tx.note ?? ''} {tx.note ? '·' : ''} {dayLabel(tx.date)}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(tx)}
                      className="w-7 h-7 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors"
                      aria-label="Editar"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="w-7 h-7 rounded-full hover:bg-error-container/30 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                      aria-label="Excluir"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setFormOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-surface rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto pb-safe">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-3 mb-4" />
            <TransactionForm
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
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-on-primary shadow-[0_8px_24px_rgba(13,99,27,0.3)] flex items-center justify-center transition-all active:scale-90 z-40"
        aria-label="Adicionar transação"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </>
  );
}
