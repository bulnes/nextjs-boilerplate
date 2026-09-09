import Link from "next/link";

import { CloneCommand } from "@/components/home/CloneCommand";
import { JsonLd } from "@/components/JsonLd/JsonLd";

const REPO_URL = "https://github.com/bulnes/nextjs-boilerplate";
const CLONE_COMMAND = "git clone git@github.com:bulnes/nextjs-boilerplate.git";

const specSheet = [
  {
    label: "Runtime",
    items: ["Next.js 16 (Turbopack)", "React 19", "TypeScript estrito", "Tailwind v4 + shadcn"],
  },
  {
    label: "Dados e sessão",
    items: ["Supabase server-only", "@supabase/ssr", "Drizzle ORM + Postgres", "RLS default-deny"],
  },
  {
    label: "Segurança",
    items: ["CSP própria", "Rate limiting", "Validação Zod", "Env validado (T3 Env)", "gitleaks"],
  },
  {
    label: "Qualidade e CI",
    items: ["Vitest", "Playwright", "Storybook", "ESLint + Prettier", "Lighthouse CI"],
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99a46]";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-[#14171b] px-6 py-20 sm:py-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: "nextjs-boilerplate",
          codeRepository: REPO_URL,
          programmingLanguage: "TypeScript",
        }}
      />

      <section className="relative w-full max-w-2xl rounded-xs border border-[#3a3f46] bg-[#1c2025] px-8 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.06),inset_0_-1px_0_rgba(0,0,0,.4),0_20px_60px_-20px_rgba(0,0,0,.6)] motion-safe:animate-[stamp-in_420ms_ease-out] sm:px-14 sm:py-16">
        <span aria-hidden className="absolute top-4 left-4 size-2 rounded-full bg-[#3a3f46]" />
        <span aria-hidden className="absolute top-4 right-4 size-2 rounded-full bg-[#3a3f46]" />
        <span aria-hidden className="absolute bottom-4 left-4 size-2 rounded-full bg-[#3a3f46]" />
        <span aria-hidden className="absolute right-4 bottom-4 size-2 rounded-full bg-[#3a3f46]" />

        <h1
          aria-label="nextjs-boilerplate"
          className="font-(family-name:--font-stencil) text-[clamp(2.5rem,7vw,4.25rem)] leading-[0.94] tracking-tight text-[#edeae1]"
        >
          <span aria-hidden className="block">
            NEXTJS
          </span>
          <span aria-hidden className="block">
            BOILERPLATE
          </span>
        </h1>

        <p className="mt-4 font-mono text-xs tracking-wide text-[#c99a46]">
          Next.js 16 / React 19 / TypeScript estrito
        </p>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#c8c5bc]">
          A base que eu uso pra tirar um projeto novo do papel sem repetir a parte chata:
          autenticação, banco, segurança e CI já calibrados.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <CloneCommand command={CLONE_COMMAND} />
          <Link
            href={REPO_URL}
            className={`text-sm font-medium whitespace-nowrap text-[#c99a46] underline-offset-4 hover:underline ${focusRing}`}
          >
            Repositório no GitHub
          </Link>
        </div>
      </section>

      <section className="mt-14 w-full max-w-2xl">
        <h2 className="font-(family-name:--font-stencil) text-sm tracking-[0.08em] text-[#8b9096]">
          FICHA TÉCNICA
        </h2>

        <dl className="mt-4 divide-y divide-[#2a2e34] border-y border-[#2a2e34]">
          {specSheet.map((row) => (
            <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm font-medium text-[#edeae1]">{row.label}</dt>
              <dd className="flex flex-wrap gap-2">
                {row.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-xs border border-[#3a3f46] px-2 py-1 font-mono text-[0.7rem] text-[#c8c5bc]"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 w-full max-w-2xl">
        <h2 className="font-(family-name:--font-stencil) text-sm tracking-[0.08em] text-[#8b9096]">
          O QUE JÁ VEM PRONTO
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#c8c5bc]">
          <p>
            Sessão e autenticação usam o Supabase inteiramente no servidor (@supabase/ssr), sem
            client de browser exposto. O banco roda em Postgres via Drizzle ORM, com Row Level
            Security padrão-nega — cada tabela nova começa bloqueada até você liberar o acesso
            explicitamente.
          </p>
          <p>
            Segurança não é um passo extra: Content Security Policy própria, rate limiting nas
            rotas, validação de entrada com Zod, variáveis de ambiente validadas em build/boot e
            verificação de segredos com gitleaks já rodam desde o primeiro commit.
          </p>
          <p>
            O CI cobre testes unitários (Vitest), end-to-end (Playwright), catálogo de componentes
            (Storybook) e orçamento de performance (Lighthouse CI) — em React 19 e TypeScript
            estrito, sobre Next.js 16 com Turbopack.
          </p>
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-[#8b9096]">
        Licenciado sob MIT. Bruno Bulnes, 2026.
      </footer>
    </main>
  );
}
