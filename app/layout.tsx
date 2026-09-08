import type { Metadata } from "next";
import { Big_Shoulders_Stencil, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
const stencil = Big_Shoulders_Stencil({
  variable: "--font-stencil",
  weight: "800",
  subsets: ["latin"],
});

const description =
  "Boilerplate Next.js de produção: App Router, TypeScript estrito, Tailwind/shadcn, DevSecOps e Supabase prontos para uso.";

export const metadata: Metadata = {
  // Ajuste para o domínio real de cada projeto derivado deste boilerplate.
  metadataBase: new URL("https://example.com"),
  title: {
    default: "nextjs-boilerplate",
    template: "%s · nextjs-boilerplate",
  },
  description,
  openGraph: {
    title: "nextjs-boilerplate",
    description,
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
