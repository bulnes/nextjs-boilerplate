import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// drizzle-kit roda fora do runtime do Next.js, então precisa carregar
// .env.local manualmente com o mesmo utilitário usado internamente pelo
// Next (@next/env).
loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida — copie .env.example para .env.local e preencha.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
