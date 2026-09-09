import { env } from "@/lib/env";

/**
 * Domínio do deploy de demonstração deste boilerplate. Cada projeto derivado
 * deve sobrescrever via NEXT_PUBLIC_SITE_URL (ver .env.example) — usado em
 * metadataBase, canonical, robots.txt e sitemap.xml.
 */
export const DEFAULT_SITE_URL = "https://nextjs-boilerplate-mauve-xi-73.vercel.app";

export const AUTHOR_NAME = "Bruno Bulnes";

export function resolveSiteUrl(envValue?: string): string {
  return envValue ?? DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl(env.NEXT_PUBLIC_SITE_URL);
