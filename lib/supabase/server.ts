import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

/**
 * Client do Supabase para uso em Server Components, Server Actions e Route
 * Handlers. Lê/escreve o cookie de sessão via @supabase/ssr (FR-017) — nunca
 * compartilhe uma instância entre requisições, crie uma nova a cada chamada.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado a partir de um Server Component sem permissão de escrita
          // de cookies; o refresh de sessão é tratado pelo proxy.ts.
        }
      },
    },
  });
}
