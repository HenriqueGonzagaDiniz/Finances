# Sprint 2 — Multi-metas + Orçamentos por Categoria

**Data:** 08/09/2026
**Status:** Concluído ✅
**Build:** `tsc -b` ✅ · `vite build` ✅ · `eslint` ✅ (0 erros)

---

## Objetivo do Sprint

O app antes só conseguia trabalhar com **uma meta** (o dashboard sempre usava `goals[0]` e os demais objetivos eram ignorados) e não tinha controle de **gasto por categoria**. Este sprint adicionou:

1. **Gerenciamento completo de múltiplas metas** (criar, editar, excluir, marcar como atingida) em página própria;
2. **Dashboard mostrando todas as metas** (não só a primeira);
3. **Orçamentos por categoria** — definir limite mensal por categoria de gasto e receber alertas quando o consumo passa de 80% do limite ou estoura.

Tudo **100% local** (localStorage/IndexedDB), sem dependências externas.

---

## Subsprints executados

| Subsprint | Descrição | Arquivos |
|---|---|---|
| 2.1 | Página Metas com CRUD completo | `src/pages/GoalsPage.tsx`, `src/components/GoalForm.tsx` |
| 2.2 | Dashboard mostrando todas as metas | `src/pages/Dashboard.tsx` |
| 2.3 | Orçamento por categoria + alertas | `src/pages/BudgetsPage.tsx`, `src/types/index.ts`, `src/contexts/FinancialContext.tsx`, `src/constants/index.ts`, `src/components/ProgressBar.tsx`, `src/App.tsx`, `src/components/BottomNavigation.tsx` |

---

## Detalhamento dos arquivos

### `src/types/index.ts` — Novo tipo `Budget` (Subsprint 2.3)

```ts
export interface Budget {
  category: string;
  limit: number;
  icon?: string;
}
```

**Por quê:** Cria o modelo de dados de orçamento. Cada orçamento associa uma categoria de gasto a um limite mensal (`limit`) em reais. O campo `icon` é opcional e usado para exibir o ícone correto na interface.

---

### `src/contexts/FinancialContext.tsx` — Estado de orçamentos (Subsprint 2.3)

- Novo estado `budgets` (array de `Budget`), inicializado a partir do `localStorage` (via `storage.getItem`), persistido em `@finances:budgets` quando muda.
- Nova função `setBudgets(budgets)` que substitui a lista (um atalho para o estado).

**Por quê:** Orçamentos são config inerente (poucos registros), então usam `localStorage` — não precisam de IndexedDB (que é usado para as transações numerosas). Centralizar no contexto mantém o "single source of truth" do app.

---

### `src/constants/index.ts` — Nova chave `BUDGETS`

```ts
export const STORAGE_KEYS = {
  // ...
  BUDGETS: '@finances:budgets',
} as const;
```

**Por quê:** Constante da chave no localStorage, seguindo o padrão existente, evitando "string mágica" espalhada no código.

---

### `src/components/GoalForm.tsx` — Formulário de meta (Subsprint 2.1)

**O que faz:** Formulário reutilizável para **criar e editar metas**, usado dentro do bottom sheet da página Metas.

Campos:
- **Nome da meta** (texto) — com chips de sugestões (Viagem, Reserva, Educação, etc.) quando criando;
- **Valor desejado** (moeda BRL com máscara, via `parseCurrencyInput`);
- **Prazo (meses)** (número);
- **Quanto consegue guardar por mês** (moeda);
- **Valor já guardado** (opcional, moeda) — novo campo que permite registrar o montante inicial.

**Lógica:** `handleSubmit` cria/atualiza o objeto `Goal` com `crypto.randomUUID()` se novo, valida nome e valor desejado > 0, e garante `deadlineMonths >= 1`.

**Por quê:** Reaproveitar o mesmo formulário para adicionar e editar (padrão do `TransactionForm` do Sprint 1) evita duplicação de UI e de lógica.

---

### `src/pages/GoalsPage.tsx` — Página de Metas (Subsprint 2.1)

**O que faz:**
- Lista **todas** as metas com:
  - `ProgressRing` com o % de progresso;
  - Nome, valor guardado / objetivo, tempo estimado restante;
  - Badge 🎉 "Meta atingida!" quando progresso ≥ 100%;
  - Botões editar (abre o form) e excluir (com confirmação);
- **EmptyState** quando não há metas;
- **FAB** (+) para adicionar nova meta;
- **Bottom sheet** com `GoalForm` para criar/editar.

**Por quê:** Antes, metas só podiam ser criadas no onboarding e não eram editáveis/excluíveis pela interface. Esta página permite gerenciamento completo, tornando o app utilizável a longo prazo.

---

### `src/pages/Dashboard.tsx` — Dashboard com todas as metas (Subsprint 2.2)

**O que mudou:**
- A seção que antes mostrava **apenas `mainGoal`** (com um único `GoalCard`) agora mostra uma seção **"Suas metas"** listando **todas** as metas (até 3 no dashboard), cada uma com seu `GoalCard` individual;
- Adicionado link **"Ver todas"** que navega para `/goals`;
- O bloco grande com o status da meta principal (on_track / needs_adjustment) continua usando `mainGoal = goals[0]` como referência principal, mas agora as demais metas são visíveis logo abaixo.

**Por quê:** Acabar com o comportamento de ignorar metas além da primeira. Cada meta tem seu progresso individual, e o usuário consegue ver o resumo de todas e navegar para a tela de gestão completa.

---

### `src/pages/BudgetsPage.tsx` — Página de Orçamentos (Subsprint 2.3)

**O que faz:**
- Lista as categorias de despesa (`DEFAULT_EXPENSE_CATEGORIES`) que têm gasto no mês atual OU orçamento definido;
- Para cada categoria mostra:
  - Ícone + nome;
  - **Gasto real do mês** (calculado das transações via `groupByCategory`);
  - **Limite** se houver orçamento + **% usado**;
  - Barra de progresso colorida (verde → amarelo/cinza → vermelho);
  - Ícone de alerta quando ≥ 80% (info) ou estourado (warning);
- Botão de editar/adicionar orçamento por categoria — abre input de valor, salva ou remove (se R$ 0);

**Constantes:**
- `SPENDING_LIMIT_WARNING = 0.8` — limiar (80%) a partir do qual aciona aviso de aproximação.

**Por quê:** É a tela de controle de orçamento. Usa as transações reais do mês (do IndexedDB) para comparar com os limites definidos, dando feedback imediato se está gastando demais.

---

### `src/components/ProgressBar.tsx` — Suporte a cores (Subsprint 2.3)

Antes a barra era sempre verde (`bg-primary`). Agora aceita a prop `tint`:
```ts
tint?: 'primary' | 'tertiary' | 'error';
```
- `primary` → verde (padrão);
- `tertiary` → cinza/verde escuro (aviso de aproximação);
- `error` → vermelho (estouro).

**Por quê:** Para os alertas de orçamento terem semântica visual (verde = ok, cinza = cuidado, vermelho = estourou). Mudança retrocompatível (default `primary`), então o dashboard existente não quebra.

---

### `src/App.tsx` — Novas rotas (Subsprint 2.1/2.3)

- `/goals` → `GoalsPage` (com lazy loading);
- `/budgets` → `BudgetsPage`;

Ambas dentro do `DashboardLayout` (têm header + bottom navigation).

**Por quê:** Novas telas precisam de rotas próprias. Lazy loading mantém o desempenho (cada página em chunk separado).

---

### `src/components/BottomNavigation.tsx` — Navegação (Subsprint 2.1/2.3)

- Aba **"Metas"** agora aponta para `/goals` (rota real);
- Aba **"Ajustes"** virou **"Orçamentos"** apontando para `/budgets`.

Itens finais: Home (/dashboard), Transações (/transactions), Metas (/goals), Orçamentos (/budgets).

**Por quê:** As abas passam a corresponder a páginas reais (resolvendo a navegação "fantasma" da base, onde todas apontavam para `/dashboard`). A aba de Ajustes retornará no Sprint 4.

---

## Melhorias de desempenho/observação

| Métrica | Antes | Depois |
|---|---|---|
| Metas no dashboard | Apenas `goals[0]` | Todas as metas (≤3, com link para todas) |
| CRUD de metas | Inexistente (só criar no onboarding) | Criar, editar, excluir, marcar atingida |
| Controle de gasto por categoria | Nenhum | Orçamento por categoria + alertas ≥80% e estouro |
| Lazy loading | Páginas novas carregadas sob demanda | GoalsPage e BudgetsPage como chunks separados |

---

## Como testar

1. `npm run dev`
2. Vá na aba **"Metas"** (navegação inferior):
   - Toque **+** para adicionar metas (nome, valor, prazo, mensal, já guardado);
   - Edite/exclua metas existentes.
3. Vá no **Dashboard**: a seção "Suas metas" lista todas, com progresso individual.
4. Registre algumas despesas em "Transações".
5. Vá na aba **"Orçamentos"**: defina limites por categoria.
6. Volte ao **Dashboard**: aparecem os **Alertas de orçamento** quando uma categoria passa de 80% do limite ou estoura.

---

## Arquivos alterados/criados neste sprint

**Criados:**
- `src/pages/GoalsPage.tsx`
- `src/pages/BudgetsPage.tsx`
- `src/components/GoalForm.tsx`
- `docs/sprints/sprint-2.md` (este documento)

**Modificados:**
- `src/types/index.ts` (tipo `Budget`)
- `src/contexts/FinancialContext.tsx` (estado + `setBudgets`)
- `src/constants/index.ts` (`STORAGE_KEYS.BUDGETS`)
- `src/components/ProgressBar.tsx` (prop `tint`)
- `src/pages/Dashboard.tsx` (todas as metas + alertas de orçamento)
- `src/App.tsx` (rotas /goals e /budgets)
- `src/components/BottomNavigation.tsx` (abas reais)