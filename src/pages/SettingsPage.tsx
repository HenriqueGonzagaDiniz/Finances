import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/hooks/useFinancial';
import { Header } from '@/components/Header';
import { buildBackup, downloadBackup, readBackupFile, applyBackup } from '@/utils/backup';

interface LinkRow {
  icon: string;
  label: string;
  desc: string;
  to: string;
}

const links: LinkRow[] = [
  { icon: 'account_balance_wallet', label: 'Transações', desc: 'Registrar receitas e despesas', to: '/transactions' },
  { icon: 'flag', label: 'Metas', desc: 'Gerenciar objetivos financeiros', to: '/goals' },
  { icon: 'bar_chart', label: 'Análises', desc: 'Gráficos e tendências', to: '/statistics' },
  { icon: 'savings', label: 'Orçamentos', desc: 'Definir limites por categoria', to: '/budgets' },
];

export default function SettingsPage() {
  const { transactions, resetAll, clearTransactions } = useFinancial();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setError(null);
    window.setTimeout(() => setFeedback(null), 4000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setFeedback(null);
    window.setTimeout(() => setError(null), 6000);
  };

  const handleExport = () => {
    try {
      downloadBackup(buildBackup(transactions));
      showFeedback('Backup exportado com sucesso.');
    } catch {
      showError('Falha ao exportar os dados.');
    }
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = await readBackupFile(file);
      await applyBackup(data);
      showFeedback('Backup importado. Recarregue a página para ver os dados.');
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Falha ao importar o backup.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Tem certeza que deseja apagar TODOS os dados? (transações, metas, orçamentos e planos). Esta ação não pode ser desfeita.',
      )
    ) {
      void clearTransactions();
      resetAll();
      showFeedback('Todos os dados foram apagados.');
    }
  };

  return (
    <>
      <Header title="Ajustes" />

      {feedback && (
        <div className="bg-primary-container/20 rounded-xl p-sm mb-md flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-body-md">check_circle</span>
          <span className="font-label-md text-label-md text-on-surface">{feedback}</span>
        </div>
      )}
      {error && (
        <div className="bg-error-container/30 rounded-xl p-sm mb-md flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-body-md">error</span>
          <span className="font-label-md text-label-md text-on-surface">{error}</span>
        </div>
      )}

      <section className="mt-md space-y-2">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
          Acesso rápido
        </h3>
        {links.map((l) => (
          <button
            key={l.to}
            onClick={() => navigate(l.to)}
            className="w-full flex items-center gap-3 bg-surface-container-lowest rounded-xl px-4 py-3 border border-surface-container text-left transition-colors hover:bg-surface-container-low"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-body-md">{l.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-label-md text-label-md text-on-surface block">{l.label}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{l.desc}</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </button>
        ))}
      </section>

      <section className="mt-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
          Backup (local)
        </h3>
        <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-container space-y-2">
          <p className="font-label-md text-label-md text-on-surface-variant">
            Exporte todos os seus dados (transações, metas, orçamentos) para um arquivo JSON e importe
            quando precisar — tudo salvo localmente, sem nuvem.
          </p>
          <button
            onClick={handleExport}
            className="w-full h-12 rounded-xl bg-secondary-container text-on-secondary-container font-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar backup (.json)
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Importar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => handleImport(e.target.files?.[0])}
          />
        </div>
      </section>

      <section className="mt-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
          Zona de perigo
        </h3>
        <button
          onClick={handleReset}
          className="w-full h-12 rounded-xl bg-error-container/30 text-error font-label-md flex items-center justify-center gap-2 transition-colors hover:bg-error-container/50"
        >
          <span className="material-symbols-outlined text-[18px]">delete_forever</span>
          Apagar todos os dados
        </button>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-center">
          {transactions.length} transações registradas no momento.
        </p>
      </section>
    </>
  );
}