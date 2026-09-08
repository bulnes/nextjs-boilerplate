import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/**
 * Reinicia o estado da tabela de exemplo para uso em testes (FR-028).
 * Uso: npm run db:seed
 */
async function main() {
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
