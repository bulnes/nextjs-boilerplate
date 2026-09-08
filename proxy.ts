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
export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/example")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
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

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            response.cookies.set(name, value);
          }
        },
      },
    },
  );

  // Dispara o refresh de sessão (se necessário); erros de rede/config não
  // devem derrubar a requisição — apenas seguem sem sessão válida.
  await supabase.auth.getUser().catch(() => null);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
