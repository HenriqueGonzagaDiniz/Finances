# Sprint 4 — Backup Local + Ajustes + Polish

**Data:** 08/09/2026
**Status:** Concluído ✅
**Build:** `tsc -b` ✅ · `vite build` ✅ · `eslint` ✅ (0 erros)

---

## Objetivo do Sprint

Fechar o ciclo do projeto com:
1. **Backup/restauração 100% local** (exportar e importar todos os dados em um arquivo `.json`) — sem nuvem, sem custo;
2. Uma **página de Ajustes** central que oferece acesso rápido e controle de dados;
3. **Acessibilidade e polish** — botões com `aria-label`, navegação com ações úteis, feedback ao usuário.

---

## Subsprints executados

| Subsprint | Descrição | Arquivos |
|---|---|---|
| 4.1 | Exportar/importar JSON (backup local) | `src/utils/backup.ts`, `src/pages/SettingsPage.tsx` |
| 4.2 | Acessibilidade + polish | `src/components/BottomNavigation.tsx`, `src/pages/Dashboard.tsx`, `src/pages/SettingsPage.tsx` |

---

## Detalhamento dos arquivos

### `src/utils/backup.ts` — Utilitário de backup (Subsprint 4.1)

**O que faz:** Constrói, baixa, lê e aplica um backup completo do app.

```ts
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
```

**Funções:**

| Função | Função |
|---|---|
| `buildBackup(transactions)` | Monta o objeto completo de backup lendo do `localStorage` (planos, metas, orçamentos, configurações) e recebendo as transações (do IndexedDB) |
| `downloadBackup(data)` | Gera um arquivo `.json` e dispara o download no navegador via `Blob` + `URL.createObjectURL` + click em `<a download>` |
| `applyBackup(data)` | Restaura tudo: escreve nos `localStorage` (mesmas chaves de `STORAGE_KEYS`) e reescreve as transações no IndexedDB (limpa e insere uma a uma) |
| `readBackupFile(file)` | Lê o arquivo, faz `JSON.parse` e valida se `version === 1` e se `transactions` é array — caso contrário, lança erro amigável |

**Por quê:** Backup de dados é essencial num app local (perder o navegador/limpar cache apagaria tudo). Exportar para arquivo `.json` é a forma mais simples e universal de portabilidade — o usuário guarda o arquivo onde quiser (Google Drive, pen drive, etc.). Tudo continua gratuito e sem backend.

---

### `src/pages/SettingsPage.tsx` — Página de Ajustes (Subsprint 4.1/4.2)

**O que faz:**
- **Header** "Ajustes";
- **Mensagens de feedback**: banner verde de sucesso e vermelho de erro (com timeout de 4-6s);
- **Acesso rápido**: links para Transações, Metas, Análises e Orçamentos;
- **Backup (local)**:
  - Botão **Exportar backup (.json)** → `buildBackup` + `downloadBackup`;
  - Botão **Importar backup** → input `type="file"` oculto (ref) → `readBackupFile` + `applyBackup`;
- **Zona de perigo**: botão "Apagar todos os dados" com confirmação (`clearTransactions` + `resetAll`) e contador de transações.

**Lógica de importação:** 
```ts
const handleImport = async (file) => {
  const data = await readBackupFile(file);
  await applyBackup(data);
  showFeedback('Backup importado. Recarregue a página...');
}
```

**Por quê:** Centraliza as configurações do app. O input de arquivo fica oculto e é acionado programaticamente (padrão de UX comum para uploads). O feedback em banner (em vez de alert) é mais gentil e moderno.

---

### `src/components/BottomNavigation.tsx` — Navegação final (Subsprint 4.2)

Agora com 5 abas funcionais e reais:

| Aba | Ícone | Rota |
|---|---|---|
| Home | home | /dashboard |
| Transações | account_balance_wallet | /transactions |
| Metas | potted_plant | /goals |
| Análises | bar_chart | /statistics |
| Ajustes | settings | /settings |

**Por quê:** Como Orçamentos também é acessível via Dashboard (alertas) e Ajustes, a navegação inferior ficou com as 5 telas principais. Resolve completamente o problema da base (onde todas as abas apontavam para `/dashboard`).

---

### `src/pages/Dashboard.tsx` — Polish (Subsprint 4.2)

- Novo botão de **engrenagem (Ajustes)** no Header ao lado do menu, com `aria-label`;
- O botão no rodapé que era **"Confirmar Plano"** (que apenas recarregava a tela ao navegar para `/`) virou **"Registrar transações"** (navega para `/transactions`), uma ação de fato útil;
- Atalho "Análises" (criado no Sprint 3) mantido.

**Por quê:** Evita ações redundantes/confusas e torna o acesso aos ajustes mais óbvio. `aria-label`s melhoram acessibilidade para leitores de tela.

---

## Melhorias observadas

| Antes | Depois |
|---|---|
| Sem backup (perda total se limpar dados do navegador) | Exportar/importar tudo em `.json` |
| Sem tela de configurações | Página `/settings` com acesso rápido e zona de perigo |
| Botão "Confirmar Plano" inútil no fim do dashboard | Botão útil "Registrar transações" |
| Ajustes inacessível (só via menu no dashboard) | Aba própria + engrenagem no header |
| Falta de `aria-label` em vários ícones | `aria-label` nos principais controles |

---

## Como testar

1. `npm run dev`
2. Vá em **Ajustes** (aba inferior ou engrenagem do dashboard).
3. **Exportar backup** — um arquivo `finances-backup-YYYY-MM-DD.json` é baixado.
4. Adicione/remova algumas transações.
5. **Importar backup** — selecione o arquivo baixado; recarregue a página para ver os dados restaurados.
6. Teste **"Apagar todos os dados"** (cuidado: apaga tudo com confirmação).

---

## Arquivos alterados/criados neste sprint

**Criados:**
- `src/utils/backup.ts`
- `src/pages/SettingsPage.tsx`
- `docs/sprints/sprint-4.md` (este documento)

**Modificados:**
- `src/components/BottomNavigation.tsx` (5 abas reais)
- `src/pages/Dashboard.tsx` (engrenagem + botão útil)
- `src/App.tsx` (rota `/settings`)