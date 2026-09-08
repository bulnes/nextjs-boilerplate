import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { authRateLimiter } from "@/lib/rate-limit";

/**
 * Next.js 16 renomeou o arquivo/export `middleware` para `proxy` (mesma API
 * de NextRequest/NextResponse — ver research.md §11). Este arquivo:
 * 1. Atualiza (refresh) a sessão do Supabase via cookies (FR-017).
 * 2. Aplica rate limiting em rotas sensíveis de exemplo (FR-018).
 *
 * Os cabeçalhos de segurança estáticos (incluindo CSP) ficam em
 * next.config.ts, não aqui — ver research.md §11 sobre a decisão de não
 * usar CSP baseada em nonce nesta versão do Next.js.
 */
/**
 * IP do cliente usado como parte da chave do rate limit. Confia apenas no
 * primeiro hop de `x-forwarded-for` (o mais próximo do cliente); sem um
 * proxy/CDN confiável na frente da aplicação que reescreva esse header, o
 * valor pode ser forjado por quem faz a requisição — mesma limitação já
 * documentada em lib/rate-limit.ts para o backing store em memória.
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstHop = forwardedFor?.split(",")[0]?.trim();
  return firstHop || request.headers.get("x-real-ip") || "unknown";
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/example")) {
    const ip = getClientIp(request);
    const { allowed, retryAfterMs } = authRateLimiter.check(`${ip}:${request.nextUrl.pathname}`);

    if (!allowed) {
      logger.warn("rate_limit_blocked", { pathname: request.nextUrl.pathname });
      return NextResponse.json(
        { error: "rate_limited" },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(retryAfterMs / 1000).toString() },
        },
      );
    }
  }

  // Sem cookie de sessão do Supabase não há nada para atualizar — evita o
  // round-trip de auth.getUser() em requisições anônimas/assets.
  const hasSupabaseCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));
  if (!hasSupabaseCookie) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Escreve no `request` e reconstrói o `response` a partir dele para
        // que o cookie de sessão atualizado (refresh) seja visto pelo
        // Route Handler dentro do mesmo ciclo de requisição — sem isso, o
        // handler lê os cookies originais (pré-refresh) via next/headers.
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Dispara o refresh de sessão (se necessário); erros de rede/config não
  // devem derrubar a requisição — apenas seguem sem sessão válida.
  await supabase.auth.getUser().catch(() => null);

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?|ttf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
