# nextjs-boilerplate

Base de produção para os demais projetos do workspace: Next.js (App Router), TypeScript estrito,
Tailwind CSS + shadcn/ui, DevSecOps no CI/CD e estrutura de dados via Supabase + Drizzle ORM.

## Stack

- **Framework**: Next.js (App Router) + React, RSC-first, com React Compiler habilitado
  (memoização automática de componentes/hooks)
- **Linguagem**: TypeScript (`strict: true`)
- **Estilo**: Tailwind CSS + shadcn/ui
- **Qualidade**: ESLint (+ `jsx-a11y` estrito) + Prettier, Husky + lint-staged, `tsc --noEmit`,
  `knip` (código/dependência morta)
- **Testes**: Vitest + React Testing Library (unitário/componente), Playwright (E2E)
- **Catálogo de componentes**: Storybook, com geradores padronizados (`plop`) de componente e de
  Route Handler
- **DX**: `.vscode/` recomendado (ESLint, Prettier, Tailwind CSS IntelliSense; format-on-save)
- **Segurança**: cabeçalhos HTTP restritivos (CSP estática sem nonce, HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP/CORP), verificação de segredos
  (`gitleaks`), auditoria de dependências (`npm audit` + `dependency-review-action` no PR), SAST
  (CodeQL), rate limiting em memória por padrão em `/api/*`, validação de entrada com Zod, sessão
  via cookies estritos (`@supabase/ssr`)
- **Banco de dados**: Supabase (Postgres) com Row Level Security default-deny + Drizzle ORM
- **Variáveis de ambiente**: validação estrita via `@t3-oss/env-nextjs` + Zod
- **CI/CD**: GitHub Actions (lint/typecheck/test/build, segurança, E2E, Lighthouse CI) + Dependabot semanal

## Pré-requisitos

- Node.js na versão fixada em `.nvmrc` (`nvm use`)
- npm (gerenciador de pacotes padrão deste projeto)
- [`gitleaks`](https://github.com/gitleaks/gitleaks) instalado localmente (necessário para o hook de pre-commit)

## Como começar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Nenhuma conexão real com o Supabase é necessária
para rodar localmente — os valores de `.env.example` são placeholders válidos apenas para satisfazer a
validação de ambiente (ver `lib/env.ts`).

## Scripts

| Script                    | Descrição                                                     |
| -------------------------- | -------------------------------------------------------------- |
| `npm run dev`               | Sobe o servidor de desenvolvimento                              |
| `npm run build`             | Build de produção                                               |
| `npm run start`             | Sobe o build de produção                                        |
| `npm run lint`              | ESLint                                                          |
| `npm run format`            | Formata o repositório com Prettier                              |
| `npm run format:check`      | Verifica formatação sem alterar arquivos (rodado no CI)         |
| `npm run typecheck`         | `tsc --noEmit`                                                  |
| `npm run test`              | Testes unitários/componente (Vitest)                            |
| `npm run test:watch`        | Vitest em modo watch                                            |
| `npm run test:coverage`     | Testes com cobertura                                            |
| `npm run test:e2e`          | Testes E2E (Playwright, builda e sobe o app automaticamente)     |
| `npm run storybook`         | Catálogo de componentes em `http://localhost:6006`               |
| `npm run build-storybook`   | Build estático do Storybook                                     |
| `npm run generate:component -- <Nome>` | Gera um componente padrão (arquivo + teste + story) em `components/<Nome>/` |
| `npm run generate:route -- <nome>` | Gera um Route Handler (arquivo + schema Zod + teste) em `app/api/<nome>/` |
| `npm run analyze`           | Analisa o bundle de produção (Turbopack) numa UI interativa      |
| `npm run knip`              | Detecta arquivo/export/dependência não utilizados                |
| `npm run db:generate`      | Gera uma migration a partir do schema do Drizzle                |
| `npm run db:seed`          | Popula/reinicia o estado do banco usado nos testes              |

## Criando um novo componente

```bash
npm run generate:component -- MeuComponente
```

Cria `components/MeuComponente/{MeuComponente.tsx,MeuComponente.test.tsx,MeuComponente.stories.tsx}`
já passando em lint, typecheck e teste, sem edição adicional. Rodar o comando duas vezes para o mesmo
nome falha em vez de sobrescrever.

## Criando uma nova rota de API

```bash
npm run generate:route -- minha-rota
```

Cria `app/api/minha-rota/route.ts` (POST + validação Zod), `lib/validations/minha-rota.schema.ts`
e `app/api/minha-rota/route.test.ts`, também já passando em lint, typecheck e teste. O handler
gerado não assume sessão do Supabase nem persistência — veja `app/api/example/route.ts` como
referência para isso. Rate limiting já cobre a rota automaticamente (todo `/api/*` é protegido por
padrão, ver seção Segurança).

## Segurança

- Toda resposta HTTP inclui `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy` e os headers `Cross-Origin-Opener-Policy`/`Cross-Origin-Resource-Policy`
  (ver `next.config.ts`). A CSP é estática (sem nonce por requisição) e usa
  `script-src 'self' 'unsafe-inline'` — o nonce automático documentado pelo Next.js para scripts
  inline de hidratação não funcionou na prática em testes manuais com esta versão (16.3.4); ver a
  decisão e o teste documentados em `specs/003-nextjs-boilerplate-hardening/research.md` §11.
- Commits e Pull Requests são verificados contra vazamento de segredos (`gitleaks`) e vulnerabilidades
  de dependência High/Critical (`npm audit` localmente/no CI + `dependency-review-action` já na
  abertura do PR), localmente (hook de pre-commit) e no CI.
- CodeQL analisa o código da aplicação em busca de padrões inseguros (injeção, XSS, etc.) em PRs,
  push para `develop`/`main` e semanalmente — complementa `gitleaks`/`npm audit`, que não olham para
  o próprio código.
- Todo input de usuário é validado com Zod antes de qualquer regra de negócio (ver `app/api/example/route.ts`
  e `contracts/example-route-handler.md` na spec desta feature).
- Rate limiting em memória (`lib/rate-limit.ts`) protege toda rota sob `/api/*` por padrão — uma
  rota nova já nasce protegida, sem precisar editar `proxy.ts`.

## Performance, SEO e acessibilidade

- React Compiler habilitado (`reactCompiler: true` em `next.config.ts` — a opção fica no nível
  raiz do config desde o Next 16, não em `experimental`) memoiza componentes/hooks automaticamente.
- `components/WebVitals` reporta Core Web Vitals reais (`useReportWebVitals`) via `lib/logger.ts`
  — hoje só loga no console do navegador; troque por um envio real a um serviço de RUM em produção.
- `npm run analyze` roda `next experimental-analyze` (só funciona com Turbopack, o bundler padrão
  deste projeto — `@next/bundle-analyzer` não é usado aqui por não suportar Turbopack).
- O job `lighthouse` do CI roda `@lhci/cli` contra as URLs listadas em `collect.url` de
  `lighthouserc.json` e falha o pipeline se Performance, Acessibilidade ou SEO ficarem abaixo de
  0.9. Hoje só a home (`/`) está na lista — **ao adicionar uma rota nova relevante para
  navegação/SEO, inclua a URL correspondente em `lighthouserc.json`**, ou ela roda sem esse gate.
- SEO on-page já vem pronto: `app/sitemap.ts`, `app/robots.ts` (com `/api` excluído), metadata
  canônica, `app/opengraph-image.tsx`, JSON-LD (`components/JsonLd`) e `app/llms.txt` para
  descoberta por crawlers de IA (GEO).
- `app/manifest.ts` + `app/icon.tsx`/`app/apple-icon.tsx` geram o Web App Manifest e os ícones do
  site (favicon/apple-touch-icon) via `next/og` — troque `lib/site-icon.tsx` por um logo real do
  projeto derivado.
- Acessibilidade é reforçada em três camadas: estaticamente por `eslint-plugin-jsx-a11y` (modo
  `strict`) e pelo addon `@storybook/addon-a11y` no catálogo de componentes; em teste de componente
  via `jest-axe` (extensão de tipos manual em `types/jest-axe.d.ts` — `@types/jest-axe` só cobre o
  namespace do Jest); e no E2E via `@axe-core/playwright`, rodando contra o DOM real da home.
  `npm run generate:component` já inclui o assert de a11y no componente gerado. O gate de Lighthouse
  (score ≥ 0.9) continua cobrindo só a(s) URL(s) listada(s) acima.

## Banco de dados

O client do Supabase e o schema do Drizzle estão estruturados, mas **nenhuma conexão real é feita por
padrão**. Para desenvolvimento com um banco real:

1. Preencha `DATABASE_URL` e as variáveis `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` em `.env.local` (todas server-side, sem prefixo `NEXT_PUBLIC_` — este boilerplate não usa Supabase no browser).
2. `npm run db:generate` para gerar/aplicar migrations.
3. `npm run db:seed` para popular o estado inicial (útil para reiniciar o estado antes de rodar testes).

Row Level Security é habilitado por padrão em modo de negação total (default deny) — ver `supabase/policies/example.sql`.
Esse RLS protege o acesso feito diretamente via client Supabase (PostgREST, papéis `anon`/`authenticated`). A conexão
usada pelo Drizzle (`DATABASE_URL`) usa um papel privilegiado do Postgres e **não passa pelo RLS**; nesse caminho,
a autorização é responsabilidade do código da aplicação (ver a checagem de sessão em `app/api/example/route.ts`).

## Estrutura

```text
app/            Rotas, layouts, error/loading/not-found globais, Route Handlers de exemplo
components/     Componentes de UI (um diretório por componente, com teste e story colocados)
lib/            Validação de env, logger, rate limiter, clients do Supabase, schemas Zod
db/             Schema, migrations e seed do Drizzle ORM
supabase/       Políticas de RLS documentadas
tests/e2e/      Testes end-to-end (Playwright)
templates/      Templates do gerador de componentes (plop)
```

## Aprenda mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Drizzle ORM](https://orm.drizzle.team)
