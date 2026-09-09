import { env } from "@/lib/env";

/**
 * Domínio do deploy de demonstração deste boilerplate. Cada projeto derivado
 * deve sobrescrever via NEXT_PUBLIC_SITE_URL (ver .env.example) — usado em
 * metadataBase, canonical, robots.txt e sitemap.xml.
 */
export const DEFAULT_SITE_URL = "https://nextjs-boilerplate-mauve-xi-73.vercel.app";

export const AUTHOR_NAME = "Bruno Bulnes";

export const SITE_NAME = "nextjs-boilerplate";

export const SITE_DESCRIPTION =
  "Boilerplate Next.js de produção: App Router, React, TypeScript estrito, Tailwind/shadcn, DevSecOps e Supabase prontos para uso.";

export function resolveSiteUrl(envValue?: string): string {
  return envValue ?? DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl(env.NEXT_PUBLIC_SITE_URL);
