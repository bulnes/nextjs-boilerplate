import { ImageResponse } from "next/og";

/**
 * Gera o ícone do site (favicon/apple-touch-icon/manifest) num tamanho
 * qualquer, reaproveitado por app/icon.tsx e app/apple-icon.tsx. Mesma
 * paleta da home (app/page.tsx) — troque por um logo real do projeto
 * derivado.
 */
export function siteIcon(size: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#14171b",
        color: "#c99a46",
        fontSize: size * 0.6,
        fontWeight: 800,
      }}
    >
      {">"}
    </div>,
    { width: size, height: size },
  );
}
