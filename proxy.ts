import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { authRateLimiter } from "@/lib/rate-limit";

/**
 * Next.js 16 renomeou o arquivo/export `middleware` para `proxy` (mesma API
 * de NextRequest/NextResponse — ver research.md §11). Este arquivo:
 * 1. Gera um nonce de CSP por requisição (FR-015).
 * 2. Atualiza (refresh) a sessão do Supabase via cookies (FR-017).
 * 3. Aplica rate limiting em rotas sensíveis de exemplo (FR-018).
 */
export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", cspHeader);

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
