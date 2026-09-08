export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Publica um bloco de dados estruturados (schema.org) em JSON-LD (FR-021).
 * Renderizado no servidor — sem risco de XSS via JSON.stringify de um objeto
 * controlado pela aplicação (nunca passe dados brutos de usuário aqui).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
