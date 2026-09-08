import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sem nonce por requisição (ver research.md §11): a injeção automática
// de nonce nos scripts internos do Next.js documentada oficialmente não se
// mostrou funcional nesta versão (16.3.4) após teste manual — os scripts
// inline de hidratação (self.__next_f...) não recebem o atributo `nonce`,
// o que bloquearia a hidratação sob 'strict-dynamic'. Uma CSP restritiva
// porém funcional (sem nonce) é preferível a uma "mais restritiva" que
// quebra a aplicação em produção.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
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

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
