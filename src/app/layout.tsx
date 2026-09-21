import type { Metadata } from "next";
import { Big_Shoulders_Stencil, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { JsonLd } from "@/components/JsonLd/JsonLd";
import { WebVitals } from "@/components/WebVitals/WebVitals";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fonte de personalidade da home (ficha/placa de identificação) — ver
// app/page.tsx. Usada apenas nos títulos, não substitui a Geist no corpo.
// adjustFontFallback desativado: o Next não tem métricas conhecidas para
// esta fonte pra gerar um fallback ajustado automaticamente (gera só um
// warning inofensivo no build); fallback manual cobre o intervalo até a
// fonte carregar.
const stencil = Big_Shoulders_Stencil({
  variable: "--font-stencil",
  weight: "800",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

const title = "nextjs-boilerplate: Next.js, React, TypeScript e Supabase";

export const metadata: Metadata = {
  // Domínio real de cada projeto derivado: sobrescreva via NEXT_PUBLIC_SITE_URL
  // (ver .env.example e lib/site.ts) em vez de editar este arquivo.
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    // Site monolíngue (pt-BR): hreflang auto-referenciado + x-default,
    // sem versões alternativas reais de idioma/região.
    languages: {
      "pt-BR": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    // app/opengraph-image.tsx gera a imagem 1200x630 automaticamente.
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${stencil.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <WebVitals />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: AUTHOR_NAME,
            url: "https://github.com/bulnes",
            sameAs: ["https://github.com/bulnes"],
          }}
        />
        {children}
      </body>
    </html>
  );
}
