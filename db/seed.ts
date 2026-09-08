import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/**
 * Reinicia o estado da tabela de exemplo para uso em testes (FR-028).
 * Uso: npm run db:seed
 */
async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("db:seed apaga todos os dados de example_items — não rode em produção.");
  }

  const { db } = await import("./client");
  const { exampleItems } = await import("./schema/example");

  await db.delete(exampleItems);

  console.log("Seed concluído: example_items limpa.");
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error("Falha ao rodar o seed:", error);
    process.exit(1);
  });
