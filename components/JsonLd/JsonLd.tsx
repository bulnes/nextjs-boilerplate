export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Publica um bloco de dados estruturados (schema.org) em JSON-LD (FR-021).
 * Renderizado no servidor — `<` é escapado no JSON serializado para impedir
 * que um valor de string contendo `</script>` feche a tag antecipadamente
 * (técnica padrão para injeção de JSON em `<script>`), então isto é seguro
 * mesmo que `data` acabe incluindo algum texto de origem externa.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
