import { SITE_URL } from "@/lib/site";

const REPO_URL = "https://github.com/bulnes/nextjs-boilerplate";

/**
 * llms.txt (llmstxt.org) — resumo do projeto voltado a LLMs/crawlers de IA,
 * na mesma linha do robots.txt/sitemap.xml (GEO). Servido via Route Handler
 * em vez de public/ pra reaproveitar o domínio configurável de lib/site.ts.
 */
export function GET() {
  const body = `# nextjs-boilerplate

> Boilerplate Next.js de produção: App Router, TypeScript estrito, Tailwind/shadcn, DevSecOps e Supabase prontos para uso.

Base para tirar um projeto novo do papel sem repetir a parte chata: autenticação e sessão via Supabase server-only, banco de dados com Drizzle ORM e Postgres, e segurança (CSP própria, rate limiting, validação Zod, variáveis de ambiente validadas, gitleaks) já calibrados.

## Stack
- Next.js 16 (Turbopack), React 19, TypeScript estrito
- Tailwind v4 + shadcn/ui
- Supabase (@supabase/ssr, server-only) + Drizzle ORM + Postgres, RLS default-deny

## Links
- [Repositório no GitHub](${REPO_URL}): código-fonte completo
- [Demo](${SITE_URL}): deploy de referência
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
