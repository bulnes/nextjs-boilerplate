# nextjs-boilerplate

Base de produção para os demais projetos do workspace: Next.js (App Router), TypeScript estrito,
Tailwind CSS + shadcn/ui, DevSecOps no CI/CD e estrutura de dados via Supabase + Drizzle ORM.

## Stack

- **Framework**: Next.js (App Router) + React, RSC-first
- **Linguagem**: TypeScript (`strict: true`)
- **Estilo**: Tailwind CSS + shadcn/ui
- **Qualidade**: ESLint (+ `jsx-a11y` estrito) + Prettier, Husky + lint-staged, `tsc --noEmit`
- **Testes**: Vitest + React Testing Library (unitário/componente), Playwright (E2E)
- **Catálogo de componentes**: Storybook, com gerador padronizado (`plop`)
- **Segurança**: cabeçalhos HTTP restritivos (CSP estática sem nonce, HSTS, X-Frame-Options, X-Content-Type-Options),
  verificação de segredos (`gitleaks`), auditoria de dependências (`npm audit`), rate limiting em memória,
  validação de entrada com Zod, sessão via cookies estritos (`@supabase/ssr`)
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
| `npm run typecheck`         | `tsc --noEmit`                                                  |
| `npm run test`              | Testes unitários/componente (Vitest)                            |
| `npm run test:watch`        | Vitest em modo watch                                            |
| `npm run test:coverage`     | Testes com cobertura                                            |
| `npm run test:e2e`          | Testes E2E (Playwright, builda e sobe o app automaticamente)     |
| `npm run storybook`         | Catálogo de componentes em `http://localhost:6006`               |
| `npm run build-storybook`   | Build estático do Storybook                                     |
| `npm run generate:component -- <Nome>` | Gera um componente padrão (arquivo + teste + story) em `components/<Nome>/` |
| `npm run db:generate`      | Gera uma migration a partir do schema do Drizzle                |
| `npm run db:seed`          | Popula/reinicia o estado do banco usado nos testes              |

## Criando um novo componente

```bash
npm run generate:component -- MeuComponente
```

Cria `components/MeuComponente/{MeuComponente.tsx,MeuComponente.test.tsx,MeuComponente.stories.tsx}`
já passando em lint, typecheck e teste, sem edição adicional. Rodar o comando duas vezes para o mesmo
nome falha em vez de sobrescrever.

## Segurança

- Toda resposta HTTP inclui `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Frame-Options: DENY` e `X-Content-Type-Options: nosniff` (ver `next.config.ts`). A CSP é
  estática (sem nonce por requisição) e usa `script-src 'self' 'unsafe-inline'` — o nonce
  automático documentado pelo Next.js para scripts inline de hidratação não funcionou na prática
  em testes manuais com esta versão (16.3.4); ver a decisão e o teste documentados em
  `specs/003-nextjs-boilerplate-hardening/research.md` §11.
- Commits e Pull Requests são verificados contra vazamento de segredos (`gitleaks`) e vulnerabilidades
  de dependência High/Critical (`npm audit`), localmente (hook de pre-commit) e no CI.
- Todo input de usuário é validado com Zod antes de qualquer regra de negócio (ver `app/api/example/route.ts`
  e `contracts/example-route-handler.md` na spec desta feature).
- Rate limiting em memória protege rotas sensíveis de exemplo (ver `lib/rate-limit.ts`).

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
