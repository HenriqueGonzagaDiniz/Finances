# Sprint 3 — Gráficos SVG Leves + Página de Análises

**Data:** 08/09/2026
**Status:** Concluído ✅
**Build:** `tsc -b` ✅ · `vite build` ✅ · `eslint` ✅ (0 erros)

---

## Objetivo do Sprint

Adicionar **visualização de dados** ao app para que o usuário entenda para onde vai seu dinheiro (antes só existiam listas e porcentagens). Como o requisito é **não adicionar dependências pesadas nem custo**, os gráficos foram construídos em **SVG puro** (sem bibliotecas como recharts/chart.js).

---

## Subsprints executados

| Subsprint | Descrição | Arquivos |
|---|---|---|
| 3.1 | Gráfico donut (pizza) por categoria de despesa | `src/components/charts/DonutChart.tsx` |
| 3.2 | Gráfico de barras receita × despesa (6 meses) | `src/components/charts/BarChart.tsx` |
| 3.3 | Página de Análises + rota + atalho no Dashboard | `src/pages/StatisticsPage.tsx`, `src/App.tsx`, `src/pages/Dashboard.tsx` |

---

## Detalhamento dos arquivos

### `src/components/charts/DonutChart.tsx` — Gráfico donut (Subsprint 3.1)

**O que faz:** Renderiza um gráfico de "rosca" (donut) a partir de dados `{ label, value, color? }`.

**Como funciona (conceito SVG):**
- Calcula `radius` e `circumference` (perímetro do círculo) a partir do tamanho e espessura;
- Para cada fatia, calcula a fração do total e converte em `strokeDasharray` (pedaço visível + pedaço invisível) e `strokeDashoffset` (deslocamento ao longo do anel). Isso é a técnica clássica de donut com SVG: desenha círculos com `stroke` e controla o traço com dash;
- Rotaciona o SVG em `-90°` para começar no topo;
- Renderiza um fundo cinza (anel vazio) como base;
- Suporta `centerLabel` e `centerSub` (texto no meio, ex: total do mês);
- Paleta fixa de 10 cores em verde (tema do app) com fallback para quando a cor não é informada.

**Por quê:** SVG puro = zero dependência, leve, renderiza rápido e responsivo. O donut é ideal para mostrar proporção de despesas por categoria.

---

### `src/components/charts/BarChart.tsx` — Gráfico de barras (Subsprint 3.2)

**O que faz:** Renderiza barras agrupadas (Receita + Despesa) por mês.

**Como funciona:**
- Recebe `data: { label, income, expense }[]` e um `height` opcional;
- Calcula o valor máximo para escalar as alturas das barras (`(valor / max) * altura útil`);
- Cada grupo tem barras gêmeas: verde (receita) e vermelha (despesa);
- Desenha o rótulo (mês) embaixo de cada grupo;
- Embaixo, uma legenda com as cores;
- `overflow-x-auto` para permitir rolagem horizontal se houver muitos meses.

**Por quê:** Comparação visual rápida entre quanto entra e quanto sai a cada mês. Mesma lógica sem dependências.

---

### `src/pages/StatisticsPage.tsx` — Página de Análises (Subsprint 3.3)

**O que faz:**
- **Seletor de mês** (navegação ‹ ›);
- **Seção "Despesas por categoria"**: 
  - DonutChart com o total do mês no centro;
  - Lista das categorias com percentual e valor;
- **Seção "Receita × Despesa (6 meses)"**:
  - BarChart com os últimos 6 meses (a partir do mês selecionado);
- **EmptyState** quando não há transações.

**Cálculos (com `useMemo`):**
- `filterByMonth` + `groupByCategory` para o donut;
- `shiftMonth` em loop (de -5 a 0) + `sumIncome`/`sumExpenses` por mês para as barras.

**Por quê:** Consolida a análise visual em uma tela dedicada, reutilizando as funções puras de `utils/transactions`. O `useMemo` evita recálculos por render desnecessário.

---

### `src/App.tsx` + `src/pages/Dashboard.tsx` — Rotas e atalho (Subsprint 3.3)

- Nova rota `/statistics` com `StatisticsPage` (lazy loaded, dentro do DashboardLayout);
- No Dashboard: novo **card atalho "Análises"** (com ícone de gráfico) que aparece quando há transações e navega para `/statistics`.

**Por quê:** Acessar análises de forma simples a partir do dashboard mantém o app com navegação curta. O lazy loading mantém o desempenho.

---

## Melhorias observadas

| Antes | Depois |
|---|---|
| Nenhum gráfico (só listas e % estático) | Donut de despesas por categoria |
| Nenhuma visão temporal | Barras receita × despesa dos últimos 6 meses |
| Nenhuma tela de estatísticas | Página `/statistics` completa com navegação de mês |
| Dependência de lib externa para gráficos | **Zero** libras adicionais (SVG puro) |

---

## Como testar

1. `npm run dev`
2. Registre algumas despesas e receitas em "Transações" (use meses diferentes para ver as barras).
3. No **Dashboard**, toque no card **"Análises"** (ou navegue para `/statistics`).
4. Veja o donut de despesas por categoria e as barras dos últimos 6 meses.
5. Navegue entre meses com as setas.

---

## Arquivos alterados/criados neste sprint

**Criados:**
- `src/components/charts/DonutChart.tsx`
- `src/components/charts/BarChart.tsx`
- `src/pages/StatisticsPage.tsx`
- `docs/sprints/sprint-3.md` (este documento)

**Modificados:**
- `src/App.tsx` (rota `/statistics`)
- `src/pages/Dashboard.tsx` (atalho "Análises")