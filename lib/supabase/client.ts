import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/** Client do Supabase para uso em Client Components. Usa apenas a chave anônima (pública). */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
