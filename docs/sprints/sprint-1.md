# Sprint 1 — Fundação: Transações + Histórico em IndexedDB

**Data:** 08/09/2026
**Status:** Concluído ✅
**Build:** `tsc -b` ✅ · `vite build` ✅ · `eslint` ✅ (0 erros)

---

## Objetivo do Sprint

Transformar o app de **"gerador de plano estático"** (que só pedia renda, gastos e metas uma vez e mostrava um dashboard fixo) em um **rastreador financeiro real**. O foco foi:
- Permitir registrar **transações (receitas e despesas) com data, categoria e observação**;
- Visualizar o **histórico mês a mês**;
- Usar **IndexedDB** (em vez de `localStorage`) para não estourar o limite de 5MB;
- **Melhorar desempenho** com **lazy loading** das rotas e **`useMemo`** nos cálculos;
- Corrigir a **infraestrutura de lint** que estava quebrada na base.

Tudo **100% local e gratuito** — sem banco de dados externo, sem nuvem, sem custo.

---

## Subsprints executados

| Subsprint | Descrição | Arquivos |
|---|---|---|
| 1.1 | IndexedDB storage service | `src/services/db.ts` |
| 1.2 | Modelo `Transaction` + contexto estendido | `src/types/index.ts`, `src/contexts/FinancialContext.tsx` |
| 1.3 | Página Transações (CRUD + histórico mensal) | `src/pages/Transactions.tsx`, `src/components/TransactionForm.tsx`, `src/utils/transactions.ts` |
| 1.4 | Dashboard mensal dinâmico | `src/pages/Dashboard.tsx` |
| 1.5 | Lazy loading + `useMemo` | `src/App.tsx`, `src/pages/Dashboard.tsx`, `*.tsx` (default exports) |
| Extra | Correção do ESLint (flat config) + navegação | `eslint.config.js`, `src/components/BottomNavigation.tsx` |

---

## Detalhamento dos arquivos

### `src/services/db.ts` — Service de IndexedDB (Subsprint 1.1)

**O que faz:** Abre uma conexão com o banco de dados IndexedDB chamado `finances-db`, versão 1, contendo um *object store* chamado `transactions` (com índices de `date` e `month` para consultas rápidas). Expõe métodos assíncronos `getAll`, `put` (insere/atualiza), `delete` e `clear`.

**Função de cada parte:**
- `openDB()`: abre/cria o banco. O evento `onupgradeneeded` cria o object store apenas na primeira vez (migração de versão).
- `runRequest<T>()`: wrapper que transforma a API *event-based* do IndexedDB em **Promises** — passa pelos callbacks `onsuccess`/`onerror` e resolve/rejeita. É o que permite usar `await` no React de forma limpa.
- Estado: `DB_NAME` (nome), `DB_VERSION` (versão), `TRANSACTIONS_STORE` (nome da tabela).

**Por que IndexedDB e não localStorage?**
O `localStorage` tem limite de ~5MB e só guarda strings. Com muitas transações, ia estourar rápido. O IndexedDB tem limite bem maior (centenas de MB/GB), é assíncrono, e permite indexar por data/mês — o que é essencial para um app de finanças com histórico. Tudo ainda local/offline e grátis.

---

### `src/types/index.ts` — Novo tipo `Transaction` (Subsprint 1.2)

Adicionado ao final:

```ts
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  icon?: string;
  date: string;    // ISO yyyy-mm-dd
  month: string;   // chave "yyyy-mm" para agrupar por mês
  note?: string;
}
```

**Por quê:** Antes o app só tinha `Expense` (despesa sem data) e `MonthlyData` (média mensal estática). Para rastrear o dia a dia, precisávamos de um registro com data, tipo (receita/despesa), categoria, ícone e observação. O campo `month` é a *chave de agrupamento* — permite filtrar rapidamente transações de um mês (ex: `2026-09`).

---

### `src/contexts/FinancialContext.tsx` — Contexto estendido (Subsprint 1.2)

**O que foi adicionado:**
- Estados `transactions` (array de `Transaction`) e `transactionsLoaded` (flag).
- **Carregamento inicial**: useEffect que chama `db.getAll<Transaction>()`, ordena por data (mais recente primeiro) e popula o estado. A flag `transactionsLoaded` evita flash de "não há transações" enquanto carrega.
- Novas funções para o valor do contexto:
  - `addTransaction(tx)`: `db.put()` + atualiza o estado local (ordenado por data).
  - `updateTransaction(tx)`: `db.put()` (upsert) + atualiza no array.
  - `deleteTransaction(id)`: remove do IndexedDB + do estado.
  - `clearTransactions()`: limpa tudo (usado para reset).

**Por quê:** O contexto é a "fonte única de verdade" (single source of truth) do app. Estender o provider centraliza toda a lógica de persistência, e os componentes apenas consomem o hook `useFinancial()`. O carregamento assíncrono inicial garante que os dados do IndexedDB apareçam logo na primeira renderização do dashboard.

---

### `src/utils/transactions.ts` — Utilitários de transações (Subsprint 1.3)

Funções puras para trabalhar com transações:

| Função | Função |
|---|---|
| `getMonthKey(date)` | Gera a chave `yyyy-mm` a partir de um `Date` |
| `currentMonthKey()` | Chave do mês atual |
| `monthLabel(key)` | Converte `2026-09` → "Setembro 2026" (pt-BR) |
| `shiftMonth(key, delta)` | Navega entre meses (anterior/próximo) |
| `filterByMonth(txs, key)` | Filtra transações de um mês |
| `sumIncome(txs)` / `sumExpenses(txs)` | Soma receitas / despesas |
| `balance(txs)` | Receita − Despesa |
| `availableMonthKeys(txs)` | Lista de meses que têm transações (para navegação) |
| `groupByCategory(txs)` | Agrupa despesas por categoria (para o gráfico/lista) |

**Por quê:** Centralizar a lógica de datas/somas torna os componentes enxutos, testáveis e reutilizáveis (a Transactions page e o Dashboard usam as mesmas funções). São funções puras = fáceis de testar depois.

---

### `src/components/TransactionForm.tsx` — Formulário de transação (Subsprint 1.3)

**O que faz:** Formulário usado no modal/sheet de adicionar e editar transações. Campos:
- Tipo (Despesa/Receita) — switch com cores (vermelho/verde);
- Valor (input com máscara de moeda BRL, via `parseCurrencyInput`);
- Categoria (chips selecionáveis). Para despesas usa `DEFAULT_EXPENSE_CATEGORIES`; para receitas usa categorias próprias (Salário, Freelance, Investimentos, Outros);
- Data (input tipo `date`);
- Observação opcional.

**Lógica:** `handleSubmit` valida se há categoria, valor > 0 e data; constrói o objeto `Transaction` com `crypto.randomUUID()` para id e `getMonthKey()` para o mês; chama `onSubmit`. Reutiliza o botão de submit desabilitado quando `canSubmit` é falso.

**Por quê:** Um único componente gerencia criação E edição (mesmo formulário, reaproveitado), evitando duplicação de código. O input usa a mesma máscara/moeda do restante do app para consistência visual.

---

### `src/pages/Transactions.tsx` — Página de Transações (Subsprint 1.3)

**O que faz:**
- **Header** com título "Transações";
- **Navegação mensal**: botões ‹ › para navegar entre meses + bolinhas indicadoras dos meses que têm lançamentos;
- **Resumo do mês**: 3 cards (Receita, Despesa, Saldo) calculados das transações do mês selecionado;
- **Lista** de transações do mês: ícone por tipo/categoria, categoria, nota, data, valor (+verde / −vermelho) e botões editar/excluir;
- **FAB** (botão flutuante) para adicionar nova transação;
- **Sheet inferior** (bottom sheet) com `TransactionForm` para criar/editar;
- **EmptyState** quando não há transações; spinner enquanto carrega do IndexedDB.

**Por quê:** É a tela central do rastreador financeiro. O uso de *bottom sheet* mantém a experiência mobile-first (padrão Material). Navegação mensal com bolinhas permite saltar direto para um mês que tenha lançamentos.

---

### `src/pages/Dashboard.tsx` — Dashboard mensal dinâmico (Subsprint 1.4)

**O que foi adicionado:**
- Import de `useMemo` para memoizar o `calculateSummary` (só recalcula quando renda/gastos/meta mudam);
- Cálculo do resumo **real do mês atual** a partir das transações: `monthIncome`, `monthExpenses`, `monthBalance`;
- Nova seção no topo (após "Seu Plano Financeiro") que mostra **Entradas / Saídas / Saldo do mês atual** baseado nas transações registradas — com o nome do mês e contagem de lançamentos.

**Por quê:** Antes o dashboard só mostrava a média mensal informada no onboarding (estática). Agora ele exibe a **realidade do mês** (quanto entrou/saiu de verdade), tornando o app útil no dia a dia. O `useMemo` evita recalcular o resumo a cada render desnecessário (melhoria de desempenho).

---

### `src/App.tsx` + `export default` nas páginas — Lazy Loading (Subsprint 1.5)

**O que foi feito:**
- Páginas agora são carregadas com `React.lazy(() => import('...'))` e envolvidas em um `<Suspense fallback={<PageLoader />}>`;
- Cada página ganhou um `export default` para funcionar com o lazy (Income, Expenses, Goals, Dashboard, Transactions);
- Foi adicionada a rota `/transactions`.

**Por quê:** Com o lazy loading, o bundle inicial não inclui todas as páginas — cada rota vira um **chunk separado** que é baixado só quando usada. Isso reduz o carregamento inicial (o chunk principal caiu de 208KB para ~174KB; o restante é dividido em chunks pequenos). Resultado: primeira carga mais rápida, principalmente em mobile.

---

### `eslint.config.js` — Correção da infraestrutura de lint (Extra)

**O que estava errado:** O projeto usa ESLint 9, que exige o novo formato *flat config* (`eslint.config.js`), mas só havia um arquivo `.eslintrc` antigo. O comando `npm run lint` falhava com "couldn't find an eslint.config file".

**O que foi feito:**
- Criado `eslint.config.js` usando `@eslint/js`, `typescript-eslint` (parser/plugin para TS/TSX), `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh`;
- Adicionados globals (`window`, `document`, `localStorage`, `indexedDB`, `crypto`, etc.);
- Regras recomendadas do TS + hooks + refresh (com `allowConstantExport`).

**Por quê:** Sem o lint funcionando não é possível garantir qualidade/código limpo. Essa correção desbloqueia a verificação a cada subsprint. `npm run lint` agora passa (0 erros).

---

### `src/components/BottomNavigation.tsx` — Navegação com rota real (Extra)

- A aba "Budgets" virou **"Transações"** apontando para `/transactions` (rota real criada neste sprint);
- Labels "Metas" e "Ajustes" renomeados (ainda apontam para `/dashboard`, serão resolvidos no Sprint 2/3).

**Por quê:** O item de transação precisava ser acessível na navegação inferior. As outras abas ficarão funcionais quando as respectivas páginas existirem.

---

## Melhorias de desempenho observadas

| Métrica | Antes | Depois |
|---|---|---|
| Chunk principal (inicial) | ~208 KB | ~174 KB |
| Páginas carregadas sob demanda | Não (tudo junto) | Sim (chunks separados) |
| Recálculo do resumo no Dashboard | A cada render | Só quando muda (useMemo) |
| Persistência | localStorage (5MB) | IndexedDB (grande, indexado) |
| Lint | Quebrado (não rodava) | Funcionando (0 erros) |

---

## Como testar

1. `npm run dev`
2. Complete o onboarding ou pule.
3. Vá na aba **"Transações"** (navegação inferior).
4. Toque no **+** para adicionar uma receita ou despesa (valor, categoria, data, obs).
5. Volte ao **Dashboard**: agora aparece o resumo **real do mês** (Entradas/Saídas/Saldo).
6. Navegue entre meses na tela de transações para ver o histórico.
7. Recarregue a página (F5): os dados persistem no IndexedDB.

---

## Arquivos alterados/criados neste sprint

**Criados:**
- `src/services/db.ts`
- `src/utils/transactions.ts`
- `src/components/TransactionForm.tsx`
- `src/pages/Transactions.tsx`
- `eslint.config.js`
- `docs/sprints/sprint-1.md` (este documento)

**Modificados:**
- `src/types/index.ts` (tipo `Transaction`)
- `src/contexts/FinancialContext.tsx` (CRUD de transações + carregamento)
- `src/pages/Dashboard.tsx` (resumo mensal + useMemo)
- `src/App.tsx` (lazy loading + rota /transactions)
- `src/pages/Income.tsx`, `Expenses.tsx`, `Goals.tsx`, `Dashboard.tsx` (default exports)
- `src/components/BottomNavigation.tsx` (aba Transações)
- `package.json` (dependência dev `typescript-eslint` adicionada)