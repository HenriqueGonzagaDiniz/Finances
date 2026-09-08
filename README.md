# Finances 💰

Um **organizador financeiro pessoal minimalista** que roda 100% no navegador — sem banco de dados externo, sem nuvem, sem custo. Feito com React + TypeScript + Tailwind CSS e empacotado como **PWA** (instalável e offline).

## ✨ Funcionalidades

- **Onboarding** guiado (renda → gastos → metas)
- **Transações** por mês (receitas/despesas com data, categoria, observação) persistidas em **IndexedDB**
- **Dashboard mensal** com resumo real do mês e estado das metas
- **Multi-metas** com CRUD completo (criar, editar, excluir, marcar atingida)
- **Orçamentos por categoria** com alertas de aproximação (≥80%) e estouro do limite
- **Gráficos SVG** (donut por categoria + barras receita × despesa dos últimos 6 meses) — sem bibliotecas externas
- **Backup local**: exportar/importar todos os dados em `.json`
- **Lazy loading** das rotas e `useMemo` nos cálculos para desempenho
- PWA instalável, mobile-first

## 🚀 Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # build de produção (dist/)
npm run lint     # lint (ESLint + TypeScript)
npm run preview  # preview do build
```

> Opcional: o projeto inclui scripts de proxy HTTPS para testar em celular na rede local (`scripts/https-proxy.mjs`).

## 📂 Estrutura

```
src/
  components/    # UI reutilizável (forms, charts, cards, navegação)
  constants/     # categorias, sugestões, chaves de storage
  contexts/      # FinancialContext (estado global + persistência)
  hooks/         # useFinancial (acesso ao contexto)
  layouts/       # OnboardingLayout e DashboardLayout
  pages/         # Cada tela do app (lazy loaded)
  services/      # storage (localStorage) e db (IndexedDB)
  types/         # Tipos TypeScript
  utils/         # Funções puras (finanças, transações, format, backup)
docs/sprints/    # Relatórios de cada sprint (o que foi feito e por quê)
```

## 🗂 Roadmap / Sprints

- [✅] **Sprint 1** — Transações + histórico em IndexedDB + lazy loading + correção do lint → `docs/sprints/sprint-1.md`
- [✅] **Sprint 2** — Multi-metas + orçamentos por categoria com alertas → `docs/sprints/sprint-2.md`
- [✅] **Sprint 3** — Gráficos SVG + página de análises → `docs/sprints/sprint-3.md`
- [✅] **Sprint 4** — Backup local (.json) + página de ajustes + acessibilidade → `docs/sprints/sprint-4.md`

## 🔒 Privacidade

Todos os dados ficam **exclusivamente no seu navegador** (localStorage + IndexedDB). Nada é enviado para servidores. Exporte um backup regularmente para não perder seus registros.