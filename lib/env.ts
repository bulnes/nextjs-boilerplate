import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Valida as variáveis de ambiente em tempo de build/boot (FR-029). Qualquer
 * variável obrigatória ausente ou inválida falha `next build`/`next dev`
 * imediatamente, em vez de deixar a aplicação subir com config parcial.
 */
export const env = createEnv({
  server: {
    SUPABASE_URL: z.url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
});
